import checkIsAdmin from "@/actions/checkIsAdmin";
import { getSingleRequestById } from "@/actions/getSingleRequestById";
import BackButton from "@/components/common/BackButton";
import RegisterModal from "@/components/modals/RegisterModal";
import { redirect } from "next/navigation";

interface PageProps {
	params: {
		id: string;
	};
}

const RequestDetailPage = async ({ params }: PageProps) => {
	const request = await getSingleRequestById(params.id);
	const isAdmin = await checkIsAdmin();

	if (!isAdmin) {
		return redirect("/");
	}

	if (!request) {
		return redirect("/dashboard/requests");
	}

	return (
		<div className="flex flex-col p-5 rounded-lg bg-white w-full">
			<div className="container">
				<div>
					<BackButton />
				</div>
				<div className="flex flex-col justify-center items-center w-full mt-5">
					<div className="bg-gray-50  w-full xl:w-[600px] flex justify-between items-center md:items-start px-4 py-6 md:p-6 xl:p-8 flex-col">
						<ul className="flex flex-col space-y-4 flex-1 mt-4">
							<li className="flex flex-col">
								<h4 className="uppercase text-[12px] text-neutral-600 mb-1">
									Name
								</h4>
								<p className="text-[14px] font-medium">{request?.name}</p>
							</li>
							<li className="flex flex-col">
								<h4 className="uppercase text-[12px] text-neutral-600 mb-1">
									Email
								</h4>
								<p className="text-[14px] font-medium">{request?.email}</p>
							</li>
							<li className="flex flex-col">
								<h4 className="uppercase text-[12px] text-neutral-600 mb-1">
									Phone number
								</h4>
								<p className="text-[14px] font-medium">{request?.phone}</p>
							</li>
							<li className="flex flex-col">
								<h4 className="uppercase text-[12px] text-neutral-600 mb-1">
									Answer
								</h4>
								<p className="text-[14px] font-medium">{request?.answer}</p>
							</li>
						</ul>
					</div>
					{isAdmin && (
						<div className="flex flex-col justify-start my-4">
							<RegisterModal />
						</div>
					)}
				</div>
			</div>
		</div>
	);
};
export default RequestDetailPage;
