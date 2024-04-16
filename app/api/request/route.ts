import { db } from "@/config/db.config";
import { handlerNativeResponse } from "@/lib/backend/utils";
import { sendMail } from "@/service/mail";
import { render } from "@react-email/render";
import { NextRequest, NextResponse } from "next/server";

import NewRequest from "@/emails/NewRequest";
import { RequestSchema, RequestSchemaInfer } from "@/lib/validators/request";
import { ZodError } from "zod";
import getCurrentUser from "@/actions/getCurrentUser";
import checkIsAdmin from "@/actions/checkIsAdmin";

export async function POST(req: NextRequest) {
	try {
		const body: RequestSchemaInfer = await req.json();
		const payload = RequestSchema.safeParse(body);
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
		const { name, phone, email, question } = payload.data;

		const formattedEmail = email.toLowerCase();

		const isEmailExist = await db.request.findUnique({
			where: {
				email: formattedEmail,
			},
			select: {
				id: true,
			},
		});

		if (isEmailExist) {
			return handlerNativeResponse(
				{
					status: 409,
					errors: {
						message: "Email already taken. please use another email.",
					},
				},
				400
			);
		}

		const newBooking = await db.request.create({
			data: {
				name,
				email: formattedEmail,
				phone,
				answer: question,
			},
		});
		if (!newBooking) {
			return handlerNativeResponse(
				{ status: 400, message: "No booking created" },
				400
			);
		}
		const emailHtml = render(NewRequest({ name, email, phone, question }));
		const adminEmail = "whoisfde@gmail.com";
		await sendMail({
			name: "whoisfde",
			to: adminEmail,
			subject: "New Request Form for OG's",
			html: emailHtml,
		});
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
