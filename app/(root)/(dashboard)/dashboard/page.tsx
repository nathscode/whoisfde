import { getAllBooking } from "@/actions/getAllBookings";
import { getAllOGs } from "@/actions/getAllOgs";
import { getAllOgsReviews } from "@/actions/getAllOgsReviews";
import { getAllReviews } from "@/actions/getAllReviews";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CircleDollarSign, Mail, Users2 } from "lucide-react";

export default async function DashboardPage() {
	const ogUsers = await getAllOGs();
	const bookings = await getAllBooking();
	const reviews = await getAllReviews();
	const ogReviews = await getAllOgsReviews();

	const totalReviews = reviews?.length! + ogReviews?.length!;

	return (
		<div className="px-8 py-10">
			<p className="text-heading2-bold">Dashboard</p>
			<Separator className="bg-grey-1 my-5" />
			<div className="grid grid-cols-1 md:grid-cols-3 gap-10">
				<Card>
					<CardHeader className="flex flex-row justify-between items-center">
						<CardTitle className="text-lg">Total Booking</CardTitle>
						<CircleDollarSign className="max-sm:hidden" />
					</CardHeader>
					<CardContent>
						<p className="text-body-bold">{bookings?.length}</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row justify-between items-center">
						<CardTitle className="text-lg">Total OG&apos;s</CardTitle>
						<Users2 className="max-sm:hidden" />
					</CardHeader>
					<CardContent>
						<p className="text-body-bold">{ogUsers?.length}</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row justify-between items-center">
						<CardTitle className="text-lg">Total Reviews</CardTitle>
						<Mail className="max-sm:hidden" />
					</CardHeader>
					<CardContent>
						<p className="text-body-bold">{totalReviews}</p>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
