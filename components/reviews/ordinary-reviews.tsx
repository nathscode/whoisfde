import OrdinaryReview from "./ordinary-review";
import { ordinaryReviews } from "./data";
import ReviewsPadding from "../util/reviews-padding";
import { SafeReview } from "@/types";

type Props = {
	reviews: SafeReview[];
};
export default function OrdinaryReviews({ reviews }: Props) {
	return (
		<ReviewsPadding className="flex flex-col mt-6 gap-8">
			{reviews && reviews.length > 0 ? (
				reviews.map((review, index) => (
					<OrdinaryReview
						key={index}
						name={review.name!}
						image={"/images/logo/logo-question.png"}
						body={review.content!}
					/>
				))
			) : (
				<div>No Review Yet</div>
			)}
		</ReviewsPadding>
	);
}

{
	/* <section className="grid grid-cols-1 gap-4 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
	{Array.from({ length: 4 }).map((_, i) => (
		<CategoryCardSkeleton key={i} />
	))}
</section>; */
}
