import { db } from "@/config/db.config";
import { handlerNativeResponse } from "@/lib/backend/utils";
import { LoginSchema, LoginSchemaInfer } from "@/lib/validators/login";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";

export async function POST(req: NextRequest) {
	try {
		const body: LoginSchemaInfer = await req.json();
		const payload = LoginSchema.safeParse(body);
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

		const { email, password } = payload.data;

		const formattedEmail = email.toLowerCase();

		const user = await db.user.findUnique({
			where: {
				email: formattedEmail,
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

			// Check if the password is correct
			const isPasswordSame = bcrypt.compareSync(password, user.password!);

			if (isPasswordSame) {
				return NextResponse.json({
					status: 200,
					message: "You logged in successfully!",
				});
			}

			return handlerNativeResponse(
				{
					status: 400,
					errors: {
						message: "Invalid credentials",
					},
				},
				400
			);
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
