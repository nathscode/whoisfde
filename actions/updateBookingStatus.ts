"use server";

import { db } from "@/config/db.config";
import { statusUpdateSchema } from "@/lib/validators/status";
import { BookingStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import checkIsAdmin from "./checkIsAdmin";
import EmailStatus from "@/emails/EmailStatus";
import { sendMail } from "@/service/mail";
import { render } from "@react-email/components";

export async function updateBookingStatus(
	values: z.infer<typeof statusUpdateSchema>
) {
	const isAdmin = await checkIsAdmin();

	const validatedFields = statusUpdateSchema.safeParse(values);

	if (!validatedFields.success) {
		return {
			errors: validatedFields.error.flatten().fieldErrors,
			message: "Missing Fields. Failed to Update Post.",
		};
	}

	const { status, bookingId } = validatedFields.data;

	if (!isAdmin) {
		return { message: "Unauthorized and access denied" };
	}

	const booking = await db.booking.findUnique({
		where: {
			id: String(bookingId),
		},
	});

	if (!booking) {
		return { message: "Booking id not found.." };
	}
	let bookingStatus: BookingStatus = BookingStatus.PENDING;
	if (status) {
		if (status === BookingStatus.PROCESSING) {
			bookingStatus = BookingStatus.PROCESSING;
		} else if (status === BookingStatus.DENIED) {
			bookingStatus = BookingStatus.DENIED;
		} else if (status === BookingStatus.SUCCESS) {
			bookingStatus = BookingStatus.SUCCESS;
		}
	}
	try {
		await db.booking.update({
			where: {
				id: String(bookingId),
			},
			data: {
				status: bookingStatus,
			},
		});
		let bookNumber = booking.bookingNumber!;
		let bookDate = booking.date!;
		let type = booking.bookType!;
		let email = booking.email!;
		let name = booking.name!;
		let status = bookingStatus;
		let phone = booking.phone!;
		const emailHtml = render(
			EmailStatus({ name, email, phone, bookNumber, bookDate, type, status })
		);
		await sendMail({
			name: "whoisfde",
			to: email,
			subject: "Your Booking Status",
			html: emailHtml,
		});
		revalidatePath(`/dashboard/bookings/${bookingId}`);
		return { message: "booking updated successfully." };
	} catch (error) {
		return { message: "Database Error: Failed to Update booking." };
	}
}
