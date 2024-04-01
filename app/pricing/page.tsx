import Pricing from "@/components/Pricing";
import React from "react";

type Props = {};

const PricingPage = (props: Props) => {
	return (
		<div className="flex flex-col justify-center items-center py-20">
			<Pricing />
		</div>
	);
};

export default PricingPage;
