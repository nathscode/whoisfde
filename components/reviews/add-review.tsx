import getCurrentUser from "@/actions/getCurrentUser";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import NormalUserReview from "./NormalUserReview";
import OgUserReview from "./OgUserReview";
import { CustomUser } from "@/types";
type Props = {
	session: CustomUser;
};
export default function AddReview({ session }: Props) {
	return (
		<div className="flex justify-center items-center flex-col w-full py-24">
			<div className="flex flex-col items-center justify-center w-full max-w-lg">
				<div className="flex flex-col w-full">
					<Tabs defaultValue="reviews" className="w-full">
						<TabsList>
							<TabsTrigger value="reviews">Reviews</TabsTrigger>
							<TabsTrigger value="ogReviews">OG&apos;s Reviews</TabsTrigger>
						</TabsList>
						<TabsContent value="reviews">
							<NormalUserReview />
						</TabsContent>
						<TabsContent value="ogReviews">
							<OgUserReview session={session!} />
						</TabsContent>
					</Tabs>
				</div>
			</div>
		</div>
	);
}
