"use client";
import { createQueryClient } from "@/lib/react-query-config";
import { QueryClientProvider } from "@tanstack/react-query";
import BrandSection from "../BrandSection";
import HeroSection from "./hero";
import ClientsAndOgComments from "./og-comments";
import WhoAmI from "./who-am-i";
import Works from "./works";

const queryClient = createQueryClient();

export default function Landing() {
	return (
		<div className="">
			<HeroSection />
			<BrandSection />
			<QueryClientProvider client={queryClient}>
				<Works />
			</QueryClientProvider>
			<WhoAmI />
			<ClientsAndOgComments />
		</div>
	);
}
