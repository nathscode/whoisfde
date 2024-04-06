import { S3Client } from "@aws-sdk/client-s3";

export const s3 = new S3Client({
	endpoint: process.env.TEBI_ENDPOINT,
	region: "global",
	credentials: {
		accessKeyId: process.env.TEBI_ACCESS_KEY!,
		secretAccessKey: process.env.TEBI_SECRET_KEY!,
	},
});
