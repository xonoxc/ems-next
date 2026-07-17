import type { NextConfig } from "next"

const nextConfig: NextConfig = {
   output: "standalone",
   images: {
      remotePatterns: [
         {
            protocol: "https",
            hostname: "blob.vercel-storage.com",
         },
         {
            protocol: "https",
            hostname: "*.public.blob.vercel-storage.com",
         },
      ],
   },
   reactCompiler: true,
}

export default nextConfig
