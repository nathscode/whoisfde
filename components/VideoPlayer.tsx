"use client";
import { useEffect, useRef, useState } from "react";
import { getFilenameFromUrl } from "./util/getVideoId";
import Loading from "@/app/loading";

interface VideoPlayerProps {
	videoUrl: string;
	width?: number | string;
	height?: number | string;
	className?: string;
}

export const VideoPlayer = ({
	videoUrl,
	width = 320,
	height = 240,
	className = "",
}: VideoPlayerProps) => {
	const videoRef = useRef<HTMLVideoElement | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	const videoId = getFilenameFromUrl(videoUrl);

	useEffect(() => {
		const videoElement = videoRef.current;

		if (videoElement) {
			const handleError = (e: ErrorEvent) => {
				console.error("Video loading error:", e);
				setError("Failed to load video");
			};

			const handleLoadStart = () => {
				setIsLoading(true);
				setError(null);
			};

			const handleLoadedData = () => {
				setIsLoading(false);
			};

			// Add event listeners
			videoElement.addEventListener("error", handleError as EventListener);
			videoElement.addEventListener("loadstart", handleLoadStart);
			videoElement.addEventListener("loadeddata", handleLoadedData);

			// Reset video when URL changes
			videoElement.pause();
			videoElement.removeAttribute("src");
			videoElement.load();

			// Cleanup event listeners
			return () => {
				videoElement.removeEventListener("error", handleError as EventListener);
				videoElement.removeEventListener("loadstart", handleLoadStart);
				videoElement.removeEventListener("loadeddata", handleLoadedData);
			};
		}
	}, [videoUrl]);

	if (error) {
		return <div className="text-red-500">Error: {error}</div>;
	}

	return (
		<div className={`relative ${className}`}>
			{isLoading && (
				<div className="absolute inset-0 flex items-center justify-center bg-gray-100">
					<Loading />
				</div>
			)}
			<video
				ref={videoRef}
				width={width}
				height={height}
				controls
				className="w-full h-auto max-w-full"
			>
				<source src={`/api/video/${videoId}`} type="video/mp4" />
				Your browser does not support the video tag.
			</video>
		</div>
	);
};
