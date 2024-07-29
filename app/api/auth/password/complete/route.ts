import { db } from "@/config/db.config";
import { handlerNativeResponse } from "@/lib/backend/utils";
import {
	ResetPasswordSchema,
	ResetPasswordSchemaInfer,
} from "@/lib/validators/reset-password";

import bcrypt from "bcryptjs";
import { DateTime } from "luxon";
import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";

export async function POST(req: NextRequest) {
	try {
		const body: ResetPasswordSchemaInfer = await req.json();
		const payload = ResetPasswordSchema.safeParse(body);
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

		const { password, confirmPassword, token } = payload.data;
		if (!password) {
			return NextResponse.json(
				{ status: false, message: "New password not specified" },
				{ status: 400 }
			);
		}
		if (!confirmPassword) {
			return NextResponse.json(
				{ status: false, message: "Repeat new password" },
				{ status: 400 }
			);
		}
		if (password !== confirmPassword) {
			return NextResponse.json(
				{ status: false, message: "New password doesn't match" },
				{ status: 400 }
			);
		}

		const passwordResetObj = await db.passwordReset.findFirst({
			where: {
				code: token,
			},
		});

		if (!passwordResetObj) {
			return handlerNativeResponse(
				{
					status: 400,
					errors: {
						message: "Invalid request",
					},
				},
				400
			);
		}
		const expiredAtFormatted = passwordResetObj?.expiredAt!.toISOString();

		const expire_date = DateTime.fromISO(expiredAtFormatted);
		const now_date = DateTime.now();
		if (now_date > expire_date) {
			return handlerNativeResponse(
				{
					status: 400,
					errors: {
						message:
							"Link is expired. Please, try again from reset password page",
					},
				},
				400
			);
		}
		const user = await db.user.findUnique({
			where: {
				email: passwordResetObj.email!,
			},
		});
		if (!user) {
			return handlerNativeResponse(
				{
					status: 400,
					errors: {
						message: "Invalid request",
					},
				},
				400
			);
		}
		const salt = bcrypt.genSaltSync(10);
		const hashedPassword = bcrypt.hashSync(password, salt);

		await db.user.update({
			where: {
				id: user.id,
			},
			data: {
				password: hashedPassword,
			},
		});

		await db.passwordReset.delete({
			where: {
				id: passwordResetObj.id,
			},
		});

		return NextResponse.json({
			status: true,
			message: "Success",
		});
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
