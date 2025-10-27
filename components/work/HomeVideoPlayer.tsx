"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import {
	Play,
	Pause,
	Volume2,
	VolumeX,
	Maximize,
	Minimize,
	RotateCcw,
	Loader2,
} from "lucide-react";

interface VideoPlayerProps {
	videoId: string;
	poster?: string;
	autoPlay?: boolean;
	className?: string;
}

// iOS detection utility
const isIOS = () => {
	if (typeof window === "undefined") return false;
	return (
		/iPad|iPhone|iPod/.test(navigator.userAgent) ||
		(navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
	);
};

// Safari detection utility
const isSafari = () => {
	if (typeof window === "undefined") return false;
	return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
};

export const HomeVideoPlayer = ({
	videoId,
	poster,
	autoPlay = false,
	className = "",
}: VideoPlayerProps) => {
	const videoRef = useRef<HTMLVideoElement>(null);
	const playerRef = useRef<HTMLDivElement>(null);
	const [isPlaying, setIsPlaying] = useState(false); // Always start paused for iOS compatibility
	const [progress, setProgress] = useState(0);
	const [buffered, setBuffered] = useState(0);
	const [volume, setVolume] = useState(1);
	const [isMuted, setIsMuted] = useState(false);
	const [isFullscreen, setIsFullscreen] = useState(false);
	const [showControls, setShowControls] = useState(true);
	const [lastInteraction, setLastInteraction] = useState(Date.now());
	const [isLoading, setIsLoading] = useState(false);
	const [currentTime, setCurrentTime] = useState(0);
	const [duration, setDuration] = useState(0);
	const [error, setError] = useState<string | null>(null);
	const [isInitialized, setIsInitialized] = useState(false);
	const [userInteracted, setUserInteracted] = useState(false);

	// iOS/Safari specific states
	const [isIOSDevice] = useState(isIOS());
	const [isSafariBrowser] = useState(isSafari());

	// Format time for display
	const formatTime = (time: number): string => {
		if (isNaN(time)) return "0:00";
		const minutes = Math.floor(time / 60);
		const seconds = Math.floor(time % 60);
		return `${minutes}:${seconds.toString().padStart(2, "0")}`;
	};

	// Enhanced play function with iOS handling
	const togglePlay = useCallback(async () => {
		if (!videoRef.current) return;

		try {
			setError(null);
			setUserInteracted(true);

			if (isPlaying) {
				videoRef.current.pause();
			} else {
				setIsLoading(true);

				// For iOS, ensure the video is loaded before playing
				if (isIOSDevice && videoRef.current.readyState < 2) {
					videoRef.current.load();
					await new Promise((resolve) => {
						const handleCanPlay = () => {
							videoRef.current?.removeEventListener("canplay", handleCanPlay);
							resolve(void 0);
						};
						videoRef.current?.addEventListener("canplay", handleCanPlay);
					});
				}

				await videoRef.current.play();
			}
		} catch (err: any) {
			console.error("Play failed:", err);

			// iOS-specific error handling
			if (err.name === "NotAllowedError") {
				setError("Please tap to play video");
			} else if (err.name === "NotSupportedError") {
				setError("Video format not supported on this device");
			} else {
				setError("Failed to play video. Please try again.");
			}
		} finally {
			setIsLoading(false);
		}
		setLastInteraction(Date.now());
	}, [isPlaying, isIOSDevice]);

	// Enhanced progress handling
	const handleTimeUpdate = useCallback(() => {
		if (!videoRef.current) return;
		const { currentTime, duration, buffered } = videoRef.current;

		if (duration > 0) {
			setProgress((currentTime / duration) * 100);
			setCurrentTime(currentTime);
			setDuration(duration);
		}

		// Update buffered progress with better iOS handling
		if (buffered.length > 0) {
			let bufferedEnd = 0;
			for (let i = 0; i < buffered.length; i++) {
				if (
					buffered.start(i) <= currentTime &&
					currentTime <= buffered.end(i)
				) {
					bufferedEnd = buffered.end(i);
					break;
				}
			}
			if (bufferedEnd === 0 && buffered.length > 0) {
				bufferedEnd = buffered.end(buffered.length - 1);
			}
			setBuffered(duration > 0 ? (bufferedEnd / duration) * 100 : 0);
		}
	}, []);

	// iOS-optimized seeking
	const handleSeek = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			if (!videoRef.current || !userInteracted) return;
			const seekTime =
				(Number(e.target.value) / 100) * videoRef.current.duration;

			// iOS requires a slight delay for seeking
			if (isIOSDevice) {
				setTimeout(() => {
					if (videoRef.current) {
						videoRef.current.currentTime = seekTime;
					}
				}, 0);
			} else {
				videoRef.current.currentTime = seekTime;
			}
			setLastInteraction(Date.now());
		},
		[userInteracted, isIOSDevice]
	);

	// Enhanced progress click with iOS handling
	const handleProgressClick = useCallback(
		(e: React.MouseEvent<HTMLDivElement>) => {
			if (!videoRef.current || !userInteracted) return;
			const rect = e.currentTarget.getBoundingClientRect();
			const clickX = e.clientX - rect.left;
			const progressWidth = rect.width;
			const clickPercent = (clickX / progressWidth) * 100;
			const seekTime = (clickPercent / 100) * videoRef.current.duration;

			if (isIOSDevice) {
				setTimeout(() => {
					if (videoRef.current) {
						videoRef.current.currentTime = seekTime;
						setProgress(clickPercent);
					}
				}, 0);
			} else {
				videoRef.current.currentTime = seekTime;
				setProgress(clickPercent);
			}
			setLastInteraction(Date.now());
		},
		[userInteracted, isIOSDevice]
	);

	// Volume handling (disabled on iOS as it's not supported)
	const handleVolumeChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			if (!videoRef.current || isIOSDevice) return; // iOS doesn't support programmatic volume control
			const newVolume = Number(e.target.value);
			videoRef.current.volume = newVolume;
			setVolume(newVolume);
			setIsMuted(newVolume === 0);
			setLastInteraction(Date.now());
		},
		[isIOSDevice]
	);

	// Toggle mute (disabled on iOS)
	const toggleMute = useCallback(() => {
		if (!videoRef.current || isIOSDevice) return; // iOS doesn't support programmatic volume control
		const newMutedState = !isMuted;
		videoRef.current.muted = newMutedState;
		setIsMuted(newMutedState);
		setLastInteraction(Date.now());
	}, [isMuted, isIOSDevice]);

	// Enhanced fullscreen for iOS
	const toggleFullscreen = useCallback(() => {
		if (!videoRef.current) return;

		// iOS handles fullscreen differently
		if (isIOSDevice) {
			// iOS supports webkitEnterFullscreen on video element
			if ("webkitEnterFullscreen" in videoRef.current) {
				if (!document.fullscreenElement) {
					(videoRef.current as any).webkitEnterFullscreen();
				}
			}
		} else if (playerRef.current) {
			if (!document.fullscreenElement) {
				playerRef.current.requestFullscreen().catch((err) => {
					console.error("Fullscreen error:", err);
				});
			} else {
				document.exitFullscreen();
			}
		}
		setLastInteraction(Date.now());
	}, [isIOSDevice]);

	// Retry with iOS optimization
	const retryVideo = useCallback(() => {
		if (!videoRef.current) return;
		setError(null);
		setIsLoading(true);
		setIsInitialized(false);

		// Force reload for iOS
		if (isIOSDevice) {
			const currentSrc = videoRef.current.src;
			videoRef.current.src = "";
			videoRef.current.load();
			setTimeout(() => {
				if (videoRef.current) {
					videoRef.current.src = currentSrc;
					videoRef.current.load();
				}
			}, 100);
		} else {
			videoRef.current.load();
		}
	}, [isIOSDevice]);

	// Keyboard shortcuts (disabled on iOS for better native experience)
	useEffect(() => {
		if (isIOSDevice) return; // Let iOS handle keyboard shortcuts natively

		const handleKeyDown = (e: KeyboardEvent) => {
			if (!videoRef.current || !userInteracted) return;

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
				case "j":
					videoRef.current.currentTime = Math.max(
						0,
						videoRef.current.currentTime - 10
					);
					break;
				case "l":
					videoRef.current.currentTime = Math.min(
						videoRef.current.duration,
						videoRef.current.currentTime + 10
					);
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
				case "ArrowUp":
					if (!isIOSDevice) {
						e.preventDefault();
						const newVolumeUp = Math.min(1, videoRef.current.volume + 0.1);
						videoRef.current.volume = newVolumeUp;
						setVolume(newVolumeUp);
						setIsMuted(false);
					}
					break;
				case "ArrowDown":
					if (!isIOSDevice) {
						e.preventDefault();
						const newVolumeDown = Math.max(0, videoRef.current.volume - 0.1);
						videoRef.current.volume = newVolumeDown;
						setVolume(newVolumeDown);
						if (newVolumeDown === 0) setIsMuted(true);
					}
					break;
				default:
					return;
			}
			setLastInteraction(Date.now());
		};

		document.addEventListener("keydown", handleKeyDown);
		return () => document.removeEventListener("keydown", handleKeyDown);
	}, [togglePlay, toggleMute, toggleFullscreen, userInteracted, isIOSDevice]);

	// Enhanced mouse movement handling
	useEffect(() => {
		let hideTimeout: NodeJS.Timeout;

		const handleMouseMove = () => {
			setShowControls(true);
			setLastInteraction(Date.now());

			if (hideTimeout) clearTimeout(hideTimeout);

			// Longer timeout for iOS/touch devices
			if (isPlaying) {
				hideTimeout = setTimeout(
					() => {
						setShowControls(false);
					},
					isIOSDevice ? 5000 : 3000
				);
			}
		};

		const handleMouseEnter = () => {
			setShowControls(true);
			if (hideTimeout) clearTimeout(hideTimeout);
		};

		const handleMouseLeave = () => {
			if (isPlaying) {
				hideTimeout = setTimeout(
					() => {
						setShowControls(false);
					},
					isIOSDevice ? 2000 : 1000
				);
			}
		};

		const playerElement = playerRef.current;
		if (playerElement) {
			// Use touch events for iOS
			if (isIOSDevice) {
				playerElement.addEventListener("touchstart", handleMouseMove);
				playerElement.addEventListener("touchmove", handleMouseMove);
			} else {
				playerElement.addEventListener("mousemove", handleMouseMove);
				playerElement.addEventListener("mouseenter", handleMouseEnter);
				playerElement.addEventListener("mouseleave", handleMouseLeave);
			}
		}

		return () => {
			if (hideTimeout) clearTimeout(hideTimeout);
			if (playerElement) {
				if (isIOSDevice) {
					playerElement.removeEventListener("touchstart", handleMouseMove);
					playerElement.removeEventListener("touchmove", handleMouseMove);
				} else {
					playerElement.removeEventListener("mousemove", handleMouseMove);
					playerElement.removeEventListener("mouseenter", handleMouseEnter);
					playerElement.removeEventListener("mouseleave", handleMouseLeave);
				}
			}
		};
	}, [isPlaying, isIOSDevice]);

	// Fullscreen changes
	useEffect(() => {
		const handleFullscreenChange = () => {
			setIsFullscreen(!!document.fullscreenElement);
			setShowControls(true);
			setLastInteraction(Date.now());
		};

		const handleWebkitFullscreenChange = () => {
			// iOS webkit fullscreen handling
			setShowControls(true);
			setLastInteraction(Date.now());
		};

		document.addEventListener("fullscreenchange", handleFullscreenChange);

		// iOS-specific fullscreen events
		if (isIOSDevice && videoRef.current) {
			videoRef.current.addEventListener(
				"webkitbeginfullscreen",
				handleWebkitFullscreenChange
			);
			videoRef.current.addEventListener(
				"webkitendfullscreen",
				handleWebkitFullscreenChange
			);
		}

		return () => {
			document.removeEventListener("fullscreenchange", handleFullscreenChange);
			if (isIOSDevice && videoRef.current) {
				videoRef.current.removeEventListener(
					"webkitbeginfullscreen",
					handleWebkitFullscreenChange
				);
				videoRef.current.removeEventListener(
					"webkitendfullscreen",
					handleWebkitFullscreenChange
				);
			}
		};
	}, [isIOSDevice]);

	// Enhanced video event handlers
	const handleLoadStart = useCallback(() => {
		setIsLoading(true);
		setIsInitialized(false);
	}, []);

	const handleLoadedMetadata = useCallback(() => {
		setIsInitialized(true);
		if (videoRef.current) {
			setDuration(videoRef.current.duration);
		}
	}, []);

	const handleLoadedData = useCallback(() => {
		setIsLoading(false);
		setError(null);
	}, []);

	const handleWaiting = useCallback(() => {
		setIsLoading(true);
	}, []);

	const handleCanPlay = useCallback(() => {
		setIsLoading(false);
		setIsInitialized(true);
	}, []);

	const handleError = useCallback(
		(e: any) => {
			setIsLoading(false);
			console.error("Video error:", e);

			// iOS-specific error messages
			if (isIOSDevice) {
				setError(
					"Video failed to load. Please check your connection and try again."
				);
			} else {
				setError("Failed to load video");
			}
		},
		[isIOSDevice]
	);

	const handlePlay = useCallback(() => {
		setIsPlaying(true);
		setError(null);
	}, []);

	const handlePause = useCallback(() => {
		setIsPlaying(false);
	}, []);

	const handleEnded = useCallback(() => {
		setIsPlaying(false);
		setProgress(100);
	}, []);

	// iOS video click handler
	const handleVideoClick = useCallback(() => {
		if (isIOSDevice && !userInteracted) {
			setUserInteracted(true);
		}
		togglePlay();
	}, [isIOSDevice, userInteracted, togglePlay]);

	return (
		<div
			ref={playerRef}
			className={`relative flex flex-col justify-center items-center w-full h-full bg-black rounded-lg overflow-hidden group ${className}`}
		>
			<video
				ref={videoRef}
				className="w-full h-full object-contain cursor-pointer"
				src={`/api/rooter/work/get-chuck/${videoId}`}
				poster={poster}
				onClick={handleVideoClick}
				onTimeUpdate={handleTimeUpdate}
				onEnded={handleEnded}
				onPlay={handlePlay}
				onPause={handlePause}
				onLoadStart={handleLoadStart}
				onLoadedMetadata={handleLoadedMetadata}
				onLoadedData={handleLoadedData}
				onWaiting={handleWaiting}
				onCanPlay={handleCanPlay}
				onError={handleError}
				autoPlay={false} // Never autoplay on iOS
				playsInline={true} // Critical for iOS
				preload={isIOSDevice ? "none" : "metadata"} // Optimize for iOS
				controls={false}
				muted={false} // iOS requires user interaction for unmuted autoplay
				webkit-playsinline="true" // iOS compatibility
			>
				Your browser does not support the video tag.
			</video>

			{/* Error overlay */}
			{error && (
				<div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-75 p-4">
					<p className="text-white text-lg mb-4 text-center">{error}</p>
					<button
						onClick={retryVideo}
						className="flex items-center gap-2 px-4 py-2 bg-white bg-opacity-20 text-white rounded-lg hover:bg-opacity-30 transition-colors"
					>
						<RotateCcw className="w-4 h-4" />
						Retry
					</button>
				</div>
			)}

			{/* Loading overlay */}
			{isLoading && !error && (
				<div className="absolute inset-0 flex items-center justify-center">
					<div className="p-4 bg-black bg-opacity-50 rounded-full">
						<Loader2 className="w-8 h-8 text-white animate-spin" />
					</div>
				</div>
			)}

			{/* Play/Pause overlay */}
			{!isPlaying && !isLoading && !error && isInitialized && (
				<div
					className="absolute inset-0 flex items-center justify-center cursor-pointer"
					onClick={handleVideoClick}
				>
					<div className="p-4 bg-black bg-opacity-50 rounded-full hover:bg-opacity-70 transition-colors">
						<Play className="w-12 h-12 text-white" />
					</div>
				</div>
			)}

			{/* User interaction prompt for iOS */}
			{isIOSDevice && !userInteracted && !error && (
				<div
					className="absolute inset-0 flex items-center justify-center cursor-pointer bg-black bg-opacity-30"
					onClick={handleVideoClick}
				>
					<div className="text-center p-6">
						<div className="p-4 bg-black bg-opacity-50 rounded-full mb-4 mx-auto w-fit">
							<Play className="w-12 h-12 text-white" />
						</div>
						<p className="text-white text-lg">Tap to play</p>
					</div>
				</div>
			)}

			{/* Controls overlay */}
			<div
				className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent transition-opacity duration-300 ${
					showControls ? "opacity-100" : "opacity-0"
				}`}
				onMouseEnter={() => setShowControls(true)}
				onTouchStart={() => setShowControls(true)}
			>
				{/* Progress bar container */}
				<div className="px-4 pt-4 pb-2">
					<div
						className="relative w-full h-2 bg-gray-700 rounded-lg overflow-hidden cursor-pointer group/progress"
						onClick={handleProgressClick}
					>
						{/* Buffered progress */}
						<div
							className="absolute top-0 left-0 h-full bg-gray-500 transition-all duration-300 pointer-events-none"
							style={{ width: `${buffered}%` }}
						/>
						{/* Current progress */}
						<div
							className="absolute top-0 left-0 h-full bg-red-600 transition-all duration-100 pointer-events-none"
							style={{ width: `${progress}%` }}
						/>
						{/* Progress thumb */}
						<div
							className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-red-600 rounded-full opacity-0 group-hover/progress:opacity-100 transition-opacity duration-200 pointer-events-none"
							style={{ left: `calc(${progress}% - 6px)` }}
						/>
						{/* Invisible input for keyboard navigation */}
						{!isIOSDevice && (
							<input
								type="range"
								min="0"
								max="100"
								value={progress}
								onChange={handleSeek}
								className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
								tabIndex={0}
								aria-label="Video progress"
							/>
						)}
					</div>
				</div>

				{/* Bottom controls */}
				<div className="flex items-center justify-between px-4 pb-4">
					<div className="flex items-center space-x-4">
						<button
							onClick={togglePlay}
							disabled={isLoading}
							className="text-white hover:text-gray-300 transition-colors disabled:opacity-50"
							aria-label={isPlaying ? "Pause" : "Play"}
						>
							{isLoading ? (
								<Loader2 className="w-5 h-5 animate-spin" />
							) : isPlaying ? (
								<Pause className="w-5 h-5" />
							) : (
								<Play className="w-5 h-5" />
							)}
						</button>

						{/* Volume controls - hidden on iOS */}
						{!isIOSDevice && (
							<div className="flex items-center space-x-2">
								<button
									onClick={toggleMute}
									className="text-white hover:text-gray-300 transition-colors"
									aria-label={isMuted ? "Unmute" : "Mute"}
								>
									{isMuted ? (
										<VolumeX className="w-5 h-5" />
									) : (
										<Volume2 className="w-5 h-5" />
									)}
								</button>
								<div className="relative group/volume">
									<input
										type="range"
										min="0"
										max="1"
										step="0.01"
										value={isMuted ? 0 : volume}
										onChange={handleVolumeChange}
										className="w-20 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
										style={{
											background: `linear-gradient(to right, #dc2626 0%, #dc2626 ${
												(isMuted ? 0 : volume) * 100
											}%, #374151 ${
												(isMuted ? 0 : volume) * 100
											}%, #374151 100%)`,
										}}
									/>
								</div>
							</div>
						)}

						<div className="text-white text-sm font-mono">
							{formatTime(currentTime)} / {formatTime(duration)}
						</div>
					</div>

					<button
						onClick={toggleFullscreen}
						className="text-white hover:text-gray-300 transition-colors"
						aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
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
	);
};
