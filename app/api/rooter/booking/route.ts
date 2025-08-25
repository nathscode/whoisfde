import { db } from "@/config/db.config";
import {
	generateRandomNumbers,
	handlerNativeResponse,
} from "@/lib/backend/utils";
import { BookingSchema, BookingSchemaInfer } from "@/lib/validators/booking";
import { sendMail } from "@/service/mail";
import { BookingStatus } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import NewBooking from "@/emails/NewBooking";
import { addOneHour } from "@/lib/utils";
import { getLogger } from "@/lib/backend/logger";
import { render } from "@react-email/components";

const logger = getLogger();

// Cache for booking numbers to reduce database calls
const bookingNumberCache = new Set<string>();
let lastCacheUpdate = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// Rate limiting storage (in production, use Redis)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes
const RATE_LIMIT_MAX_REQUESTS = 5; // Max 5 booking requests per 15 minutes per IP

// Email queue to handle email sending asynchronously
interface EmailJob {
	to: string;
	subject: string;
	html: string;
	name?: string;
}

const emailQueue: EmailJob[] = [];
let emailQueueProcessing = false;

// Process email queue
async function processEmailQueue() {
	if (emailQueueProcessing || emailQueue.length === 0) return;

	emailQueueProcessing = true;

	while (emailQueue.length > 0) {
		const job = emailQueue.shift();
		if (!job) break;

		try {
			await sendMail({
				name: job.name || "whoisfde",
				to: job.to,
				subject: job.subject,
				html: job.html,
			});
		} catch (error: any) {
			logger.error("Email sending failed:", error);
			// Could implement retry logic here
		}
	}

	emailQueueProcessing = false;
}

// Enhanced booking number generation with caching
async function generateUniqueBookingNumberCode(): Promise<string> {
	const now = Date.now();

	// Refresh cache if it's stale
	if (now - lastCacheUpdate > CACHE_TTL) {
		bookingNumberCache.clear();
		const existingBookings = await db.booking.findMany({
			select: { bookingNumber: true },
			where: {
				createdAt: {
					gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // Last 24 hours
				},
			},
		});

		existingBookings.forEach((booking) => {
			if (booking.bookingNumber) {
				bookingNumberCache.add(booking.bookingNumber);
			}
		});

		lastCacheUpdate = now;
	}

	let bookingNumber: string;
	let attempts = 0;
	const maxAttempts = 10;

	do {
		bookingNumber = generateRandomNumbers(12);
		attempts++;

		if (attempts > maxAttempts) {
			throw new Error(
				"Failed to generate unique booking number after multiple attempts"
			);
		}
	} while (bookingNumberCache.has(bookingNumber));

	// Add to cache to prevent duplicates in subsequent requests
	bookingNumberCache.add(bookingNumber);

	return bookingNumber;
}

// Rate limiting function
function checkRateLimit(identifier: string): {
	allowed: boolean;
	retryAfter?: number;
} {
	const now = Date.now();
	const key = identifier;
	const existing = rateLimitStore.get(key);

	if (!existing || now > existing.resetTime) {
		// Reset or create new entry
		rateLimitStore.set(key, {
			count: 1,
			resetTime: now + RATE_LIMIT_WINDOW,
		});
		return { allowed: true };
	}

	if (existing.count >= RATE_LIMIT_MAX_REQUESTS) {
		const retryAfter = Math.ceil((existing.resetTime - now) / 1000);
		return { allowed: false, retryAfter };
	}

	existing.count++;
	return { allowed: true };
}

// Input sanitization
function sanitizeInput(data: BookingSchemaInfer): BookingSchemaInfer {
	return {
		...data,
		name: data.name.trim().replace(/[<>]/g, ""), // Basic XSS prevention
		email: data.email.toLowerCase().trim(),
		phone: data.phone.replace(/[^\d+\-\s()]/g, ""), // Keep only valid phone characters
		note: data.note ? data.note.trim().substring(0, 1000) : data.note, // Limit note length
	};
}

