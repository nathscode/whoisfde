"use client";

import React, { useState, useCallback } from "react";
import LiteYouTubeEmbed from "react-lite-youtube-embed";
import YouTube, { YouTubeProps } from "react-youtube";
import "react-lite-youtube-embed/dist/LiteYouTubeEmbed.css";
import { useMediaQuery } from "usehooks-ts";
import { AlertTriangle, ExternalLink, Play } from "lucide-react";
import { getYouTubeVideoId, isValidYouTubeId } from "@/lib/utils";

type Props = {
	id?: string;
	url?: string;
	caption: string;
	useLite?: boolean;
	autoplay?: boolean;
	className?: string;
	useNoCookie?: boolean; // Option to use youtube-nocookie.com
};

const YoutubeEmbed = ({
	id,
	url,
	caption,
	useLite = true,
	autoplay = false,
	className = "",
	useNoCookie = false, // Disable by default to avoid connection issues
}: Props) => {
	const isMobile = useMediaQuery("(max-width: 600px)");
	const [embedError, setEmbedError] = useState(false);
	const [retryCount, setRetryCount] = useState(0);
	const [loadingState, setLoadingState] = useState<
		"idle" | "loading" | "loaded" | "error"
	>("idle");

	// Extract video ID from URL if provided, otherwise use the direct ID
	const getVideoId = (): string | null => {
		if (id && isValidYouTubeId(id)) {
			return id;
		}
		if (url) {
			return getYouTubeVideoId(url);
		}
		return null;
	};

	const videoId = getVideoId();

	const onPlayerReady: YouTubeProps["onReady"] = useCallback(
		(event: any) => {
			setEmbedError(false);
			setRetryCount(0);
			setLoadingState("loaded");
			if (!autoplay) {
				event.target.pauseVideo();
			}
		},
		[autoplay]
	);

	const onPlayerError: YouTubeProps["onError"] = useCallback((event: any) => {
		console.error("YouTube player error:", event);
		setEmbedError(true);
		setLoadingState("error");
	}, []);

	const handleRetry = useCallback(() => {
		setEmbedError(false);
		setRetryCount((prev) => prev + 1);
		setLoadingState("idle");
	}, []);

	const openInNewTab = useCallback(() => {
		if (videoId) {
			window.open(
				`https://www.youtube.com/watch?v=${videoId}`,
				"_blank",
				"noopener,noreferrer"
			);
		}
	}, [videoId]);

	// Create a custom iframe as fallback
	const renderCustomIframe = useCallback(() => {
		if (!videoId) return null;

		const baseUrl = useNoCookie
			? "https://www.youtube-nocookie.com"
			: "https://www.youtube.com";

		const params = new URLSearchParams({
			autoplay: autoplay ? "1" : "0",
			modestbranding: "1",
			rel: "0",
			fs: "1",
			cc_load_policy: "0",
			iv_load_policy: "3",
			playsinline: "1",
		});

		const src = `${baseUrl}/embed/${videoId}?${params.toString()}`;

		return (
			<iframe
				src={src}
				title={caption}
				frameBorder="0"
				allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
				allowFullScreen
				className="w-full h-full rounded-lg"
				onLoad={() => setLoadingState("loaded")}
				onError={() => {
					setEmbedError(true);
					setLoadingState("error");
				}}
			/>
		);
	}, [videoId, caption, autoplay, useNoCookie]);

	// Validate YouTube ID
	if (!videoId || !isValidYouTubeId(videoId)) {
		return (
			<div
				className={`flex flex-col items-center justify-center bg-gray-100 rounded-lg p-4 aspect-video ${className}`}
			>
				<AlertTriangle className="w-6 h-6 text-yellow-500 mb-2" />
				<p className="text-xs text-gray-600 text-center">Invalid video</p>
			</div>
		);
	}

	// Error fallback component
	if (embedError && retryCount >= 2) {
		return (
			<div
				className={`flex flex-col items-center justify-center bg-gray-100 rounded-lg p-4 aspect-video ${className}`}
			>
				<AlertTriangle className="w-6 h-6 text-red-500 mb-2" />
				<p className="text-xs text-gray-800 text-center mb-2">
					Unable to load video
				</p>
				<p className="text-xs text-gray-600 text-center mb-3">
					Connection refused by YouTube
				</p>
				<button
					onClick={openInNewTab}
					className="flex items-center gap-1 px-3 py-1.5 text-xs bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
				>
					<ExternalLink className="w-3 h-3" />
					Watch on YouTube
				</button>
			</div>
		);
	}

	const opts: YouTubeProps["opts"] = {
		width: "100%",
		height: "100%",
		playerVars: {
			autoplay: autoplay ? 1 : 0,
			modestbranding: 1,
			rel: 0,
			fs: 1,
			cc_load_policy: 0,
			iv_load_policy: 3,
			playsinline: 1,
		},
		// Force YouTube to use regular domain instead of nocookie
		host: "https://www.youtube.com",
	};

	// Use LiteYouTubeEmbed for better performance and fewer connection issues
	if (useLite) {
		return (
			<div
				className={`w-full aspect-video rounded-lg overflow-hidden bg-black ${className}`}
			>
				<LiteYouTubeEmbed
					id={videoId}
					title={caption}
					poster="hqdefault"
					webp={true}
					adNetwork={false}
					noCookie={false} // Disable nocookie to avoid connection issues
					params={`autoplay=${autoplay ? 1 : 0}&modestbranding=1&rel=0`}
					onIframeAdded={() => {
						setEmbedError(false);
						setLoadingState("loaded");
					}}
					// Custom error handling
					// @ts-ignore
					iframe={{
						onError: () => {
							console.error("LiteYouTube iframe failed to load");
							setEmbedError(true);
							setLoadingState("error");
						},
					}}
				/>
			</div>
		);
	}

	// Try different embed methods based on retry count
	return (
		<div
			className={`w-full aspect-video rounded-lg overflow-hidden bg-black ${className}`}
		>
			{retryCount === 0 ? (
				// First attempt: Use react-youtube
				<YouTube
					key={`${videoId}-${retryCount}`}
					videoId={videoId}
					opts={opts}
					onReady={onPlayerReady}
					onError={onPlayerError}
					className="w-full h-full"
					iframeClassName="w-full h-full"
				/>
			) : (
				// Second attempt: Use custom iframe
				<div className="relative w-full h-full">
					{renderCustomIframe()}
					{loadingState === "idle" && (
						<div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
							<Play className="w-12 h-12 text-white opacity-75" />
						</div>
					)}
				</div>
			)}

			{embedError && retryCount < 2 && (
				<div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-75">
					<button
						onClick={handleRetry}
						className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
					>
						Try Alternative Method
					</button>
				</div>
			)}
		</div>
	);
};

export default YoutubeEmbed;
