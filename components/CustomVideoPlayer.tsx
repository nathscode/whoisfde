"use client";
import React, { useRef, useEffect, useMemo } from "react";
import { getFilenameFromUrl } from "./util/getVideoId";
interface CustomVideoPlayerProps {
	videoUrl: string; // The URL of the video
	width?: number | string; // Optional width
	height?: number | string; // Optional height
}

const CustomVideoPlayer: React.FC<CustomVideoPlayerProps> = ({
	videoUrl,
	width = "100%",
	height = "auto",
}) => {
	const videoRef = useRef<HTMLVideoElement>(null);

	// Extract video ID from the URL
	const videoId = getFilenameFromUrl(videoUrl);

	// Memoize the API URL based on the environment
	const apiUrl = useMemo(() => {
		if (!videoId) return "";
		const isProduction = process.env.NODE_ENV === "production";
		return isProduction
			? `https://www.whoisfde.com/api/video/${videoId}`
			: `/api/video/${videoId}`;
	}, [videoId]);

	// Early return if videoId is not valid
	if (!videoId) {
		return <div>Error: Invalid video URL.</div>;
	}

	// Function to fetch video data with Range header
	const fetchVideo = async (start: number, end?: number): Promise<void> => {
		try {
			const response = await fetch(apiUrl, {
				// Use apiUrl instead of videoUrl
				headers: {
					Range: `bytes=${start}${end !== undefined ? `-${end}` : ""}`,
				},
			});

			if (response.status === 206) {
				// Partial content
				const blob = await response.blob();
				const url = URL.createObjectURL(blob);
				if (videoRef.current) {
					videoRef.current.src = url;
					videoRef.current.pause();
				}
			} else {
				console.error("Failed to fetch video:", response.statusText);
			}
		} catch (error: any) {
			console.error("Error fetching video:", error);
			if (error.name === "AbortError") {
				console.log("Fetch aborted");
			}
		}
	};

	useEffect(() => {
		// Initial fetch for the first range
		fetchVideo(0);

		// Cleanup on unmount
		return () => {
			if (videoRef.current) {
				URL.revokeObjectURL(videoRef.current.src);
			}
		};
	}, [apiUrl]); // Depend on apiUrl

	const handleSeek = async (event: React.SyntheticEvent<HTMLVideoElement>) => {
		const target = event.target as HTMLVideoElement;
		const seekTime = target.currentTime; // Get current time in seconds

		// Convert time to byte range (assuming 1 second == X bytes)
		const bytesPerSecond = 1000000; // Placeholder; adjust based on your video's actual bitrate
		const startByte = Math.floor(seekTime * bytesPerSecond);

		// Fetch the new range based on the seek time
		await fetchVideo(startByte);
	};

	return (
		<video
			ref={videoRef}
			controls
			width={width}
			height={height}
			onSeeked={handleSeek} // Handle seeking
			style={{ maxWidth: "100%", height: "auto" }}
		>
			<p>Your browser does not support HTML5 video.</p>
		</video>
	);
};

export default CustomVideoPlayer;
