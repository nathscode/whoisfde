"use server";

import { db } from "@/config/db.config";
import { getLogger } from "@/lib/backend/logger";
import { SafeWorkExtras } from "@/types";
import { unstable_noStore as noStore } from "next/cache";

export type WorkWithFiles = Awaited<
	ReturnType<typeof getAllWorkVideos>
>[number];

export async function getAllWorkVideos(): Promise<SafeWorkExtras[] | []> {
	noStore();
	try {
		const works = await db.work.findMany({
			where: {
				isActive: false,
				isScrolled: true,
				OR: [{ links: null }, { links: "" }],
				workFiles: {
					some: {},
				},
			},
			include: {
				workFiles: true,
			},
			orderBy: {
				createdAt: "desc",
			},
		});

		if (!works) return [];
		const plainWorks = JSON.parse(JSON.stringify(works));
		return plainWorks;
	} catch (error) {
		console.error("Failed to fetch works:", error);
		throw new Error("Unable to load works");
	}
}
