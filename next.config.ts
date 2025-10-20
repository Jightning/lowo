import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	images: {
		remotePatterns: [{
			hostname: "static.wixstatic.com",
		}]
		
	},
};

export default nextConfig;
