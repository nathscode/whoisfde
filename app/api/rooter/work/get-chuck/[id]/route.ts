import { s3 } from "@/actions/getS3Client";
import { db } from "@/config/db.config";
import { GetObjectCommand, HeadObjectCommand } from "@aws-sdk/client-s3";
import { NextRequest, NextResponse } from "next/server";

const Bucket = process.env.TEBI_BUCKET_NAME;
// Increased chunk size for better iOS performance
const CHUNK_SIZE = 2 * 1024 * 1024; // 2MB chunks for better iOS performance
const MAX_CHUNK_SIZE = 10 * 1024 * 1024; // 10MB max for large requests

// Cache for file metadata to reduce database hits
const metadataCache = new Map<
	string,
	{
		data: any;
		timestamp: number;
		ttl: number;
	}
>();

const METADATA_CACHE_TTL = 5 * 60 * 1000; // 5 minutes

interface RangeRequest {
	start: number;
	end?: number;
}

function parseRangeHeader(
	range: string,
	fileSize: number
): RangeRequest | null {
	const rangeMatch = range.match(/bytes=(\d+)-(\d*)/);
	if (!rangeMatch) return null;

	const start = parseInt(rangeMatch[1], 10);
	const end = rangeMatch[2] ? parseInt(rangeMatch[2], 10) : fileSize - 1;

	if (start >= fileSize || (end && end >= fileSize) || start > (end || 0)) {
		return null;
	}

	return { start, end };
}

function extractS3KeyFromUrl(url: string): string | null {
	try {
		const parsed = new URL(url);
		const pathname = parsed.pathname;
		const [, bucket, ...keyParts] = pathname.split("/");
		if (!bucket || keyParts.length === 0) return null;
		return keyParts.join("/");
	} catch (e) {
		console.error("Invalid URL:", e);
		return null;
	}
}

function getOptimalChunkSize(
	requestedRange?: RangeRequest,
	userAgent?: string
): number {
	// iOS devices prefer smaller initial chunks
	const isIOS =
		userAgent?.includes("iPhone") ||
		userAgent?.includes("iPad") ||
		userAgent?.includes("iPod");
	const isSafari =
		userAgent?.includes("Safari") && !userAgent?.includes("Chrome");

	if (isIOS || isSafari) {
		// Smaller chunks for iOS for faster initial load
		return requestedRange ? Math.min(1024 * 1024, CHUNK_SIZE) : CHUNK_SIZE; // 1MB for iOS
	}

	// Larger chunks for other devices
	return requestedRange
		? Math.min(MAX_CHUNK_SIZE, CHUNK_SIZE * 2)
		: CHUNK_SIZE * 2;
}

async function getFileMetadata(fileId: string) {
	// Check cache first
	const cached = metadataCache.get(fileId);
	if (cached && Date.now() - cached.timestamp < cached.ttl) {
		return cached.data;
	}

	// Fetch from database
	const workFile = await db.workFiles.findFirst({
		where: { id: fileId },
		select: {
			id: true,
			url: true,
		},
	});

	if (workFile) {
		// Cache the result
		metadataCache.set(fileId, {
			data: workFile,
			timestamp: Date.now(),
			ttl: METADATA_CACHE_TTL,
		});
	}

	return workFile;
}

