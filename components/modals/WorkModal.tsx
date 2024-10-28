"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import useMount from "@/hooks/use-mount";
import { WorkSchema, WorkSchemaInfer } from "@/lib/validators/work";
import { useMutation } from "@tanstack/react-query";
import { ImageIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { Accept, useDropzone } from "react-dropzone";
import LoadingButton from "../common/LoadingButton";
import { Label } from "../ui/label";
import { ScrollArea } from "../ui/scroll-area";
import { useToast } from "../ui/use-toast";
import { bytesToSize } from "../util/bytesToSize";

type Props = {};

const WorkModal = (props: Props) => {
	const [fileUrl, setFileUrl] = useState<File>();
	const [check, setCheck] = useState<boolean>(false);
	const [progress, setProgress] = useState<number>(0);

	const isMounted = useMount();
	const router = useRouter();
	const { toast } = useToast();

	const {
		getRootProps: getRootProps,
		getInputProps: getInputProps,
		isDragActive: isDragActive,
		acceptedFiles: acceptedFiles,
	} = useDropzone({
		accept: ["video/*"] as unknown as Accept,
		maxSize: 500 * 1024 * 1024,
		onDrop: (acceptedFiles) => {
			setFileUrl(acceptedFiles[0]);
		},
	});

	const form = useForm({
		resolver: zodResolver(WorkSchema),
		defaultValues: {
			caption: "",
			workType: "",
			link: "",
		},
	});

	const isLoading = form.formState.isSubmitting;

	const { mutate, isPending } = useMutation({
		mutationFn: async (FormData: FormData) => {
			const { data } = await axios.post("/api/work/upload-chuck", FormData, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
				onUploadProgress: (progressEvent) => {
					const percentCompleted = Math.round(
						(progressEvent.loaded * 100) / progressEvent.total!
					);
					setProgress(percentCompleted);
				},
			});
			return data;
		},
		onSuccess: (data) => {
			form.reset();
			setProgress(0);
			window.location.reload();
			return toast({
				description: "Work created successfully",
			});
		},
		onError: (err: any) => {
			setProgress(0);
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

	const handleSwitchChange = () => {
		setCheck(!check);
	};

	const onSubmit = async (values: WorkSchemaInfer) => {
		const formData = new FormData();
		formData.append("caption", values.caption);
		formData.append("links", values.link || "");
		formData.append("workType", values.workType);
		formData.append("files", fileUrl!);
		mutate(formData);
		form.reset();
		setFileUrl(undefined);
	};

	if (!isMounted) {
		return null;
	}
	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button variant="default" size="lg" disabled={false}>
					Add Work
				</Button>
			</DialogTrigger>
			<DialogContent className="bg-white text-black p-0 overflow-hidden">
				<DialogHeader className="pt-8 px-6">
					<DialogTitle className="text-2xl text-center font-bold">
						Add Work
					</DialogTitle>
				</DialogHeader>
				<div className="flex items-start flex-col  w-full justify-start p-5">
					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(onSubmit)}
							className="space-y-4  w-full"
						>
							<FormField
								control={form.control}
								name="workType"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Event Type</FormLabel>
										<FormControl>
											<Select
												onValueChange={field.onChange}
												defaultValue={field.value}
												disabled={isPending}
											>
												<SelectTrigger className="w-full">
													<SelectValue placeholder="Category" />
												</SelectTrigger>
												<SelectContent>
													<ScrollArea className="h-[150px] w-full">
														{[
															"Concert",
															"Contents",
															"Parties",
															"Photography",
															"Weddings",
														].map((event, index) => (
															<SelectItem
																className="capitalize"
																key={index}
																value={event}
															>
																{event}
															</SelectItem>
														))}
													</ScrollArea>
												</SelectContent>
											</Select>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="caption"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
											Caption
										</FormLabel>
										<FormControl>
											<Input
												type="text"
												disabled={isLoading}
												className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
												placeholder="Enter caption"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							{!check && (
								<FormField
									control={form.control}
									name="link"
									render={({ field }) => (
										<FormItem>
											<FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
												Link
											</FormLabel>
											<FormControl>
												<Input
													type="text"
													disabled={isLoading}
													className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
													placeholder="Youtube link if available"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							)}
							<div className="flex items-center space-x-2">
								<Switch
									id="addFile"
									checked={check}
									onCheckedChange={handleSwitchChange}
								/>
								<Label htmlFor="addFile">
									{check ? "Add Link" : "Add File"}
								</Label>
							</div>
							{check && (
								<>
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
															Accepted file types: AVI, MOV, MP4. Max file size:
															500MB.
														</p>
													</div>
												</div>
											)}
											{fileUrl && (
												<div className="flex flex-col w-full mt-4">
													<div className="flex justify-between items-center">
														<p>File name</p>
														<p className="truncate w-[200px]">
															{fileUrl?.name.toString()}
														</p>
													</div>
													<div className="flex justify-between items-center">
														<p>File size</p>
														<p>{bytesToSize(acceptedFiles[0].size)}</p>
													</div>
												</div>
											)}
										</div>
									</div>
									<div className="flex flex-col">
										{progress > 0 && (
											<div className="w-full bg-gray-200 rounded-full mt-2">
												<div
													className="bg-blue-600 text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-full"
													style={{ width: `${progress}%` }}
												>
													{progress}%
												</div>
											</div>
										)}
									</div>
								</>
							)}
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

export default WorkModal;
