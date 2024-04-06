import { z } from "zod";

export const UserSchema = z
	.object({
		name: z.string().min(1, { message: "full name is required" }),
		email: z.string().email().min(1, {
			message: "Invalid email address",
		}),
		password: z
			.string()
			.min(1, "Password is required")
			.min(8, "Password must have than 8 characters"),
		confirmPassword: z
			.string()
			.min(1, "Password is required")
			.min(8, "Password must have than 8 characters"),
	})
	.refine((data) => data.password === data.confirmPassword, {
		path: ["confirmPassword"],
		message: "Password do not match",
	});
export type UserSchemaInfer = z.infer<typeof UserSchema>;
