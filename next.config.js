/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  images: {
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  // Enable React StrictMode for better development experience
  reactStrictMode: true,
  // Configure trailing slash behavior
  trailingSlash: false,
  // Disable ESLint during production builds
  eslint: {
    // Only run ESLint on local development for faster builds
    ignoreDuringBuilds: process.env.NODE_ENV === 'production',
  },
  // Disable TypeScript type checking during production builds
  typescript: {
    // Only run type checking on local development for faster builds
    ignoreBuildErrors: process.env.NODE_ENV === 'production',
  },
  // Configure output directory for static exports (if needed)
  // distDir: 'build',
};

module.exports = nextConfig; 