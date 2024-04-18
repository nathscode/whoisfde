"use server";

import { db } from "@/config/db.config";
import checkIsAdmin from "./checkIsAdmin";
import getCurrentUser from "./getCurrentUser";

export async function deleteUser(id: string) {
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
		const isUserExist = await db.user.findUnique({
			where: {
				id: id,
			},
			select: {
				id: true,
			},
		});

		if (!isUserExist) {
			return {
				message: "No user found",
			};
		}

		const userObj = await db.user.delete({
			where: {
				id: id,
			},
		});

		if (userObj) {
			return {
				message: "User deleted successfully",
			};
		}
	} catch (error) {
		return { message: "Database Error: Failed to delete User." };
	}
}
