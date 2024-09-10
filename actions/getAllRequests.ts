import { db } from "@/config/db.config";
import { SafeRequest } from "@/types";
import { unstable_noStore as noStore } from "next/cache";

export async function getAllRequests(): Promise<SafeRequest[] | null> {
	noStore();

	try {
		const [requests, users] = await Promise.all([
			db.request.findMany({ orderBy: { createdAt: "desc" } }),
			db.user.findMany({ select: { email: true } }),
		]);

		if (!requests.length) return [];

		const requestMap = new Map(users.map((user) => [user.email, user]));

		for (const req of requests) {
			if (requestMap.has(req.email)) {
				await db.request.delete({
					where: { id: req.id },
				});
			}
		}
		const plainRequests = JSON.parse(JSON.stringify(requests));
		return plainRequests;
	} catch (error) {
		console.error("Database Error:", error);
		throw new Error("Failed to fetch requests");
	}
}
