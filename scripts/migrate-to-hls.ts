import { db } from "@/config/db.config";
import { processVideoToHLS } from "@/lib/hls-processor";

async function migrateOldVideos() {
	// Get all non-HLS videos
	const oldVideos = await db.workFiles.findMany({
		where: {
			AND: [
				{
					url: {
						not: {
							contains: ".m3u8",
						},
					},
				},
				{
					url: {
						not: null,
					},
				},
			],
		},
	});

	console.log(`Found ${oldVideos.length} videos to migrate`);

	for (const video of oldVideos) {
		try {
			// Check if url exists before using it
			if (!video.url) {
				console.log(`Skipping ${video.id} - no URL provided`);
				continue;
			}

			console.log(`Processing: ${video.url}`);

			// Download original video
			const response = await fetch(video.url);
			const blob = await response.blob();
			const file = new File([blob], "video.mp4", { type: "video/mp4" });

			// Process to HLS (this would use server-side FFmpeg)
			const hlsUrl = await processVideoToHLS(file, video.id);

			// Update database with new HLS URL
			await db.workFiles.update({
				where: { id: video.id },
				data: {
					url: hlsUrl,
					// Store old URL as backup
					metadata: {
						oldUrl: video.url,
						migratedAt: new Date(),
						type: "hls",
					},
				},
			});

			console.log(`✓ Migrated: ${video.id}`);

			// Optional: Delete old file from storage
			// await deleteFromStorage(video.url);
		} catch (error) {
			console.error(`✗ Failed to migrate ${video.id}:`, error);
		}
	}

	console.log("Migration complete!");
}

// Run migration
migrateOldVideos();
