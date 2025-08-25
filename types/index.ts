import {
	Booking,
	OgReview,
	Request,
	Review,
	Files,
	User,
	Work,
	WorkFiles,
} from "@prisma/client";
import { ISODateString } from "next-auth";

export type CustomUser = {
	id?: string;
	name?: string | null;
	email?: string | null;
	phone?: string | null;
	role?: string | null;
};

export type CustomSession = {
	user?: CustomUser;
	expires: ISODateString;
};

export type SafeBooking = Omit<Booking, "createdAt"> & {
	createdAt: string;
	updatedAt: string;
};
export type SafeRequest = Omit<Request, "createdAt"> & {
	createdAt: string;
	updatedAt: string;
};

export type SafeWork = Omit<Work, "createdAt"> & {
	createdAt: string;
};
export type SafeReview = Omit<Review, "createdAt"> & {
	createdAt: string;
	updatedAt: string;
};
export type SafeOgReview = Omit<OgReview, "createdAt"> & {
	createdAt: string;
	updatedAt: string;
};
export type SafeOgReviewExtras = SafeOgReview & {
	user: User | null;
	files: Files[];
};
export type SafeWorkExtras = SafeWork & {
	workFiles: WorkFiles[];
};

export type FileActions = {
	file: File;
	fileName: string;
	fileSize: number;
	fileType: string;
	isError?: boolean;
	url?: string;
	output?: any;
	outputBlob?: Blob;
};

export enum QualityType {
	High = "15",
	Medium = "18",
	Low = "20",
}

export enum VideoFormats {
	MP4 = "mp4",
	WEBM = "webm",
}

export type VideoInputSettings = {
	quality: QualityType;
	videoType: VideoFormats;
	removeAudio: boolean;
};
