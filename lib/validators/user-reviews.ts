import { z } from "zod";

export const UserReviewSchema = z.object({
	name: z.string().min(1, { message: "full name is required" }),
	content: z.string().min(1, { message: "content is required" }),
});
export type UserReviewSchemaInfer = z.infer<typeof UserReviewSchema>;
