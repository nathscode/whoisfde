"use client";

import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect, useState, useRef, useMemo } from "react";
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
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/components/ui/use-toast";
import {
	Loader,
	AlertCircle,
	CheckCircle,
	Upload,
	ImageIcon,
} from "lucide-react";
import { useDropzone } from "react-dropzone";
import { WorkSchema } from "@/lib/validators/work";

const MAX_FILE_SIZE = 500 * 1024 * 1024; // 500MB
const VALID_FILE_TYPES = ["video/mp4", "video/quicktime", "video/x-msvideo"];

type FFmpegLoadingState = "idle" | "loading" | "loaded" | "error";
type ProcessingStatus =
	| "idle"
	| "processing"
	| "uploading"
	| "completed"
	| "error";

interface HLSQuality {
	name: string;
	width: number;
	height: number;
	videoBitrate: string;
	audioBitrate: string;
}

const HLS_QUALITIES: HLSQuality[] = [
	{
		name: "360p",
		width: 640,
		height: 360,
		videoBitrate: "800k",
		audioBitrate: "96k",
	},
	{
		name: "480p",
		width: 854,
		height: 480,
		videoBitrate: "1400k",
		audioBitrate: "128k",
	},
	{
		name: "720p",
		width: 1280,
		height: 720,
		videoBitrate: "2800k",
		audioBitrate: "128k",
	},
	{
		name: "1080p",
		width: 1920,
		height: 1080,
		videoBitrate: "5000k",
		audioBitrate: "192k",
	},
];

