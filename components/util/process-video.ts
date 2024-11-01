import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";

const SEGMENT_DURATION = "6"; // HLS segment duration in seconds

interface ProcessedVideo {
	m3u8: Buffer;
	segments: Array<{
		name: string;
		content: Buffer;
	}>;
}

export async function initFFmpeg() {
	const ffmpeg = new FFmpeg();
	const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.2/dist/umd";
	await ffmpeg.load({
		coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
		wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, "application/wasm"),
	});
	return ffmpeg;
}

async function getSegmentNames(outputPrefix: string): Promise<string[]> {
	// We'll determine segment names based on the pattern outputPrefix_000.ts, outputPrefix_001.ts, etc.
	const segmentNames: string[] = [];
	for (let i = 0; i < 999; i++) {
		const segmentName = `${outputPrefix}_${i.toString().padStart(3, "0")}.ts`;
		segmentNames.push(segmentName);
	}
	return segmentNames;
}

function convertToBuffer(data: Uint8Array | string): Buffer {
	if (typeof data === "string") {
		return Buffer.from(data);
	}
	return Buffer.from(data);
}

export async function processVideo(
	file: File,
	ffmpeg: FFmpeg
): Promise<ProcessedVideo> {
	const inputFileName =
		"input" + file.name.substring(file.name.lastIndexOf("."));
	const outputPrefix = "output";

	// Write input file to FFmpeg's virtual filesystem
	await ffmpeg.writeFile(inputFileName, await fetchFile(file));

	// Generate high-quality compressed MP4 with AAC audio
	const ffmpegCommand = [
		"-i",
		inputFileName,
		// Video encoding settings
		"-c:v",
		"libx264",
		"-preset",
		"slow",
		"-crf",
		"22",
		"-profile:v",
		"high",
		"-level",
		"4.0",
		// Audio encoding settings
		"-c:a",
		"aac",
		"-b:a",
		"192k",
		// HLS settings
		"-hls_time",
		SEGMENT_DURATION,
		"-hls_list_size",
		"0",
		"-hls_segment_filename",
		`${outputPrefix}_%03d.ts`,
		"-f",
		"hls",
		// Multiple quality variants
		"-var_stream_map",
		"v:0,a:0",
		`${outputPrefix}.m3u8`,
	];

	await ffmpeg.exec(ffmpegCommand);

	// Read the M3U8 file
	const m3u8FileData = await ffmpeg.readFile(`${outputPrefix}.m3u8`);
	if (!m3u8FileData) {
		throw new Error("Failed to generate M3U8 playlist");
	}

	// Convert FileData to Buffer
	const m3u8Content = convertToBuffer(m3u8FileData);

	// Read segment files based on the M3U8 content
	const segmentFiles = [];
	const segmentFileNames = await getSegmentNames(outputPrefix);

	for (const segmentName of segmentFileNames) {
		try {
			const segmentData = await ffmpeg.readFile(segmentName);
			if (segmentData) {
				segmentFiles.push({
					name: segmentName,
					content: convertToBuffer(segmentData),
				});
			}
		} catch (error) {
			// If we can't read a segment file, we've probably reached the end of the segments
			break;
		}
	}

	if (segmentFiles.length === 0) {
		throw new Error("No segment files were generated");
	}

	return {
		m3u8: m3u8Content,
		segments: segmentFiles,
	};
}
