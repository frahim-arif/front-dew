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

      // Production backend (Render) use karoge to isko apne domain se replace kar dena
      // {
      //   protocol: "https",
      //   hostname: "your-backend.onrender.com",
      //   pathname: "/uploads/**",
      // },
    ],
  },
};

export default nextConfig;
