import { db } from "@/config/db.config";
import { SafeRequest } from "@/types";
import { unstable_noStore as noStore } from "next/cache";

export async function getSingleRequestById(
	id: string
): Promise<SafeRequest | null | undefined> {
	noStore();

	try {
		const request = await db.request.findUnique({
			where: {
				id: id,
			},
		});

		if (!request) return null;

		const plainRequest = JSON.parse(JSON.stringify(request));
		return plainRequest;
	} catch (error) {
		console.error("Database Error:", error);
	}
}
