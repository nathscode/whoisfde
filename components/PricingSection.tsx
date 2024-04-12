"use client";
import PricingCard from "./card/pricing-card";
import { textRevealMotion } from "./util/animations";
import Padding from "./util/home-padding";
import { motion } from "framer-motion";

const pricingData = [
	{
		name: "Regular",
		features: [
			"Event recap (3minutes minimum)",
			"2 short form contents from event (1minute maximum)",
		],
	},
	{
		name: "Gold",
		cost: "400,000",
		features: [
			"Event recap (3minutes minimum)",
			"3 short form contents from event (1minute maximum)",
			"Drone highlights (1minute maximum)",
		],
	},
	{
		name: "Platinum",
		features: [
			"Trailer of Event (1minute maximum) ",
			"Event recap (3minutes minimum)",
			"3 short form contents from event (1minute maximum)",
			"2 Drone highlights (1minute maximum)",
			"360 camera highlights",
		],
	},
	{
		name: "Blank",
		features: [
			"Freedom to tell us what you want",
			"Tell us what you want when booking.",
		],
	},
];

const PricingSection = () => {
	return (
		<div className="p-4">
			<Padding className="flex flex-col items-center gap-4 mb-10 mt-20">
				<motion.div
					className="text-[28px] sm:text-4xl font-bold font-heading"
					variants={textRevealMotion(0)}
				>
					Packages
				</motion.div>
				<motion.div
					className="text-lg font-light text-left md:text-center"
					variants={textRevealMotion(0.4)}
				>
					Select package that best suit your budget.
				</motion.div>
			</Padding>
			<div className="max-w-5xl w-full">
				<div className="flex flex-wrap justify-center sm:justify-between flex-col md:flex-row w-full  space-y-2  md:space-y-0">
					{pricingData.map((data, i) => (
						<PricingCard key={i} {...data} />
					))}
				</div>
			</div>
		</div>
	);
};
export default PricingSection;
