import { z } from "zod";

const MB_BYTES = 1000000;

const ACCEPTED_MIME_TYPES = [
	"image/gif",
	"image/jpeg",
	"image/jpg",
	"image/png",
	"video/mp4",
	"video/webm",
];

const fileSchema = z.instanceof(File).superRefine((f, ctx) => {
	if (!ACCEPTED_MIME_TYPES.includes(f.type)) {
		ctx.addIssue({
			code: z.ZodIssueCode.custom,
			message: `File must be one of [${ACCEPTED_MIME_TYPES.join(
				", "
			)}] but was ${f.type}`,
		});
	}
	if (f.size > 10 * MB_BYTES) {
		ctx.addIssue({
			code: z.ZodIssueCode.too_big,
			type: "array",
			message: `The file must not be larger than ${10 * MB_BYTES} bytes: ${
				f.size
			}`,
			maximum: 10 * MB_BYTES,
			inclusive: true,
		});
	}
});

function isValidYouTubeLink(url: string | undefined): url is string {
	if (!url) {
		return false;
	}
	const regExp =
		/^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
	return regExp.test(url);
}

export const WorkSchema = z.object({
	caption: z.string().min(1, {
		message: "Caption is required",
	}),
	workType: z.string().min(1, {
		message: "work type is required",
	}),
	link: z.string().optional(),
});

export type WorkSchemaInfer = z.infer<typeof WorkSchema>;
