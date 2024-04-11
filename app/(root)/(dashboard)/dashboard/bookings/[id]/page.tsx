import { getSingleBookingById } from "@/actions/getSingleBookingById";
import BackButton from "@/components/common/BackButton";
import { formatDateTime } from "@/lib/utils";

interface PageProps {
	params: {
		id: string;
	};
}

const BookingDetailPage = async ({ params }: PageProps) => {
	const booking = await getSingleBookingById(params.id);
	return (
		<div className="flex flex-col p-5 rounded-lg bg-white w-full">
			<div className="container">
				<div>
					<BackButton />
				</div>
				<div className="flex flex-col justify-center items-center w-full mt-5">
					<div className="bg-gray-50  w-full xl:w-[600px] flex justify-between items-center md:items-start px-4 py-6 md:p-6 xl:p-8 flex-col">
						<ul className="space-y-4 flex flex-col w-full mt-5">
							<li className="flex justify-between w-full">
								<strong className="inline-flex">Booking Number</strong>
								<span className="inline-flex">{booking?.bookingNumber}</span>
							</li>
							<li className="flex justify-between w-full">
								<strong className="inline-flex">Booking Type</strong>
								<span className="inline-flex">{booking?.bookType}</span>
							</li>
							<li className="flex justify-between w-full">
								<strong className="inline-flex">Event Type</strong>
								<span className="inline-flex">{booking?.typeOfEvent}</span>
							</li>
							<li className="flex justify-between w-full">
								<strong className="inline-flex">Event Date</strong>
								<span className="inline-flex">
									{formatDateTime(booking?.date!.toString()!)}
								</span>
							</li>
							<li className="flex justify-between w-full">
								<strong className="inline-flex">Booking Status</strong>
								<span className="inline-flex">
									<span
										className={`${
											booking?.status === "SUCCESS"
												? "bg-green-100 text-green-800 "
												: "bg-red-100 text-red-500"
										}inline-flex text-sm px-2 py-1.5 font-medium rounded-full w-fit text-center`}
									>
										{booking?.status}
									</span>
								</span>
							</li>
						</ul>
						<div className="flex flex-col bg-neutral-100 rounded-lg w-full p-2 my-4 ">
							<h4 className="text-base font-semibold uppercase">Client info</h4>
							<ul className="flex flex-col space-y-4 flex-1 mt-4">
								<li className="flex flex-col">
									<h4 className="uppercase text-[12px] text-neutral-600 mb-1">
										Client Name
									</h4>
									<p className="text-[14px] font-medium">{booking?.name}</p>
								</li>
								<li className="flex flex-col">
									<h4 className="uppercase text-[12px] text-neutral-600 mb-1">
										Client email
									</h4>
									<p className="text-[14px] font-medium">{booking?.email}</p>
								</li>
								<li className="flex flex-col">
									<h4 className="uppercase text-[12px] text-neutral-600 mb-1">
										Client Phone Number
									</h4>
									<p className="text-[14px] font-medium">{booking?.phone}</p>
								</li>
							</ul>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
export default BookingDetailPage;
