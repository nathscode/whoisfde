"use client";

import useMount from "@/hooks/use-mount";
import { Suspense } from "react";
import Reveal from "../Reveal";
import { NormalReviewSkeleton } from "../skeletons/NormalReviewSkeleton";
import CommentClients from "./CommentClients";
import Link from "next/link";

export default function ClientsAndOgComments() {
	const mount = useMount();

	if (!mount) return;

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
					<Suspense fallback={<NormalReviewSkeleton />}>
						<CommentClients />
					</Suspense>
				</div>
				<div className="flex flex-col justify-center items-center w-full">
					<Link
						href="/reviews"
						className="flex justify-center w-fit px-10 py-3 mt-4 text-sm font-semibold text-white bg-black border border-black rounded active:text-gray-500 hover:bg-transparent hover:text-black focus:outline-none focus:ring transition-all duration-200"
					>
						Leave a review
					</Link>
				</div>
			</div>
		</div>
	);
}
