import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	typescript: {
		ignoreBuildErrors: true,
	},
	eslint: {
		ignoreDuringBuilds: true,
	},
	/* config options here */
	// webpack: (config, { isServer }) => {
	// 	if (!isServer) {
	// 		// Ignore Node.js built-in modules in client-side bundles
	// 		config.resolve.fallback = {
	// 			...config.resolve.fallback,
	// 			child_process: false,
	// 			fs: false,
	// 			net: false,
	// 			tls: false,
	// 			crypto: false, // May also be needed for bcrypt or other dependencies
	// 		};
	// 	}

	// 	return config;
	// },
};

export default nextConfig;
