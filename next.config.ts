import type { NextConfig } from "next"
import { env } from "process"

const nextConfig: NextConfig = {
	compiler: {
		removeConsole: env.NODE_ENV === "production",
	},
}

export default nextConfig
