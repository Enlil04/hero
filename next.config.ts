import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["192.168.0.244", "192.168.0.*", "192.168.*.*"],
};

export default nextConfig;
