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
				source: "/:path*",
				headers: [
					{
						key: "Cross-Origin-Embedder-Policy",
						value: "credentialless",
					},
					{
						key: "Cross-Origin-Opener-Policy",
						value: "same-origin",
					},
					{
						key: "Access-Control-Allow-Origin",
						value: "*",
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
