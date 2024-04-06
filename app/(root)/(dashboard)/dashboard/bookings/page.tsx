import { getAllBooking } from "@/actions/getAllBookings";
import { BookingColumns } from "@/components/columns/BookingColumns";
import { DataTable } from "@/components/common/DataTable";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Receipt } from "lucide-react";

const BookingSectionPage = async () => {
	const bookings = await getAllBooking();
	return (
		<div className="px-10 py-5">
			<div className="flex items-center justify-between">
				<p className="text-heading2-bold">Bookings</p>
			</div>
			<Separator className="bg-gray-200 my-4" />
			<div className="grid grid-cols-2 md:grid-cols-3 gap-10">
				<Card>
					<CardHeader className="flex flex-row justify-between items-center">
						<CardTitle className="text-lg">Total Booking</CardTitle>
						<Receipt className="max-sm:hidden" />
					</CardHeader>
					<CardContent>
						<p className="text-body-bold"> {bookings?.length}</p>
					</CardContent>
				</Card>
			</div>
			<DataTable
				columns={BookingColumns}
				//@ts-ignore
				data={bookings}
				searchKey="Name"
			/>
		</div>
	);
};

export const dynamic = "force-dynamic";

export default BookingSectionPage;
