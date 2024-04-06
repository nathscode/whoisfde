import { db } from "@/config/db.config";
import { SafeOgReviewExtras, SafeReview } from "@/types";
import { unstable_noStore as noStore } from "next/cache";

export async function getAllOgsReviews(): Promise<SafeOgReviewExtras[] | null> {
	noStore();

	try {
		const ogReviews = await db.ogReview.findMany({
			orderBy: { createdAt: "desc" },
			include: {
				files: true,
				user: true,
			},
		});

		if (!ogReviews) return [];
		const plainReviews = JSON.parse(JSON.stringify(ogReviews));
		return plainReviews;
	} catch (error) {
		console.error("Database Error:", error);
		throw new Error("Failed to fetch ogReviews");
	}
}