export async function GET(
	request: NextRequest,
	{ params }: { params: { id: string } }
) {
	try {
		// Get file info from database (with caching)
		const formattedId = await params;
		const workFile = await getFileMetadata(formattedId.id);

		if (!workFile || !workFile.url) {
			return NextResponse.json({ error: "File not found" }, { status: 404 });
		}

		const fileKey = extractS3KeyFromUrl(workFile.url);
		if (!fileKey) {
			return NextResponse.json({ error: "Invalid file URL" }, { status: 400 });
		}

		// Get user agent for optimization
		const userAgent = request.headers.get("user-agent") || "";

		// Get file metadata from S3 (with better error handling)
		let headResponse;
		try {
			const headCommand = new HeadObjectCommand({
				Bucket: Bucket,
				Key: fileKey,
			});
			headResponse = await s3.send(headCommand);
		} catch (error: any) {
			if (
				error?.name === "NoSuchKey" ||
				error?.$metadata?.httpStatusCode === 404
			) {
				return NextResponse.json(
					{ error: "File not found in storage" },
					{ status: 404 }
				);
			}
			throw error;
		}

		const fileSize = headResponse.ContentLength!;
		const contentType =
			workFile.mimeType || headResponse.ContentType || "video/mp4";
		const lastModified = headResponse.LastModified;
		const etag = headResponse.ETag;

		// Handle conditional requests (caching)
		const ifModifiedSince = request.headers.get("if-modified-since");
		const ifNoneMatch = request.headers.get("if-none-match");

		if (ifModifiedSince || ifNoneMatch) {
			const notModified =
				(ifModifiedSince &&
					lastModified &&
					new Date(ifModifiedSince) >= lastModified) ||
				(ifNoneMatch && etag && ifNoneMatch === etag);

			if (notModified) {
				return new NextResponse(null, { status: 304 });
			}
		}

		// Parse range header
		const rangeHeader = request.headers.get("range");
		const optimalChunkSize = getOptimalChunkSize(
			rangeHeader
				? parseRangeHeader(rangeHeader, fileSize) || undefined
				: undefined,
			userAgent
		);

		if (!rangeHeader) {
			// For iOS, we should still support range requests even when not explicitly requested
			// Return partial content for better streaming performance
			const isIOS =
				userAgent.includes("iPhone") ||
				userAgent.includes("iPad") ||
				userAgent.includes("iPod");

			if (isIOS && fileSize > optimalChunkSize) {
				// For iOS, send initial chunk even without range request
				const initialChunkSize = Math.min(optimalChunkSize, fileSize);

				const command = new GetObjectCommand({
					Bucket: Bucket,
					Key: fileKey,
					Range: `bytes=0-${initialChunkSize - 1}`,
				});

				const response = await s3.send(command);

				return new NextResponse(response.Body as ReadableStream, {
					status: 206, // Partial Content
					headers: {
						"Content-Type": contentType,
						"Content-Length": initialChunkSize.toString(),
						"Content-Range": `bytes 0-${initialChunkSize - 1}/${fileSize}`,
						"Accept-Ranges": "bytes",
						"Cache-Control": "public, max-age=31536000, immutable",
						ETag: etag || "",
						"Last-Modified": lastModified?.toUTCString() || "",
						// iOS-specific headers
						"X-Content-Type-Options": "nosniff",
						"X-Frame-Options": "SAMEORIGIN",
						// Enable CORS for cross-origin requests
						"Access-Control-Allow-Origin": "*",
						"Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
						"Access-Control-Allow-Headers": "Range",
					},
				});
			}

			// Return entire file for non-iOS or small files
			const command = new GetObjectCommand({
				Bucket: Bucket,
				Key: fileKey,
			});

			const response = await s3.send(command);

			return new NextResponse(response.Body as ReadableStream, {
				status: 200,
				headers: {
					"Content-Type": contentType,
					"Content-Length": fileSize.toString(),
					"Accept-Ranges": "bytes",
					"Cache-Control": "public, max-age=31536000, immutable",
					ETag: etag || "",
					"Last-Modified": lastModified?.toUTCString() || "",
					// Security headers
					"X-Content-Type-Options": "nosniff",
					"X-Frame-Options": "SAMEORIGIN",
					// Enable CORS
					"Access-Control-Allow-Origin": "*",
					"Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
					"Access-Control-Allow-Headers": "Range",
				},
			});
		}

		// Parse and validate range request
		const range = parseRangeHeader(rangeHeader, fileSize);
		if (!range) {
			return NextResponse.json(
				{ error: "Invalid range request" },
				{
					status: 416,
					headers: {
						"Content-Range": `bytes */${fileSize}`,
						"Access-Control-Allow-Origin": "*",
					},
				}
			);
		}

		const { start, end } = range;

		// Calculate optimal end position based on device and request
		let actualEnd = end;
		if (!end) {
			// If no end specified, use optimal chunk size
			actualEnd = Math.min(start + optimalChunkSize - 1, fileSize - 1);
		} else {
			// If end is specified but the chunk is too large, limit it
			const requestedSize = end - start + 1;
			if (requestedSize > MAX_CHUNK_SIZE) {
				actualEnd = start + MAX_CHUNK_SIZE - 1;
			}
		}

		const contentLength = actualEnd! - start + 1;

		// Request specific range from S3
		const command = new GetObjectCommand({
			Bucket: Bucket,
			Key: fileKey,
			Range: `bytes=${start}-${actualEnd}`,
		});

		const response = await s3.send(command);

		if (!response.Body) {
			throw new Error("No response body from S3");
		}

		// Enhanced headers for better iOS compatibility
		const responseHeaders = new Headers({
			"Content-Type": contentType,
			"Content-Length": contentLength.toString(),
			"Content-Range": `bytes ${start}-${actualEnd}/${fileSize}`,
			"Accept-Ranges": "bytes",
			"Cache-Control": "public, max-age=31536000, immutable",
			ETag: etag || "",
			"Last-Modified": lastModified?.toUTCString() || "",

			// Security headers
			"X-Content-Type-Options": "nosniff",
			"X-Frame-Options": "SAMEORIGIN",

			// CORS headers
			"Access-Control-Allow-Origin": "*",
			"Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
			"Access-Control-Allow-Headers": "Range",
			"Access-Control-Expose-Headers":
				"Content-Length, Content-Range, Accept-Ranges",

			// iOS-specific optimizations
			Connection: "keep-alive",
		});

		// Add iOS-specific headers for better compatibility
		const isIOS =
			userAgent.includes("iPhone") ||
			userAgent.includes("iPad") ||
			userAgent.includes("iPod");
		if (isIOS) {
			responseHeaders.set("Accept-Ranges", "bytes");
			responseHeaders.set("Content-Transfer-Encoding", "binary");
		}

		return new NextResponse(response.Body as ReadableStream, {
			status: 206, // Partial Content
			headers: responseHeaders,
		});
	} catch (error: any) {
		console.error("Streaming error:", error);

		// Clear cache on error to prevent stale data
		const formattedId = await params;
		metadataCache.delete(formattedId.id);

		// Enhanced error handling
		if (
			error?.name === "NoSuchKey" ||
			error?.$metadata?.httpStatusCode === 404
		) {
			return NextResponse.json(
				{ error: "File not found in storage" },
				{
					status: 404,
					headers: {
						"Access-Control-Allow-Origin": "*",
					},
				}
			);
		}

		if (
			error?.$metadata?.httpStatusCode === 416 ||
			error?.name === "InvalidRange"
		) {
			return NextResponse.json(
				{ error: "Requested range not satisfiable" },
				{
					status: 416,
					headers: {
						"Access-Control-Allow-Origin": "*",
					},
				}
			);
		}

		if (error?.name === "AccessDenied") {
			return NextResponse.json(
				{ error: "Access denied to file" },
				{
					status: 403,
					headers: {
						"Access-Control-Allow-Origin": "*",
					},
				}
			);
		}

		// Network or timeout errors
		if (error?.name === "NetworkError" || error?.code === "ECONNRESET") {
			return NextResponse.json(
				{ error: "Network error, please try again" },
				{
					status: 503,
					headers: {
						"Access-Control-Allow-Origin": "*",
						"Retry-After": "5",
					},
				}
			);
		}

		return NextResponse.json(
			{ error: "Internal server error" },
			{
				status: 500,
				headers: {
					"Access-Control-Allow-Origin": "*",
				},
			}
		);
	}
}

