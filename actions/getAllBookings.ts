import { db } from "@/config/db.config";
import { SafeBooking } from "@/types";
import { unstable_noStore as noStore } from "next/cache";

export async function getAllBooking(): Promise<SafeBooking[] | null> {
	noStore();

	try {
		const bookings = await db.booking.findMany({
			orderBy: { createdAt: "desc" },
		});

		if (!bookings) return [];
		const plainBookings = JSON.parse(JSON.stringify(bookings));
		return plainBookings;
	} catch (error) {
		console.error("Database Error:", error);
		throw new Error("Failed to fetch bookings");
	}
}
