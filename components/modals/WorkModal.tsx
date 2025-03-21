"use client";

import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";

import { createWork } from "@/actions/createWork";
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
import { useCreateVideo } from "@/features/video/video-create";
import useMount from "@/hooks/use-mount";
import { WorkSchema, WorkSchemaInfer } from "@/lib/validators/work";
import { FileActions } from "@/types";
import { ImageIcon, Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { useDropzone } from "react-dropzone";
import { VideoCondenseProgress } from "../VideoCompressProgress";
import { VideoOutputDetails } from "../VideoOutputDetail";
import LoadingButton from "../common/LoadingButton";
import { Label } from "../ui/label";
import { ScrollArea } from "../ui/scroll-area";
import { useToast } from "../ui/use-toast";
import { bytesToSize } from "../util/bytesToSize";

type Props = {};

const MAX_FILE_SIZE = 500 * 1024 * 1024; // 500MB

const WorkModal = (props: Props) => {
	const [ffmpeg] = useState(() => new FFmpeg());
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [fileUrl, setFileUrl] = useState<File>();
	const [videoFile, setVideoFile] = useState<FileActions>();
	const [progress, setProgress] = useState<number>(0);
	const [isWorkLoading, startTransition] = useTransition();
	const router = useRouter();

	const [time, setTime] = useState<{
		startTime?: Date;
		elapsedSeconds?: number;
	}>({ elapsedSeconds: 0 });

	const [status, setStatus] = useState<
		"notStarted" | "converted" | "condensing" | "uploading" | "completed"
	>("notStarted");
	const [check, setCheck] = useState<boolean>(false);
	const [error, setError] = useState<string | null>();

	const { toast } = useToast();
	const isMounted = useMount();

	useEffect(() => {
		const loadFFmpeg = async () => {
			try {
				await ffmpeg.load({
					coreURL: await toBlobURL(
						"https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd/ffmpeg-core.js",
						"text/javascript"
					),
					wasmURL: await toBlobURL(
						"https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd/ffmpeg-core.wasm",
						"application/wasm"
					),
				});

				ffmpeg.on("progress", ({ progress }) => {
					setProgress(progress * 100);
				});
			} catch (error: any) {
				console.error("FFmpeg load error:", error);
				setError(`Failed to load FFmpeg: ${error.message}`);
			}
		};

		loadFFmpeg();
	}, []);

	useEffect(() => {
		let timer: NodeJS.Timeout;

		if (time?.startTime && status === "condensing") {
			timer = setInterval(() => {
				const now = new Date();
				const elapsedMs = now.getTime() - time.startTime!.getTime();
				setTime((prev) => ({
					...prev,
					elapsedSeconds: Math.floor(elapsedMs / 1000), // Convert ms to seconds
				}));
			}, 1000);
		}

		return () => {
			if (timer) clearInterval(timer);
		};
	}, [time?.startTime, status]);

	const form = useForm({
		resolver: zodResolver(WorkSchema),
		defaultValues: {
			caption: "",
			workType: "",
			link: "",
		},
	});

	const onDrop = useCallback((acceptedFiles: File[]) => {
		if (acceptedFiles?.[0]) {
			setFileUrl(acceptedFiles[0]);
			setVideoFile({
				fileName: acceptedFiles[0].name,
				fileSize: acceptedFiles[0].size,
				fileType: acceptedFiles[0].type,
				file: acceptedFiles[0],
				isError: false,
			});
		}
	}, []);

	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		onDrop,
		accept: { "video/*": [] },
		maxSize: MAX_FILE_SIZE,
	});

	// Optimized video compression
	const condense = async () => {
		if (!videoFile?.file) return;

		try {
			setStatus("condensing");
			setTime({ startTime: new Date(), elapsedSeconds: 0 });

			const inputFileName =
				"input" +
				videoFile.file.name.substring(videoFile.file.name.lastIndexOf("."));
			const outputFileName = "output.mp4";
			await ffmpeg.writeFile(inputFileName, await fetchFile(videoFile.file));

			const ffmpegCommands = [
				"-i",
				inputFileName,
				// Video encoding settings
				"-c:v",
				"libx264", // or "libx265" for better compression
				"-preset",
				"ultrafast", // Change to ultrafast for speed
				"-crf",
				"18", // Adjusted for a balance of quality and speed
				"-tune",
				"film",
				"-profile:v",
				"high",
				"-level",
				"5.2",

				// Resolution and bitrate settings
				"-vf",
				"scale=-2:2160",
				// "scale=-2:720",
				"-maxrate",
				"20M",
				"-bufsize",
				"40M",

				// Frame rate and GOP settings
				"-g",
				"48",
				"-keyint_min",
				"48",
				"-sc_threshold",
				"0",

				// Audio settings
				"-c:a",
				"aac",
				"-b:a",
				"192k",
				"-ar",
				"48000",

				// Output optimization
				"-movflags",
				"+faststart",
				"-threads",
				"0",

				// Additional quality settings
				"-x264opts",
				"rc-lookahead=48:ref=4",
				"-pix_fmt",
				"yuv420p",
				outputFileName,
			];

			await ffmpeg.exec(ffmpegCommands);

			// Read the processed file
			const data = await ffmpeg.readFile(outputFileName);
			const blob = new Blob([data], { type: "video/mp4" });
			const url = URL.createObjectURL(blob);

			setVideoFile((prev) => ({
				...prev!,
				url,
				outputBlob: blob,
				output: outputFileName,
			}));

			setStatus("converted");
			setTime((prev) => ({ ...prev, startTime: undefined }));
			setProgress(0);
		} catch (error) {
			console.error("Conversion error:", error);
			setStatus("notStarted");
			setProgress(0);
			setTime({ elapsedSeconds: 0, startTime: undefined });
			toast({
				description: `Error converting video. ${error}`,
				variant: "destructive",
			});
		}
	};

	const isLoading = form.formState.isSubmitting;
	const { isPending, isSuccess, isError, mutate } = useCreateVideo();
	const handleSwitchChange = () => setCheck((prev) => !prev);

	const onSubmit = async (values: WorkSchemaInfer) => {
		const hasLink = (values.link?.trim() || "").length > 0;
		const hasFile = !!videoFile?.outputBlob;
		if (!hasLink && !hasFile) {
			toast({
				title: "Missing Data",
				description: "Provide a link or upload a video.",
				variant: "destructive",
			});
			return;
		}

		if (videoFile?.outputBlob) {
			const formData = new FormData();
			formData.append("caption", values.caption);
			formData.append("workType", values.workType);
			formData.append("links", values.link!);
			formData.append("files", videoFile.outputBlob);

			setStatus("uploading");
			mutate(formData, {
				onSuccess: () => {
					setIsModalOpen(false);
					form.reset();
					router.refresh();
					toast({ title: "Upload Successful", description: "Work uploaded." });
					setStatus("completed");
				},
			});
		} else {
			startTransition(async () => {
				const res = await createWork({
					workType: values.workType,
					caption: values.caption,
					links: values.link,
					fileUrl: "",
				});
				toast({ title: res.message });
				router.refresh();
			});
			setStatus("completed");
		}
	};
	if (!isMounted) return null;

	return (
		<Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
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
												disabled={isPending}
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
														<p>{bytesToSize(fileUrl.size)}</p>
													</div>
												</div>
											)}
										</div>
									</div>
									{status === "condensing" && (
										<VideoCondenseProgress
											progress={progress}
											seconds={time.elapsedSeconds!}
										/>
									)}
								</>
							)}
							{!check && (
								<LoadingButton
									type="submit"
									loading={isWorkLoading || isLoading}
									className="mt-6 w-full"
								>
									Submit
								</LoadingButton>
							)}

							{/* If switch is ON (Add File) */}
							{check && (
								<>
									{/* If condensing not started */}
									{status === "notStarted" && (
										<button
											onClick={condense}
											type="button"
											className="bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-zinc-700 via-zinc-950 to-zinc-950 rounded-lg text-white/90 relative px-3.5 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition ease-in-out duration-500 focus:ring-zinc-950 flex-shrink-0"
										>
											Condense
										</button>
									)}

									{/* After condensing */}
									{status === "converted" && videoFile && (
										<VideoOutputDetails
											timeTaken={time.elapsedSeconds}
											videoFile={videoFile!}
										/>
									)}
									{!isSuccess && (
										<>
											{isPending && (
												<div className="flex gap-2 items-center">
													Uploading video...
													<Loader className="animate-spin w-4 h-4" />
												</div>
											)}
											<LoadingButton
												type="submit"
												loading={isPending}
												className="mt-6 w-full"
											>
												Submit
											</LoadingButton>
										</>
									)}
									{isSuccess && (
										<p className="text-green-500">
											Video Uploaded Successfully!
										</p>
									)}
									{isError && <p className="text-red-500">Failed to upload.</p>}
								</>
							)}
						</form>
					</Form>
				</div>
			</DialogContent>
		</Dialog>
	);
};

export default WorkModal;
