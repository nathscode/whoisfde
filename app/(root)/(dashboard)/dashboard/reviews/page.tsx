import { getAllOgsReviews } from "@/actions/getAllOgsReviews";
import { getAllReviews } from "@/actions/getAllReviews";
import { ReviewsColumns } from "@/components/columns/ReviewsColumns";
import { DataTable } from "@/components/common/DataTable";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ReviewsPage = async () => {
	const reviews = await getAllReviews();
	const ogReviews = await getAllOgsReviews();

	return (
		<div className="px-10 py-5">
			<div className="flex items-center justify-between">
				<p className="text-heading2-bold">Reviews</p>
			</div>
			<Separator className="bg-gray-200 my-4" />
			<Tabs defaultValue="reviews" className="w-full">
				<TabsList>
					<TabsTrigger value="reviews">Reviews</TabsTrigger>
					<TabsTrigger value="ogReviews">OG&apos;s Reviews</TabsTrigger>
				</TabsList>
				<TabsContent value="reviews">
					<div className="flex flex-col w-full my-5">
						<h1 className="text-heading3-bold">Reviews</h1>
						<DataTable
							columns={ReviewsColumns}
							//@ts-ignore
							data={reviews}
							searchKey="Name"
						/>
					</div>
				</TabsContent>
				<TabsContent value="ogReviews">
					<div className="flex flex-col w-full my-5">
						<h1 className="text-heading3-bold">OG&apos;s Reviews</h1>
						<DataTable
							columns={ReviewsColumns}
							//@ts-ignore
							data={ogReviews}
							searchKey="Name"
						/>
					</div>
				</TabsContent>
			</Tabs>
		</div>
	);
};

export const dynamic = "force-dynamic";

export default ReviewsPage;
