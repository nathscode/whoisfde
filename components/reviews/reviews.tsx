import getCurrentUser from "@/actions/getCurrentUser";
import ReviewBar from "./ReviewBar";
import { getAllReviews } from "@/actions/getAllReviews";
import { getAllOgsReviews } from "@/actions/getAllOgsReviews";

export default async function Reviews() {
	const session = await getCurrentUser();
	const reviews = await getAllReviews();
	const ogReviews = await getAllOgsReviews();

	return (
		<ReviewBar
			session={session!}
			reviews={reviews!}
			ogReviewData={ogReviews!}
		/>
	);
}
