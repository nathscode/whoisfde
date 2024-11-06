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
		const file = formData.get("files") as File;
		const caption = formData.get("caption") as string;
		const workType = formData.get("workType") as string;
		const links = formData.get("links") as string;

		console.log({ file });

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

			const uploadId = multipartUpload.UploadId;
			if (!uploadId) throw new Error("Upload ID not found");

			// Step 2: Upload each chunk
			const chunks = createChunks(file);
			const MAX_RETRIES = 3;

			const parts = await Promise.all(
				chunks.map(async (chunk, index) => {
					const partNumber = index + 1;
					const chunkBuffer = await chunk.arrayBuffer();

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

							// Ensure ETag is defined
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

			// Filter out any undefined parts
			const validParts = parts.filter(
				(part): part is { PartNumber: number; ETag: string } =>
					part !== undefined
			);

			// Step 3: Complete the upload with valid parts only
			await s3.send(
				new CompleteMultipartUploadCommand({
					Bucket: bucketName,
					Key: key,
					UploadId: uploadId,
					MultipartUpload: {
						Parts: validParts.sort((a, b) => a.PartNumber - b.PartNumber),
					},
				})
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
		const status = error instanceof ZodError ? 422 : 500;
		const message =
			error instanceof ZodError ? error.message : "Something went wrong";
		return handlerNativeResponse({ status, message }, status);
	}
}
