import { db } from "@/config/db.config";
import { SafeRequest } from "@/types";
import { unstable_noStore as noStore } from "next/cache";

export async function getAllRequests(): Promise<SafeRequest[] | null> {
	noStore();

	try {
		const requests = await db.request.findMany({
			orderBy: { createdAt: "desc" },
		});

		if (!requests) return [];
		const plainRequests = JSON.parse(JSON.stringify(requests));
		return plainRequests;
	} catch (error) {
		console.error("Database Error:", error);
		throw new Error("Failed to fetch requests");
	}
}