export default function HLSVideoUploadModal() {
	const ffmpegRef = useRef<FFmpeg | null>(null);
	const [ffmpegLoadingState, setFFmpegLoadingState] =
		useState<FFmpegLoadingState>("idle");
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [progress, setProgress] = useState(0);
	const [status, setStatus] = useState<ProcessingStatus>("idle");
	const [error, setError] = useState<string | null>(null);
	const [check, setCheck] = useState(false);
	const [selectedQualities, setSelectedQualities] = useState<string[]>([
		"720p",
	]);
	const [processingStage, setProcessingStage] = useState<string>("");
	const [hlsFiles, setHlsFiles] = useState<{ [key: string]: Blob }>({});

	const { toast } = useToast();

	const form = useForm({
		resolver: zodResolver(WorkSchema),
		defaultValues: {
			caption: "",
			workType: "",
			link: "",
		},
	});

	// Initialize FFmpeg
	useEffect(() => {
		if (!isModalOpen || ffmpegLoadingState !== "idle") return;

		const initFFmpeg = async () => {
			try {
				setFFmpegLoadingState("loading");

				if (!ffmpegRef.current) {
					ffmpegRef.current = new FFmpeg();
				}

				const ffmpeg = ffmpegRef.current;

				if (ffmpeg.loaded) {
					setFFmpegLoadingState("loaded");
					return;
				}

				await ffmpeg.load({
					coreURL: await toBlobURL("/ffmpeg/ffmpeg-core.js", "text/javascript"),
					wasmURL: await toBlobURL(
						"/ffmpeg/ffmpeg-core.wasm",
						"application/wasm"
					),
					workerURL: await toBlobURL(
						"/ffmpeg/ffmpeg-core.worker.js",
						"text/javascript"
					),
				});

				ffmpeg.on("progress", ({ progress: prog }) => {
					setProgress(Math.round(prog * 100));
				});

				setFFmpegLoadingState("loaded");
			} catch (error: any) {
				console.error("FFmpeg load error:", error);
				setFFmpegLoadingState("error");
				setError("Failed to load video processor");
				toast({
					title: "Initialization Error",
					description: "Failed to load video processor",
					variant: "destructive",
				});
			}
		};

		initFFmpeg();
	}, [isModalOpen, ffmpegLoadingState, toast]);

	const onDrop = useCallback((acceptedFiles: File[]) => {
		if (!acceptedFiles?.[0]) return;

		const file = acceptedFiles[0];

		if (!VALID_FILE_TYPES.includes(file.type)) {
			setError(`Unsupported file format. Please upload MP4, MOV, or AVI`);
			return;
		}

		if (file.size > MAX_FILE_SIZE) {
			setError(`File too large. Maximum size is 500MB`);
			return;
		}

		setError(null);
		setSelectedFile(file);
	}, []);

	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		onDrop,
		accept: { "video/*": [] },
		maxSize: MAX_FILE_SIZE,
		multiple: false,
	});

	// Generate HLS segments with multiple qualities
	const generateHLS = async () => {
		if (
			!selectedFile ||
			!ffmpegRef.current ||
			ffmpegLoadingState !== "loaded"
		) {
			toast({
				description: "Please wait for the video processor to load",
				variant: "destructive",
			});
			return;
		}

		try {
			setStatus("processing");
			setProgress(0);
			setProcessingStage("Preparing video...");

			const ffmpeg = ffmpegRef.current;
			const inputFileName = `input_${Date.now()}.${selectedFile.name
				.split(".")
				.pop()}`;

			// Write input file
			await ffmpeg.writeFile(inputFileName, await fetchFile(selectedFile));

			const generatedFiles: { [key: string]: Blob } = {};
			const masterPlaylistContent: string[] = ["#EXTM3U", "#EXT-X-VERSION:3"];

			// Process each quality level
			for (let i = 0; i < selectedQualities.length; i++) {
				const qualityName = selectedQualities[i];
				const quality = HLS_QUALITIES.find((q) => q.name === qualityName);
				if (!quality) continue;

				setProcessingStage(
					`Processing ${quality.name}... (${i + 1}/${selectedQualities.length})`
				);

				const outputPrefix = `output_${quality.name}`;
				const playlistName = `${outputPrefix}.m3u8`;

				// FFmpeg command for HLS with specific quality
				await ffmpeg.exec([
					"-i",
					inputFileName,
					"-c:v",
					"libx264",
					"-c:a",
					"aac",
					"-b:v",
					quality.videoBitrate,
					"-b:a",
					quality.audioBitrate,
					"-vf",
					`scale=${quality.width}:${quality.height}`,
					"-preset",
					"fast",
					"-g",
					"48",
					"-sc_threshold",
					"0",
					"-hls_time",
					"4",
					"-hls_playlist_type",
					"vod",
					"-hls_segment_filename",
					`${outputPrefix}_%03d.ts`,
					"-f",
					"hls",
					playlistName,
				]);

				// Read generated playlist
				const playlistData = await ffmpeg.readFile(playlistName);
				const playlistBlob = new Blob([playlistData], {
					type: "application/vnd.apple.mpegurl",
				});
				generatedFiles[playlistName] = playlistBlob;

				// Read all segment files
				const playlistText = new TextDecoder().decode(
					playlistData as Uint8Array
				);
				const segmentMatches = playlistText.matchAll(/output_.*?\.ts/g);

				for (const match of segmentMatches) {
					const segmentName = match[0];
					try {
						const segmentData = await ffmpeg.readFile(segmentName);
						const segmentBlob = new Blob([segmentData], { type: "video/MP2T" });
						generatedFiles[segmentName] = segmentBlob;
					} catch (err) {
						console.warn(`Segment ${segmentName} not found`);
					}
				}

				// Add to master playlist
				masterPlaylistContent.push(
					`#EXT-X-STREAM-INF:BANDWIDTH=${
						parseInt(quality.videoBitrate) * 1000
					},RESOLUTION=${quality.width}x${quality.height}`,
					playlistName
				);

				// Update progress
				setProgress(Math.round(((i + 1) / selectedQualities.length) * 100));
			}

			// Create master playlist
			const masterPlaylist = masterPlaylistContent.join("\n");
			const masterBlob = new Blob([masterPlaylist], {
				type: "application/vnd.apple.mpegurl",
			});
			generatedFiles["master.m3u8"] = masterBlob;

			setHlsFiles(generatedFiles);
			setStatus("completed");
			setProcessingStage("Processing complete!");

			// Cleanup
			await ffmpeg.deleteFile(inputFileName);

			toast({
				title: "Success",
				description: `Generated HLS playlist with ${selectedQualities.length} quality levels`,
			});
		} catch (error: any) {
			console.error("HLS generation error:", error);
			setStatus("error");
			setError(`Failed to generate HLS: ${error.message}`);
			toast({
				title: "Processing Failed",
				description: error.message,
				variant: "destructive",
			});
		}
	};

	// Upload HLS files to server
	const uploadHLSFiles = async (formValues: any) => {
		if (Object.keys(hlsFiles).length === 0) {
			toast({
				description: "No HLS files to upload",
				variant: "destructive",
			});
			return;
		}

		try {
			setStatus("uploading");
			setProcessingStage("Uploading HLS files...");

			const formData = new FormData();
			formData.append("caption", formValues.caption);
			formData.append("workType", formValues.workType);
			formData.append("links", formValues.link || "");
			formData.append("qualities", JSON.stringify(selectedQualities));

			// Add all HLS files
			Object.entries(hlsFiles).forEach(([filename, blob]) => {
				formData.append("hlsFiles", blob, filename);
			});

			const response = await fetch("/api/rooter/work/upload-hls", {
				method: "POST",
				body: formData,
			});

			if (!response.ok) {
				throw new Error("Upload failed");
			}

			const result = await response.json();

			setStatus("completed");
			setProcessingStage("Upload complete!");

			toast({
				title: "Success",
				description: "Video uploaded successfully",
			});

			// Reset form
			setTimeout(() => {
				handleModalChange(false);
				form.reset();
			}, 1500);
		} catch (error: any) {
			console.error("Upload error:", error);
			setStatus("error");
			setError(`Upload failed: ${error.message}`);
			toast({
				title: "Upload Failed",
				description: error.message,
				variant: "destructive",
			});
		}
	};

	const onSubmit = async (values: any) => {
		if (check && Object.keys(hlsFiles).length > 0) {
			await uploadHLSFiles(values);
		} else if (!check && values.link) {
			// Handle link-only submission
			// Your existing createWork logic here
		} else {
			toast({
				title: "Missing Data",
				description: "Provide a link or upload a video",
				variant: "destructive",
			});
		}
	};

	const handleModalChange = (open: boolean) => {
		setIsModalOpen(open);
		if (!open) {
			setStatus("idle");
			setProgress(0);
			setError(null);
			setSelectedFile(null);
			setHlsFiles({});
			setProcessingStage("");
		}
	};

	const bytesToSize = (bytes: number) => {
		const sizes = ["Bytes", "KB", "MB", "GB"];
		if (bytes === 0) return "0 Bytes";
		const i = Math.floor(Math.log(bytes) / Math.log(1024));
		return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + " " + sizes[i];
	};

	return (
		<Dialog open={isModalOpen} onOpenChange={handleModalChange}>
			<DialogTrigger asChild>
				<Button variant="default" size="lg">
					Add Work
				</Button>
			</DialogTrigger>
			<DialogContent className="bg-white text-black p-0 overflow-hidden max-w-2xl max-h-[90vh] overflow-y-auto">
				<DialogHeader className="pt-8 px-6">
					<DialogTitle className="text-2xl text-center font-bold">
						Add Work with HLS Streaming
					</DialogTitle>
				</DialogHeader>

				{check && ffmpegLoadingState === "loading" && (
					<div className="px-6">
						<Alert>
							<Loader className="h-4 w-4 animate-spin" />
							<AlertDescription>
								Loading video processor... This may take a moment.
							</AlertDescription>
						</Alert>
					</div>
				)}

				{check && ffmpegLoadingState === "error" && (
					<div className="px-6">
						<Alert variant="destructive">
							<AlertCircle className="h-4 w-4" />
							<AlertDescription>
								Failed to load video processor
								<Button
									variant="outline"
									size="sm"
									className="ml-2"
									onClick={() => setFFmpegLoadingState("idle")}
								>
									Retry
								</Button>
							</AlertDescription>
						</Alert>
					</div>
				)}

				<div className="flex items-start flex-col w-full justify-start p-6">
					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(onSubmit)}
							className="space-y-4 w-full"
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
											>
												<SelectTrigger className="w-full">
													<SelectValue placeholder="Category" />
												</SelectTrigger>
												<SelectContent>
													<ScrollArea className="h-[150px] w-full">
														{[
															"Brands",
															"Events",
															"Personal",
															"Estate",
															"Stills",
															"Weddings",
														].map((event) => (
															<SelectItem key={event} value={event}>
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
										<FormLabel>Caption</FormLabel>
										<FormControl>
											<Input
												type="text"
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
											<FormLabel>Link</FormLabel>
											<FormControl>
												<Input
													type="text"
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
									onCheckedChange={() => setCheck(!check)}
								/>
								<Label htmlFor="addFile">
									{check ? "Add Link" : "Add File"}
								</Label>
							</div>

							{check && (
								<>
									<div>
										<Label className="mb-2 block">
											Quality Levels (Select multiple)
										</Label>
										<div className="grid grid-cols-2 gap-2">
											{HLS_QUALITIES.map((quality) => (
												<div
													key={quality.name}
													className="flex items-center space-x-2"
												>
													<input
														type="checkbox"
														id={quality.name}
														checked={selectedQualities.includes(quality.name)}
														onChange={(e) => {
															if (e.target.checked) {
																setSelectedQualities([
																	...selectedQualities,
																	quality.name,
																]);
															} else {
																setSelectedQualities(
																	selectedQualities.filter(
																		(q) => q !== quality.name
																	)
																);
															}
														}}
														className="w-4 h-4"
													/>
													<Label
														htmlFor={quality.name}
														className="text-sm font-normal"
													>
														{quality.name} ({quality.videoBitrate})
													</Label>
												</div>
											))}
										</div>
									</div>

									<div className="flex flex-col">
										<Label className="mb-4">File</Label>
										<div
											{...getRootProps()}
											className={`border-2 border-dashed rounded-lg p-4 transition-colors ${
												isDragActive
													? "border-blue-500 bg-blue-50"
													: "border-gray-300"
											}`}
										>
											<input {...getInputProps()} />
											<div className="flex items-start justify-start">
												<ImageIcon className="w-10 h-10" />
												<div className="ml-4">
													<p className="text-sm">
														{isDragActive
															? "Drop the file here"
															: "Drag and drop or click to select"}
													</p>
													<p className="text-xs text-gray-500 mt-1">
														MP4, MOV, AVI up to 500MB
													</p>
												</div>
											</div>
											{selectedFile && (
												<div className="mt-4 p-2 bg-gray-50 rounded">
													<div className="flex justify-between">
														<p className="font-medium">File:</p>
														<p className="text-sm truncate w-[200px]">
															{selectedFile.name}
														</p>
													</div>
													<div className="flex justify-between">
														<p className="font-medium">Size:</p>
														<p className="text-sm">
															{bytesToSize(selectedFile.size)}
														</p>
													</div>
												</div>
											)}
										</div>
									</div>

									{status === "processing" && (
										<div className="space-y-2">
											<div className="flex justify-between text-sm">
												<span>{processingStage}</span>
												<span>{progress}%</span>
											</div>
											<div className="w-full bg-gray-200 rounded-full h-2">
												<div
													className="bg-blue-600 h-2 rounded-full transition-all duration-300"
													style={{ width: `${progress}%` }}
												/>
											</div>
										</div>
									)}

									{status === "completed" &&
										Object.keys(hlsFiles).length > 0 && (
											<Alert>
												<CheckCircle className="h-4 w-4 text-green-600" />
												<AlertDescription className="text-green-600">
													HLS processing complete! Generated{" "}
													{Object.keys(hlsFiles).length} files
												</AlertDescription>
											</Alert>
										)}

									{status === "uploading" && (
										<Alert>
											<Loader className="h-4 w-4 animate-spin" />
											<AlertDescription>{processingStage}</AlertDescription>
										</Alert>
									)}
								</>
							)}

							{error && (
								<Alert variant="destructive">
									<AlertCircle className="h-4 w-4" />
									<AlertDescription>{error}</AlertDescription>
								</Alert>
							)}

							{!check && (
								<Button type="submit" className="w-full">
									Submit
								</Button>
							)}

							{check && (
								<>
									{status === "idle" && selectedFile && (
										<Button
											onClick={generateHLS}
											type="button"
											disabled={
												ffmpegLoadingState !== "loaded" ||
												selectedQualities.length === 0
											}
											className="w-full"
										>
											{ffmpegLoadingState === "loading" ? (
												<>
													<Loader className="animate-spin w-4 h-4 mr-2" />
													Loading Processor...
												</>
											) : (
												"Generate HLS Stream"
											)}
										</Button>
									)}

									{status === "completed" && (
										<Button type="submit" className="w-full">
											Upload HLS Video
										</Button>
									)}
								</>
							)}
						</form>
					</Form>
				</div>
			</DialogContent>
		</Dialog>
	);
}
