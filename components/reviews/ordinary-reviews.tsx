import OrdinaryReview from "./ordinary-review";
import { ordinaryReviews } from "./data";
import ReviewsPadding from "../util/reviews-padding";

export default function OrdinaryReviews() {
  return (
    <ReviewsPadding className="flex flex-col mt-6 gap-8">
      {ordinaryReviews.map((review, index) => (
        <OrdinaryReview
          key={index}
          name={review.name}
          work={review.work}
          image={review.image}
          body={review.body}
        />
      ))}
    </ReviewsPadding>
  );
}
