"use client";

import Image from "next/image";
import { Suspense, useRef, useState } from "react";
import TabController from "../util/tab-controller";
import AddReview from "./add-review";
import OgReviews from "./og-reviews";
import OrdinaryReviews from "./ordinary-reviews";
import { CustomUser, SafeOgReviewExtras, SafeReview } from "@/types";
import { NormalReviewSkeleton } from "../skeletons/NormalReviewSkeleton";
import SuspenseSkeleton from "../skeletons/SuspenseSkeleton";
import { ogReviews } from "./data";

type Props = {
	session: CustomUser;
	reviews: SafeReview[];
	ogReviewData: SafeOgReviewExtras[];
};

const ReviewBar = ({ session, reviews, ogReviewData }: Props) => {
	const position = useRef(0);
	const [activeComponent, setActiveComponent] = useState(
		<OrdinaryReviews reviews={reviews} />
	);
	return (
		<div className="bg-white text-black mt-20">
			<div className="flex flex-col items-center gap-4">
				<div
					className="
             px-2 
             md:px-[50px] 
             lg:px-[200px] 
             xl:px-[400px] 
             flex flex-col 
             items-start 
             md:items-center 
             gap-4"
				>
					<div className="text-3xl font-[500]  font-heading">
						REVIEWS AND COMMENTS FROM MY OG&apos;S
					</div>
					<div className="text-base sm:text-lg font-light text-left md:text-center">
						Read reviews of clients I have worked with over the years. You also
						get access to pictures and recordings from behind the scene moments
						with my OGs
					</div>
				</div>
				<TabController
					elementsStyle="
          my-7 flex px-2 
          sm:px-[75px] 
          md:px-[150px] 
          lg:px-[300px] 
          xl:px-[400px] 
          justify-between 
          items-center 
          mb-1
          "
					activeElementColor="#4159AD"
					indicatorColor="#4159AD"
					railColor="#eeeeee"
					onTabPress={(index) => {
						position.current = index;
						if (index === 0) {
							setActiveComponent(
								<Suspense fallback={<SuspenseSkeleton />}>
									<OrdinaryReviews reviews={reviews} />
								</Suspense>
							);
						} else if (index === 1) {
							setActiveComponent(
								<Suspense fallback={<SuspenseSkeleton />}>
									<OgReviews
										//@ts-ignore
										ogReviews={ogReviewData}
									/>
								</Suspense>
							);
						} else {
							setActiveComponent(<AddReview session={session} />);
						}
					}}
				>
					<div>Reviews</div>
					<div>OGs Comments</div>
					<div className="flex gap-2 items-center">
						<div>
							{position.current !== 2 ? (
								<Image
									src={"/add_black.svg"}
									width={14}
									height={14}
									alt="add"
								/>
							) : (
								<Image src={"/add_blue.svg"} width={14} height={14} alt="add" />
							)}
						</div>
						<div>Add Review</div>
					</div>
				</TabController>
				{activeComponent}
			</div>
			<div className="px-[2px] md:px-32 mt-10 md:mt-20">
				<div className="h-[1px] w-full bg-black rounded-full" />
			</div>
		</div>
	);
};

export default ReviewBar;
