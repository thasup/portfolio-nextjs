import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

// Force Lightning CSS to use the universal WASM build so Vercel's Linux runners
// don't attempt to load absent native binaries from Mac installs.
if (!process.env.LIGHTNINGCSS_FORCE_WASM) {
  process.env.LIGHTNINGCSS_FORCE_WASM = '1'
}

const withNextIntl = createNextIntlPlugin()

const nextConfig: NextConfig = {
  trailingSlash: true,
  experimental: {
    optimizePackageImports: ['framer-motion', 'lucide-react', 'swiper'],
  },
}

export default withNextIntl(nextConfig)
