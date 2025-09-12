"use server";

import { db } from "@/config/db.config";
import { getLogger } from "@/lib/backend/logger";
import { uploadSchema } from "@/lib/validators/video";
import { z } from "zod";

const logger = getLogger();
export async function createWork(values: z.infer<typeof uploadSchema>) {
	try {
		// Validate input
		const validatedFields = uploadSchema.safeParse(values);

		if (!validatedFields.success) {
			return {
				errors: validatedFields.error.flatten().fieldErrors,
				message: "Missing or Invalid Fields. Failed to Upload Work.",
			};
		}

		const { links, caption, workType, fileUrl } = validatedFields.data;

		// Check if BOTH fileUrl & links are empty
		const hasFile = fileUrl && fileUrl.trim() !== "";
		const hasLink = links && links.trim() !== "";

		if (!hasFile && !hasLink) {
			return {
				message: "You must provide either a file or a link.",
			};
		}

		// Create the Work entry
		const newWork = await db.work.create({
			data: { caption, links, workType },
		});

		// Create file record only if file exists
		if (hasFile) {
			await db.workFiles.create({
				data: { url: fileUrl, workId: newWork.id },
			});
		}

		return { message: "Work uploaded successfully." };
	} catch (error: any) {
		logger.error("Error in createWork:", error);
		return { message: "Database Error: Failed to upload work." };
	}
}
