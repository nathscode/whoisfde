import BookingForm from "@/components/forms/BookingForm";
import Padding from "@/components/util/home-padding";
import { Metadata } from "next";
import React, { Suspense } from "react";

export const metadata: Metadata = {
	title: "Book",
};

const BookPage = async () => {
	return (
		<div className="py-20">
			<Padding className="flex flex-col items-center gap-4 mb-10 mt-20">
				<div className="text-[28px] sm:text-3xl font-[500]">
					SERVICE BOOKING FORM
				</div>
				<div className="text-lg font-light text-left md:text-center">
					Fill the form below in other for me to get a complete idea and
					scenario of what we will be working on.
				</div>
			</Padding>
			<div className="flex justify-center items-center flex-col w-full py-24">
				<div className="flex flex-col items-center justify-center w-full max-w-4xl">
					<Suspense>
						<BookingForm />
					</Suspense>
				</div>
			</div>
		</div>
	);
};

export default BookPage;
