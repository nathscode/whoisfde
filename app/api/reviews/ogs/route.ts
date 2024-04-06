import { db } from "@/config/db.config";
import { getRandomNumber, handlerNativeResponse } from "@/lib/backend/utils";
import { NextRequest, NextResponse } from "next/server";

import {
	UserReviewSchema,
	UserReviewSchemaInfer,
} from "@/lib/validators/user-reviews";
import { ZodError } from "zod";
import getCurrentUser from "@/actions/getCurrentUser";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "@/actions/getS3Client";

const Bucket = process.env.TEBI_BUCKET_NAME;

export async function GET() {
	try {
		const reviews = await db.ogReview.findMany({
			orderBy: { createdAt: "desc" },
			include: {
				files: true,
				user: true,
			},
		});
		if (!reviews) {
			return handlerNativeResponse(
				{ status: 400, message: "No OG's Review yet" },
				400
			);
		}
		return NextResponse.json(reviews);
	} catch (error: any) {
		let status = 500;

		return handlerNativeResponse({ status, message: error.message }, status);
	}
}
export async function POST(req: NextRequest) {
	try {
		const formData = await req.formData();
		const file = formData.get("file") as File;
		const location: string = formData.get("location") as string;
		const content: string = formData.get("content") as string;

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
		const buffer = Buffer.from(await file.arrayBuffer());
		const uniqueName = Date.now() + "_" + getRandomNumber(1, 999999);
		const imgExt = file.name.split(".");
		const filename = uniqueName + "." + imgExt[1];

		const fileParams = {
			Bucket: Bucket,
			Key: `uploads/${filename}`,
			Body: buffer,
			ContentType: file.type,
		};
		const command = new PutObjectCommand(fileParams);
		await s3.send(command);

		const fileUrl = `${process.env.NEXT_PUBLIC_TEBI_URL}/uploads/${filename}`;

		const newReview = await db.ogReview.create({
			data: {
				location,
				content,
				user: {
					connect: {
						id: session.id,
					},
				},
			},
		});
		if (!newReview) {
			return handlerNativeResponse(
				{ status: 400, message: "No Review created" },
				400
			);
		}
		if (fileUrl) {
			const fileUpload = await db.files.create({
				data: {
					url: fileUrl,
					ogReviewId: newReview.id,
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
