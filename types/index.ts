import {
	Booking,
	OgReview,
	Request,
	Review,
	Files,
	User,
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
