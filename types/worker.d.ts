declare module "*.worker.ts" {
	class WebpackWorker extends Worker {
		constructor();
	}

	export default WebpackWorker;
}

declare module "*.worker.ts" {
	const content: any;
	export default content;
}
