"use client";

import EmblaCarousel from "@/components/common/EmblaCarousel";
import { DoomScrollVideoPlayer } from "@/components/DoomScrollVideoPlayer";
import { SafeWorkExtras } from "@/types";
import React, { useState, useCallback, useEffect, useRef } from "react";

type Props = {
	works: SafeWorkExtras[] | [];
};

const DoomScrollClient = ({ works }: Props) => {
	const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
	const emblaApiRef = useRef<any>(null);
	const autoAdvanceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

	// Lock body scroll when component mounts
	useEffect(() => {
		// Store original body overflow
		const originalOverflow = document.body.style.overflow;
		const originalHeight = document.body.style.height;

		// Lock body scroll
		document.body.style.overflow = "hidden";
		document.body.style.height = "100vh";
		document.body.classList.add("doom-scroll-active");

		// Prevent scroll on touch devices
		const preventScroll = (e: TouchEvent) => {
			// Only prevent if it's not within the video player area
			const target = e.target as Element;
			if (!target.closest(".embla")) {
				e.preventDefault();
			}
		};

		// Add touch event listeners
		document.addEventListener("touchmove", preventScroll, { passive: false });

		return () => {
			// Restore original body overflow
			document.body.style.overflow = originalOverflow;
			document.body.style.height = originalHeight;
			document.body.classList.remove("doom-scroll-active");

			// Remove touch event listeners
			document.removeEventListener("touchmove", preventScroll);

			// Clear any pending auto-advance
			if (autoAdvanceTimeoutRef.current) {
				clearTimeout(autoAdvanceTimeoutRef.current);
			}
		};
	}, []);

	const handleSlideChange = useCallback((index: number) => {
		setCurrentVideoIndex(index);

		// Clear any pending auto-advance when user manually changes slides
		if (autoAdvanceTimeoutRef.current) {
			clearTimeout(autoAdvanceTimeoutRef.current);
			autoAdvanceTimeoutRef.current = null;
		}
	}, []);

	const handleVideoEnd = useCallback(() => {
		if (autoAdvanceTimeoutRef.current) {
			clearTimeout(autoAdvanceTimeoutRef.current);
		}

		autoAdvanceTimeoutRef.current = setTimeout(() => {
			if (currentVideoIndex < works.length - 1) {
				// Move to next video
				const nextIndex = currentVideoIndex + 1;
				setCurrentVideoIndex(nextIndex);

				// Use Embla API to scroll to next slide
				if (emblaApiRef.current) {
					emblaApiRef.current.scrollTo(nextIndex);
				}
			} else {
				setCurrentVideoIndex(0);
				if (emblaApiRef.current) {
					emblaApiRef.current.scrollTo(0);
				}
			}
		}, 500);
	}, [currentVideoIndex, works.length]);

	const handleEmblaInit = useCallback((emblaApi: any) => {
		emblaApiRef.current = emblaApi;
	}, []);

	if (!works || works.length === 0) {
		return (
			<div className="h-screen w-full bg-black flex items-center justify-center">
				<div className="text-white text-center">
					<h2 className="text-2xl font-bold mb-4">No videos available</h2>
					<p className="text-gray-400">Check back later for new content</p>
				</div>
			</div>
		);
	}

	return (
		<div className="flex flex-col items-center bg-black overflow-hidden justify-center w-full h-full">
			<div className="h-screen w-full sm:w-[500px] bg-black overflow-hidden relative">
				<EmblaCarousel
					onSlideChange={handleSlideChange}
					onInit={handleEmblaInit}
				>
					{works.map((work, index) => {
						// Only render video player if work has files
						if (!work.workFiles || work.workFiles.length === 0) {
							return (
								<div
									key={work.id}
									className="h-full w-full flex items-center justify-center bg-gray-900"
								>
									<div className="text-center text-white px-4">
										<div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-700 flex items-center justify-center">
											<svg
												className="w-8 h-8"
												fill="currentColor"
												viewBox="0 0 24 24"
											>
												<path d="M14,6L10.25,11L13.1,14.8L11.5,16C9.81,13.75 7,10.85 7,10.85C7,10.85 11.81,4 16,4C16.69,4 17.39,4.25 18.05,4.68L14,6M4,1.27L22.73,20L21.46,21.27L19.65,19.46C19.39,19.73 18.93,20 18.36,20C16.98,20 15.96,19.44 15.28,18.5C14.6,19.44 13.58,20 12.2,20C10.3,20 8.85,18.85 8.85,17.18C8.85,15.18 10.95,14.44 12.85,14.81L2.73,4.69L4,1.27M12.85,16.15C12.2,16.05 11.15,16.11 11.15,17.18C11.15,17.72 11.46,18.38 12.2,18.38C12.68,18.38 13.15,17.85 13.15,17.18C13.15,16.68 13.04,16.35 12.85,16.15Z" />
											</svg>
										</div>
										<h3 className="text-xl font-semibold mb-2">
											{work.caption || "Content Unavailable"}
										</h3>
										<p className="text-gray-400 text-sm">
											This video is currently unavailable
										</p>
									</div>
								</div>
							);
						}

						// Use the first available workFile
						const workFile = work.workFiles[0];

						return (
							<div key={work.id} className="h-screen w-full relative bg-black">
								<div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none z-10" />

								<DoomScrollVideoPlayer
									videoId={workFile.id}
									autoPlay={index === currentVideoIndex}
									isActive={index === currentVideoIndex}
									hideControls={false}
									onVideoEnd={handleVideoEnd}
									workData={{
										title: work.caption,
										caption: work.caption,
										description: work.caption,
										author: "whoisfde",
										createdAt: work.createdAt,
									}}
									className="absolute inset-0 w-full h-full"
								/>
							</div>
						);
					})}
				</EmblaCarousel>

				{/* Video counter */}
				<div className="absolute top-4 left-4 z-30">
					<div className="flex items-center space-x-2 text-white text-sm">
						<span className="bg-black bg-opacity-50 backdrop-blur-sm px-3 py-1 rounded-full">
							{currentVideoIndex + 1} / {works.length}
						</span>
					</div>
				</div>

				{currentVideoIndex === 0 && (
					<div className="absolute top-1/2 left-4 transform -translate-y-1/2 z-20 hidden sm:block">
						<div className="text-white text-sm bg-black bg-opacity-50 backdrop-blur-sm px-3 py-2 rounded-lg max-w-xs">
							<p className="mb-1">Swipe up for next video</p>
							<p className="mb-1">Swipe down for previous</p>
							<p className="text-xs opacity-75">
								Videos auto-advance when finished
							</p>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default DoomScrollClient;
