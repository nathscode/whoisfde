import { z } from "zod";

export const statusUpdateSchema = z.object({
	status: z.string().min(1, {
		message: "Status is required",
	}),
	bookingId: z.string().optional(),
});

export type statusUpdateSchemaInfer = z.infer<typeof statusUpdateSchema>;
