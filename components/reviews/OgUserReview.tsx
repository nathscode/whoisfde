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
	OgUserReviewSchema,
	OgUserReviewSchemaInfer,
} from "@/lib/validators/og-user-reviews";
import { CustomUser } from "@/types";
import { useMutation } from "@tanstack/react-query";
import { ImageIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Accept, useDropzone } from "react-dropzone";
import LoadingButton from "../common/LoadingButton";
import RequestModal from "../modals/RequestModal";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { useToast } from "../ui/use-toast";

type Props = {
	session: CustomUser;
};

const OgUserReview = ({ session }: Props) => {
	const [file, setFile] = useState<File>();
	const isMounted = useMount();
	const router = useRouter();
	const { toast } = useToast();

	const {
		getRootProps: getRootProps,
		getInputProps: getInputProps,
		isDragActive: isDragActive,
		acceptedFiles: acceptedFiles,
	} = useDropzone({
		accept: ["image/*", "video/*"] as unknown as Accept,
		maxSize: 10 * 1024 * 1024, // 10MB
		onDrop: (acceptedFiles) => {
			setFile(acceptedFiles[0]);
		},
	});

	const form = useForm({
		resolver: zodResolver(OgUserReviewSchema),
		defaultValues: {
			content: "",
			location: "",
		},
	});

	const isLoading = form.formState.isSubmitting;

	const { mutate, isPending } = useMutation({
		mutationFn: async (FormData: FormData) => {
			const { data } = await axios.post("/api/rooter/reviews/ogs", FormData);
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

	const onSubmit = async (values: OgUserReviewSchemaInfer) => {
		const formData = new FormData();
		formData.append("location", values.location);
		formData.append("content", values.content);
		formData.append("file", file!);
		mutate(formData);
		form.reset();
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
						name="location"
						disabled={isPending}
						render={({ field }) => (
							<FormItem>
								<FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
									Location
								</FormLabel>
								<FormControl>
									<Input
										type="text"
										disabled={isLoading}
										className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
										placeholder="Event Location"
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<div className="flex flex-col">
						<Label className="mb-4"> File</Label>
						<div
							{...getRootProps()}
							className={`border-2 border-dashed rounded-lg p-4 ${
								isDragActive ? "border-blue-500" : "border-gray-300"
							}`}
						>
							<input {...getInputProps()} />
							{isDragActive ? (
								<p>Drop the files here ...</p>
							) : (
								<div className="flex items-start justify-start">
									<div>
										<ImageIcon className="w-10 h-10" />
									</div>
									<div className="ml-4">
										<p className="text-sm">
											{isDragActive
												? "Drop the files here"
												: "Drag and drop files here or click to select"}
										</p>
										<p className="text-xs text-gray-500 mt-1">
											Accepted file types: PNG, JPEG, JPG. Max file size: 10MB.
										</p>
									</div>
								</div>
							)}
							{acceptedFiles.length > 0 && (
								<Image
									src={URL.createObjectURL(acceptedFiles[0])}
									alt="Preview"
									height={14}
									width={14}
									className="h-14 w-14 object-cover"
								/>
							)}
						</div>
					</div>

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
					{session && session ? (
						<LoadingButton
							type="submit"
							loading={isPending}
							className="mt-6 w-full"
						>
							Submit
						</LoadingButton>
					) : (
						<RequestModal />
					)}
				</form>
			</Form>
		</div>
	);
};

export default OgUserReview;
