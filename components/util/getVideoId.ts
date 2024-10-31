export function getFilenameFromUrl(url: string): string {
	// Remove protocol, query parameters, and hash fragments
	const urlWithoutProtocol = url.replace(/^https?:\/\//, "");
	const parts = urlWithoutProtocol.split("/");
	const filenameWithParams = parts[parts.length - 1];

	// Remove any query parameters or hash fragments (e.g., ?v=123 or #section)
	const [filename] = filenameWithParams.split(/[?#]/);

	return filename;
}
