import PricingSection from "@/components/PricingSection";
import { Metadata } from "next";

export const metadata: Metadata = {
	title: "Pricing",
};

const PricingPage = async () => {
	return (
		<div className="flex flex-col justify-center items-center py-20">
			<PricingSection />
		</div>
	);
};

export default PricingPage;
