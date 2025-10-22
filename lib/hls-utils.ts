export function validateVideoFile(file: File | null): string | null {
	if (!file) return "No file selected";

	const allowedTypes = [
		"video/mp4",
		"video/quicktime",
		"video/x-msvideo",
		"video/webm",
	];
	if (!allowedTypes.includes(file.type)) {
		return "Invalid video format. Please upload MP4, MOV, AVI, or WebM";
	}

	const maxSize = 500 * 1024 * 1024; // 500MB
	if (file.size > maxSize) {
		return "File size exceeds 500MB limit";
	}

	return null;
}

/**
 * Formats bytes to human-readable size
 */
export function bytesToSize(bytes: number): string {
	if (bytes === 0) return "0 Bytes";

	const k = 1024;
	const sizes = ["Bytes", "KB", "MB", "GB"];
	const i = Math.floor(Math.log(bytes) / Math.log(k));

	return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
}

/**
 * Estimates HLS file count based on video duration and quality count
 */
export function estimateHLSFileCount(
	durationSeconds: number,
	qualityCount: number,
	segmentDuration: number = 4
): number {
	const segmentsPerQuality = Math.ceil(durationSeconds / segmentDuration);
	const totalSegments = segmentsPerQuality * qualityCount;
	const playlists = qualityCount + 1; // quality playlists + master

	return totalSegments + playlists;
}

/**
 * Calculates estimated processing time based on video duration and quality count
 */
export function estimateProcessingTime(
	durationSeconds: number,
	qualityCount: number
): number {
	// Rough estimate: ~0.3x realtime per quality level in browser
	const processingFactor = 0.3;
	return Math.ceil(durationSeconds * qualityCount * processingFactor);
}

/**
 * Gets optimal quality levels based on video resolution
 */
export function getOptimalQualities(
	videoWidth: number,
	videoHeight: number
): string[] {
	const maxResolution = Math.max(videoWidth, videoHeight);
	const qualities: string[] = [];

	if (maxResolution >= 360) qualities.push("360p");
	if (maxResolution >= 480) qualities.push("480p");
	if (maxResolution >= 720) qualities.push("720p");
	if (maxResolution >= 1080) qualities.push("1080p");

	// Always include at least 360p and the highest available
	if (qualities.length === 0) qualities.push("360p");

	return qualities;
}

/**
 * Parses HLS master playlist to extract available quality levels
 */
export function parseHLSQualities(masterPlaylistContent: string): Array<{
	bandwidth: number;
	resolution: string;
	url: string;
}> {
	const qualities: Array<{
		bandwidth: number;
		resolution: string;
		url: string;
	}> = [];
	const lines = masterPlaylistContent.split("\n");

	for (let i = 0; i < lines.length; i++) {
		const line = lines[i].trim();

		if (line.startsWith("#EXT-X-STREAM-INF:")) {
			const bandwidthMatch = line.match(/BANDWIDTH=(\d+)/);
			const resolutionMatch = line.match(/RESOLUTION=(\d+x\d+)/);

			if (bandwidthMatch && resolutionMatch && i + 1 < lines.length) {
				qualities.push({
					bandwidth: parseInt(bandwidthMatch[1]),
					resolution: resolutionMatch[1],
					url: lines[i + 1].trim(),
				});
			}
		}
	}

	return qualities.sort((a, b) => a.bandwidth - b.bandwidth);
}

/**
 * Generates a unique video ID for storage
 */
export function generateVideoId(): string {
	const timestamp = Date.now();
	const random = Math.floor(Math.random() * 999999);
	return `${timestamp}_${random}`;
}

/**
 * Gets video metadata from file
 */
export async function getVideoMetadata(file: File): Promise<{
	duration: number;
	width: number;
	height: number;
}> {
	return new Promise((resolve, reject) => {
		const video = document.createElement("video");
		video.preload = "metadata";

		video.onloadedmetadata = () => {
			URL.revokeObjectURL(video.src);
			resolve({
				duration: video.duration,
				width: video.videoWidth,
				height: video.videoHeight,
			});
		};

		video.onerror = () => {
			URL.revokeObjectURL(video.src);
			reject(new Error("Failed to load video metadata"));
		};

		video.src = URL.createObjectURL(file);
	});
}

/**
 * Creates a safe filename for S3/storage
 */
export function createSafeFilename(
	originalName: string,
	videoId: string
): string {
	const extension = originalName.split(".").pop()?.toLowerCase() || "mp4";
	return `${videoId}.${extension}`;
}

