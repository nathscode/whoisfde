"use client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { ContentSkeleton } from "../skeletons/ContentSkeleton";
import ContentCard from "./ContentCard";

type Props = {};

const GeneralContent = (props: Props) => {
	const generalContentData = () => {
		return axios
			.get("/api/rooter/work/", {
				params: {
					workType: "Personal",
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

	if (error) {
		return (
			<div className="flex flex-col justify-center items-center my-5">
				Error retrieving Content Uploads
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
			<ContentCard data={data} />
		</div>
	);
};

export default GeneralContent;
