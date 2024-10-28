import { getAllWorks } from "@/actions/getAllWorks";
import { WorkColumns } from "@/components/columns/WorkColumns";
import { DataTable } from "@/components/common/DataTable";
import WorkModal from "@/components/modals/WorkModal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { User } from "lucide-react";
const UsersPage = async () => {
	const works = await getAllWorks();
	return (
		<div className="px-10 py-5">
			<div className="flex items-center justify-between">
				<p className="text-heading2-bold">Your Works</p>
				<WorkModal />
			</div>
			<Separator className="bg-gray-200 my-4" />
			<div className="grid grid-cols-2 md:grid-cols-3 gap-10">
				<Card>
					<CardHeader className="flex flex-row justify-between items-center">
						<CardTitle className="text-lg">Total Works</CardTitle>
						<User className="max-sm:hidden" />
					</CardHeader>
					<CardContent>
						<p className="text-body-bold"> {works?.length}</p>
					</CardContent>
				</Card>
			</div>
			<DataTable
				columns={WorkColumns}
				//@ts-ignore
				data={works}
				searchKey="workType"
			/>
		</div>
	);
};

export const dynamic = "force-dynamic";

export default UsersPage;
