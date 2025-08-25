import { type ClassValue, clsx } from "clsx";
import moment from "moment";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function addOneHour(date: Date): Date {
	const newDate = new Date(date);
	newDate.setHours(newDate.getHours() + 1);
	return newDate;
}

export function stringifyObj(data: Object) {
	if (typeof data !== "object") return data;
	return JSON.parse(JSON.stringify(data));
}

export function formatDateTime(date: string): string {
	return moment.utc(date).format("DD MMM, YYYY, HH:mm A");
}

export function getFileExtension(url: string): string | null {
	const parts = url.split("/");
	const fileName = parts.pop() || "";
	const segments = fileName.split(".");
	const fileExtension = segments.pop() || null;
	return fileExtension;
}

export function getValueAfterYoutuBe(url: string): string | null {
	try {
		const urlObj = new URL(url);
		const pathname = urlObj.pathname;
		const valueAfterYoutuBe = pathname.substring(1);
		return valueAfterYoutuBe;
	} catch (error) {
		console.error("Invalid URL", error);
		return null;
	}
}

export function getYouTubeVideoId(url: string): string | null {
	if (!url || typeof url !== "string") {
		return null;
	}

	// Remove whitespace
	const cleanUrl = url.trim();

	try {
		const urlObj = new URL(cleanUrl);
		const hostname = urlObj.hostname.toLowerCase();
		const pathname = urlObj.pathname;
		const searchParams = urlObj.searchParams;

		// Check if it's a YouTube domain
		const youtubeHosts = [
			"www.youtube.com",
			"youtube.com",
			"m.youtube.com",
			"music.youtube.com",
			"youtu.be",
		];

		if (
			!youtubeHosts.some(
				(host) => hostname === host || hostname.endsWith("." + host)
			)
		) {
			return null;
		}

		let videoId: string | null = null;

		// Handle youtu.be short URLs
		if (hostname === "youtu.be") {
			videoId = pathname.substring(1).split("?")[0];
		}
		// Handle youtube.com URLs
		else if (hostname.includes("youtube.com")) {
			// Check for /watch URLs with v parameter
			if (pathname === "/watch" && searchParams.has("v")) {
				videoId = searchParams.get("v");
			}
			// Check for /embed/ URLs
			else if (pathname.startsWith("/embed/")) {
				videoId = pathname.substring(7).split("?")[0];
			}
			// Check for /v/ URLs
			else if (pathname.startsWith("/v/")) {
				videoId = pathname.substring(3).split("?")[0];
			}
			// Check for /shorts/ URLs
			else if (pathname.startsWith("/shorts/")) {
				videoId = pathname.substring(8).split("?")[0];
			}
		}

		// Validate the extracted video ID
		if (videoId && isValidYouTubeId(videoId)) {
			return videoId;
		}

		return null;
	} catch (error) {
		console.error("Error parsing YouTube URL:", error);
		return null;
	}
}

/**
 * Validates if a string is a valid YouTube video ID
 */
export function isValidYouTubeId(id: string): boolean {
	if (!id || typeof id !== "string") {
		return false;
	}

	// YouTube video IDs are 11 characters long
	const youtubeIdRegex = /^[a-zA-Z0-9_-]{11}$/;
	return youtubeIdRegex.test(id);
}

export function generateRandomNumbers(count: number): string {
	let numbers: string[] = [];
	for (let i = 0; i < count; i++) {
		let randomNumber = Math.floor(Math.random() * (9 - 0) + 0);
		numbers.push(randomNumber.toString());
	}
	return numbers.join("");
}
