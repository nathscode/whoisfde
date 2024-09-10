import { SafeOgReviewExtras } from "@/types";
import ReviewsPadding from "../util/reviews-padding";
import OgReview from "./og-review";

type Props = {
	ogReviews: SafeOgReviewExtras[];
};
export default function OgReviews({ ogReviews }: Props) {
	return (
		<ReviewsPadding className="flex flex-col mt-6 gap-8">
			{ogReviews && ogReviews.length > 0 ? (
				ogReviews.map((review, index) => (
					<OgReview
						key={index}
						name={review.user?.name!}
						image={"/images/logo/logo-question.png"}
						body={review.content!}
						files={review.files!}
					/>
				))
			) : (
				<p className="font-semibold text-xl">No OG Reviews Yet</p>
			)}
		</ReviewsPadding>
	);
}
