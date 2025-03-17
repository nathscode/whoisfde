"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { useForm } from "react-hook-form";

import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import useMount from "@/hooks/use-mount";
import {
	UserReviewSchema,
	UserReviewSchemaInfer,
} from "@/lib/validators/user-reviews";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import LoadingButton from "../common/LoadingButton";
import { Textarea } from "../ui/textarea";
import { useToast } from "../ui/use-toast";
type Props = {};

const NormalUserReview = (props: Props) => {
	const isMounted = useMount();
	const router = useRouter();
	const { toast } = useToast();

	const form = useForm({
		resolver: zodResolver(UserReviewSchema),
		defaultValues: {
			name: "",
			content: "",
		},
	});

	const isLoading = form.formState.isSubmitting;

	const { mutate, isPending } = useMutation({
		mutationFn: async ({ name, content }: UserReviewSchemaInfer) => {
			const payload: UserReviewSchemaInfer = {
				name,
				content,
			};
			const { data } = await axios.post("/api/rooter/reviews/normal", payload);
			return data;
		},
		onSuccess: (data) => {
			window.location.reload();
			form.reset();
			return toast({
				description: "Your Review submitted successfully",
			});
		},
		onError: (err: any) => {
			if (err instanceof AxiosError) {
				if (err.response?.data?.status === 409) {
					return toast({
						title: "An error occurred.",
						description: `${err.response?.data?.errors?.message}`,
						variant: "destructive",
					});
				}

				if (err.response?.status === 422) {
					return toast({
						title: "Invalid credentials.",
						description: `${err.response.data?.errors?.message}`,
						variant: "destructive",
					});
				}
				toast({
					title: "There was an error",
					description:
						"Could not create request, check your network connections",
					variant: "destructive",
				});
			}
		},
	});

	const onSubmit = async (values: UserReviewSchemaInfer) => {
		mutate(values);
	};
	if (!isMounted) {
		return null;
	}

	return (
		<div className="flex items-start flex-col  w-full justify-start p-5">
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="space-y-4  w-full"
				>
					<FormField
						control={form.control}
						name="name"
						disabled={isPending}
						render={({ field }) => (
							<FormItem>
								<FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
									Full name
								</FormLabel>
								<FormControl>
									<Input
										type="text"
										disabled={isLoading}
										className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
										placeholder="Enter Your Full name"
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="content"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Content</FormLabel>
								<FormControl>
									<Textarea
										disabled={isPending}
										className="bg-gray-100 rounded-none"
										placeholder="Give your review"
										id="content"
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<LoadingButton
						type="submit"
						loading={isPending}
						className="mt-6 w-full"
					>
						Submit
					</LoadingButton>
				</form>
			</Form>
		</div>
	);
};

export default NormalUserReview;
