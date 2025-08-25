import { QueryClient } from "@tanstack/react-query";

// Enhanced React Query configuration for video content caching
export const createQueryClient = () => {
	return new QueryClient({
		defaultOptions: {
			queries: {
				// Cache video data for 10 minutes
				staleTime: 10 * 60 * 1000,
				// Keep cached data for 30 minutes
				gcTime: 30 * 60 * 1000,
				// Retry failed requests 3 times with exponential backoff
				retry: (failureCount, error: any) => {
					// Don't retry on 4xx errors (client errors)
					if (error?.response?.status >= 400 && error?.response?.status < 500) {
						return false;
					}
					return failureCount < 3;
				},
				retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
				// Don't refetch on window focus for video content
				refetchOnWindowFocus: false,
				// Don't refetch on reconnect for cached content
				refetchOnReconnect: "always",
			},
			mutations: {
				// Retry mutations once
				retry: 1,
				// Show loading states for mutations
				onError: (error) => {
					console.error("Mutation error:", error);
				},
			},
		},
	});
};

// Video-specific cache configuration
export const videoQueryOptions = {
	staleTime: 15 * 60 * 1000, // 15 minutes for video data
	gcTime: 60 * 60 * 1000, // 1 hour cache retention
	refetchOnMount: false,
	refetchOnWindowFocus: false,
};
