/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,

  // ⭐ ALLOW YOUR PHONE AND LOCAL NETWORK DEVICES
  allowedDevOrigins: [
    "http://localhost:3000",
    "http://127.0.0.1:3000",

    // allow your entire LAN range
    "http://10.0.0.0/8",
    "http://172.16.0.0/12",
    "http://192.168.0.0/16",

    // or your specific device:
    "http://10.167.230.102:3000"
  ],

  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "**" },
      { protocol: "http", hostname: "**" },
    ],
  }
};

export default nextConfig;
