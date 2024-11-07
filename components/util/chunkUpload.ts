export const CHUNK_SIZE = 20 * 1024 * 1024; // 20MB chunks

export const createChunks = (file: File) => {
	const chunks = [];
	let start = 0;

	while (start < file.size) {
		const end = Math.min(start + CHUNK_SIZE, file.size);
		chunks.push(file.slice(start, end));
		start = end;
	}

	return chunks;
};
