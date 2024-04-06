"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
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
import { apiClient } from "@/lib/constants";
import { RequestSchema, RequestSchemaInfer } from "@/lib/validators/request";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import LoadingButton from "../common/LoadingButton";
import { Textarea } from "../ui/textarea";
import { useToast } from "../ui/use-toast";
import LoginModal from "./LoginModal";

type Props = {};

const RequestModal = (props: Props) => {
	const isMounted = useMount();
	const router = useRouter();
	const { toast } = useToast();

	const form = useForm({
		resolver: zodResolver(RequestSchema),
		defaultValues: {
			name: "",
			email: "",
			phone: "",
			question: "",
		},
	});

	const isLoading = form.formState.isSubmitting;

	const { mutate, isPending } = useMutation({
		mutationFn: async ({
			name,
			phone,
			email,
			question,
		}: RequestSchemaInfer) => {
			const payload: RequestSchemaInfer = {
				name,
				phone,
				email,
				question,
			};
			const { data } = await apiClient.post("/request", payload);
			return data;
		},
		onSuccess: (data) => {
			window.location.reload();
			form.reset();
			return toast({
				description: "Your Request submitted successfully, awaiting approval",
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

	const onSubmit = async (values: RequestSchemaInfer) => {
		mutate(values);
	};
	if (!isMounted) {
		return null;
	}

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button variant="ghost" size="lg" disabled={false}>
					Join Us
				</Button>
			</DialogTrigger>
			<DialogContent className="bg-white text-black p-0 overflow-hidden">
				<DialogHeader className="pt-8 px-6">
					<DialogTitle className="text-2xl text-center font-bold">
						Join OG&apos;s
					</DialogTitle>
					<DialogDescription className="text-center text-zinc-500">
						If you already have OG&apos;s Login details, click this button to
						login <LoginModal />
					</DialogDescription>
				</DialogHeader>
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
								name="phone"
								disabled={isPending}
								render={({ field }) => (
									<FormItem>
										<FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
											Mobile Number
										</FormLabel>
										<FormControl>
											<Input
												type="text"
												disabled={isLoading}
												className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
												placeholder="Enter Your Mobile Number"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="email"
								disabled={isPending}
								render={({ field }) => (
									<FormItem>
										<FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
											Email
										</FormLabel>
										<FormControl>
											<Input
												type="email"
												disabled={isLoading}
												className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
												placeholder="Enter Email address"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="question"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Who is Fde</FormLabel>
										<FormControl>
											<Textarea
												disabled={isPending}
												className="bg-gray-100 rounded-none"
												placeholder="Who is Fde"
												id="question"
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
			</DialogContent>
		</Dialog>
	);
};

export default RequestModal;
