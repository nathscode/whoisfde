import React from "react";
import { getFilenameFromUrl } from "./util/getVideoId";
import ReactPlayer from "react-player/lazy";

interface VideoPlayerProps {
	videoUrl: string;
	width?: number | string;
	height?: number | string;
	className?: string;
}

const NewVideoPlayer = ({ videoUrl, width, height }: VideoPlayerProps) => {
	const videoId = getFilenameFromUrl(videoUrl);
	return (
		<>
			<ReactPlayer
				controls
				playing
				width={width}
				height={height}
				style={{ width: "100%", height: "auto", maxWidth: "100%" }}
				url={`/api/video/${videoId}`}
			/>
		</>
	);
};

export default NewVideoPlayer;
