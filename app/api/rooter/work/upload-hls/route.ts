// app/api/rooter/work/upload-hls/route.ts

import { db } from "@/config/db.config";
import { handlerNativeResponse } from "@/lib/backend/utils";
import { NextRequest, NextResponse } from "next/server";
import getCurrentUser from "@/actions/getCurrentUser";
import { s3 } from "@/actions/getS3Client";
import { PutObjectCommand } from "@aws-sdk/client-s3";

const bucketName = process.env.TEBI_BUCKET_NAME;

export async function POST(req: NextRequest) {
	try {
		const formData = await req.formData();
		const caption = formData.get("caption") as string;
		const workType = formData.get("workType") as string;
		const links = formData.get("links") as string;
		const qualities = JSON.parse((formData.get("qualities") as string) || "[]");
		const hlsFiles = formData.getAll("hlsFiles") as File[];

		const session = await getCurrentUser();
		if (!session) {
			return handlerNativeResponse(
				{
					status: 401,
					errors: { message: "Unauthorized User" },
				},
				401
			);
		}

		if (hlsFiles.length === 0) {
			return handlerNativeResponse(
				{
					status: 400,
					errors: { message: "No HLS files provided" },
				},
				400
			);
		}

		// Generate unique folder for this video
		const videoId = `${Date.now()}_${Math.floor(Math.random() * 999999)}`;
		const baseKey = `works/hls/${videoId}`;

		// Upload all HLS files (master playlist, quality playlists, and segments)
		const uploadPromises = hlsFiles.map(async (file) => {
			const fileBuffer = await file.arrayBuffer();
			const key = `${baseKey}/${file.name}`;

			// Determine content type based on file extension
			let contentType = "application/octet-stream";
			if (file.name.endsWith(".m3u8")) {
				contentType = "application/vnd.apple.mpegurl";
			} else if (file.name.endsWith(".ts")) {
				contentType = "video/MP2T";
			}

			await s3.send(
				new PutObjectCommand({
					Bucket: bucketName,
					Key: key,
					Body: Buffer.from(fileBuffer),
					ContentType: contentType,
					CacheControl: "public, max-age=31536000", // Cache segments for 1 year
				})
			);

			return key;
		});

		await Promise.all(uploadPromises);

		// The master playlist URL is what we'll use for playback
		const masterPlaylistUrl = `${process.env.NEXT_PUBLIC_TEBI_URL}/${baseKey}/master.m3u8`;

		// Create work entry in database
		const newWork = await db.work.create({
			data: {
				caption,
				links,
				workType,
			},
		});

		// Store the master playlist URL and metadata
		await db.workFiles.create({
			data: {
				url: masterPlaylistUrl,
				workId: newWork.id,
			},
		});

		return NextResponse.json({
			status: "success",
			data: {
				workId: newWork.id,
				masterPlaylistUrl,
				qualities,
			},
		});
	} catch (error: any) {
		console.error("HLS upload error:", error);
		return handlerNativeResponse(
			{
				status: 500,
				message: error.message || "Something went wrong",
			},
			500
		);
	}
}
