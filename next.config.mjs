/** @type {import('next').NextConfig} */
const nextConfig = {
  staticPageGenerationTimeout: 120,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
}

export default nextConfig
