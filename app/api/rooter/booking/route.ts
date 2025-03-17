import { db } from "@/config/db.config";
import {
	generateRandomNumbers,
	handlerNativeResponse,
} from "@/lib/backend/utils";
import { BookingSchema, BookingSchemaInfer } from "@/lib/validators/booking";
import { render } from "@react-email/render";
import { sendMail } from "@/service/mail";
import { BookingStatus } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

import { ZodError } from "zod";
import NewBooking from "@/emails/NewBooking";
import { addOneHour } from "@/lib/utils";
import { getLogger } from "@/lib/backend/logger";

const logger = getLogger();

async function generateUniqueBookingNumberCode(): Promise<string> {
	let bookingNumber: string;

	do {
		bookingNumber = generateRandomNumbers(12);
	} while (await db.booking.findFirst({ where: { bookingNumber } }));

	return bookingNumber;
}

export async function POST(req: NextRequest) {
	try {
		const body: BookingSchemaInfer = await req.json();
		const payload = BookingSchema.safeParse(body);
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
		const { name, phone, email, typeOfEvent, bookType, date, note } =
			payload.data;

		const formattedEmail = email.toLowerCase();
		const newDate = addOneHour(date);

		const bookingNumber = await generateUniqueBookingNumberCode();

		const newBooking = await db.booking.create({
			data: {
				name,
				email: formattedEmail,
				bookingNumber,
				phone,
				date: newDate,
				typeOfEvent,
				bookType,
				note,
				status: BookingStatus.PENDING,
			},
		});
		if (!newBooking) {
			return handlerNativeResponse(
				{ status: 400, message: "No booking created" },
				400
			);
		}
		let bookNumber = newBooking.bookingNumber!;
		let bookDate = newBooking.date!;
		let type = newBooking.bookType!;
		let id = newBooking.id!;
		const emailHtml = render(
			NewBooking({ id, name, email, phone, bookNumber, bookDate, type })
		);
		await sendMail({
			name: "whoisfde",
			to: formattedEmail,
			subject: "Booking Confirmation",
			html: emailHtml,
		});
		return NextResponse.json({ status: "success" });
	} catch (error: any) {
		logger.error("Error in booking:", error);
		let message: any = "Something went wrong";
		let status = 500;
		if (error instanceof ZodError) {
			message = error.message;
			status = 422;
		}
		return handlerNativeResponse({ status, message }, status);
	}
}
