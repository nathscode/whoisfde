import Reviews from "@/components/reviews/reviews";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
	title: "Reviews",
};

const ReviewPage = async () => {
	return <Reviews />;
};

export default ReviewPage;
