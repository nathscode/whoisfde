import Reviews from "@/components/reviews/reviews";
import { Metadata } from "next";
import React from "react";

type Props = {};

export const metadata: Metadata = {
	title: "Reviews",
};

const ReviewPage = (props: Props) => {
	return <Reviews />;
};

export default ReviewPage;
