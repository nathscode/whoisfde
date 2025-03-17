"use client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { ConfirmModal } from "../modals/ConfirmModal";
import { Loader2, Trash } from "lucide-react";

type Props = {
	id: string | null;
};

const DeleteButton = ({ id }: Props) => {
	const queryClient = useQueryClient();
	const router = useRouter();
	const { toast } = useToast();
	const { mutate, isPending } = useMutation({
		mutationFn: async () => {
			const { data } = await axios.delete(`/api/rooter/work`, {
				params: {
					id: id,
				},
				headers: {
					"Content-Type": "multipart/form-data",
				},
			});
			return data;
		},
		onSuccess: () => {
			router.refresh();
			queryClient.invalidateQueries({
				queryKey: ["deleteWork", id],
			});
			toast({
				description: "Delete Successful",
			});
		},
		onError: (err: any) => {
			if (err instanceof AxiosError) {
				if (err.response?.data?.status === 401) {
					return toast({
						title: "An error occurred.",
						description: `${err.response?.data?.errors?.message}`,
						variant: "destructive",
					});
				}
				if (err.response?.data?.status === 400) {
					return toast({
						title: "An error occurred.",
						description: `${err.response?.data?.errors?.message}`,
						variant: "destructive",
					});
				}

				if (err.response?.status === 403) {
					return toast({
						title: "Unauthorized request.",
						description: `${err.response.data?.errors?.message}`,
						variant: "destructive",
					});
				}
				if (err.response?.status === 404) {
					return toast({
						title: "Review not found.",
						description: `${err.response.data?.errors?.message}`,
						variant: "destructive",
					});
				}
				if (err.response?.status === 405) {
					return toast({
						title: "Method not allowed.",
						description: `${err.response.data?.errors?.message}`,
						variant: "destructive",
					});
				}
				toast({
					title: "There was an error",
					description: "Server error, contact admin",
					variant: "destructive",
				});
			}
		},
	});

	const onDeleteWork = () => {
		mutate();
	};
	return (
		<div className="w-full">
			<ConfirmModal
				description="You're about to delete this work"
				onConfirm={onDeleteWork}
			>
				<Button
					variant="destructive"
					className="w-full"
					size="icon"
					disabled={isPending}
				>
					{isPending && isPending ? (
						<Loader2 size={16} className="animate-spin" />
					) : (
						<Trash className="w-5 h-5" />
					)}
				</Button>
			</ConfirmModal>
		</div>
	);
};

export default DeleteButton;
