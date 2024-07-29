import { db } from "@/config/db.config";
import { handlerNativeResponse, normalizeEmail } from "@/lib/backend/utils";

import { render } from "@react-email/render";

import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { DateTime } from "luxon";
import bcrypt from "bcryptjs";

import { generateRandomNumbers } from "@/lib/utils";
import {
	ResetPasswordEmailSchema,
	ResetPasswordEmailSchemaInfer,
} from "@/lib/validators/reset-password";
import passwordResetEmail from "@/emails/passwordResetEmail";
import { sendMail } from "@/service/mail";

export async function POST(req: NextRequest) {
	try {
		const body: ResetPasswordEmailSchemaInfer = await req.json();
		const payload = ResetPasswordEmailSchema.safeParse(body);
		if (!payload.success) {
			return handlerNativeResponse(
				{
					status: 400,
					errors: {
						message: payload.error.message,
					},
				},
				400
			);
		}

		const { email } = payload.data;

		const formattedEmail = normalizeEmail(email);

		const user = await db.user.findUnique({
			where: {
				email: formattedEmail,
			},
			select: {
				id: true,
				verified: true,
			},
		});

		if (user) {
			// Check if the user is verified
			if (!user.verified) {
				return handlerNativeResponse(
					{
						status: 401, // Unauthorized
						errors: {
							message:
								"Your account is not verified. check your email for verification code",
						},
					},
					401
				);
			}
			const expires = DateTime.now().plus({ hours: 1 }).toISO();
			const rand = generateRandomNumbers(20);
			const token = bcrypt.hashSync(`${rand}`);

			const serializedToken = token
				.substring(8)
				.replace("/", "")
				.replace(".", "");

			const resetEmailObj = await db.passwordReset.create({
				data: {
					email,
					code: serializedToken,
					expiredAt: expires,
				},
			});
			const htmlEmail = render(passwordResetEmail({ token: serializedToken }));
			await sendMail({
				name: "whoisfde",
				to: formattedEmail,
				subject: "Reset Password Link [Whoisfde]",
				html: htmlEmail,
			});
			return NextResponse.json({
				status: true,
				message: "Success",
			});
		}

		return handlerNativeResponse(
			{
				status: 404,
				errors: {
					message: "No account found",
				},
			},
			404
		);
	} catch (error: any) {
		let message: any = "Something went wrong";
		let status = 500;
		if (error instanceof ZodError) {
			message = error.message;
			status = 422;
		}
		console.error(error.message);
		return handlerNativeResponse({ status, message }, status);
	}
}
