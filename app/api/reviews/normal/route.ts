import { db } from "@/config/db.config";
import { handlerNativeResponse } from "@/lib/backend/utils";
import { NextRequest, NextResponse } from "next/server";

import {
	UserReviewSchema,
	UserReviewSchemaInfer,
} from "@/lib/validators/user-reviews";
import { ZodError } from "zod";
export async function POST(req: NextRequest) {
	try {
		const body: UserReviewSchemaInfer = await req.json();
		const payload = UserReviewSchema.safeParse(body);
		if (!payload.success) {
			return handlerNativeResponse(
				{
					status: 400,
					errors: {
						errors: payload.error.flatten().fieldErrors,
						message: "Missing Fields. Failed to Update Post.",
					},
				},
				400
			);
		}
		const { name, content } = payload.data;

		const newReview = await db.review.create({
			data: {
				name,
				content,
			},
		});
		if (!newReview) {
			return handlerNativeResponse(
				{ status: 400, message: "No Review created" },
				400
			);
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
