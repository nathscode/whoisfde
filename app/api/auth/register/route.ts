import { handlerNativeResponse } from "@/lib/backend/utils";
import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import bcrypt from "bcryptjs";
import { generate } from "otp-generator";
import { UserSchema, UserSchemaInfer } from "@/lib/validators/user";
import { db } from "@/config/db.config";
import { RoleType } from "@prisma/client";
import { sendMail } from "@/service/mail";
import SendVerificationEmail from "@/emails/SendVerificationEmail";
import { render } from "@react-email/components";

async function generateUniqueVerificationCode(): Promise<string> {
	let verificationCode: string;

	do {
		verificationCode = generate(20, {
			digits: true,
			upperCaseAlphabets: true,
			lowerCaseAlphabets: true,
			specialChars: false,
		});
	} while (await db.user.findFirst({ where: { verificationCode } }));

	return verificationCode;
}

export async function POST(req: NextRequest) {
	try {
		const body: UserSchemaInfer = await req.json();
		const payload = UserSchema.safeParse(body);
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
		const { name, email, password, confirmPassword } = payload.data;
		const formattedEmail = email.toLowerCase();

		const isEmailExist = await db.user.findUnique({
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
		const salt = bcrypt.genSaltSync(10);
		const hashedPassword = bcrypt.hashSync(password, salt);
		const verificationCode = await generateUniqueVerificationCode();

		const newUser = await db.user.create({
			data: {
				name,
				email: formattedEmail,
				verificationCode,
				password: hashedPassword,
				role: RoleType.USER,
			},
		});
		if (!newUser) {
			return handlerNativeResponse(
				{ status: 400, message: "No user created" },
				400
			);
		}

		let code = verificationCode;
		const emailHtml = render(
			SendVerificationEmail({ name, password, email, code })
		);
		await sendMail({
			name: "whoisfde",
			to: formattedEmail,
			subject: "Email verification link",
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
