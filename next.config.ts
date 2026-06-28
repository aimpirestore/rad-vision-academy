import type { NextConfig } from "next";

/**
 * Security headers — protect against XSS, clickjacking, MIME sniffing,
 * downgrade attacks, and information leakage.
 *
 * These are set on every response (public + admin).
 */
const securityHeaders = [
  // Force HTTPS for 2 years
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  // Prevent clickjacking — this site cannot be framed
  { key: "X-Frame-Options", value: "DENY" },
  // Prevent MIME-type sniffing
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Referrer policy — strip query strings on cross-origin
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Disable unnecessary browser features
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
  // Content Security Policy — allow Supabase + inline styles/scripts only
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      // Allow inline styles (Tailwind, Framer Motion, TipTap all inject styles)
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      // Allow inline scripts for Next.js runtime + JSON-LD structured data
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://www.clarity.ms",
      // Images: allow self + Supabase storage + data URIs (optimized images)
      "img-src 'self' data: blob: https: https://*.supabase.co",
      // Supabase REST + Auth + Realtime endpoints
      "connect-src 'self' https://*.supabase.co https://www.google-analytics.com https://*.clarity.ms wss://*.supabase.co",
      // Block mixed content + external plugins
      "upgrade-insecure-requests",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
    ].join("; "),
  },
  // Cross-Origin policies — isolate documents from each other
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  { key: "X-DNS-Prefetch-Control", value: "on" },
];

const nextConfig: NextConfig = {
  // ✅ Standalone output — required for Hostinger/VPS/Docker deployment
  output: "standalone",

  reactStrictMode: true,
  poweredByHeader: false,

  // ✅ Compress responses (gzip + brotli)
  compress: true,

  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
    minimumCacheTTL: 86400,
  },

  // ✅ Security headers applied on every route
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },

  // ✅ Strip Supabase-internal paths out of the client bundle
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion"],
  },

  // ✅ Webpack: split heavy libs into their own chunks so they don't block
  // the main page bundle. Three.js + Framer Motion are the big ones.
  webpack: (config, { isServer }) => {
    // Only split client chunks — server keeps everything in one bundle
    if (!isServer) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: "all",
          cacheGroups: {
            three: {
              test: /[\\/]node_modules[\\/](three|@react-three)[\\/]/,
              name: "three",
              chunks: "all",
              priority: 30,
            },
            framer: {
              test: /[\\/]node_modules[\\/](framer-motion|motion-dom)[\\/]/,
              name: "framer",
              chunks: "all",
              priority: 25,
            },
            supabase: {
              test: /[\\/]node_modules[\\/](@supabase)[\\/]/,
              name: "supabase",
              chunks: "all",
              priority: 20,
            },
            tiptap: {
              test: /[\\/]node_modules[\\/](@tiptap)[\\/]/,
              name: "tiptap",
              chunks: "all",
              priority: 15,
            },
          },
        },
      };
    }
    return config;
  },
};

export default nextConfig;
