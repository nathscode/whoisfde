// lib/hls-processor.ts
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { exec } from "child_process";
import { promisify } from "util";
import { mkdir, writeFile, readFile, readdir, rm } from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";

const execAsync = promisify(exec);

const s3Client = new S3Client({
	region: process.env.TEBI_REGION || "us-east-1",
	endpoint: process.env.TEBI_ENDPOINT,
	credentials: {
		accessKeyId: process.env.TEBI_ACCESS_KEY!,
		secretAccessKey: process.env.TEBI_SECRET_KEY!,
	},
});

const bucketName = process.env.TEBI_BUCKET_NAME;

interface HLSQuality {
	name: string;
	width: number;
	height: number;
	videoBitrate: string;
	audioBitrate: string;
}

const DEFAULT_QUALITIES: HLSQuality[] = [
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

/**
 * Process a video file to HLS format with multiple quality levels
 */
export async function processVideoToHLS(
	file: File,
	videoId: string,
	qualities: HLSQuality[] = DEFAULT_QUALITIES
): Promise<string> {
	const tempId = uuidv4();
	const tempDir = path.join("/tmp", `video-${tempId}`);
	const inputPath = path.join(tempDir, "input.mp4");
	const outputDir = path.join(tempDir, "output");

	try {
		// Create temp directories
		await mkdir(tempDir, { recursive: true });
		await mkdir(outputDir, { recursive: true });

		// Save uploaded file to temp location
		const arrayBuffer = await file.arrayBuffer();
		await writeFile(inputPath, Buffer.from(arrayBuffer));

		// Process each quality level
		const uploadedFiles: string[] = [];

		for (const quality of qualities) {
			console.log(`Processing ${quality.name}...`);

			const outputPrefix = `output_${quality.name}`;
			const playlistName = `${outputPrefix}.m3u8`;
			const playlistPath = path.join(outputDir, playlistName);

			// FFmpeg command for this quality
			const ffmpegCmd = [
				"ffmpeg",
				"-i",
				inputPath,
				"-c:v",
				"libx264",
				"-c:a",
				"aac",
				"-b:v",
				quality.videoBitrate,
				"-b:a",
				quality.audioBitrate,
				`-vf scale=${quality.width}:${quality.height}`,
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
				`-hls_segment_filename ${path.join(
					outputDir,
					`${outputPrefix}_%03d.ts`
				)}`,
				"-f",
				"hls",
				playlistPath,
			].join(" ");

			await execAsync(ffmpegCmd);
		}

		// Create master playlist
		const masterPlaylistContent = ["#EXTM3U", "#EXT-X-VERSION:3"];

		for (const quality of qualities) {
			const bandwidth = parseInt(quality.videoBitrate) * 1000;
			masterPlaylistContent.push(
				`#EXT-X-STREAM-INF:BANDWIDTH=${bandwidth},RESOLUTION=${quality.width}x${quality.height}`,
				`output_${quality.name}.m3u8`
			);
		}

		const masterPlaylistPath = path.join(outputDir, "master.m3u8");
		await writeFile(masterPlaylistPath, masterPlaylistContent.join("\n"));

		// Upload all files to S3
		const files = await readdir(outputDir);
		const baseKey = `works/hls/${videoId}`;

		for (const file of files) {
			const filePath = path.join(outputDir, file);
			const fileContent = await readFile(filePath);

			let contentType = "application/octet-stream";
			if (file.endsWith(".m3u8")) {
				contentType = "application/vnd.apple.mpegurl";
			} else if (file.endsWith(".ts")) {
				contentType = "video/MP2T";
			}

			await s3Client.send(
				new PutObjectCommand({
					Bucket: bucketName,
					Key: `${baseKey}/${file}`,
					Body: fileContent,
					ContentType: contentType,
					CacheControl: file.endsWith(".m3u8")
						? "public, max-age=3600"
						: "public, max-age=31536000",
				})
			);

			uploadedFiles.push(file);
		}

		console.log(`Uploaded ${uploadedFiles.length} files for video ${videoId}`);

		// Cleanup temp files
		await rm(tempDir, { recursive: true, force: true });

		// Return master playlist URL
		return `${process.env.NEXT_PUBLIC_TEBI_URL}/${baseKey}/master.m3u8`;
	} catch (error) {
		// Cleanup on error
		await rm(tempDir, { recursive: true, force: true }).catch(() => {});
		throw error;
	}
}

/**
 * Check if FFmpeg is available on the system
 */
export async function checkFFmpegAvailable(): Promise<boolean> {
	try {
		await execAsync("ffmpeg -version");
		return true;
	} catch {
		return false;
	}
}
