import { db } from "@/config/db.config";
import { SafeReview } from "@/types";
import { unstable_noStore as noStore } from "next/cache";

export async function getAllReviews(): Promise<SafeReview[] | null> {
	noStore();

	try {
		const reviews = await db.review.findMany({
			orderBy: { createdAt: "desc" },
		});

		if (!reviews) return [];
		const plainReviews = JSON.parse(JSON.stringify(reviews));
		return plainReviews;
	} catch (error) {
		console.error("Database Error:", error);
		throw new Error("Failed to fetch reviews");
	}
}
