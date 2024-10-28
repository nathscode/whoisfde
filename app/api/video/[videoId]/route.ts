import { NextRequest, NextResponse } from "next/server";

import { s3 } from "@/actions/getS3Client";
import { GetObjectCommand } from "@aws-sdk/client-s3";

const BucketName = process.env.TEBI_BUCKET_NAME;

export async function GET(
	req: NextRequest,
	{ params }: { params: { videoId: string } }
) {
	try {
		const videoId = params.videoId;
		if (!videoId) {
			return NextResponse.json(
				{ error: "Video ID is required" },
				{ status: 400 }
			);
		}

		const videoKey = decodeURIComponent(videoId.split("/").slice(-1)[0]);
		const range = req.headers.get("range");

		if (!range) {
			return NextResponse.json(
				{ error: "Range is not specified" },
				{ status: 400 }
			);
		}

		const parts = range.replace(/bytes=/, "").split("-");
		const start = parseInt(parts[0], 10);
		const end = parts[1] ? parseInt(parts[1], 10) : undefined;

		const bucketParams = {
			Bucket: BucketName,
			Key: `works/${videoKey}`,
			Range: `bytes=${start}-${end || ""}`,
		};

		const command = new GetObjectCommand(bucketParams);
		const response = await s3.send(command);

		if (!response.Body) {
			return NextResponse.json(
				{ error: "Failed to get video stream" },
				{ status: 500 }
			);
		}

		// Create headers object with type safety
		const headers: Record<string, string> = {
			"Accept-Ranges": "bytes",
			"Content-Type": "video/mp4",
			"Access-Control-Allow-Origin": "*",
		};

		// Only add Content-Range and Content-Length if they exist
		if (response.ContentRange) {
			headers["Content-Range"] = response.ContentRange;
		}

		if (response.ContentLength !== undefined) {
			headers["Content-Length"] = response.ContentLength.toString();
		}

		// Return streamed response
		return new NextResponse(response.Body as any, {
			status: 206,
			headers,
		});
	} catch (error) {
		console.error("Error streaming video from S3:", error);

		if ((error as any).name === "NoSuchKey") {
			return NextResponse.json({ error: "Video not found" }, { status: 404 });
		}

		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}