// Handle OPTIONS requests for CORS
export async function OPTIONS(request: NextRequest) {
	return new NextResponse(null, {
		status: 200,
		headers: {
			"Access-Control-Allow-Origin": "*",
			"Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
			"Access-Control-Allow-Headers": "Range, If-Modified-Since, If-None-Match",
			"Access-Control-Max-Age": "86400",
		},
	});
}

// Handle HEAD requests for metadata
export async function HEAD(
	request: NextRequest,
	{ params }: { params: { id: string } }
) {
	try {
		const formattedId = await params;
		const workFile = await getFileMetadata(formattedId.id);

		if (!workFile || !workFile.url) {
			return new NextResponse(null, { status: 404 });
		}

		const fileKey = extractS3KeyFromUrl(workFile.url);
		if (!fileKey) {
			return new NextResponse(null, { status: 400 });
		}

		const headCommand = new HeadObjectCommand({
			Bucket: Bucket,
			Key: fileKey,
		});

		const headResponse = await s3.send(headCommand);
		const fileSize = headResponse.ContentLength!;
		const contentType =
			workFile.mimeType || headResponse.ContentType || "video/mp4";

		return new NextResponse(null, {
			status: 200,
			headers: {
				"Content-Type": contentType,
				"Content-Length": fileSize.toString(),
				"Accept-Ranges": "bytes",
				"Cache-Control": "public, max-age=31536000, immutable",
				"Access-Control-Allow-Origin": "*",
				"Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
				"Access-Control-Allow-Headers": "Range",
			},
		});
	} catch (error) {
		console.error("HEAD request error:", error);
		return new NextResponse(null, { status: 500 });
	}
}
