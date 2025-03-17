import { z } from "zod";

export const blobSchema = z.object({
	id: z.string().uuid(),
	filename: z.string().min(1).max(255),
	contentType: z
		.string()
		.regex(/text\/.*|image\/.*|application\/.*|audio\/.*|video\/./),
	size: z.number().int().positive(),
	content: z.string().optional(), // Optional base64 content
});

export type blobSchemaInfer = z.infer<typeof blobSchema>;

export const uploadSchema = z.object({
	caption: z.string().optional(),
	workType: z.string(),
	links: z.string().optional(),
	fileUrl: z.string(),
});
export type uploadSchemaInfer = z.infer<typeof uploadSchema>;
