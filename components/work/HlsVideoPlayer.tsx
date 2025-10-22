"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import {
	Play,
	Pause,
	Volume2,
	VolumeX,
	Maximize,
	Minimize,
	Settings,
	Loader2,
	RotateCcw,
	AlertCircle,
} from "lucide-react";

interface UniversalVideoPlayerProps {
	videoUrl: string;
	poster?: string;
	autoPlay?: boolean;
	className?: string;
}

// Detect if URL is HLS
function isHLSUrl(url: string): boolean {
	return url.endsWith(".m3u8") || url.includes("/hls/");
}

// iOS detection
function isIOS(): boolean {
	if (typeof window === "undefined") return false;
	return (
		/iPad|iPhone|iPod/.test(navigator.userAgent) ||
		(navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
	);
}

export const UniversalVideoPlayer = ({
	videoUrl,
	poster,
	autoPlay = false,
	className = "",
}: UniversalVideoPlayerProps) => {
	const videoRef = useRef<HTMLVideoElement>(null);
	const playerRef = useRef<HTMLDivElement>(null);
	const hlsRef = useRef<any>(null);
	const isInitializedRef = useRef(false);
	const abortControllerRef = useRef<AbortController | null>(null);

	const [isPlaying, setIsPlaying] = useState(false);
	const [progress, setProgress] = useState(0);
	const [volume, setVolume] = useState(1);
	const [isMuted, setIsMuted] = useState(false);
	const [isFullscreen, setIsFullscreen] = useState(false);
	const [showControls, setShowControls] = useState(true);
	const [isLoading, setIsLoading] = useState(true);
	const [currentTime, setCurrentTime] = useState(0);
	const [duration, setDuration] = useState(0);
	const [error, setError] = useState<string | null>(null);
	const [availableQualities, setAvailableQualities] = useState<any[]>([]);
	const [currentQuality, setCurrentQuality] = useState<number>(-1);
	const [showQualityMenu, setShowQualityMenu] = useState(false);
	const [videoType, setVideoType] = useState<"hls" | "regular" | null>(null);
	const [isIOSDevice] = useState(isIOS());
	const [canPlay, setCanPlay] = useState(false);

	// Format time
	const formatTime = (time: number): string => {
		if (isNaN(time)) return "0:00";
		const minutes = Math.floor(time / 60);
		const seconds = Math.floor(time % 60);
		return `${minutes}:${seconds.toString().padStart(2, "0")}`;
	};

	// Initialize video player
	useEffect(() => {
		// Prevent double initialization in React strict mode
		if (isInitializedRef.current) return;
		isInitializedRef.current = true;

		const initPlayer = async () => {
			if (!videoRef.current) return;

			// Create abort controller for this initialization
			abortControllerRef.current = new AbortController();

			setIsLoading(true);
			setError(null);
			setCanPlay(false);

			const isHLS = isHLSUrl(videoUrl);
			setVideoType(isHLS ? "hls" : "regular");

			try {
				if (isHLS) {
					// Check for native HLS support (Safari/iOS)
					if (videoRef.current.canPlayType("application/vnd.apple.mpegurl")) {
						videoRef.current.src = videoUrl;
						return;
					}

					// Use hls.js for other browsers
					const Hls = (await import("hls.js")).default;

					if (!Hls.isSupported()) {
						setError("HLS streaming is not supported in this browser");
						setIsLoading(false);
						return;
					}

					const hls = new Hls({
						debug: false,
						enableWorker: true,
						lowLatencyMode: false,
						backBufferLength: 90,
						maxBufferLength: 30,
						maxMaxBufferLength: 600,
						startLevel: -1,
						xhrSetup: (xhr) => {
							xhr.withCredentials = false;
						},
					});

					hlsRef.current = hls;

					hls.loadSource(videoUrl);
					hls.attachMedia(videoRef.current);

					hls.on(Hls.Events.MANIFEST_PARSED, (event, data) => {
						setAvailableQualities(data.levels);
						setCanPlay(true);
					});

					hls.on(Hls.Events.LEVEL_SWITCHED, (event, data) => {
						setCurrentQuality(data.level);
					});

					hls.on(Hls.Events.ERROR, (event, data) => {
						if (data.fatal) {
							switch (data.type) {
								case Hls.ErrorTypes.NETWORK_ERROR:
									console.log("Network error, attempting recovery...");
									setTimeout(() => hls.startLoad(), 1000);
									break;
								case Hls.ErrorTypes.MEDIA_ERROR:
									console.log("Media error, attempting recovery...");
									setTimeout(() => hls.recoverMediaError(), 1000);
									break;
								default:
									setError("Failed to load video");
									setIsLoading(false);
									hls.destroy();
									break;
							}
						}
					});
				} else {
					// Regular video
					videoRef.current.src = videoUrl;
					setCanPlay(true);
				}
			} catch (err: any) {
				console.error("Failed to initialize player:", err);
				setError("Failed to initialize video player");
				setIsLoading(false);
			}
		};

		initPlayer();

		return () => {
			// Cleanup
			if (abortControllerRef.current) {
				abortControllerRef.current.abort();
			}
			if (hlsRef.current) {
				hlsRef.current.destroy();
				hlsRef.current = null;
			}
			isInitializedRef.current = false;
		};
	}, [videoUrl]);

	// Play/Pause toggle
	const togglePlay = useCallback(async () => {
		if (!videoRef.current || !canPlay) return;

		try {
			if (isPlaying) {
				videoRef.current.pause();
			} else {
				const playPromise = videoRef.current.play();

				if (playPromise !== undefined) {
					await playPromise;
				}
			}
		} catch (err: any) {
			// Ignore abort errors
			if (err.name !== "AbortError") {
				console.error("Play failed:", err);
				// Don't set error for user-initiated actions
			}
		}
	}, [isPlaying, canPlay]);

	// Handle time update
	const handleTimeUpdate = useCallback(() => {
		if (!videoRef.current) return;
		const { currentTime, duration } = videoRef.current;

		if (duration > 0) {
			setProgress((currentTime / duration) * 100);
			setCurrentTime(currentTime);
			setDuration(duration);
		}
	}, []);

	// Seek handling
	const handleSeek = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
		if (!videoRef.current) return;
		const seekTime = (Number(e.target.value) / 100) * videoRef.current.duration;
		videoRef.current.currentTime = seekTime;
	}, []);

	// Progress bar click
	const handleProgressClick = useCallback(
		(e: React.MouseEvent<HTMLDivElement>) => {
			if (!videoRef.current) return;
			const rect = e.currentTarget.getBoundingClientRect();
			const clickX = e.clientX - rect.left;
			const clickPercent = (clickX / rect.width) * 100;
			const seekTime = (clickPercent / 100) * videoRef.current.duration;
			videoRef.current.currentTime = seekTime;
			setProgress(clickPercent);
		},
		[]
	);

	// Volume handling
	const handleVolumeChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			if (!videoRef.current || isIOSDevice) return;
			const newVolume = Number(e.target.value);
			videoRef.current.volume = newVolume;
			setVolume(newVolume);
			setIsMuted(newVolume === 0);
		},
		[isIOSDevice]
	);

	// Toggle mute
	const toggleMute = useCallback(() => {
		if (!videoRef.current || isIOSDevice) return;
		const newMutedState = !isMuted;
		videoRef.current.muted = newMutedState;
		setIsMuted(newMutedState);
	}, [isMuted, isIOSDevice]);

	// Fullscreen toggle
	const toggleFullscreen = useCallback(() => {
		if (!playerRef.current) return;

		if (!document.fullscreenElement) {
			playerRef.current.requestFullscreen().catch(console.error);
		} else {
			document.exitFullscreen();
		}
	}, []);

	// Change quality (HLS only)
	const changeQuality = useCallback((level: number) => {
		if (hlsRef.current) {
			hlsRef.current.currentLevel = level;
			setCurrentQuality(level);
			setShowQualityMenu(false);
		}
	}, []);

	// Retry video
	const retryVideo = useCallback(() => {
		setError(null);
		isInitializedRef.current = false;
		window.location.reload();
	}, []);

	// Keyboard shortcuts
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (!videoRef.current) return;

			switch (e.key) {
				case " ":
				case "k":
					e.preventDefault();
					togglePlay();
					break;
				case "m":
					if (!isIOSDevice) toggleMute();
					break;
				case "f":
					toggleFullscreen();
					break;
				case "ArrowLeft":
					videoRef.current.currentTime = Math.max(
						0,
						videoRef.current.currentTime - 5
					);
					break;
				case "ArrowRight":
					videoRef.current.currentTime = Math.min(
						videoRef.current.duration,
						videoRef.current.currentTime + 5
					);
					break;
			}
		};

		document.addEventListener("keydown", handleKeyDown);
		return () => document.removeEventListener("keydown", handleKeyDown);
	}, [togglePlay, toggleMute, toggleFullscreen, isIOSDevice]);

	// Auto-hide controls
	useEffect(() => {
		let hideTimeout: NodeJS.Timeout;

		const handleMouseMove = () => {
			setShowControls(true);
			if (hideTimeout) clearTimeout(hideTimeout);

			if (isPlaying) {
				hideTimeout = setTimeout(() => setShowControls(false), 3000);
			}
		};

		const playerElement = playerRef.current;
		if (playerElement) {
			playerElement.addEventListener("mousemove", handleMouseMove);
		}

		return () => {
			if (hideTimeout) clearTimeout(hideTimeout);
			if (playerElement) {
				playerElement.removeEventListener("mousemove", handleMouseMove);
			}
		};
	}, [isPlaying]);

	// Fullscreen change
	useEffect(() => {
		const handleFullscreenChange = () => {
			setIsFullscreen(!!document.fullscreenElement);
		};

		document.addEventListener("fullscreenchange", handleFullscreenChange);
		return () =>
			document.removeEventListener("fullscreenchange", handleFullscreenChange);
	}, []);

	return (
		<div
			ref={playerRef}
			className={`relative flex flex-col justify-center items-center w-full h-full bg-black rounded-lg overflow-hidden group ${className}`}
		>
			{/* Video type badge */}
			{videoType && (
				<div className="absolute top-2 left-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded z-10">
					{videoType === "hls" ? "HLS" : "MP4"}
				</div>
			)}

			<video
				ref={videoRef}
				className="w-full h-full object-contain cursor-pointer"
				poster={poster}
				onClick={togglePlay}
				onTimeUpdate={handleTimeUpdate}
				onPlay={() => {
					setIsPlaying(true);
					setIsLoading(false);
				}}
				onPause={() => setIsPlaying(false)}
				onWaiting={() => setIsLoading(true)}
				onCanPlay={() => {
					setIsLoading(false);
					setCanPlay(true);
				}}
				onLoadedMetadata={() => {
					if (videoRef.current) {
						setDuration(videoRef.current.duration);
					}
				}}
				onError={(e) => {
					const errorCode = e.currentTarget.error?.code;
					const errorMessage = e.currentTarget.error?.message;

					// Ignore abort errors
					if (errorCode !== 1) {
						console.error("Video error:", errorCode, errorMessage);
						setError("Failed to load video");
					}
					setIsLoading(false);
				}}
				playsInline
				preload="metadata"
			/>

			{/* Error overlay */}
			{error && (
				<div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-75 p-4">
					<AlertCircle className="w-12 h-12 text-red-500 mb-4" />
					<p className="text-white text-lg mb-4 text-center">{error}</p>
					<button
						onClick={retryVideo}
						className="flex items-center gap-2 px-4 py-2 bg-white bg-opacity-20 text-white rounded-lg hover:bg-opacity-30"
					>
						<RotateCcw className="w-4 h-4" />
						Retry
					</button>
				</div>
			)}

			{/* Loading overlay */}
			{isLoading && !error && (
				<div className="absolute inset-0 flex items-center justify-center">
					<Loader2 className="w-8 h-8 text-white animate-spin" />
				</div>
			)}

			{/* Play overlay */}
			{!isPlaying && !isLoading && !error && canPlay && (
				<div
					className="absolute inset-0 flex items-center justify-center cursor-pointer"
					onClick={togglePlay}
				>
					<div className="p-4 bg-black bg-opacity-50 rounded-full hover:bg-opacity-70 transition-colors">
						<Play className="w-12 h-12 text-white" />
					</div>
				</div>
			)}

			{/* Controls */}
			<div
				className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent transition-opacity duration-300 ${
					showControls ? "opacity-100" : "opacity-0"
				}`}
			>
				<div className="px-4 pt-4 pb-2">
					<div
						className="relative w-full h-2 bg-gray-700 rounded-lg overflow-hidden cursor-pointer"
						onClick={handleProgressClick}
					>
						<div
							className="absolute top-0 left-0 h-full bg-red-600 transition-all duration-100"
							style={{ width: `${progress}%` }}
						/>
						<input
							type="range"
							min="0"
							max="100"
							value={progress}
							onChange={handleSeek}
							className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
						/>
					</div>
				</div>

				<div className="flex items-center justify-between px-4 pb-4">
					<div className="flex items-center space-x-4">
						<button
							onClick={togglePlay}
							className="text-white hover:text-gray-300 transition-colors"
							disabled={!canPlay}
						>
							{isPlaying ? (
								<Pause className="w-5 h-5" />
							) : (
								<Play className="w-5 h-5" />
							)}
						</button>

						{!isIOSDevice && (
							<div className="flex items-center space-x-2">
								<button
									onClick={toggleMute}
									className="text-white hover:text-gray-300"
								>
									{isMuted ? (
										<VolumeX className="w-5 h-5" />
									) : (
										<Volume2 className="w-5 h-5" />
									)}
								</button>
								<input
									type="range"
									min="0"
									max="1"
									step="0.01"
									value={isMuted ? 0 : volume}
									onChange={handleVolumeChange}
									className="w-20 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer"
								/>
							</div>
						)}

						<div className="text-white text-sm font-mono">
							{formatTime(currentTime)} / {formatTime(duration)}
						</div>
					</div>

					<div className="flex items-center space-x-4">
						{videoType === "hls" && availableQualities.length > 0 && (
							<div className="relative">
								<button
									onClick={() => setShowQualityMenu(!showQualityMenu)}
									className="text-white hover:text-gray-300 transition-colors"
								>
									<Settings className="w-5 h-5" />
								</button>
								{showQualityMenu && (
									<div className="absolute bottom-8 right-0 bg-black bg-opacity-90 rounded-lg p-2 min-w-32">
										<button
											onClick={() => changeQuality(-1)}
											className={`block w-full text-left px-3 py-2 text-sm text-white hover:bg-gray-700 rounded ${
												currentQuality === -1 ? "bg-gray-700" : ""
											}`}
										>
											Auto
										</button>
										{availableQualities.map((level, index) => (
											<button
												key={index}
												onClick={() => changeQuality(index)}
												className={`block w-full text-left px-3 py-2 text-sm text-white hover:bg-gray-700 rounded ${
													currentQuality === index ? "bg-gray-700" : ""
												}`}
											>
												{level.height}p
											</button>
										))}
									</div>
								)}
							</div>
						)}

						<button
							onClick={toggleFullscreen}
							className="text-white hover:text-gray-300"
						>
							{isFullscreen ? (
								<Minimize className="w-5 h-5" />
							) : (
								<Maximize className="w-5 h-5" />
							)}
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};
