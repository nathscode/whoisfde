import { getAllOGs } from "@/actions/getAllOgs";
import { UserColumns } from "@/components/columns/UserColumns";
import { DataTable } from "@/components/common/DataTable";
import RegisterModal from "@/components/modals/RegisterModal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { User } from "lucide-react";
const UsersPage = async () => {
	const ogUsers = await getAllOGs();
	return (
		<div className="px-10 py-5">
			<div className="flex items-center justify-between">
				<p className="text-heading2-bold">Users</p>
				<RegisterModal />
			</div>
			<Separator className="bg-gray-200 my-4" />
			<div className="grid grid-cols-2 md:grid-cols-3 gap-10">
				<Card>
					<CardHeader className="flex flex-row justify-between items-center">
						<CardTitle className="text-lg">Total Users</CardTitle>
						<User className="max-sm:hidden" />
					</CardHeader>
					<CardContent>
						<p className="text-body-bold"> {ogUsers?.length}</p>
					</CardContent>
				</Card>
			</div>
			<DataTable
				columns={UserColumns}
				//@ts-ignore
				data={ogUsers}
				searchKey="name"
			/>
		</div>
	);
};

export const dynamic = "force-dynamic";

export default UsersPage;
