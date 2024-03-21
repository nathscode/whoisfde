import { ogReviews } from "./data";
import OgReview from "./og-review";

export default function OgReviews() {
  return (
    <div className="flex flex-col mt-6 gap-8 px-2 sm:px-[75px] md:px-[150px] lg:px-[300px] xl:px-[400px]">
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
    </div>
  );
}
