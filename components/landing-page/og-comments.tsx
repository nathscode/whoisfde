"use client";

import { Suspense } from "react";
import Reveal from "../Reveal";
import CommentClients from "./CommentClients";
import SuspenseSkeleton from "../skeletons/SuspenseSkeleton";

export default function ClientsAndOgComments() {
	const testimonials: {
		id: number;
		name: string;
		location: string;
		text: string;
		image?: string;
	}[] = [
		{
			id: 1,
			name: "Ajakaye Joshua",
			location: "E.O.Y 23' PARTY",
			text: "I recently used this website for a purchase and I was extremely satisfied with the ease of use and the variety of options 							available. The checkout process was seamless and the delivery was				prompt",
			image: "/who-image.png",
		},
		{
			id: 2,
			name: "John Peter",
			location: "E.O.Y 23' PARTY",
			text: "I recently used this website for a purchase and I was extremely satisfied.",
		},
	];

	return (
		<div
			className="
      px-2 
    
      md:h-screen 
      flex 
      items-center 
      justify-center
      relative"
		>
			<div className="px-4 py-10">
				<Reveal>
					<div className="clients font-heading text-4xl font-semibold mb-6 md:mb-12">
						CLIENTS AND OG&apos;S COMMENTS
					</div>
				</Reveal>
				<div className="flex flex-col md:flex-row gap-4 justify-center">
					<Suspense fallback={<SuspenseSkeleton />}>
						<CommentClients />
					</Suspense>
				</div>
			</div>
		</div>
	);
}
