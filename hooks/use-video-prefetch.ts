import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";

interface VideoPrefetchOptions {
	enabled?: boolean;
	prefetchOnHover?: boolean;
	maxConcurrentPrefetches?: number;
}

// Hook for intelligent video prefetching
export const useVideoPrefetch = (
	videoIds: string[],
	options: VideoPrefetchOptions = {}
) => {
	const {
		enabled = true,
		prefetchOnHover = true,
		maxConcurrentPrefetches = 2,
	} = options;

	const queryClient = useQueryClient();
	const prefetchQueueRef = useRef<string[]>([]);
	const activePrefetchesRef = useRef(new Set<string>());

	const prefetchVideo = async (videoId: string) => {
		if (!enabled || activePrefetchesRef.current.has(videoId)) {
			return;
		}

		// Check if already cached
		const existingData = queryClient.getQueryData(["video", videoId]);
		if (existingData) {
			return;
		}

		activePrefetchesRef.current.add(videoId);

		try {
			// Prefetch video metadata
			await queryClient.prefetchQuery({
				queryKey: ["video-metadata", videoId],
				queryFn: async () => {
					const response = await axios.get(
						`/api/rooter/work/metadata/${videoId}`
					);
					return response.data;
				},
				staleTime: 15 * 60 * 1000, // 15 minutes
			});

			// Optionally prefetch a small portion of the video
			if ("serviceWorker" in navigator) {
				// Use service worker for video prefetching
				navigator.serviceWorker.ready.then((registration) => {
					registration.active?.postMessage({
						type: "PREFETCH_VIDEO",
						videoId,
						url: `/api/rooter/work/get-chuck/${videoId}`,
					});
				});
			}
		} catch (error) {
			console.warn(`Failed to prefetch video ${videoId}:`, error);
		} finally {
			activePrefetchesRef.current.delete(videoId);
		}
	};

	const processPrefetchQueue = async () => {
		const activeCount = activePrefetchesRef.current.size;
		const availableSlots = maxConcurrentPrefetches - activeCount;

		if (availableSlots <= 0 || prefetchQueueRef.current.length === 0) {
			return;
		}

		const videosToProcess = prefetchQueueRef.current.splice(0, availableSlots);

		await Promise.all(videosToProcess.map((videoId) => prefetchVideo(videoId)));
	};

	const addToPrefetchQueue = (videoId: string) => {
		if (!prefetchQueueRef.current.includes(videoId)) {
			prefetchQueueRef.current.push(videoId);
			processPrefetchQueue();
		}
	};

	// Auto-prefetch visible videos
	useEffect(() => {
		if (!enabled) return;

		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						const videoId = entry.target.getAttribute("data-video-id");
						if (videoId) {
							addToPrefetchQueue(videoId);
						}
					}
				});
			},
			{ rootMargin: "50px" }
		);

		// Observe video elements
		const videoElements = document.querySelectorAll("[data-video-id]");
		videoElements.forEach((element) => observer.observe(element));

		return () => observer.disconnect();
	}, [enabled]);

	return {
		prefetchVideo: addToPrefetchQueue,
		activePrefetches: activePrefetchesRef.current.size,
		queueLength: prefetchQueueRef.current.length,
	};
};
