import { db } from "@/config/db.config";
import { getRandomNumber, handlerNativeResponse } from "@/lib/backend/utils";
import { NextRequest, NextResponse } from "next/server";

import checkIsAdmin from "@/actions/checkIsAdmin";
import getCurrentUser from "@/actions/getCurrentUser";
import { s3 } from "@/actions/getS3Client";
import { DeleteObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { ZodError } from "zod";

const Bucket = process.env.TEBI_BUCKET_NAME;

export async function GET(req: NextRequest) {
	const searchParams = req.nextUrl.searchParams;
	const params = Object.fromEntries(searchParams);
	const workType = params.workType;
	try {
		const works = await db.work.findMany({
			where: {
				workType: workType,
			},
			orderBy: { createdAt: "desc" },
			include: {
				workFiles: true,
			},
		});
		if (!works) {
			return handlerNativeResponse(
				{ status: 400, message: "No Works yet" },
				400
			);
		}
		return NextResponse.json(works);
	} catch (error: any) {
		let status = 500;

		return handlerNativeResponse({ status, message: error.message }, status);
	}
}

export async function POST(req: NextRequest) {
	try {
		const formData = await req.formData();
		const files = (formData.get("files") as File) || null;
		const caption: string = formData.get("caption") as string;
		const workType: string = formData.get("workType") as string;
		const links: string = formData.get("links") as string;

		const session = await getCurrentUser();
		if (!session) {
			return handlerNativeResponse(
				{
					status: 401, // Unauthorized
					errors: {
						message: "Unauthorized User",
					},
				},
				401
			);
		}
		let fileUrl = "";
		if (files.name) {
			const buffer = Buffer.from(await files.arrayBuffer());
			const uniqueName = Date.now() + "_" + getRandomNumber(1, 999999);
			const imgExt = files.name.split(".");
			const filename = uniqueName + "." + imgExt[1];

			const fileParams = {
				Bucket: Bucket,
				Key: `works/${filename}`,
				Body: buffer,
				ContentType: files.type,
			};
			const command = new PutObjectCommand(fileParams);
			await s3.send(command);

			fileUrl = `${process.env.NEXT_PUBLIC_TEBI_URL}/works/${filename}`;
		}

		const newWork = await db.work.create({
			data: {
				caption,
				links,
				workType,
			},
		});
		if (!newWork) {
			return handlerNativeResponse(
				{ status: 400, message: "No work created" },
				400
			);
		}
		if (fileUrl) {
			const fileUpload = await db.workFiles.create({
				data: {
					url: fileUrl,
					workId: newWork.id,
				},
			});
		}

		return NextResponse.json({ status: "success" });
	} catch (error: any) {
		console.log(error);
		let message: any = "Something went wrong";
		let status = 500;
		if (error instanceof ZodError) {
			message = error.message;
			status = 422;
		}
		return handlerNativeResponse({ status, message }, status);
	}
}

export async function DELETE(req: NextRequest) {
	if (req.method !== "DELETE") {
		return handlerNativeResponse(
			{ status: 405, errors: { message: "Method not allowed" } },
			405
		);
	}
	const searchParams = req.nextUrl.searchParams;
	const params = Object.fromEntries(searchParams);
	const id = params.id;
	const session = await getCurrentUser();
	const isAdmin = await checkIsAdmin();

	if (!session) {
		return handlerNativeResponse(
			{ status: 403, errors: { message: "Unauthorized" } },
			401
		);
	}

	if (!isAdmin) {
		return handlerNativeResponse(
			{
				status: 403,
				errors: { message: "Unauthorized and access denied" },
			},
			401
		);
	}

	try {
		const work = await db.work.findUnique({
			where: { id: id },
		});

		if (!work) {
			return handlerNativeResponse(
				{ status: 404, errors: { message: "work not found" } },
				404
			);
		}

		const files = await db.workFiles.findMany({
			where: { workId: work.id },
		});

		if (files) {
			for (const file of files) {
				const filename = file.url!.split("/").pop();

				if (file) {
					await db.workFiles.delete({
						where: { id: file.id },
					});
				}

				const bucketParams = {
					Bucket: Bucket,
					Key: `works/${filename}`,
				};

				const command = new DeleteObjectCommand(bucketParams);
				await s3.send(command);
			}
		}

		const workObj = await db.work.delete({
			where: {
				id: id,
			},
		});

		if (workObj) {
			return NextResponse.json({ success: true });
		}
	} catch (error: any) {
		let status = 500;
		return handlerNativeResponse({ status, message: error.message }, status);
	}
}
