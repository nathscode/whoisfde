import { db } from "@/config/db.config";
import { handlerNativeResponse } from "@/lib/backend/utils";
import { NextRequest, NextResponse } from "next/server";

import {
	UserReviewSchema,
	UserReviewSchemaInfer,
} from "@/lib/validators/user-reviews";
import { ZodError } from "zod";
import getCurrentUser from "@/actions/getCurrentUser";
import checkIsAdmin from "@/actions/checkIsAdmin";
export async function GET() {
	try {
		const reviews = await db.review.findMany({
			orderBy: { createdAt: "desc" },
		});
		if (!reviews) {
			return handlerNativeResponse(
				{ status: 400, message: "No Review yet" },
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
		const review = await db.review.findUnique({
			where: { id: id },
		});

		if (!review) {
			return handlerNativeResponse(
				{ status: 404, errors: { message: "review not found" } },
				404
			);
		}

		const reviewObj = await db.review.delete({
			where: {
				id: id,
			},
		});

		if (reviewObj) {
			return NextResponse.json({ success: true });
		}
	} catch (error: any) {
		let status = 500;
		return handlerNativeResponse({ status, message: error.message }, status);
	}
}
