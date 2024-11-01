"use client";
import { useEffect, useRef, useState } from "react";
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

	useEffect(() => {
		const videoElement = videoRef.current;

		if (!videoElement) return;

		const handleError = () => {
			setError("Failed to load video. Please try again later.");
			setIsLoading(false);
		};

		const handleLoadStart = () => {
			setIsLoading(true);
			setError(null);
		};

		const handleLoadedData = () => {
			setIsLoading(false);
		};

		videoElement.addEventListener("error", handleError);
		videoElement.addEventListener("loadstart", handleLoadStart);
		videoElement.addEventListener("loadeddata", handleLoadedData);

		if (videoElement.src !== videoUrl) {
			videoElement.src = videoUrl; // Set the source only if it's different
			videoElement.load(); // Load the new video
		}

		return () => {
			videoElement.removeEventListener("error", handleError);
			videoElement.removeEventListener("loadstart", handleLoadStart);
			videoElement.removeEventListener("loadeddata", handleLoadedData);
		};
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
				<source src={videoUrl} type="video/mp4" />
				Your browser does not support the video tag.
			</video>
		</div>
	);
};

// className="w-full h-auto max-w-full"
