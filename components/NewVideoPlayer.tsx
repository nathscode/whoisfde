import React, { useMemo } from "react";
import { getFilenameFromUrl } from "./util/getVideoId";
import ReactPlayer from "react-player/lazy";

interface VideoPlayerProps {
	videoUrl: string;
	width?: number | string;
	height?: number | string;
	className?: string;
}

const NewVideoPlayer = React.memo(
	({
		videoUrl,
		width = "100%",
		height = "auto",
		className,
	}: VideoPlayerProps) => {
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

		return (
			<ReactPlayer
				controls
				playing={false}
				width={width}
				height={height}
				style={{ maxWidth: "100%", height: "auto" }}
				url={apiUrl}
				className={className}
				onBuffer={() => console.log("Buffering...")}
				onBufferEnd={() => console.log("Buffering ended")}
			/>
		);
	}
);

export default NewVideoPlayer;
