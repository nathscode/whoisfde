export const CHUNK_SIZE = 20 * 1024 * 1024; // 20MB chunks
type ChunkType = {
	chunkNumber: number;
	chunk: Blob;
	start: number;
	end: number;
};
export const createChunks = async (blob: Blob): Promise<ChunkType[]> => {
	const chunks: ChunkType[] = [];
	let start = 0;
	while (start < blob.size) {
		const end = Math.min(start + CHUNK_SIZE, blob.size);
		const chunk = blob.slice(start, end);
		chunks.push({
			chunkNumber: chunks.length + 1,
			chunk,
			start,
			end,
		});
		start = end;
	}
	return chunks;
};
