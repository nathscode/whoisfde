"use client";

import Link from "next/link";
import { useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Reveal from "@/components/Reveal";
import TabController from "@/components/util/tab-controller";
import ContentCard from "@/components/work/ContentCard";
import { ContentSkeleton } from "@/components/skeletons/ContentSkeleton";
import { Play } from "lucide-react";

/* ------------------------------------------------------------------ */
/* Types                                                              */
/* ------------------------------------------------------------------ */
interface WorkData {
	id: string;
	caption: string;
	workType: string;
	links: string | null;
	workFiles: { id: string; url: string }[];
	thumbnail?: string;
	poster?: string;
}

const WORK_TYPES = [
	{ key: "Brands", display: "BRAND ADS", title: "Brand Ads" },
	{ key: "Events", display: "EVENTS", title: "Events" },
	{ key: "Personal", display: "PERSONAL PROJECTS", title: "Personal Projects" },
	{ key: "Estate", display: "REAL ESTATE", title: "Real Estate" },
	{ key: "Wedding", display: "WEDDINGS", title: "Wedding" },
	{ key: "Stills", display: "STILLS", title: "Frozen in times (Stills)" },
] as const;

/* ------------------------------------------------------------------ */
/* Hook: fetch **one** work-type                                      */
/* ------------------------------------------------------------------ */
const useWorkByType = (workType: string) =>
	useQuery<WorkData[]>({
		queryKey: ["work", workType],
		queryFn: async () => {
			const { data } = await axios.get("/api/rooter/work", {
				params: { workType },
			});
			return data;
		},
		staleTime: 5 * 60 * 1000,
		gcTime: 10 * 60 * 1000,
		refetchOnWindowFocus: false,
		retry: 2,
	});

/* ------------------------------------------------------------------ */
/* Tab-panel component                                                */
/* ------------------------------------------------------------------ */
const TabPanel = ({
	workType,
	displayName,
}: {
	workType: string;
	displayName: string;
}) => {
	const { data, isPending, error } = useWorkByType(workType);

	if (isPending)
		return (
			<div className="flex flex-col sm:flex-row justify-start max-w-full gap-4 my-5">
				{Array.from({ length: 4 }).map((_, i) => (
					<div key={i} className="flex flex-col w-full justify-start">
						<ContentSkeleton />
					</div>
				))}
			</div>
		);

	if (error)
		return (
			<div className="flex flex-col justify-center items-center my-5">
				<div className="text-red-600 text-center">
					<p>Error retrieving {displayName}</p>
					<button
						onClick={() => window.location.reload()}
						className="mt-2 px-4 py-2 bg-red-100 text-red-800 rounded hover:bg-red-200 transition-colors"
					>
						Retry
					</button>
				</div>
			</div>
		);

	if (!data || data.length === 0)
		return (
			<div className="flex flex-col justify-center items-center my-5">
				<div className="text-gray-500 text-center">
					<p>No {displayName} Yet</p>
					<p className="text-sm mt-1">Check back later for updates</p>
				</div>
			</div>
		);

	return (
		<div className="flex flex-col w-full py-4">
			<div className="flex justify-between items-center h-full w-full mb-4">
				<div className="justify-start">
					<h1 className="font-heading leading-none font-bold text-2xl">
						{displayName}
					</h1>
				</div>
				<div className="justify-end">
					<Link
						href={`/doomscroll`}
						className="inline-flex justify-center items-center text-sm font-semibold border border-black px-3 py-2 rounded-full hover:bg-black hover:text-white transition-all duration-200"
					>
						<span>Doomscroll</span>

						<Play className="inline-block ml-2 h-4 w-4" />
					</Link>
				</div>
			</div>
			<ContentCard data={data} />
		</div>
	);
};

/* ------------------------------------------------------------------ */
/* Main component                                                     */
/* ------------------------------------------------------------------ */
export default function Works() {
	const [activeIndex, setActiveIndex] = useState(0);
	const activeWorkType = WORK_TYPES[activeIndex];

	const handleTabPress = useCallback((index: number) => {
		setActiveIndex(index);
	}, []);

	return (
		<div className="py-20 h-full">
			<div className="px-2 lg:px-[150px] xl:px-[250px]">
				<Reveal>
					<div className="font-heading text-[33px] sm:text-4xl font-semibold">
						MY WORKS
					</div>
				</Reveal>

				<div className="my-8 text-[10.5px] sm:text-[14px] md:text-[18px]">
					{/* Tab bar -------------------------------------------------- */}
					<TabController
						elementsStyle="flex justify-start space-x-5 items-center mb-1"
						activeElementColor="#4159AD"
						indicatorColor="#4159AD"
						railColor="#eeeeee"
						onTabPress={handleTabPress}
					>
						{WORK_TYPES.map((wt) => (
							<div
								key={wt.key}
								className="text-sm uppercase whitespace-nowrap font-medium cursor-pointer transition-colors hover:text-blue-600"
							>
								{wt.display}
							</div>
						))}
					</TabController>

					{/* Videos for the active tab only --------------------------- */}
					<TabPanel
						workType={activeWorkType.key}
						displayName={activeWorkType.title}
					/>
				</div>

				<div className="flex justify-end gap-2 items-center mt-4 md:mt-6">
					<Link
						href="/package"
						className="flex justify-center w-fit px-10 py-3 mt-4 text-sm font-semibold text-white bg-black border border-black rounded active:text-gray-500 hover:bg-transparent hover:text-black focus:outline-none focus:ring transition-all duration-200"
					>
						View Packages
					</Link>
				</div>
			</div>
		</div>
	);
}
