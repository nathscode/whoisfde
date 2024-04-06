import { db } from "@/config/db.config";
import { CustomSession } from "@/types";
import { unstable_noStore as noStore } from "next/cache";

export async function getAllOGs(): Promise<CustomSession[] | null> {
	noStore();

	try {
		const users = await db.user.findMany({
			where: {
				role: {
					not: "ADMIN",
				},
			},
			orderBy: { createdAt: "desc" },
		});

		if (!users) return [];
		const plainUsers = JSON.parse(JSON.stringify(users));
		return plainUsers;
	} catch (error) {
		console.error("Database Error:", error);
		throw new Error("Failed to fetch users");
	}
}
