"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/config/db.config";

interface UpdateWorkData {
	caption: string;
	workType: string;
}

export async function updateWork(id: string, data: UpdateWorkData) {
	try {
		// Validate the ID
		if (!id) {
			return { success: false, error: "Work ID is required" };
		}

		// Validate the data
		if (!data.caption || !data.workType) {
			return { success: false, error: "Caption and work type are required" };
		}

		// Check if work exists
		const existingWork = await db.work.findUnique({
			where: { id },
		});

		if (!existingWork) {
			return { success: false, error: "Work not found" };
		}

		// Update the work
		const updatedWork = await db.work.update({
			where: { id },
			data: {
				caption: data.caption,
				workType: data.workType,
			},
		});
		revalidatePath("/dashboard/works");
		return { success: true, data: updatedWork };
	} catch (error) {
		console.error("Error updating work:", error);
		return { success: false, error: "Failed to update work" };
	}
}
