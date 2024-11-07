const ffmpegCommands = [
	"-i",
	// Video encoding settings
	"-c:v",
	"libx264", // H.264 codec
	"-preset",
	"superfast", // Fastest preset for quicker compression
	"-crf",
	"15", // Lower CRF for better quality
	"-tune",
	"film", // Optimize for high-quality video content
	"-profile:v",
	"high", // Use high profile for better quality
	"-level",
	"5.2", // Compatibility level for 4K video

	// Resolution and bitrate settings
	"-vf",
	"scale=-2:2160", // Scale to 4K maintaining aspect ratio
	"-maxrate",
	"20M", // Higher maximum bitrate for 4K video
	"-bufsize",
	"40M", // Larger buffer size for rate control

	// Frame rate and GOP settings
	"-g",
	"48", // Keyframe interval
	"-keyint_min",
	"48", // Minimum GOP length
	"-sc_threshold",
	"0", // Scene change threshold

	// Audio settings
	"-c:a",
	"aac", // AAC audio codec
	"-b:a",
	"192k", // Higher audio bitrate for better quality
	"-ar",
	"48000", // Audio sample rate

	// Output optimization
	"-movflags",
	"+faststart", // Enable fast start for web playback
	"-threads",
	"0", // Use all available CPU threads

	// Additional quality settings
	"-x264opts",
	"rc-lookahead=48:ref=4", // Look-ahead and reference frames
	"-pix_fmt",
	"yuv420p", // Pixel format for compatibility
];
