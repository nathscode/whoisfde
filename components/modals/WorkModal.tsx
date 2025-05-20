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
const VALID_FILE_TYPES = ["video/mp4", "video/quicktime", "video/x-msvideo"];

const WorkModal = (props: Props) => {
	const [ffmpeg] = useState(() => new FFmpeg());
	const [isFFmpegLoaded, setIsFFmpegLoaded] = useState(false);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [fileUrl, setFileUrl] = useState<File>();
	const [videoFile, setVideoFile] = useState<FileActions>();
	const [progress, setProgress] = useState<number>(0);
	const [check, setCheck] = useState<boolean>(false);
	const [isWorkLoading, startTransition] = useTransition();
	const router = useRouter();
	const [quality, setQuality] = useState<"low" | "medium" | "high">("medium");
	const [resolution, setResolution] = useState<
		"480p" | "720p" | "1080p" | "original"
	>("720p");

	// Time tracking
	const [time, setTime] = useState<{
		startTime?: Date;
		elapsedSeconds?: number;
	}>({ elapsedSeconds: 0 });

	// Status tracking
	const [status, setStatus] = useState<
		"notStarted" | "converted" | "condensing" | "uploading" | "completed"
	>("notStarted");

	// Error handling
	const [error, setError] = useState<{
		message: string;
		details?: string;
		isFatal?: boolean;
	} | null>(null);

	// Metrics
	const [metrics, setMetrics] = useState<{
		inputSize: number;
		outputSize?: number;
		compressionRatio?: number;
		processingTime?: number;
	}>({ inputSize: 0 });
	const [abortController, setAbortController] = useState<AbortController>();

	const { toast } = useToast();
	const isMounted = useMount();

	useEffect(() => {
		const loadFFmpeg = async () => {
			try {
				await ffmpeg.load({
					coreURL: "/ffmpeg/ffmpeg-core.js",
					wasmURL: "/ffmpeg/ffmpeg-core.wasm",
					workerURL: "/ffmpeg/ffmpeg-core.worker.js",
				});

				ffmpeg.on("progress", ({ progress }) => {
					setProgress(progress * 100);
				});

				ffmpeg.on("log", ({ message }) => {});

				setIsFFmpegLoaded(true);
			} catch (error: any) {
				console.error("FFmpeg load error:", error);
				setError({
					message: "Failed to load FFmpeg",
					details: error.message,
					isFatal: true,
				});
				toast({
					title: "Initialization Error",
					description:
						"Failed to load video processor. Please refresh the page.",
					variant: "destructive",
					duration: 10000,
				});
			}
		};

		loadFFmpeg();

		return () => {
			if (videoFile?.url) {
				URL.revokeObjectURL(videoFile.url);
			}
			if (fileUrl) {
				URL.revokeObjectURL(URL.createObjectURL(fileUrl));
			}
		};
	}, []);

	useEffect(() => {
		let timer: NodeJS.Timeout;

		if (time?.startTime && status === "condensing") {
			timer = setInterval(() => {
				const now = new Date();
				const elapsedMs = now.getTime() - time.startTime!.getTime();
				setTime((prev) => ({
					...prev,
					elapsedSeconds: Math.floor(elapsedMs / 1000),
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
		if (!acceptedFiles?.[0]) return;

		const file = acceptedFiles[0];

		if (!VALID_FILE_TYPES.includes(file.type)) {
			setError({
				message: "Unsupported file format",
				details: `Please upload one of: ${VALID_FILE_TYPES.join(", ")}`,
			});
			return;
		}

		if (file.size > MAX_FILE_SIZE) {
			setError({
				message: "File too large",
				details: `Maximum size is ${bytesToSize(MAX_FILE_SIZE)}`,
			});
			return;
		}

		setError(null);
		setFileUrl(file);
		setVideoFile({
			fileName: file.name,
			fileSize: file.size,
			fileType: file.type,
			file: file,
			isError: false,
		});
	}, []);

	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		onDrop,
		accept: { "video/*": [] },
		maxSize: MAX_FILE_SIZE,
	});

	const getQualitySettings = () => {
		switch (quality) {
			case "low":
				return { crf: 26, preset: "ultrafast", audioBitrate: "96k" };
			case "medium":
				return { crf: 22, preset: "fast", audioBitrate: "128k" };
			case "high":
				return { crf: 18, preset: "medium", audioBitrate: "192k" };
			default:
				return { crf: 22, preset: "fast", audioBitrate: "128k" };
		}
	};

	const getResolutionScale = () => {
		switch (resolution) {
			case "480p":
				return "scale='min(854,iw)':-2";
			case "720p":
				return "scale='min(1280,iw)':-2";
			case "1080p":
				return "scale='min(1920,iw)':-2";
			case "original":
				return "";
			default:
				return "scale='min(1280,iw)':-2";
		}
	};

	const condense = async () => {
		if (!videoFile?.file || !isFFmpegLoaded) {
			toast({
				description: "FFmpeg is still loading. Please wait...",
				variant: "destructive",
			});
			return;
		}

		try {
			setStatus("condensing");
			setTime({ startTime: new Date(), elapsedSeconds: 0 });

			const inputFileName =
				"input" +
				videoFile.file.name.substring(videoFile.file.name.lastIndexOf("."));
			const outputFileName = "output.mp4";

			const controller = new AbortController();
			setAbortController(controller);

			await ffmpeg.writeFile(inputFileName, await fetchFile(videoFile.file));

			const { crf, preset, audioBitrate } = getQualitySettings();
			const scaleFilter = getResolutionScale();

			const ffmpegCommands = [
				"-i",
				inputFileName,
				"-c:v",
				"libx264",
				"-preset",
				preset,
				"-crf",
				crf.toString(),
				"-c:a",
				"aac",
				"-b:a",
				audioBitrate,
				"-movflags",
				"+faststart",
				"-threads",
				"0",
			];

			if (scaleFilter) {
				ffmpegCommands.push("-vf", scaleFilter);
			}

			ffmpegCommands.push(outputFileName);

			try {
				await ffmpeg.exec(ffmpegCommands);
			} catch (error: any) {
				if (controller.signal.aborted) {
					console.log("Processing was manually aborted");
					return;
				}
			}

			const data = await ffmpeg.readFile(outputFileName);
			const blob = new Blob([data], { type: "video/mp4" });
			const url = URL.createObjectURL(blob);
			// @ts-expect-error
			const outputSize = data.byteLength;
			setMetrics({
				inputSize: videoFile.fileSize,
				outputSize,
				compressionRatio: (1 - outputSize / videoFile.fileSize) * 100,
				processingTime: time.elapsedSeconds,
			});

			setVideoFile((prev) => ({
				...prev!,
				url,
				outputBlob: blob,
				output: outputFileName,
			}));

			setStatus("converted");
			setTime((prev) => ({ ...prev, startTime: undefined }));
			setProgress(0);
		} catch (error: any) {
			if (error.name === "AbortError") {
				console.log("Processing was aborted");
				return;
			}

			console.error("Conversion error:", error);
			setStatus("notStarted");
			setProgress(0);
			setTime({ elapsedSeconds: 0, startTime: undefined });
			toast({
				description: `Error converting video. ${error.message}`,
				variant: "destructive",
			});
		} finally {
			try {
				await ffmpeg.deleteFile("input.mp4");
				await ffmpeg.deleteFile("output.mp4");
			} catch (cleanupError) {
				console.warn("Failed to clean up temporary files:", cleanupError);
			}
		}
	};

	const cancelProcessing = () => {
		if (abortController) {
			abortController.abort();
			setStatus("notStarted");
			setProgress(0);
			toast({
				description: "Processing cancelled",
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
				onError: (error) => {
					toast({
						title: "Upload Failed",
						description: error.message,
						variant: "destructive",
					});
					setStatus("converted");
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
