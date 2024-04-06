import { z } from "zod";

export const OgUserReviewSchema = z.object({
	location: z.string().min(1, { message: "location is required" }),
	content: z.string().min(1, { message: "content is required" }),
});
export type OgUserReviewSchemaInfer = z.infer<typeof OgUserReviewSchema>;
