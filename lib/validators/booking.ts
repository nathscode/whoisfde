import { z } from "zod";

export const BookingSchema = z.object({
	name: z.string().min(1, { message: "full name is required" }),
	phone: z.string().min(1, { message: "Phone number is required" }),
	email: z.string().email().min(1, {
		message: "Invalid email address",
	}),
	typeOfEvent: z.string().min(1, {
		message: "Type of Event is required",
	}),
	bookType: z.string().optional(),
	note: z.string().optional(),
	date: z
		.string()
		.or(z.date())
		.transform((arg) => new Date(arg)),
});
export type BookingSchemaInfer = z.infer<typeof BookingSchema>;
