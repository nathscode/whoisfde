import { s3 } from "@/actions/getS3Client";
import { db } from "@/config/db.config";
import { GetObjectCommand, HeadObjectCommand } from "@aws-sdk/client-s3";
import { NextRequest, NextResponse } from "next/server";

const Bucket = process.env.TEBI_BUCKET_NAME;
const CHUNK_SIZE = 1024 * 1024; // 1MB chunks

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

export async function GET(
	request: NextRequest,
	{ params }: { params: { id: string } }
) {
	try {
		// Get file info from database
		const formattedId = await params;
		const workFile = await db.workFiles.findFirst({
			where: {
				id: formattedId.id,
			},
		});

		if (!workFile || !workFile.url) {
			return NextResponse.json({ error: "File not found" }, { status: 404 });
		}

		const fileKey = extractS3KeyFromUrl(workFile.url);
		if (!fileKey) {
			return NextResponse.json({ error: "Invalid file URL" }, { status: 400 });
		}

		// Get file metadata first
		const headCommand = new HeadObjectCommand({
			Bucket: Bucket,
			Key: fileKey,
		});

		const headResponse = await s3.send(headCommand);
		const fileSize = headResponse.ContentLength!;
		const contentType = headResponse.ContentType || "video/mp4";
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

		if (!rangeHeader) {
			// Return entire file if no range requested (not recommended for large videos)
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
					},
				}
			);
		}

		const { start, end } = range;
		const actualEnd = end ?? Math.min(start + CHUNK_SIZE - 1, fileSize - 1);
		const contentLength = actualEnd - start + 1;

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

		return new NextResponse(response.Body as ReadableStream, {
			status: 206, // Partial Content
			headers: {
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
			},
		});
	} catch (error: any) {
		console.error("Streaming error:", error);

		// Handle specific S3 errors
		if (error?.name === "NoSuchKey") {
			return NextResponse.json(
				{ error: "File not found in storage" },
				{ status: 404 }
			);
		}

		if (error?.$metadata?.httpStatusCode === 416) {
			return NextResponse.json(
				{ error: "Requested range not satisfiable" },
				{ status: 416 }
			);
		}

		if (error?.name === "InvalidRange") {
			return NextResponse.json(
				{ error: "Invalid range request" },
				{ status: 416 }
			);
		}

		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}
