import ReviewsPadding from "../util/reviews-padding";
import { ogReviews } from "./data";
import OgReview from "./og-review";

export default function OgReviews() {
  return (
    <ReviewsPadding className="flex flex-col mt-6 gap-8">
      {ogReviews.map((review, index) => (
        <OgReview
          key={index}
          name={review.name}
          work={review.work}
          image={review.image}
          body={review.body}
          images={review.images}
        />
      ))}
    </ReviewsPadding>
  );
}
