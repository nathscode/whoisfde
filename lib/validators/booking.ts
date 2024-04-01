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
	date: z.date({
		required_error: "A date  is required.",
	}),
});
export type BookingSchemaInfer = z.infer<typeof BookingSchema>;
