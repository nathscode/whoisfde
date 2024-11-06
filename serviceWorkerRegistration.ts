export const registerServiceWorker = async () => {
	if ("serviceWorker" in navigator) {
		try {
			const registration = await navigator.serviceWorker.register(
				"/workers/videoCompressionWorker.js",
				{
					scope: "/",
				}
			);
			console.log("ServiceWorker registration successful");

			// Wait for the service worker to be ready
			await navigator.serviceWorker.ready;
		} catch (error) {
			console.error("ServiceWorker registration failed:", error);
		}
	}
};
