import { getFileExtension } from "./convert";
import { VideoFormats, VideoInputSettings } from "@/types";

export const whatsappStatusCompressionCommand = (
	input: string,
	output: string
) => [
	"-i",
	input,
	"-c:v",
	"libx264",
	"-preset",
	"veryfast",
	"-crf",
	"35",
	"-c:a",
	"aac",
	"-b:a",
	"64k",
	"-movflags",
	"faststart",
	"-maxrate",
	"1000k",
	"-bufsize",
	"1000k",
	"-fs",
	"9M",
	output,
];

export const customVideoCompressionCommand = (
	input: string,
	output: string,
	videoSettings: VideoInputSettings
): string[] => {
	const inputType = getFileExtension(input);
	if (inputType === "mp4") {
		return getMP4toMP4Command(input, output, videoSettings);
	} else {
		switch (videoSettings.videoType) {
			case VideoFormats.MP4:
				return getMP4Command(input, output, videoSettings);
			default:
				return ["-i", input, output];
		}
	}
};

const getMP4toMP4Command = (
	input: string,
	output: string,
	videoSettings: VideoInputSettings
) => {
	const ffmpegCommand = [
		"-i",
		input,
		"-c:v",
		"libx264",
		"-crf",
		"23",
		"-preset",
		"medium",
		"-c:a",
		"aac",
		"-b:a",
		"128k",
		output,
	];
	return ffmpegCommand;
};

const getMP4Command = (
	input: string,
	output: string,
	videoSettings: VideoInputSettings
) => {
	const ffmpegCommand = [
		"-i",
		input,
		"-c:v",
		"libx264",
		"-profile:v",
		"high",
		"-level:v",
		"4.2",
		"-pix_fmt",
		"yuv420p",
		"-r",
		"30",
		"-maxrate",
		"5000k",
		"-bufsize",
		"5000k",
		"-tune",
		"film",
		"-q:v",
		videoSettings.quality,
		"-crf",
		"18",
		"-c:v",
		"libx264",
		"-preset",
		"medium",
		"-f",
		videoSettings.videoType,
	];

	if (!videoSettings.removeAudio) {
		ffmpegCommand.push("-c:a", "aac", "-b:a", "192k", "-movflags", "faststart");
	} else {
		ffmpegCommand.push("-an");
	}
	ffmpegCommand.push(output);

	return ffmpegCommand;
};
