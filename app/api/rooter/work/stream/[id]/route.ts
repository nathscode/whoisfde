import { db } from "@/config/db.config";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(
	req: NextRequest,
	{ params }: { params: { id: string } }
) {
	try {
		const { id } = params;

		// Get video file from database
		const videoFile = await db.workFiles.findFirst({
			where: {
				OR: [{ id }, { workId: id }],
			},
		});

		if (!videoFile?.url) {
			return new NextResponse("Video not found", { status: 404 });
		}

		// Fetch video from S3
		const response = await fetch(videoFile.url);

		if (!response.ok) {
			return new NextResponse("Failed to fetch video", { status: 500 });
		}

		// Stream the video with proper headers
		return new NextResponse(response.body, {
			status: 200,
			headers: {
				"Content-Type": response.headers.get("Content-Type") || "video/mp4",
				"Content-Length": response.headers.get("Content-Length") || "",
				"Accept-Ranges": "bytes",
				"Cache-Control": "public, max-age=31536000, immutable",
				"Access-Control-Allow-Origin": "*",
				"Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
			},
		});
	} catch (error) {
		console.error("Stream error:", error);
		return new NextResponse("Error streaming video", { status: 500 });
	}
}

export async function OPTIONS() {
	return new NextResponse(null, {
		status: 200,
		headers: {
			"Access-Control-Allow-Origin": "*",
			"Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
			"Access-Control-Allow-Headers": "*",
		},
	});
}
