import React from "react";
import { NormalReviewSkeleton } from "./NormalReviewSkeleton";
import { Shell } from "../Shell";

type Props = {};

const SuspenseSkeleton = (props: Props) => {
	return (
		<Shell className="max-w-6xl">
			<section className="grid grid-cols-1 gap-4 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
				{Array.from({ length: 4 }).map((_, i) => (
					<NormalReviewSkeleton key={i} />
				))}
			</section>
		</Shell>
	);
};

export default SuspenseSkeleton;
