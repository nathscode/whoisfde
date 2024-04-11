import { db } from "@/config/db.config";
import { SafeBooking } from "@/types";
import { unstable_noStore as noStore } from "next/cache";

export async function getSingleBookingById(
	id: string
): Promise<SafeBooking | null | undefined> {
	noStore();

	try {
		const booking = await db.booking.findUnique({
			where: {
				id: id,
			},
		});

		if (!booking) return null;

		const plainBooking = JSON.parse(JSON.stringify(booking));
		return plainBooking;
	} catch (error) {
		console.error("Database Error:", error);
	}
}
