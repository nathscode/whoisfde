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
];

export default function Pricing() {
	return (
		<div className="p-4">
			<Padding className="flex flex-col items-center gap-4 mb-10 mt-20">
				<motion.div
					className="text-[28px] sm:text-4xl font-bold font-heading"
					variants={textRevealMotion(0)}
				>
					Pricing
				</motion.div>
				<motion.div
					className="text-lg font-light text-left md:text-center"
					variants={textRevealMotion(0.4)}
				>
					Select pricing that best suit your budget.
				</motion.div>
			</Padding>
			<div className="flex flex-col sm:flex-row gap-2 justify-center">
				{pricingData.map((data, i) => (
					<PricingCard key={i} {...data} />
				))}
			</div>
		</div>
	);
}
