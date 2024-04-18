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
