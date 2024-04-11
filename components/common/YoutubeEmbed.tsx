"use client";
import React from "react";
import LiteYouTubeEmbed from "react-lite-youtube-embed";
import "react-lite-youtube-embed/dist/LiteYouTubeEmbed.css";

type Props = {
	id: string;
	caption: string;
};

const YoutubeEmbed = ({ id, caption }: Props) => {
	return (
		<div className="w-[500px]">
			<LiteYouTubeEmbed id={id} title={caption} />
		</div>
	);
};

export default YoutubeEmbed;
