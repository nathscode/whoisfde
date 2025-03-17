import { NextRequest, NextResponse } from "next/server";
import { s3 } from "@/actions/getS3Client";
import { GetObjectCommand, GetObjectCommandOutput } from "@aws-sdk/client-s3";

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

		// Require a range request for partial content support
		if (!range) {
			return NextResponse.json(
				{ error: "Range header is required" },
				{ status: 400 }
			);
		}

		const [startStr, endStr] = range.replace(/bytes=/, "").split("-");
		const start = parseInt(startStr, 10);
		const end = endStr ? parseInt(endStr, 10) : undefined;

		const bucketParams = {
			Bucket: BucketName,
			Key: `works/${videoKey}`,
			Range: `bytes=${start}-${end !== undefined ? end : ""}`,
		};

		const command = new GetObjectCommand(bucketParams);
		const s3Response: GetObjectCommandOutput = await s3.send(command);

		if (!s3Response.Body) {
			return NextResponse.json(
				{ error: "Failed to retrieve video stream" },
				{ status: 500 }
			);
		}

		// Check ContentLength and handle it safely
		const contentLength = s3Response.ContentLength ?? 0; // Default to 0 if undefined
		const actualEnd = end !== undefined ? end : contentLength - 1;

		// Prepare headers for range-based response
		const headers: Record<string, string> = {
			"Accept-Ranges": "bytes",
			"Content-Type": "video/mp4", // Change this if your video format is different
			"Access-Control-Allow-Origin": "*", // Adjust as necessary for your CORS policy
			"Access-Control-Expose-Headers":
				"Content-Range, Accept-Ranges, Content-Length",
			"Content-Range": `bytes ${start}-${actualEnd}/${contentLength}`,
			"Content-Length": (actualEnd - start + 1).toString(),
		};

		// Return video stream with partial content status
		return new NextResponse(s3Response.Body as any, {
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
