"use client";
import { useEffect } from "react";
import Landing from "@/components/landing-page/landing";
import Lenis from "@studio-freight/lenis";

export default function Home() {
	useEffect(() => {
		const lenis = new Lenis();
		function raf(time: any) {
			lenis.raf(time);
			requestAnimationFrame(raf);
		}
		requestAnimationFrame(raf);
	}, []);

	return (
		<div className="flex flex-col justify-between">
			<Landing />
		</div>
	);
}
