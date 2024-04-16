"use server";

import { db } from "@/config/db.config";
import checkIsAdmin from "./checkIsAdmin";
import getCurrentUser from "./getCurrentUser";

export async function deleteRequest(id: string) {
	const session = await getCurrentUser();
	const isAdmin = await checkIsAdmin();

	console.log(id);

	if (!id) {
		return { message: "No ID found" };
	}

	if (!session) {
		return { message: "Unauthorized" };
	}

	if (!isAdmin) {
		return { message: "Unauthorized and access denied" };
	}
	try {
		const isRequestExist = await db.request.findUnique({
			where: {
				id: id,
			},
			select: {
				id: true,
			},
		});

		if (!isRequestExist) {
			return {
				message: "No request found",
			};
		}

		const requestObj = await db.request.delete({
			where: {
				id: id,
			},
		});

		if (requestObj) {
			return {
				message: "Request deleted successfully",
			};
		}
	} catch (error) {
		return { message: "Database Error: Failed to delete request." };
	}
}
