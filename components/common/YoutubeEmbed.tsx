"use client";
import React from "react";
import LiteYouTubeEmbed from "react-lite-youtube-embed";
import "react-lite-youtube-embed/dist/LiteYouTubeEmbed.css";
import { useMediaQuery } from "usehooks-ts";

type Props = {
	id: string;
	caption: string;
};

const YoutubeEmbed = ({ id, caption }: Props) => {
	const media = useMediaQuery("(max-width: 600px)");

	const mobile = media ? "320px" : "500px";
	return (
		<div className={`w-[${mobile}]`}>
			<LiteYouTubeEmbed id={id} title={caption} />
		</div>
	);
};

export default YoutubeEmbed;
