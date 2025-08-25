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

export const HomeVideoPlayer = ({
	videoId,
	poster,
	autoPlay = false,
	className = "",
}: VideoPlayerProps) => {
	const videoRef = useRef<HTMLVideoElement>(null);
	const playerRef = useRef<HTMLDivElement>(null);
	const [isPlaying, setIsPlaying] = useState(autoPlay);
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

	// Format time for display
	const formatTime = (time: number): string => {
		if (isNaN(time)) return "0:00";
		const minutes = Math.floor(time / 60);
		const seconds = Math.floor(time % 60);
		return `${minutes}:${seconds.toString().padStart(2, "0")}`;
	};

	// Handle play/pause
	const togglePlay = useCallback(async () => {
		if (!videoRef.current) return;

		try {
			setError(null);
			if (isPlaying) {
				videoRef.current.pause();
			} else {
				setIsLoading(true);
				await videoRef.current.play();
			}
		} catch (err: any) {
			console.error("Play failed:", err);
			setError("Failed to play video. Please try again.");
		} finally {
			setIsLoading(false);
		}
		setLastInteraction(Date.now());
	}, [isPlaying]);

	// Handle progress updates
	const handleTimeUpdate = useCallback(() => {
		if (!videoRef.current) return;
		const { currentTime, duration, buffered } = videoRef.current;

		if (duration > 0) {
			setProgress((currentTime / duration) * 100);
			setCurrentTime(currentTime);
			setDuration(duration);
		}

		// Update buffered progress
		if (buffered.length > 0) {
			const bufferedEnd = buffered.end(buffered.length - 1);
			setBuffered((bufferedEnd / duration) * 100);
		}
	}, []);

	// Handle seeking via input change
	const handleSeek = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
		if (!videoRef.current) return;
		const seekTime = (Number(e.target.value) / 100) * videoRef.current.duration;
		videoRef.current.currentTime = seekTime;
		setLastInteraction(Date.now());
	}, []);

	// Handle seeking via click on progress bar
	const handleProgressClick = useCallback(
		(e: React.MouseEvent<HTMLDivElement>) => {
			if (!videoRef.current) return;
			const rect = e.currentTarget.getBoundingClientRect();
			const clickX = e.clientX - rect.left;
			const progressWidth = rect.width;
			const clickPercent = (clickX / progressWidth) * 100;
			const seekTime = (clickPercent / 100) * videoRef.current.duration;

			videoRef.current.currentTime = seekTime;
			setProgress(clickPercent);
			setLastInteraction(Date.now());
		},
		[]
	);

	// Handle volume changes
	const handleVolumeChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			if (!videoRef.current) return;
			const newVolume = Number(e.target.value);
			videoRef.current.volume = newVolume;
			setVolume(newVolume);
			setIsMuted(newVolume === 0);
			setLastInteraction(Date.now());
		},
		[]
	);

	// Toggle mute
	const toggleMute = useCallback(() => {
		if (!videoRef.current) return;
		const newMutedState = !isMuted;
		videoRef.current.muted = newMutedState;
		setIsMuted(newMutedState);
		setLastInteraction(Date.now());
	}, [isMuted]);

	// Toggle fullscreen
	const toggleFullscreen = useCallback(() => {
		if (!playerRef.current) return;
		if (!document.fullscreenElement) {
			playerRef.current.requestFullscreen().catch((err) => {
				console.error("Fullscreen error:", err);
			});
		} else {
			document.exitFullscreen();
		}
		setLastInteraction(Date.now());
	}, []);

	// Retry loading video
	const retryVideo = useCallback(() => {
		if (!videoRef.current) return;
		setError(null);
		setIsLoading(true);
		videoRef.current.load();
	}, []);

	// Handle keyboard shortcuts
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
					toggleMute();
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
					e.preventDefault();
					const newVolumeUp = Math.min(1, videoRef.current.volume + 0.1);
					videoRef.current.volume = newVolumeUp;
					setVolume(newVolumeUp);
					setIsMuted(false);
					break;
				case "ArrowDown":
					e.preventDefault();
					const newVolumeDown = Math.max(0, videoRef.current.volume - 0.1);
					videoRef.current.volume = newVolumeDown;
					setVolume(newVolumeDown);
					if (newVolumeDown === 0) setIsMuted(true);
					break;
				default:
					return;
			}
			setLastInteraction(Date.now());
		};

		document.addEventListener("keydown", handleKeyDown);
		return () => document.removeEventListener("keydown", handleKeyDown);
	}, [togglePlay, toggleMute, toggleFullscreen]);

	// Handle mouse movement for controls visibility
	useEffect(() => {
		let hideTimeout: NodeJS.Timeout;

		const handleMouseMove = () => {
			setShowControls(true);
			setLastInteraction(Date.now());

			if (hideTimeout) clearTimeout(hideTimeout);

			if (isPlaying) {
				hideTimeout = setTimeout(() => {
					setShowControls(false);
				}, 3000);
			}
		};

		const handleMouseEnter = () => {
			setShowControls(true);
			if (hideTimeout) clearTimeout(hideTimeout);
		};

		const handleMouseLeave = () => {
			if (isPlaying) {
				hideTimeout = setTimeout(() => {
					setShowControls(false);
				}, 1000);
			}
		};

		const playerElement = playerRef.current;
		if (playerElement) {
			playerElement.addEventListener("mousemove", handleMouseMove);
			playerElement.addEventListener("mouseenter", handleMouseEnter);
			playerElement.addEventListener("mouseleave", handleMouseLeave);
		}

		return () => {
			if (hideTimeout) clearTimeout(hideTimeout);
			if (playerElement) {
				playerElement.removeEventListener("mousemove", handleMouseMove);
				playerElement.removeEventListener("mouseenter", handleMouseEnter);
				playerElement.removeEventListener("mouseleave", handleMouseLeave);
			}
		};
	}, [isPlaying]);

	// Handle fullscreen changes
	useEffect(() => {
		const handleFullscreenChange = () => {
			setIsFullscreen(!!document.fullscreenElement);
			setShowControls(true);
			setLastInteraction(Date.now());
		};

		document.addEventListener("fullscreenchange", handleFullscreenChange);
		return () => {
			document.removeEventListener("fullscreenchange", handleFullscreenChange);
		};
	}, []);

	// Video event handlers
	const handleLoadStart = () => setIsLoading(true);
	const handleLoadedData = () => {
		setIsLoading(false);
		setError(null);
	};
	const handleWaiting = () => setIsLoading(true);
	const handleCanPlay = () => setIsLoading(false);
	const handleError = () => {
		setIsLoading(false);
		setError("Failed to load video");
	};

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
				onClick={togglePlay}
				onTimeUpdate={handleTimeUpdate}
				onEnded={() => setIsPlaying(false)}
				onPlay={() => setIsPlaying(true)}
				onPause={() => setIsPlaying(false)}
				onLoadStart={handleLoadStart}
				onLoadedData={handleLoadedData}
				onWaiting={handleWaiting}
				onCanPlay={handleCanPlay}
				onError={handleError}
				autoPlay={autoPlay}
				playsInline
				preload="metadata"
				controls={false}
			>
				Your browser does not support the video tag.
			</video>

			{/* Error overlay */}
			{error && (
				<div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-75">
					<p className="text-white text-lg mb-4">{error}</p>
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
			{!isPlaying && !isLoading && !error && (
				<div
					className="absolute inset-0 flex items-center justify-center cursor-pointer"
					onClick={togglePlay}
				>
					<div className="p-4 bg-black bg-opacity-50 rounded-full hover:bg-opacity-70 transition-colors">
						<Play className="w-12 h-12 text-white" />
					</div>
				</div>
			)}

			{/* Controls overlay */}
			<div
				className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent transition-opacity duration-300 ${
					showControls ? "opacity-100" : "opacity-0"
				}`}
				onMouseEnter={() => setShowControls(true)}
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
