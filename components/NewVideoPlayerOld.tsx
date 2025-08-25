"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import {
	Play,
	Pause,
	Volume2,
	VolumeX,
	Maximize,
	Minimize,
} from "lucide-react";

interface VideoPlayerProps {
	videoId: string;
	poster?: string;
	autoPlay?: boolean;
	hideControls?: boolean; // New prop to hide controls
}
export const CustomVideoPlayer = ({
	videoId,
	poster,
	autoPlay = false,
	hideControls = false,
}: VideoPlayerProps) => {
	const videoRef = useRef<HTMLVideoElement>(null);
	const playerRef = useRef<HTMLDivElement>(null);
	const [isPlaying, setIsPlaying] = useState(autoPlay);
	const [progress, setProgress] = useState(0);
	const [volume, setVolume] = useState(1);
	const [isMuted, setIsMuted] = useState(false);
	const [isFullscreen, setIsFullscreen] = useState(false);
	const [showControls, setShowControls] = useState(!hideControls); // Controls visibility
	const [lastInteraction, setLastInteraction] = useState(Date.now());

	// Handle play/pause
	const togglePlay = useCallback(() => {
		if (!videoRef.current) return;
		if (isPlaying) {
			videoRef.current.pause();
		} else {
			videoRef.current
				.play()
				.catch((err) => console.error("Play failed:", err));
		}
		setIsPlaying(!isPlaying);
		setLastInteraction(Date.now());
	}, [isPlaying]);

	// Handle progress updates
	const handleTimeUpdate = useCallback(() => {
		if (!videoRef.current) return;
		const { currentTime, duration } = videoRef.current;
		if (duration > 0) {
			setProgress((currentTime / duration) * 100);
		}
	}, []);

	// Handle seeking
	const handleSeek = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
		if (!videoRef.current) return;
		const seekTime = (Number(e.target.value) / 100) * videoRef.current.duration;
		videoRef.current.currentTime = seekTime;
		setLastInteraction(Date.now());
	}, []);

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
		videoRef.current.muted = !isMuted;
		setIsMuted(!isMuted);
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
		setIsFullscreen(!isFullscreen);
		setLastInteraction(Date.now());
	}, [isFullscreen]);

	// Handle keyboard shortcuts
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (!videoRef.current) return;

			switch (e.key) {
				case " ":
					togglePlay();
					break;
				case "m":
					toggleMute();
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
				case "ArrowUp":
					videoRef.current.volume = Math.min(1, videoRef.current.volume + 0.1);
					setVolume(videoRef.current.volume);
					break;
				case "ArrowDown":
					videoRef.current.volume = Math.max(0, videoRef.current.volume - 0.1);
					setVolume(videoRef.current.volume);
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
		const handleMouseMove = () => {
			setShowControls(true);
			setLastInteraction(Date.now());
		};

		const checkInactivity = () => {
			if (Date.now() - lastInteraction > 3000 && isPlaying) {
				setShowControls(false);
			}
		};

		const interval = setInterval(checkInactivity, 1000);
		document.addEventListener("mousemove", handleMouseMove);

		return () => {
			clearInterval(interval);
			document.removeEventListener("mousemove", handleMouseMove);
		};
	}, [lastInteraction, isPlaying]);

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

	return (
		<div
			ref={playerRef}
			className="relative flex flex-col justify-center items-center w-full max-w-full bg-black rounded-lg overflow-hidden group"
			onMouseEnter={() => setShowControls(true)}
			onMouseLeave={() => {
				if (isPlaying) {
					setShowControls(false);
				}
			}}
		>
			<video
				ref={videoRef}
				className="w-full cursor-pointer"
				src={`/api/rooter/work/get-chuck/${videoId}`}
				poster={poster}
				onClick={togglePlay}
				onTimeUpdate={handleTimeUpdate}
				onEnded={() => setIsPlaying(false)}
				onPlay={() => setIsPlaying(true)}
				onPause={() => setIsPlaying(false)}
				autoPlay={autoPlay}
				playsInline
				preload="metadata"
			>
				Your browser does not support the video tag.
			</video>

			{/* Play/Pause overlay */}
			{!isPlaying && (
				<div
					className="absolute inset-0 flex items-center justify-center cursor-pointer"
					onClick={togglePlay}
				>
					<div className="p-4 bg-black bg-opacity-50 rounded-full">
						<Play className="w-12 h-12 text-white" />
					</div>
				</div>
			)}

			{/* Controls overlay */}
			{showControls && !hideControls && (
				<div
					className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 transition-opacity duration-300 opacity-100`}
				>
					{/* Progress bar */}
					<div className="flex items-center mb-2">
						<input
							type="range"
							min="0"
							max="100"
							value={progress}
							onChange={handleSeek}
							className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
						/>
					</div>

					{/* Bottom controls */}
					<div className="flex items-center justify-between">
						<div className="flex items-center space-x-4">
							<button
								onClick={togglePlay}
								className="text-white hover:text-gray-300 transition-colors"
								aria-label={isPlaying ? "Pause" : "Play"}
							>
								{isPlaying ? (
									<Pause className="w-5 h-5" />
								) : (
									<Play className="w-5 h-5" />
								)}
							</button>

							<div className="flex items-center">
								<button
									onClick={toggleMute}
									className="text-white hover:text-gray-300 transition-colors mr-2"
									aria-label={isMuted ? "Unmute" : "Mute"}
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
			)}
		</div>
	);
};
