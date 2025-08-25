import { getAllWorkVideos } from "@/actions/getAllWorkVideos";
import { Metadata } from "next";
import DoomScrollClient from "./DoomScrollClient";

export const metadata: Metadata = {
	title: "Doom Scroll - Vertical Video Experience",
	description:
		"Experience videos in a vertical scrolling format like TikTok and Instagram Reels",
};

const DoomScrollPage = async () => {
	const works = await getAllWorkVideos();

	return (
		<div className="relative w-full h-screen overflow-hidden">
			{/* Remove padding and margins that interfere with full-screen experience */}
			<DoomScrollClient works={works} />

			{/* Optional: Add a back button or navigation */}
			<div className="absolute top-4 left-4 z-30">
				<a
					href="/"
					className="flex items-center space-x-2 text-white bg-black bg-opacity-50 hover:bg-opacity-70 transition-all duration-200 px-3 py-2 rounded-full text-sm"
				>
					<svg
						className="w-4 h-4"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M15 19l-7-7 7-7"
						/>
					</svg>
					<span>Back</span>
				</a>
			</div>
		</div>
	);
};

export default DoomScrollPage;
