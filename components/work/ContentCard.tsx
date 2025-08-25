"use client";

import { getYouTubeVideoId, isValidYouTubeId } from "@/lib/utils";
import React from "react";
import { useMediaQuery } from "usehooks-ts";
import YoutubeEmbed from "../common/YoutubeEmbed";
import Image from "next/image";
import { HomeVideoPlayer } from "./HomeVideoPlayer";

type Props = {
	data: any[];
};

const ContentCard = ({ data }: Props) => {
	const isMobile = useMediaQuery("(max-width: 768px)");

	if (!data || data.length === 0) {
		return (
			<div className="flex items-center justify-center p-8">
				<p className="text-gray-500">No content available</p>
			</div>
		);
	}

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
			{data.map((party: any) => {
				// Extract YouTube video ID if links exist
				const youtubeId = party.links ? getYouTubeVideoId(party.links) : null;
				const hasValidYoutubeId = youtubeId && isValidYouTubeId(youtubeId);

				return (
					<div key={party.id} className="flex flex-col space-y-3">
						{/* Media Content */}
						<div className="w-full">
							{party.links && hasValidYoutubeId ? (
								<YoutubeEmbed
									id={youtubeId}
									caption={party.caption || "Video"}
									useLite={true}
									className="shadow-sm"
								/>
							) : party.workFiles && party.workFiles[0] ? (
								<div className="aspect-video w-full">
									<HomeVideoPlayer
										videoId={party.workFiles[0].id}
										className="w-full h-full"
									/>
								</div>
							) : (
								<div className="aspect-video w-full bg-gray-100 rounded-lg flex items-center justify-center">
									<Image
										src="/images/logo/logo-question.png"
										className="object-contain opacity-50"
										alt="No content available"
										height={60}
										width={60}
									/>
								</div>
							)}
						</div>
					</div>
				);
			})}
		</div>
	);
};

export default ContentCard;
