import { z } from "zod";

export const RequestSchema = z.object({
	name: z.string().min(1, { message: "full name is required" }),
	phone: z.string().min(1, { message: "Phone number is required" }),
	email: z.string().email().min(1, {
		message: "Invalid email address",
	}),
	question: z.string().min(1, { message: "Question is required" }),
});
export type RequestSchemaInfer = z.infer<typeof RequestSchema>;
