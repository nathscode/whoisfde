"use client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { ConfirmModal } from "../modals/ConfirmModal";
import { Loader2, Trash } from "lucide-react";
import { startTransition, useTransition } from "react";
import { deleteRequest } from "@/actions/deleteRequest";

type Props = {
	id: string;
};

const RequestDeleteButton = ({ id }: Props) => {
	const [isLoading, startTransition] = useTransition();

	const router = useRouter();
	const { toast } = useToast();

	const onDeleteRequest = async () => {
		startTransition(async () => {
			const result = await deleteRequest(id);
			router.push("/dashboard/requests");
			toast({ title: `${result?.message}` });
		});
	};

	return (
		<div className="w-full">
			<ConfirmModal
				description="You're about to delete this request"
				onConfirm={onDeleteRequest}
			>
				<Button
					variant="destructive"
					className="w-full px-10"
					size="icon"
					disabled={isLoading}
				>
					{isLoading && isLoading ? (
						<Loader2 size={16} className="animate-spin" />
					) : (
						<span className="inline-flex">
							Delete Request <Trash className="w-5 h-5 ml-2" />
						</span>
					)}
				</Button>
			</ConfirmModal>
		</div>
	);
};

export default RequestDeleteButton;
