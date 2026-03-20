/** @type {import('next').NextConfig} */
const nextConfig = {
  // Output standalone (Vercel/Docker usage, not needed for Cloudflare but kept for compatibility)
  output: undefined,

  // Allow external images (YouTube thumbnails, Notion images for future use)
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'i.ytimg.com' },
      { protocol: 'https', hostname: 'img.youtube.com' },
      { protocol: 'https', hostname: '*.notion.so' },
      { protocol: 'https', hostname: 'prod-files-secure.s3.us-west-2.amazonaws.com' },
    ],
  },
};

module.exports = nextConfig;
