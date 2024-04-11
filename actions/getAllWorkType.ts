import { db } from "@/config/db.config";
import { SafeBooking, SafeWork, SafeWorkExtras } from "@/types";
import { unstable_noStore as noStore } from "next/cache";

export async function getAllWorkType(
	workType: string
): Promise<SafeWorkExtras[] | null> {
	noStore();

	try {
		const works = await db.work.findMany({
			where: {
				workType: workType,
			},
			orderBy: { createdAt: "desc" },
			include: {
				workFiles: true,
			},
		});

		if (!works) return [];
		const plainWorks = JSON.parse(JSON.stringify(works));
		return plainWorks;
	} catch (error) {
		console.error("Database Error:", error);
		throw new Error("Failed to fetch works");
	}
}
