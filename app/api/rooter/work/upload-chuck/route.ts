import { db } from "@/config/db.config";
import { handlerNativeResponse } from "@/lib/backend/utils";
import { NextRequest, NextResponse } from "next/server";

import getCurrentUser from "@/actions/getCurrentUser";
import { s3 } from "@/actions/getS3Client";
import {
	CompleteMultipartUploadCommand,
	CreateMultipartUploadCommand,
	UploadPartCommand,
} from "@aws-sdk/client-s3";

import { createChunks } from "@/components/util/chunkUpload";
import { ZodError } from "zod";

const bucketName = process.env.TEBI_BUCKET_NAME;

export async function POST(req: NextRequest) {
	try {
		const formData = await req.formData();
		const file = (formData.get("files") as File) || null;
		const caption: string = formData.get("caption") as string;
		const workType: string = formData.get("workType") as string;
		const links: string = formData.get("links") as string;

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
		let fileUrl = "";
		let uploadId: string | undefined;
		if (file?.name) {
			const uniqueName = `${Date.now()}_${Math.floor(Math.random() * 999999)}`;
			const extension = file.name.split(".").pop();
			const filename = `${uniqueName}.${extension}`;
			const key = `works/${filename}`;

			// Step 1: Initialize multipart upload
			const multipartUpload = await s3.send(
				new CreateMultipartUploadCommand({
					Bucket: bucketName,
					Key: key,
					ContentType: file.type,
				})
			);
			uploadId = multipartUpload.UploadId;
			if (!uploadId) throw new Error("Upload ID not found");

			// Step 2: Upload each chunk in parallel
			const MAX_RETRIES = 5;
			const chunks = await createChunks(file);

			const parts = await Promise.all(
				chunks.map(async (chunk, index) => {
					const partNumber = index + 1;
					const chunkBuffer = await chunk.chunk.arrayBuffer();

					for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
						try {
							const uploadPartResult = await s3.send(
								new UploadPartCommand({
									Bucket: bucketName,
									Key: key,
									UploadId: uploadId,
									PartNumber: partNumber,
									Body: Buffer.from(chunkBuffer),
								})
							);

							if (!uploadPartResult.ETag) {
								throw new Error(`ETag is undefined for part ${partNumber}`);
							}

							return { PartNumber: partNumber, ETag: uploadPartResult.ETag };
						} catch (error) {
							if (attempt === MAX_RETRIES) {
								console.error(`Failed to upload part ${partNumber}:`, error);
								throw new Error(`Failed to upload part ${partNumber}`);
							}

							// Exponential backoff
							await new Promise((resolve) =>
								setTimeout(resolve, 1000 * 2 ** attempt)
							);
						}
					}
				})
			);

			// Step 3: Complete the upload with valid parts only
			await completeMultipartUpload(
				uploadId,
				key,
				parts as { PartNumber: number; ETag: string }[]
			);

			fileUrl = `${process.env.NEXT_PUBLIC_TEBI_URL}/works/${filename}`;
		}

		const newWork = await db.work.create({
			data: { caption, links, workType },
		});

		if (fileUrl) {
			await db.workFiles.create({
				data: { url: fileUrl, workId: newWork.id },
			});
		}

		return NextResponse.json({ status: "success" });
	} catch (error: any) {
		console.error(error);
		let message: any = "Something went wrong";
		let status = 500;
		if (error instanceof ZodError) {
			message = error.message;
			status = 422;
		}
		return handlerNativeResponse({ status, message }, status);
	}
}

async function completeMultipartUpload(
	uploadId: string,
	key: string,
	parts: { PartNumber: number; ETag: string }[]
) {
	await s3.send(
		new CompleteMultipartUploadCommand({
			Bucket: bucketName,
			Key: key,
			UploadId: uploadId,
			MultipartUpload: {
				Parts: parts.sort((a, b) => a.PartNumber - b.PartNumber),
			},
		})
	);
}
