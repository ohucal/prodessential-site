/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static HTML export → deploys on Netlify with no server runtime.
  output: 'export',
  // Each route becomes a folder with index.html (e.g. /beats/stories/index.html).
  trailingSlash: true,
  images: {
    // next/image optimization is unavailable in static export.
    unoptimized: true,
  },
};

export default nextConfig;
