import * as z from "zod";

export const ResetPasswordEmailSchema = z.object({
	email: z.string().email().min(1, {
		message: "Invalid email address",
	}),
});

export type ResetPasswordEmailSchemaInfer = z.infer<
	typeof ResetPasswordEmailSchema
>;

export const ResetPasswordSchema = z
	.object({
		password: z
			.string()
			.min(1, "Password is required")
			.min(8, "Password must have than 8 characters"),
		confirmPassword: z
			.string()
			.min(1, "Password is required")
			.min(8, "Password must have than 8 characters"),
		token: z.string().optional(),
	})
	.refine((data) => data.password === data.confirmPassword, {
		path: ["confirmPassword"],
		message: "Password do not match",
	});

export type ResetPasswordSchemaInfer = z.infer<typeof ResetPasswordSchema>;
