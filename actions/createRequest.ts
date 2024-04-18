"use server";

import { db } from "@/config/db.config";
import NewRequest from "@/emails/NewRequest";
import { RequestSchema } from "@/lib/validators/request";
import { sendMail } from "@/service/mail";
import { render } from "@react-email/render";
import { z } from "zod";

export async function createRequest(values: z.infer<typeof RequestSchema>) {
	try {
		const validatedFields = RequestSchema.safeParse(values);

		if (!validatedFields.success) {
			return {
				errors: validatedFields.error.flatten().fieldErrors,
				message: "Missing Fields. Failed to Update Post.",
			};
		}

		const { name, email, phone, question } = validatedFields.data;
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
			return {
				message: "Email already taken. please use another email.",
			};
		}

		const createRequestObj = await db.request.create({
			data: {
				name,
				email: formattedEmail,
				phone,
				answer: question,
			},
		});

		if (!createRequestObj) {
			return {
				message: "Request not created, Try refreshing and try again",
			};
		}

		const emailHtml = render(NewRequest({ name, email, phone, question }));
		const adminEmail = "whoisfde@gmail.com";
		await sendMail({
			name: "whoisfde",
			to: adminEmail,
			subject: "New Request Form for OG's",
			html: emailHtml,
		});

		return { message: "Request sent successfully." };

	} catch (error) {
		console.error("Error in createRequest:", error);
		return { message: "Database Error: Failed to create request." };
	}
}
