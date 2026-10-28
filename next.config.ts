
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "5000",
        pathname: "/uploads/**",
      },

      // Production backend (Render)
      // {
      //   protocol: "https",
      //   hostname: "your-backend.onrender.com",
      //   pathname: "/uploads/**",
      // },
    ],
  },

  async redirects() {
    return [
      {
        source: "/appointment/success",
        destination: "/",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
