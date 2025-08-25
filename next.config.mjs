/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "s3.tebi.io",
			},
		],
	},
	eslint: {
		ignoreDuringBuilds: true,
	},
	typescript: {
		ignoreBuildErrors: true,
	},
	async headers() {
		return [
			{
				// Global headers for most routes
				source: "/((?!.*youtube|.*embed).*)",
				headers: [
					{
						key: "Cross-Origin-Embedder-Policy",
						value: "unsafe-none", // Changed from credentialless
					},
					{
						key: "Cross-Origin-Opener-Policy",
						value: "unsafe-none", // Changed from same-origin
					},
					{
						key: "Access-Control-Allow-Origin",
						value: "*",
					},
				],
			},
			{
				// Special headers for YouTube embed compatibility
				source: "/:path*(youtube|embed)",
				headers: [
					{
						key: "Access-Control-Allow-Origin",
						value: "*",
					},
					{
						key: "Access-Control-Allow-Methods",
						value: "GET, HEAD, OPTIONS",
					},
					{
						key: "Access-Control-Allow-Headers",
						value: "Content-Type, Authorization, Range",
					},
					{
						key: "Cross-Origin-Resource-Policy",
						value: "cross-origin",
					},
					// Remove X-Frame-Options to allow embedding
				],
			},
			{
				// Optimized headers for video streaming API routes
				source: "/api/rooter/work/get-chuck/:path*",
				headers: [
					{
						key: "Cache-Control",
						value: "public, max-age=31536000, immutable",
					},
					{
						key: "Access-Control-Allow-Origin",
						value: "*",
					},
					{
						key: "Access-Control-Allow-Methods",
						value: "GET, HEAD, OPTIONS",
					},
					{
						key: "Access-Control-Allow-Headers",
						value:
							"Range, Accept-Ranges, Content-Range, Content-Length, Content-Type",
					},
					{
						key: "Accept-Ranges",
						value: "bytes",
					},
					{
						key: "X-Content-Type-Options",
						value: "nosniff",
					},
					{
						key: "X-Frame-Options",
						value: "SAMEORIGIN",
					},
				],
			},
			{
				// Headers for static video files (if you serve any directly)
				source: "/videos/:path*.(mp4|webm|ogg|avi|mov|wmv|flv|mkv)",
				headers: [
					{
						key: "Cache-Control",
						value: "public, max-age=31536000, immutable",
					},
					{
						key: "Accept-Ranges",
						value: "bytes",
					},
					{
						key: "Access-Control-Allow-Origin",
						value: "*",
					},
				],
			},
			{
				// Headers for API routes (general optimization)
				source: "/api/:path*",
				headers: [
					{
						key: "Access-Control-Allow-Origin",
						value: "*",
					},
					{
						key: "Access-Control-Allow-Methods",
						value: "GET, POST, PUT, DELETE, OPTIONS",
					},
					{
						key: "Access-Control-Allow-Headers",
						value: "Content-Type, Authorization, Range",
					},
				],
			},
			{
				// Security headers for sensitive API routes (adjust paths as needed)
				source: "/api/(auth|user|admin)/:path*",
				headers: [
					{
						key: "X-Frame-Options",
						value: "DENY",
					},
					{
						key: "X-Content-Type-Options",
						value: "nosniff",
					},
					{
						key: "Referrer-Policy",
						value: "strict-origin-when-cross-origin",
					},
				],
			},
		];
	},
	webpack: (config, { isServer }) => {
		// Fallback configuration
		config.resolve.fallback = {
			...config.resolve.fallback,
			fs: false,
			path: false,
			crypto: false,
		};

		// Add Web Worker support
		config.module.rules.push({
			test: /\.worker\.(js|ts)$/,
			use: {
				loader: "worker-loader",
				options: {
					filename: "static/[fullhash].worker.js", // Updated from [hash] to [fullhash]
					publicPath: "/_next/",
					worker: {
						type: "Worker",
						options: {
							type: "module",
						},
					},
				},
			},
		});

		// Prevent worker-loader from generating chunk files
		if (!isServer) {
			config.output.globalObject = "self";
		}

		// Enable WebAssembly support
		config.experiments = {
			...config.experiments,
			asyncWebAssembly: true,
		};

		return config;
	},
};

export default nextConfig;
