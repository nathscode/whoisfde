import { z } from "zod";

export const LoginSchema = z.object({
	email: z.string().email().min(1, {
		message: "Invalid email address",
	}),
	password: z
		.string()
		.min(1, "Password is required")
		.min(8, "Password must have than 8 characters"),
});

export type LoginSchemaInfer = z.infer<typeof LoginSchema>;
