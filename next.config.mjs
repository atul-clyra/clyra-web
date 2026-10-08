/** @type {import('next').NextConfig} */
const nextConfig = {
  // Fully static export: `next build` writes the site to out/, deployable to any CDN.
  output: "export",
  images: { unoptimized: true },
  reactStrictMode: true,
  // Every page exports as <route>/index.html, which every static host serves at /<route>/.
  trailingSlash: true,
};

export default nextConfig;
