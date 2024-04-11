"use client";
import { apiClient } from "@/lib/constants";
import { getValueAfterYoutuBe } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import YoutubeEmbed from "../common/YoutubeEmbed";
import { ContentSkeleton } from "../skeletons/ContentSkeleton";
import axios from "axios";

type Props = {};

const GeneralContent = (props: Props) => {
	const generalContentData = () => {
		return axios
			.get("/api/work/", {
				params: {
					workType: "Contents",
				},
			})
			.then((response) => {
				return response.data;
			})
			.catch((error) => {
				console.error(error);
				throw error;
			});
	};

	const { isPending, data, error } = useQuery({
		queryKey: ["generalContentData"],
		queryFn: generalContentData,
	});
	if (isPending) {
		return (
			<div className="flex flex-col sm:flex-row justify-start max-w-full gap-4 my-5">
				{Array.from({ length: 4 }).map((_, i) => (
					<div key={i} className="flex flex-col w-full justify-start">
						<ContentSkeleton />
					</div>
				))}
			</div>
		);
	}
	if (!data || data.length === 0) {
		return (
			<div className="flex flex-col justify-center items-center my-5">
				No Contents Uploads Yet
			</div>
		);
	}

	return (
		<div className="flex flex-col w-full py-4">
			<h1 className="font-heading text-2xl mb-4">Contents</h1>
			<div className="flex justify-center sm:items-center gap-1 flex-row sm:gap-2">
				{data &&
					data.map((party: any) => (
						<div key={party.id} className="flex flex-col gap-1 sm:gap-2">
							{party.links ? (
								<YoutubeEmbed
									id={getValueAfterYoutuBe(party.links)!}
									caption={party.captions}
								/>
							) : (
								<video controls width={"500px"}>
									<source src={party.workFiles[0].url!} type={`video/mp4`} />
									Your browser does not support the video tag.
								</video>
							)}
						</div>
					))}
			</div>
		</div>
	);
};

export default GeneralContent;
