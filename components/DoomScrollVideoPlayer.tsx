"use client";

import { useFullscreenScrollFix } from "@/hooks/use-body-scroll-lock";
import { Maximize, Minimize, Play, Volume2, VolumeX } from "lucide-react";
import { useCallback, useEffect, useRef, useState, memo } from "react";

interface VideoPlayerProps {
	videoId: string;
	poster?: string;
	autoPlay?: boolean;
	hideControls?: boolean;
	isActive?: boolean;
	onVideoEnd?: () => void;
	className?: string;
	workData?: any;
}

export const DoomScrollVideoPlayer = memo(
	({
		videoId,
		poster,
		autoPlay = false,
		hideControls = false,
		isActive = true,
		onVideoEnd,
		className = "",
		workData,
	}: VideoPlayerProps) => {
		const videoRef = useRef<HTMLVideoElement>(null);
		const playerRef = useRef<HTMLDivElement>(null);
		const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);
		const retryCountRef = useRef(0);
		const maxRetries = 3;

		const [isPlaying, setIsPlaying] = useState(false);
		const [progress, setProgress] = useState(0);
		const [isMuted, setIsMuted] = useState(true);
		const [isFullscreen, setIsFullscreen] = useState(false);
		const [showControls, setShowControls] = useState(!hideControls);
		const [isLoading, setIsLoading] = useState(true);
		const [duration, setDuration] = useState(0);
		const [currentTime, setCurrentTime] = useState(0);
		const [isMobile, setIsMobile] = useState(false);
		const [hasEnded, setHasEnded] = useState(false);
		const [isIOS, setIsIOS] = useState(false);
		const [canAutoPlay, setCanAutoPlay] = useState(false);

		const {
			saveScrollPosition,
			restoreScrollPosition,
			isFullscreen: hookIsFullscreen,
		} = useFullscreenScrollFix({
			preventScrollJump: true,
			restoreOnExit: true,
			disableBodyScroll: true,
		});

		// Detect device type and capabilities
		useEffect(() => {
			const checkDevice = () => {
				const userAgent = navigator.userAgent.toLowerCase();
				const width = window.innerWidth;

				setIsMobile(width < 768);
				setIsIOS(/iphone|ipad|ipod/.test(userAgent));

				// Check if autoplay is supported
				const video = document.createElement("video");
				video.muted = true;
				const playPromise = video.play();

				if (playPromise !== undefined) {
					playPromise
						.then(() => {
							setCanAutoPlay(true);
							video.pause();
						})
						.catch(() => {
							setCanAutoPlay(false);
						});
				}
			};

			checkDevice();
			window.addEventListener("resize", checkDevice);
			return () => window.removeEventListener("resize", checkDevice);
		}, []);

		// Optimized play function with retry logic
		const attemptPlay = useCallback(async (muted: boolean = true) => {
			if (!videoRef.current) return;

			try {
				videoRef.current.muted = muted;
				await videoRef.current.play();
				setIsPlaying(true);
				retryCountRef.current = 0;
			} catch (error: any) {
				console.error("Play attempt failed:", error);

				// Retry with muted if unmuted play failed
				if (!muted && retryCountRef.current < maxRetries) {
					retryCountRef.current++;
					setTimeout(() => attemptPlay(true), 500);
				}
			}
		}, []);

		// Handle play/pause with iOS considerations
		const togglePlay = useCallback(() => {
			if (!videoRef.current) return;

			if (isPlaying) {
				videoRef.current.pause();
				setIsPlaying(false);
			} else {
				if (hasEnded) {
					videoRef.current.currentTime = 0;
					setHasEnded(false);
					setProgress(0);
				}

				// On iOS, user interaction allows unmuting
				const shouldUnmute = !isIOS || !isMuted;
				attemptPlay(!shouldUnmute);

				if (shouldUnmute) {
					setIsMuted(false);
				}
			}
		}, [isPlaying, isMuted, hasEnded, isIOS, attemptPlay]);

		// Optimized time update with requestAnimationFrame
		const handleTimeUpdate = useCallback(() => {
			if (!videoRef.current) return;

			requestAnimationFrame(() => {
				if (!videoRef.current) return;
				const { currentTime, duration } = videoRef.current;

				if (duration > 0) {
					const newProgress = (currentTime / duration) * 100;
					setProgress(newProgress);
					setCurrentTime(currentTime);
					setDuration(duration);
				}
			});
		}, []);

		// Handle video ended with cleanup
		const handleVideoEnded = useCallback(() => {
			setIsPlaying(false);
			setHasEnded(true);
			setProgress(100);

			// Cleanup and advance to next video
			if (onVideoEnd) {
				const timer = setTimeout(() => {
					onVideoEnd();
				}, 1500); // Slightly longer delay for better UX

				return () => clearTimeout(timer);
			}
		}, [onVideoEnd]);

		// Optimized seeking
		const handleProgressClick = useCallback(
			(e: React.MouseEvent<HTMLDivElement>) => {
				if (!videoRef.current) return;
				e.stopPropagation();

				const rect = e.currentTarget.getBoundingClientRect();
				const clickX = e.clientX - rect.left;
				const clickPercent = (clickX / rect.width) * 100;
				const seekTime = (clickPercent / 100) * videoRef.current.duration;

				videoRef.current.currentTime = seekTime;
				setHasEnded(false);
			},
			[]
		);

		// Toggle mute with persistence
		const toggleMute = useCallback(() => {
			if (!videoRef.current) return;

			const newMutedState = !isMuted;
			videoRef.current.muted = newMutedState;
			setIsMuted(newMutedState);

			// Save preference
			try {
				localStorage.setItem("videoPlayerMuted", String(newMutedState));
			} catch (e) {
				// Ignore localStorage errors
			}
		}, [isMuted]);

		// Format time display
		const formatTime = useCallback((time: number): string => {
			if (!isFinite(time) || isNaN(time)) return "0:00";
			const minutes = Math.floor(time / 60);
			const seconds = Math.floor(time % 60);
			return `${minutes}:${seconds.toString().padStart(2, "0")}`;
		}, []);

		// Enhanced fullscreen toggle
		const toggleFullscreen = useCallback(async () => {
			if (!playerRef.current) return;

			try {
				if (!document.fullscreenElement) {
					saveScrollPosition();

					// Use different methods for different browsers
					if (playerRef.current.requestFullscreen) {
						await playerRef.current.requestFullscreen();
					} else if ((playerRef.current as any).webkitRequestFullscreen) {
						// Safari/iOS
						await (playerRef.current as any).webkitRequestFullscreen();
					} else if ((playerRef.current as any).mozRequestFullScreen) {
						// Firefox
						await (playerRef.current as any).mozRequestFullScreen();
					} else if ((playerRef.current as any).msRequestFullscreen) {
						// IE/Edge
						await (playerRef.current as any).msRequestFullscreen();
					}
				} else {
					if (document.exitFullscreen) {
						await document.exitFullscreen();
					} else if ((document as any).webkitExitFullscreen) {
						await (document as any).webkitExitFullscreen();
					} else if ((document as any).mozCancelFullScreen) {
						await (document as any).mozCancelFullScreen();
					} else if ((document as any).msExitFullscreen) {
						await (document as any).msExitFullscreen();
					}
				}
			} catch (err) {
				console.error("Fullscreen error:", err);
			}
		}, [saveScrollPosition]);

		// Handle autoplay based on device capabilities
		useEffect(() => {
			if (!videoRef.current || !isActive) return;

			const video = videoRef.current;

			if (autoPlay && !hasEnded) {
				// Load mute preference
				try {
					const savedMutedState = localStorage.getItem("videoPlayerMuted");
					if (savedMutedState !== null) {
						const shouldMute = savedMutedState === "true";
						video.muted = shouldMute;
						setIsMuted(shouldMute);
					}
				} catch (e) {
					// Ignore localStorage errors
				}

				// Attempt autoplay
				const playTimer = setTimeout(() => {
					attemptPlay(true);
				}, 100);

				return () => clearTimeout(playTimer);
			} else if (!isActive && isPlaying) {
				video.pause();
			}
		}, [isActive, autoPlay, hasEnded, attemptPlay, isPlaying]);

		// Reset state on video change
		useEffect(() => {
			setHasEnded(false);
			setProgress(0);
			setCurrentTime(0);
			setIsPlaying(false);
			setIsLoading(true);
			retryCountRef.current = 0;

			// Preload video
			if (videoRef.current) {
				videoRef.current.load();
			}
		}, [videoId]);

		// Controls visibility management
		useEffect(() => {
			if (hideControls || isMobile) return;

			const handleMouseMove = () => {
				setShowControls(true);

				if (controlsTimeoutRef.current) {
					clearTimeout(controlsTimeoutRef.current);
				}

				controlsTimeoutRef.current = setTimeout(() => {
					if (isPlaying && !hasEnded) {
						setShowControls(false);
					}
				}, 3000);
			};

			const playerElement = playerRef.current;
			if (playerElement) {
				playerElement.addEventListener("mousemove", handleMouseMove);
				playerElement.addEventListener("touchstart", handleMouseMove);
			}

			return () => {
				if (controlsTimeoutRef.current) {
					clearTimeout(controlsTimeoutRef.current);
				}
				if (playerElement) {
					playerElement.removeEventListener("mousemove", handleMouseMove);
					playerElement.removeEventListener("touchstart", handleMouseMove);
				}
			};
		}, [isPlaying, hideControls, isMobile, hasEnded]);

		// Sync fullscreen state
		useEffect(() => {
			setIsFullscreen(hookIsFullscreen);
		}, [hookIsFullscreen]);

		// Keyboard shortcuts (desktop only)
		useEffect(() => {
			if (!isActive || isMobile) return;

			const handleKeyDown = (e: KeyboardEvent) => {
				if (!videoRef.current) return;

				switch (e.key) {
					case " ":
					case "k":
						e.preventDefault();
						togglePlay();
						break;
					case "m":
						e.preventDefault();
						toggleMute();
						break;
					case "f":
						e.preventDefault();
						toggleFullscreen();
						break;
					case "ArrowLeft":
						e.preventDefault();
						videoRef.current.currentTime = Math.max(
							0,
							videoRef.current.currentTime - 5
						);
						break;
					case "ArrowRight":
						e.preventDefault();
						videoRef.current.currentTime = Math.min(
							videoRef.current.duration,
							videoRef.current.currentTime + 5
						);
						break;
					case "Escape":
						if (document.fullscreenElement) {
							e.preventDefault();
							document.exitFullscreen();
						}
						break;
				}
			};

			document.addEventListener("keydown", handleKeyDown);
			return () => document.removeEventListener("keydown", handleKeyDown);
		}, [isActive, isMobile, togglePlay, toggleMute, toggleFullscreen]);

		// Cleanup on unmount
		useEffect(() => {
			return () => {
				if (controlsTimeoutRef.current) {
					clearTimeout(controlsTimeoutRef.current);
				}
				if (videoRef.current) {
					videoRef.current.pause();
					videoRef.current.src = "";
					videoRef.current.load();
				}
			};
		}, []);

		return (
			<div
				ref={playerRef}
				className={`relative w-full h-full bg-black ${className}`}
				onClick={togglePlay}
				data-video-player="true"
			>
				<video
					ref={videoRef}
					className="absolute inset-0 w-full h-full object-cover"
					src={`/api/rooter/work/get-chuck/${videoId}`}
					poster={poster}
					onTimeUpdate={handleTimeUpdate}
					onEnded={handleVideoEnded}
					onPlay={() => {
						setIsPlaying(true);
						setHasEnded(false);
					}}
					onPause={() => setIsPlaying(false)}
					onLoadStart={() => setIsLoading(true)}
					onLoadedData={() => setIsLoading(false)}
					onLoadedMetadata={(e) => {
						const video = e.currentTarget;
						setDuration(video.duration);
						setIsLoading(false);
					}}
					onWaiting={() => setIsLoading(true)}
					onCanPlay={() => setIsLoading(false)}
					onError={(e) => {
						console.error("Video error:", e);
						setIsLoading(false);
					}}
					muted={isMuted}
					playsInline
					preload="metadata"
					crossOrigin="anonymous"
					webkit-playsinline="true"
					x-webkit-airplay="allow"
					style={{
						width: "100%",
						height: "100%",
						objectFit: "cover",
					}}
				>
					Your browser does not support the video tag.
				</video>

				{/* Play/Pause overlay */}
				{(!isPlaying || hasEnded) && !isLoading && (
					<div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
						<div className="p-4 bg-black bg-opacity-50 rounded-full backdrop-blur-sm">
							<Play
								className={`${isMobile ? "w-12 h-12" : "w-16 h-16"} text-white`}
								fill="white"
							/>
						</div>
					</div>
				)}

				{/* Video ended overlay */}
				{hasEnded && (
					<div className="absolute inset-0 flex items-center justify-center z-25 bg-black bg-opacity-30 pointer-events-none">
						<div className="text-center text-white">
							<div className="p-4 bg-black bg-opacity-70 rounded-full backdrop-blur-sm mb-4">
								<Play
									className={`${
										isMobile ? "w-12 h-12" : "w-16 h-16"
									} text-white`}
									fill="white"
								/>
							</div>
							<p className="text-sm opacity-75">
								Auto-advancing to next video...
							</p>
						</div>
					</div>
				)}

				{/* Loading overlay */}
				{isLoading && (
					<div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
						<div
							className={`${
								isMobile ? "w-8 h-8" : "w-10 h-10"
							} border-3 border-white border-t-transparent rounded-full animate-spin`}
						/>
					</div>
				)}

				{/* Side Actions */}
				<div
					className={`absolute ${
						isMobile ? "right-3 bottom-24" : "right-4 bottom-32"
					} flex flex-col items-center space-y-4 z-20`}
				>
					<button
						onClick={(e) => {
							e.stopPropagation();
							toggleMute();
						}}
						className="p-3 bg-gray-800/60 rounded-full text-white hover:bg-gray-700/80 active:scale-95 transition-all backdrop-blur-sm touch-manipulation"
						aria-label={isMuted ? "Unmute" : "Mute"}
					>
						{isMuted ? (
							<VolumeX className="w-5 h-5" />
						) : (
							<Volume2 className="w-5 h-5" />
						)}
					</button>
				</div>

				{/* Bottom Info */}
				{workData && (
					<div
						className={`absolute ${
							isMobile ? "bottom-3 left-3 right-20" : "bottom-4 left-4 right-24"
						} text-white z-20 pointer-events-none`}
					>
						<h3
							className={`font-semibold ${
								isMobile ? "text-base" : "text-lg"
							} mb-1 drop-shadow-lg line-clamp-2`}
						>
							{workData.title || workData.caption || "Video"}
						</h3>
						<p
							className={`${
								isMobile ? "text-xs" : "text-sm"
							} opacity-90 drop-shadow-lg line-clamp-2 mb-2`}
						>
							{workData.description || workData.caption}
						</p>
						<p
							className={`${
								isMobile ? "text-xs" : "text-sm"
							} opacity-75 drop-shadow-lg`}
						>
							@{workData.author || "user"}
						</p>

						{/* Progress bar */}
						<div className="mt-3 pointer-events-auto">
							<div
								className={`flex items-center space-x-2 ${
									isMobile ? "text-xs" : "text-xs"
								}`}
							>
								<span className="min-w-max tabular-nums">
									{formatTime(currentTime)}
								</span>
								<div
									className="flex-1 h-1 bg-white bg-opacity-30 rounded-full overflow-hidden cursor-pointer touch-manipulation"
									onClick={handleProgressClick}
									role="progressbar"
									aria-valuenow={progress}
									aria-valuemin={0}
									aria-valuemax={100}
								>
									<div
										className="h-full bg-white transition-all duration-100"
										style={{ width: `${progress}%` }}
									/>
								</div>
								<span className="min-w-max tabular-nums">
									{formatTime(duration)}
								</span>
							</div>
						</div>
					</div>
				)}

				{/* Top Controls - Desktop only */}
				{showControls && !hideControls && !isMobile && (
					<div className="absolute top-4 right-4 z-20">
						<button
							onClick={(e) => {
								e.stopPropagation();
								toggleFullscreen();
							}}
							className="p-2 bg-gray-800/60 rounded-full text-white hover:bg-gray-700/80 active:scale-95 transition-all backdrop-blur-sm"
							aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
							title={
								isFullscreen ? "Exit fullscreen (Esc)" : "Enter fullscreen (F)"
							}
						>
							{isFullscreen ? (
								<Minimize className="w-5 h-5" />
							) : (
								<Maximize className="w-5 h-5" />
							)}
						</button>
					</div>
				)}
			</div>
		);
	}
);

DoomScrollVideoPlayer.displayName = "DoomScrollVideoPlayer";
