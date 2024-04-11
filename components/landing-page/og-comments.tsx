"use client";

import { Suspense } from "react";
import Reveal from "../Reveal";
import CommentClients from "./CommentClients";
import SuspenseSkeleton from "../skeletons/SuspenseSkeleton";
import useMount from "@/hooks/use-mount";
import { NormalReviewSkeleton } from "../skeletons/NormalReviewSkeleton";

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
			</div>
		</div>
	);
}
