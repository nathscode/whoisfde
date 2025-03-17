"use client";
import BrandSection from "../BrandSection";
import HeroSection from "./hero";
import ClientsAndOgComments from "./og-comments";
import WhoAmI from "./who-am-i";
import Works from "./works";

export default function Landing() {
	return (
		<div className="">
			<HeroSection />
			<BrandSection />
			<Works />
			<WhoAmI />
			<ClientsAndOgComments />
		</div>
	);
}
