import { getAllRequests } from "@/actions/getAllRequests";
import { RequestColumns } from "@/components/columns/RequestColumns";
import { DataTable } from "@/components/common/DataTable";
import { Separator } from "@/components/ui/separator";

const RequestPage = async () => {
	const requests = await getAllRequests();
	return (
		<div className="px-10 py-5">
			<div className="flex items-center justify-between">
				<p className="text-heading2-bold">Requests</p>
			</div>
			<Separator className="bg-gray-200 my-4" />
			<DataTable
				columns={RequestColumns}
				//@ts-ignore
				data={requests}
				searchKey="Name"
			/>
		</div>
	);
};

export const dynamic = "force-dynamic";

export default RequestPage;
