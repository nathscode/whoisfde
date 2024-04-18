"use client";
import { deleteUser } from "@/actions/deleteUser";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { ConfirmModal } from "../modals/ConfirmModal";

type Props = {
	id: string;
};

const UserDeleteButton = ({ id }: Props) => {
	const [isLoading, startTransition] = useTransition();

	const router = useRouter();
	const { toast } = useToast();

	const onDeleteRequest = async () => {
		startTransition(async () => {
			const result = await deleteUser(id);
			router.push("/dashboard/users");
			toast({ title: `${result?.message}` });
			window.location.reload();
		});
	};

	return (
		<div className="w-full">
			<ConfirmModal
				description="You're about to delete this OG"
				onConfirm={onDeleteRequest}
			>
				<Button
					variant="destructive"
					className="w-full"
					size="icon"
					disabled={isLoading}
				>
					{isLoading && isLoading ? (
						<Loader2 size={16} className="animate-spin" />
					) : (
						<span className="inline-flex">
							<Trash className="w-5 h-5 ml-2" />
						</span>
					)}
				</Button>
			</ConfirmModal>
		</div>
	);
};

export default UserDeleteButton;
