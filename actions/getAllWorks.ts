import { db } from "@/config/db.config";
import { SafeBooking, SafeWork } from "@/types";
import { unstable_noStore as noStore } from "next/cache";

export async function getAllWorks(): Promise<SafeWork[] | null> {
	noStore();

	try {
		const works = await db.work.findMany({
			orderBy: { createdAt: "desc" },
		});

		if (!works) return [];
		const plainWorks = JSON.parse(JSON.stringify(works));
		return plainWorks;
	} catch (error) {
		console.error("Database Error:", error);
		throw new Error("Failed to fetch works");
	}
}
