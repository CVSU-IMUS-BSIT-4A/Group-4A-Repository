import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Performance optimizations for faster compilation
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // Speed up development builds
  experimental: {
    optimizePackageImports: [
      'lucide-react',
      '@radix-ui/react-dialog',
      '@radix-ui/react-dropdown-menu',
      '@radix-ui/react-avatar',
      '@radix-ui/react-collapsible',
      '@radix-ui/react-separator',
      '@radix-ui/react-slot',
      '@radix-ui/react-tooltip',
    ],
  },
  // Reduce TypeScript checking overhead in development
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3005',
        pathname: '/uploads/**',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '3005',
        pathname: '/uploads/**',
      },
      // Allow local network IPs (192.168.x.x, 10.x.x.x, 172.16-31.x.x)
      {
        protocol: 'http',
        hostname: '192.168.**',
        port: '3005',
        pathname: '/uploads/**',
      },
      {
        protocol: 'http',
        hostname: '10.**',
        port: '3005',
        pathname: '/uploads/**',
      },
      {
        protocol: 'http',
        hostname: '172.**',
        port: '3005',
        pathname: '/uploads/**',
      },
    ],
    // Allow unoptimized images in development to bypass private IP restrictions
    unoptimized: process.env.NODE_ENV === 'development',
  },
};

export default nextConfig;
