import { db } from "@/config/db.config";
import { handlerNativeResponse } from "@/lib/backend/utils";
import { sendMail } from "@/service/mail";
import { render } from "@react-email/render";
import { NextRequest, NextResponse } from "next/server";

import NewRequest from "@/emails/NewRequest";
import { RequestSchema, RequestSchemaInfer } from "@/lib/validators/request";
import { ZodError } from "zod";

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