/**
 * Validates HLS playlist content
 */
export function isValidHLSPlaylist(content: string): boolean {
	return content.trim().startsWith("#EXTM3U");
}

/**
 * Calculates compression ratio
 */
export function calculateCompressionRatio(
	originalSize: number,
	compressedSize: number
): number {
	if (originalSize === 0) return 0;
	return Math.round(((originalSize - compressedSize) / originalSize) * 100);
}

/**
 * Formats time in seconds to MM:SS format
 */
export function formatDuration(seconds: number): string {
	if (isNaN(seconds)) return "0:00";
	const mins = Math.floor(seconds / 60);
	const secs = Math.floor(seconds % 60);
	return `${mins}:${secs.toString().padStart(2, "0")}`;
}

/**
 * Detects if browser supports native HLS
 */
export function supportsNativeHLS(): boolean {
	if (typeof document === "undefined") return false;

	const video = document.createElement("video");
	return video.canPlayType("application/vnd.apple.mpegurl") !== "";
}

/**
 * Checks if device is iOS
 */
export function isIOSDevice(): boolean {
	if (typeof navigator === "undefined") return false;

	return (
		/iPad|iPhone|iPod/.test(navigator.userAgent) ||
		(navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
	);
}

/**
 * Gets recommended segment duration based on video length
 */
export function getRecommendedSegmentDuration(
	videoDurationSeconds: number
): number {
	// Shorter videos benefit from smaller segments for faster seeking
	// Longer videos can use larger segments to reduce file count
	if (videoDurationSeconds < 120) return 2; // 2 seconds for < 2 min
	if (videoDurationSeconds < 600) return 4; // 4 seconds for 2-10 min
	if (videoDurationSeconds < 1800) return 6; // 6 seconds for 10-30 min
	return 10; // 10 seconds for > 30 min
}

/**
 * Calculates estimated storage size for HLS files
 */
export function estimateHLSStorageSize(
	originalFileSize: number,
	qualityCount: number,
	compressionRatio: number = 0.7 // 30% compression by default
): number {
	// HLS creates multiple quality variants
	// Each quality is smaller due to compression and resolution reduction
	const avgQualitySize = originalFileSize * compressionRatio;
	const totalSize = avgQualitySize * qualityCount;

	// Add ~5% overhead for playlist files and metadata
	return Math.ceil(totalSize * 1.05);
}

/**
 * Generates HLS quality configuration based on video properties
 */
export function generateQualityConfig(
	videoWidth: number,
	videoHeight: number,
	originalBitrate?: number
) {
	const qualities = [];
	const maxResolution = Math.max(videoWidth, videoHeight);

	const qualityPresets = [
		{ name: "360p", maxHeight: 360, videoBitrate: "800k", audioBitrate: "96k" },
		{
			name: "480p",
			maxHeight: 480,
			videoBitrate: "1400k",
			audioBitrate: "128k",
		},
		{
			name: "720p",
			maxHeight: 720,
			videoBitrate: "2800k",
			audioBitrate: "128k",
		},
		{
			name: "1080p",
			maxHeight: 1080,
			videoBitrate: "5000k",
			audioBitrate: "192k",
		},
	];

	for (const preset of qualityPresets) {
		if (maxResolution >= preset.maxHeight) {
			qualities.push(preset);
		}
	}

	// Always include at least one quality
	if (qualities.length === 0) {
		qualities.push(qualityPresets[0]);
	}

	return qualities;
}

/**
 * Debounce function for performance optimization
 */
export function debounce<T extends (...args: any[]) => any>(
	func: T,
	wait: number
): (...args: Parameters<T>) => void {
	let timeout: NodeJS.Timeout | null = null;

	return (...args: Parameters<T>) => {
		if (timeout) clearTimeout(timeout);
		timeout = setTimeout(() => func(...args), wait);
	};
}

/**
 * Retry function with exponential backoff
 */
export async function retryWithBackoff<T>(
	fn: () => Promise<T>,
	maxRetries: number = 3,
	initialDelay: number = 1000
): Promise<T> {
	let lastError: Error;

	for (let i = 0; i < maxRetries; i++) {
		try {
			return await fn();
		} catch (error) {
			lastError = error as Error;

			if (i < maxRetries - 1) {
				const delay = initialDelay * Math.pow(2, i);
				await new Promise((resolve) => setTimeout(resolve, delay));
			}
		}
	}

	throw lastError!;
}

/**
 * Validates S3/Storage URL format
 */
export function isValidStorageUrl(url: string): boolean {
	try {
		const parsedUrl = new URL(url);
		return parsedUrl.protocol === "https:" || parsedUrl.protocol === "http:";
	} catch {
		return false;
	}
}

/**
 * Extracts video ID from HLS playlist URL
 */
export function extractVideoIdFromUrl(url: string): string | null {
	const match = url.match(/\/hls\/([^\/]+)\//);
	return match ? match[1] : null;
}

/**
 * Converts quality name to resolution dimensions
 */
export function qualityToResolution(quality: string): {
	width: number;
	height: number;
} {
	const resolutions: Record<string, { width: number; height: number }> = {
		"360p": { width: 640, height: 360 },
		"480p": { width: 854, height: 480 },
		"720p": { width: 1280, height: 720 },
		"1080p": { width: 1920, height: 1080 },
		"1440p": { width: 2560, height: 1440 },
		"4k": { width: 3840, height: 2160 },
	};

	return resolutions[quality.toLowerCase()] || { width: 1280, height: 720 };
}

/**
 * Gets network speed estimate (rough approximation)
 */
export async function estimateNetworkSpeed(): Promise<number> {
	try {
		const startTime = performance.now();
		// Download a small test file (or use existing resource)
		const response = await fetch("/api/health", { method: "HEAD" });
		const endTime = performance.now();

		if (!response.ok) return 0;

		const duration = (endTime - startTime) / 1000; // Convert to seconds
		// Rough estimate in Mbps (this is very approximate)
		return duration < 0.1 ? 10 : duration < 0.5 ? 5 : 1;
	} catch {
		return 0; // Unknown speed
	}
}

/**
 * Recommends quality based on network speed
 */
export function recommendQuality(networkSpeedMbps: number): string {
	if (networkSpeedMbps >= 8) return "1080p";
	if (networkSpeedMbps >= 4) return "720p";
	if (networkSpeedMbps >= 2) return "480p";
	return "360p";
}

/**
 * Sanitizes filename for safe storage
 */
export function sanitizeFilename(filename: string): string {
	return filename
		.replace(/[^a-zA-Z0-9.-]/g, "_")
		.replace(/_{2,}/g, "_")
		.toLowerCase();
}

/**
 * Chunks array for batch processing
 */
export function chunkArray<T>(array: T[], chunkSize: number): T[][] {
	const chunks: T[][] = [];
	for (let i = 0; i < array.length; i += chunkSize) {
		chunks.push(array.slice(i, i + chunkSize));
	}
	return chunks;
}

/**
 * Calculates progress percentage
 */
export function calculateProgress(current: number, total: number): number {
	if (total === 0) return 0;
	return Math.min(Math.round((current / total) * 100), 100);
}

/**
 * Type guard for File object
 */
export function isFile(value: unknown): value is File {
	return value instanceof File;
}

/**
 * Type guard for Blob object
 */
export function isBlob(value: unknown): value is Blob {
	return value instanceof Blob;
}

/**
 * Creates a download link for a blob
 */
export function downloadBlob(blob: Blob, filename: string): void {
	const url = URL.createObjectURL(blob);
	const link = document.createElement("a");
	link.href = url;
	link.download = filename;
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
	URL.revokeObjectURL(url);
}

/**
 * Converts File to base64 string
 */
export async function fileToBase64(file: File): Promise<string> {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = () => resolve(reader.result as string);
		reader.onerror = reject;
		reader.readAsDataURL(file);
	});
}

/**
 * Validates video aspect ratio
 */
export function validateAspectRatio(
	width: number,
	height: number,
	expectedRatio: number = 16 / 9,
	tolerance: number = 0.1
): boolean {
	const actualRatio = width / height;
	return Math.abs(actualRatio - expectedRatio) <= tolerance;
}

/**
 * Gets user-friendly error message for common errors
 */
export function getErrorMessage(error: unknown): string {
	if (error instanceof Error) {
		// Map common errors to user-friendly messages
		if (error.message.includes("CORS")) {
			return "Unable to access video. Please check your network connection.";
		}
		if (error.message.includes("404")) {
			return "Video not found. It may have been removed.";
		}
		if (error.message.includes("403")) {
			return "Access denied. You may not have permission to view this video.";
		}
		if (error.message.includes("network")) {
			return "Network error. Please check your internet connection.";
		}
		return error.message;
	}
	return "An unexpected error occurred";
}
