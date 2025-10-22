import { useState, useCallback, useRef } from "react";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";

interface HLSQuality {
	name: string;
	width: number;
	height: number;
	videoBitrate: string;
	audioBitrate: string;
}

interface UploadState {
	status: "idle" | "processing" | "uploading" | "completed" | "error";
	progress: number;
	stage: string;
	error: string | null;
	hlsFiles: { [key: string]: Blob };
}

interface UseHLSUploadOptions {
	qualities?: HLSQuality[];
	segmentDuration?: number;
	onProgress?: (progress: number) => void;
	onStageChange?: (stage: string) => void;
	onComplete?: (files: { [key: string]: Blob }) => void;
	onError?: (error: Error) => void;
}

export function useHLSUpload(options: UseHLSUploadOptions = {}) {
	const {
		qualities = [
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
		],
		segmentDuration = 4,
		onProgress,
		onStageChange,
		onComplete,
		onError,
	} = options;

	const ffmpegRef = useRef<FFmpeg | null>(null);
	const [ffmpegLoaded, setFFmpegLoaded] = useState(false);
	const [uploadState, setUploadState] = useState<UploadState>({
		status: "idle",
		progress: 0,
		stage: "",
		error: null,
		hlsFiles: {},
	});

	// Initialize FFmpeg
	const initFFmpeg = useCallback(async () => {
		if (ffmpegRef.current?.loaded) {
			setFFmpegLoaded(true);
			return;
		}

		try {
			if (!ffmpegRef.current) {
				ffmpegRef.current = new FFmpeg();
			}

			const ffmpeg = ffmpegRef.current;

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

			ffmpeg.on("progress", ({ progress }) => {
				const progressPercent = Math.round(progress * 100);
				setUploadState((prev) => ({ ...prev, progress: progressPercent }));
				onProgress?.(progressPercent);
			});

			setFFmpegLoaded(true);
		} catch (error) {
			const err =
				error instanceof Error ? error : new Error("Failed to load FFmpeg");
			setUploadState((prev) => ({
				...prev,
				status: "error",
				error: err.message,
			}));
			onError?.(err);
		}
	}, [onProgress, onError]);

	// Process video to HLS
	const processVideo = useCallback(
		async (file: File, selectedQualities: string[]) => {
			if (!ffmpegRef.current || !ffmpegLoaded) {
				throw new Error("FFmpeg not initialized");
			}

			try {
				setUploadState((prev) => ({
					...prev,
					status: "processing",
					progress: 0,
					stage: "Preparing video...",
					error: null,
				}));
				onStageChange?.("Preparing video...");

				const ffmpeg = ffmpegRef.current;
				const inputFileName = `input_${Date.now()}.${file.name
					.split(".")
					.pop()}`;

				// Write input file
				await ffmpeg.writeFile(inputFileName, await fetchFile(file));

				const generatedFiles: { [key: string]: Blob } = {};
				const masterPlaylistContent: string[] = ["#EXTM3U", "#EXT-X-VERSION:3"];

				// Filter qualities based on selection
				const selectedQualityConfigs = qualities.filter((q) =>
					selectedQualities.includes(q.name)
				);

				// Process each quality
				for (let i = 0; i < selectedQualityConfigs.length; i++) {
					const quality = selectedQualityConfigs[i];
					const stage = `Processing ${quality.name}... (${i + 1}/${
						selectedQualityConfigs.length
					})`;

					setUploadState((prev) => ({ ...prev, stage }));
					onStageChange?.(stage);

					const outputPrefix = `output_${quality.name}`;
					const playlistName = `${outputPrefix}.m3u8`;

					// FFmpeg command
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
						segmentDuration.toString(),
						"-hls_playlist_type",
						"vod",
						"-hls_segment_filename",
						`${outputPrefix}_%03d.ts`,
						"-f",
						"hls",
						playlistName,
					]);

					// Read playlist
					const playlistData = await ffmpeg.readFile(playlistName);
					const playlistBlob = new Blob([playlistData], {
						type: "application/vnd.apple.mpegurl",
					});
					generatedFiles[playlistName] = playlistBlob;

					// Read segments
					const playlistText = new TextDecoder().decode(
						playlistData as Uint8Array
					);
					const segmentMatches = playlistText.matchAll(/output_.*?\.ts/g);

					for (const match of segmentMatches) {
						const segmentName = match[0];
						try {
							const segmentData = await ffmpeg.readFile(segmentName);
							const segmentBlob = new Blob([segmentData], {
								type: "video/MP2T",
							});
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
					const progressPercent = Math.round(
						((i + 1) / selectedQualityConfigs.length) * 100
					);
					setUploadState((prev) => ({ ...prev, progress: progressPercent }));
					onProgress?.(progressPercent);
				}

				// Create master playlist
				const masterPlaylist = masterPlaylistContent.join("\n");
				const masterBlob = new Blob([masterPlaylist], {
					type: "application/vnd.apple.mpegurl",
				});
				generatedFiles["master.m3u8"] = masterBlob;

				// Cleanup
				await ffmpeg.deleteFile(inputFileName);

				setUploadState((prev) => ({
					...prev,
					status: "completed",
					stage: "Processing complete!",
					hlsFiles: generatedFiles,
				}));

				onStageChange?.("Processing complete!");
				onComplete?.(generatedFiles);

				return generatedFiles;
			} catch (error) {
				const err =
					error instanceof Error ? error : new Error("Processing failed");
				setUploadState((prev) => ({
					...prev,
					status: "error",
					error: err.message,
				}));
				onError?.(err);
				throw err;
			}
		},
		[
			ffmpegLoaded,
			qualities,
			segmentDuration,
			onProgress,
			onStageChange,
			onComplete,
			onError,
		]
	);

	// Upload HLS files to server
	const uploadFiles = useCallback(
		async (
			hlsFiles: { [key: string]: Blob },
			metadata: {
				caption: string;
				workType: string;
				links?: string;
				qualities: string[];
			}
		) => {
			try {
				setUploadState((prev) => ({
					...prev,
					status: "uploading",
					stage: "Uploading HLS files...",
				}));
				onStageChange?.("Uploading HLS files...");

				const formData = new FormData();
				formData.append("caption", metadata.caption);
				formData.append("workType", metadata.workType);
				formData.append("links", metadata.links || "");
				formData.append("qualities", JSON.stringify(metadata.qualities));

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

				setUploadState((prev) => ({
					...prev,
					status: "completed",
					stage: "Upload complete!",
				}));
				onStageChange?.("Upload complete!");

				return result;
			} catch (error) {
				const err = error instanceof Error ? error : new Error("Upload failed");
				setUploadState((prev) => ({
					...prev,
					status: "error",
					error: err.message,
				}));
				onError?.(err);
				throw err;
			}
		},
		[onStageChange, onError]
	);

	// Reset state
	const reset = useCallback(() => {
		setUploadState({
			status: "idle",
			progress: 0,
			stage: "",
			error: null,
			hlsFiles: {},
		});
	}, []);

	return {
		// State
		ffmpegLoaded,
		status: uploadState.status,
		progress: uploadState.progress,
		stage: uploadState.stage,
		error: uploadState.error,
		hlsFiles: uploadState.hlsFiles,

		// Actions
		initFFmpeg,
		processVideo,
		uploadFiles,
		reset,
	};
}
