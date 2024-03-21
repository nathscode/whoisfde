import OrdinaryReview from "./ordinary-review";
import { ordinaryReviews } from "./data";

export default function OrdinaryReviews() {
  return (
    <div className="flex flex-col mt-6 gap-8 px-2 sm:px-[75px] md:px-[150px] lg:px-[300px] xl:px-[400px]">
      {ordinaryReviews.map((review, index) => (
        <OrdinaryReview
          key={index}
          name={review.name}
          work={review.work}
          image={review.image}
          body={review.body}
        />
      ))}
    </div>
  );
}
