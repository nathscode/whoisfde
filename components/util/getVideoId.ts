export function getFilenameFromUrl(url: string): string {
	const urlWithoutProtocol = url.replace(/^https?:\/\//, "");

	const parts = urlWithoutProtocol.split("/");

	const filename = parts[parts.length - 1];

	return filename;
}
