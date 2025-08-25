"use client";

import { useFullscreenScrollFix } from "@/hooks/use-body-scroll-lock";
import { Maximize, Minimize, Play, Volume2, VolumeX } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

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

export const DoomScrollVideoPlayer = ({
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

	const [isPlaying, setIsPlaying] = useState(false);
	const [progress, setProgress] = useState(0);
	const [volume, setVolume] = useState(1);
	const [isMuted, setIsMuted] = useState(true);
	const [isFullscreen, setIsFullscreen] = useState(false);
	const [showControls, setShowControls] = useState(!hideControls);
	const [isLoading, setIsLoading] = useState(true);
	const [duration, setDuration] = useState(0);
	const [currentTime, setCurrentTime] = useState(0);
	const [isMobile, setIsMobile] = useState(false);
	const [hasEnded, setHasEnded] = useState(false);

	// Use the custom fullscreen scroll fix hook
	const {
		saveScrollPosition,
		restoreScrollPosition,
		isFullscreen: hookIsFullscreen,
	} = useFullscreenScrollFix({
		preventScrollJump: true,
		restoreOnExit: true,
		disableBodyScroll: true,
	});

	// Detect mobile device
	useEffect(() => {
		const checkMobile = () => {
			setIsMobile(window.innerWidth < 768);
		};

		checkMobile();
		window.addEventListener("resize", checkMobile);

		return () => window.removeEventListener("resize", checkMobile);
	}, []);

	// Handle play/pause
	const togglePlay = useCallback(() => {
		if (!videoRef.current) return;

		if (isPlaying) {
			videoRef.current.pause();
		} else {
			// Reset if video has ended
			if (hasEnded) {
				videoRef.current.currentTime = 0;
				setHasEnded(false);
				setProgress(0);
			}

			// Unmute when user explicitly plays
			if (isMuted) {
				videoRef.current.muted = false;
				setIsMuted(false);
			}
			videoRef.current
				.play()
				.catch((err) => console.error("Play failed:", err));
		}
	}, [isPlaying, isMuted, hasEnded]);

	// Handle progress updates
	const handleTimeUpdate = useCallback(() => {
		if (!videoRef.current) return;
		const { currentTime, duration } = videoRef.current;
		if (duration > 0) {
			setProgress((currentTime / duration) * 100);
			setCurrentTime(currentTime);
			setDuration(duration);
		}
	}, []);

	// Handle video ended
	const handleVideoEnded = useCallback(() => {
		console.log("Video ended - calling onVideoEnd callback");
		setIsPlaying(false);
		setHasEnded(true);
		setProgress(100);

		setTimeout(() => {
			onVideoEnd?.();
		}, 100);
	}, [onVideoEnd]);

	// Handle seeking via progress bar click
	const handleProgressClick = useCallback(
		(e: React.MouseEvent<HTMLDivElement>) => {
			if (!videoRef.current) return;
			e.stopPropagation();

			const rect = e.currentTarget.getBoundingClientRect();
			const clickX = e.clientX - rect.left;
			const progressWidth = rect.width;
			const clickPercent = (clickX / progressWidth) * 100;
			const seekTime = (clickPercent / 100) * videoRef.current.duration;

			videoRef.current.currentTime = seekTime;
			setHasEnded(false);
		},
		[]
	);

	// Toggle mute
	const toggleMute = useCallback(() => {
		if (!videoRef.current) return;
		const newMutedState = !isMuted;
		videoRef.current.muted = newMutedState;
		setIsMuted(newMutedState);
	}, [isMuted]);

	// Format time display
	const formatTime = (time: number): string => {
		if (isNaN(time)) return "0:00";
		const minutes = Math.floor(time / 60);
		const seconds = Math.floor(time % 60);
		return `${minutes}:${seconds.toString().padStart(2, "0")}`;
	};

	// Toggle fullscreen with the hook's scroll management
	const toggleFullscreen = useCallback(async () => {
		if (!playerRef.current) return;

		try {
			if (!document.fullscreenElement) {
				// Save scroll position before entering fullscreen
				saveScrollPosition();
				await playerRef.current.requestFullscreen();
			} else {
				// Exit fullscreen - the hook will handle scroll restoration
				await document.exitFullscreen();
			}
		} catch (err) {
			console.error("Fullscreen error:", err);
		}
	}, [saveScrollPosition]);

	// Handle video playing based on isActive prop
	useEffect(() => {
		if (!videoRef.current) return;

		if (isActive && autoPlay && !hasEnded) {
			videoRef.current.play().catch((err) => {
				console.error("Auto-play failed:", err);
			});
		} else if (!isActive) {
			videoRef.current.pause();
		}
	}, [isActive, autoPlay, hasEnded]);

	// Reset video state when videoId changes
	useEffect(() => {
		setHasEnded(false);
		setProgress(0);
		setCurrentTime(0);
		setIsPlaying(false);
	}, [videoId]);

	// Handle mouse movement for controls visibility (desktop only)
	useEffect(() => {
		if (hideControls || isMobile) return;

		let hideTimeout: NodeJS.Timeout;

		const handleMouseMove = () => {
			setShowControls(true);

			if (hideTimeout) clearTimeout(hideTimeout);

			hideTimeout = setTimeout(() => {
				if (isPlaying && !hasEnded) {
					setShowControls(false);
				}
			}, 3000);
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
	}, [isPlaying, hideControls, isMobile, hasEnded]);

	// Update fullscreen state from hook
	useEffect(() => {
		setIsFullscreen(hookIsFullscreen);
	}, [hookIsFullscreen]);

	// Handle keyboard shortcuts
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (!isActive || !videoRef.current) return;

			switch (e.key) {
				case " ":
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
				case "Escape":
					if (document.fullscreenElement) {
						e.preventDefault();
						document.exitFullscreen();
					}
					break;
				default:
					return;
			}
		};

		if (isActive && !isMobile) {
			document.addEventListener("keydown", handleKeyDown);
		}

		return () => document.removeEventListener("keydown", handleKeyDown);
	}, [isActive, togglePlay, toggleMute, toggleFullscreen, isMobile]);

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
				onWaiting={() => setIsLoading(true)}
				onCanPlay={() => setIsLoading(false)}
				muted={isMuted}
				playsInline
				preload="metadata"
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
				<div className="absolute inset-0 flex items-center justify-center z-20">
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
				<div className="absolute inset-0 flex items-center justify-center z-25 bg-black bg-opacity-30">
					<div className="text-center text-white">
						<div className="p-4 bg-black bg-opacity-70 rounded-full backdrop-blur-sm mb-4">
							<Play
								className={`${isMobile ? "w-12 h-12" : "w-16 h-16"} text-white`}
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
				<div className="absolute inset-0 flex items-center justify-center z-20">
					<div
						className={`${
							isMobile ? "w-6 h-6" : "w-8 h-8"
						} border-2 border-white border-t-transparent rounded-full animate-spin`}
					></div>
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
					className="p-3 bg-gray-800/50 bg-opacity-60 rounded-full text-white hover:bg-opacity-80 transition-all backdrop-blur-sm"
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
					} text-white z-20`}
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
					<div className="mt-3">
						<div
							className={`flex items-center space-x-2 ${
								isMobile ? "text-xs" : "text-xs"
							}`}
						>
							<span className="min-w-max">{formatTime(currentTime)}</span>
							<div
								className="flex-1 h-1 bg-white bg-opacity-30 rounded-full overflow-hidden cursor-pointer"
								onClick={handleProgressClick}
							>
								<div
									className="h-full bg-white transition-all duration-100"
									style={{ width: `${progress}%` }}
								/>
							</div>
							<span className="min-w-max">{formatTime(duration)}</span>
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
						className="p-2 bg-gray-800 bg-opacity-60 rounded-full text-white hover:bg-opacity-80 transition-all backdrop-blur-sm"
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
};