export async function POST(req: NextRequest) {
	const startTime = Date.now();

	try {
		// Get client IP for rate limiting
		const clientIP =
			req.headers.get("x-forwarded-for") ||
			req.headers.get("x-real-ip") ||
			"unknown";

		// Check rate limit
		const rateLimitResult = checkRateLimit(clientIP);
		if (!rateLimitResult.allowed) {
			return handlerNativeResponse(
				{
					status: 429,
					message: "Too many booking requests. Please try again later.",
					retryAfter: rateLimitResult.retryAfter,
				},
				429
			);
		}

		// Parse and validate request body
		const body: BookingSchemaInfer = await req.json();
		const payload = BookingSchema.safeParse(body);

		if (!payload.success) {
			logger.warn("Booking validation failed:");
			return handlerNativeResponse(
				{
					status: 400,
					errors: {
						errors: payload.error.flatten().fieldErrors,
						message:
							"Invalid input data. Please check your form and try again.",
					},
				},
				400
			);
		}

		// Sanitize input data
		const sanitizedData = sanitizeInput(payload.data);
		const { name, phone, email, typeOfEvent, bookType, date, note } =
			sanitizedData;

		// Check for duplicate bookings (same email and date within 1 hour)
		const duplicateBooking = await db.booking.findFirst({
			where: {
				email,
				date: {
					gte: new Date(new Date(date).getTime() - 60 * 60 * 1000), // 1 hour before
					lte: new Date(new Date(date).getTime() + 60 * 60 * 1000), // 1 hour after
				},
				status: {
					not: BookingStatus.DENIED,
				},
			},
		});

		if (duplicateBooking) {
			logger.warn(`Duplicate booking attempt for email: ${email}`);
			return handlerNativeResponse(
				{
					status: 409,
					message: "A booking for this email and time slot already exists.",
				},
				409
			);
		}

		// Generate unique booking number
		const bookingNumber = await generateUniqueBookingNumberCode();

		// Add one hour to the date
		const adjustedDate = addOneHour(date);

		// Create booking with transaction for data consistency
		const newBooking = await db.$transaction(async (tx) => {
			const booking = await tx.booking.create({
				data: {
					name,
					email,
					bookingNumber,
					phone,
					date: adjustedDate,
					typeOfEvent,
					bookType,
					note,
					status: BookingStatus.PENDING,
				},
			});

			// Log the booking creation
			logger.info(`Booking created: ${booking.id} for ${email}`);

			return booking;
		});

		if (!newBooking) {
			logger.error("Failed to create booking");
			return handlerNativeResponse(
				{ status: 500, message: "Failed to create booking. Please try again." },
				500
			);
		}

		// Prepare email data
		const emailData = {
			id: newBooking.id,
			name: newBooking.name!,
			email: newBooking.email!,
			phone: newBooking.phone!,
			bookNumber: newBooking.bookingNumber!,
			bookDate: newBooking.date!,
			type: newBooking.bookType!,
		};

		const emailHtml = render(NewBooking(emailData));

		// Queue emails for asynchronous processing
		emailQueue.push(
			{
				to: email,
				subject: "Booking Confirmation - whoisfde",
				html: emailHtml,
				name: "whoisfde",
			},
			{
				to: "whoisfde@gmail.com",
				subject: `New Booking Received - ${bookingNumber}`,
				html: emailHtml,
				name: "whoisfde",
			}
		);

		setImmediate(() => processEmailQueue());

		// Log performance
		const duration = Date.now() - startTime;
		logger.info(`Booking processed in ${duration}ms`);

		return NextResponse.json(
			{
				status: "success",
				message: "Booking created successfully",
				bookingNumber: newBooking.bookingNumber,
				data: {
					id: newBooking.id,
					bookingNumber: newBooking.bookingNumber,
					status: newBooking.status,
				},
			},
			{ status: 201 }
		);
	} catch (error: any) {
		const duration = Date.now() - startTime;
		logger.error(`Booking failed after ${duration}ms:`, error);

		let message = "Something went wrong. Please try again later.";
		let status = 500;

		if (error instanceof ZodError) {
			message = "Invalid input data. Please check your form.";
			status = 422;
		} else if (error.code === "P2002") {
			// Prisma unique constraint violation
			message = "A booking with this information already exists.";
			status = 409;
		} else if (error.message.includes("unique booking number")) {
			message = "Unable to generate booking reference. Please try again.";
			status = 500;
		}

		return handlerNativeResponse({ status, message }, status);
	}
}

export function cleanupRateLimitStore() {
	const now = Date.now();
	for (const [key, value] of rateLimitStore.entries()) {
		if (now > value.resetTime) {
			rateLimitStore.delete(key);
		}
	}
}

setInterval(cleanupRateLimitStore, 5 * 60 * 1000); // Clean up every 5 minutes
