"use client";
import { getValueAfterYoutuBe } from "@/lib/utils";
import React from "react";
import { useMediaQuery } from "usehooks-ts";
import YoutubeEmbed from "../common/YoutubeEmbed";
import Image from "next/image";
import { VideoPlayer } from "../VideoPlayer";
import NewVideoPlayer from "../NewVideoPlayer";

type Props = {
	data: any;
};

const ContentCard = ({ data }: Props) => {
	const media = useMediaQuery("(max-width: 600px)");

	const mobile = media ? "320px" : "500px";

	return (
		<div className="flex flex-col flex-wrap justify-center md:justify-start  gap-4 md:flex-row md:gap-5">
			{data &&
				data.map((party: any) => (
					<div key={party.id} className="w-full md:w-1/3">
						{party.links ? (
							<YoutubeEmbed
								id={getValueAfterYoutuBe(party.links)!}
								caption={party.captions}
							/>
						) : party.workFiles[0] ? (
							<NewVideoPlayer
								videoUrl={party.workFiles[0].url!}
								width={mobile}
							/>
						) : (
							<Image
								src={"/images/logo/logo-question.png"}
								className="object-fill"
								alt="who image"
								height={50}
								width={80}
							/>
						)}
						<h2 className="font-semibold text-lg text-neutral-700 my-4">
							{party.caption}
						</h2>
					</div>
				))}
		</div>
	);
};

export default ContentCard;
