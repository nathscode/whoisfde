"use client";
import { getValueAfterYoutuBe } from "@/lib/utils";
import React from "react";
import { useMediaQuery } from "usehooks-ts";
import YoutubeEmbed from "../common/YoutubeEmbed";
import Image from "next/image";

type Props = {
	data: any;
};

const ContentCard = ({ data }: Props) => {
	const media = useMediaQuery("(max-width: 600px)");

	const mobile = media ? "320px" : "500px";

	console.log(data);
	return (
		<div className="flex flex-col justify-center  gap-4 sm:flex-row sm:gap-2">
			{data &&
				data.map((party: any) => (
					<div key={party.id} className="w-full md:w-1/2">
						{party.links ? (
							<YoutubeEmbed
								id={getValueAfterYoutuBe(party.links)!}
								caption={party.captions}
							/>
						) : party.workFiles[0] ? (
							<video controls width={mobile}>
								<source src={party.workFiles[0].url!} type={`video/mp4`} />
								Your browser does not support the video tag.
							</video>
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
