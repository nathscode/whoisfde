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
			const handleError = (e: Event) => {
				const errorDetails = videoElement.error;
				console.error("Video loading error:", errorDetails);
				setError("Failed to load video. Please try again later.");
			};

			const handleLoadStart = () => {
				setIsLoading(true);
				setError(null);
			};

			const handleLoadedData = () => {
				setIsLoading(false);
			};

			// Add event listeners
			videoElement.addEventListener("error", handleError);
			videoElement.addEventListener("loadstart", handleLoadStart);
			videoElement.addEventListener("loadeddata", handleLoadedData);

			// Load the video
			videoElement.pause();
			videoElement.src = `/api/video/${videoId}`;
			videoElement.load();

			// Cleanup event listeners
			return () => {
				videoElement.removeEventListener("error", handleError);
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
				Your browser does not support the video tag.
			</video>
		</div>
	);
};
