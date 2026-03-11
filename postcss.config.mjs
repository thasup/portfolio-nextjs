/** @type {import('postcss-load-config').Config} */

// Ensure Lightning CSS uses the WASM fallback before Tailwind's plugin loads, so
// Linux builders don't try to require missing native binaries.
if (!process.env.LIGHTNINGCSS_FORCE_WASM) {
  process.env.LIGHTNINGCSS_FORCE_WASM = '1'
}

const config = {
  plugins: {
    '@tailwindcss/postcss': {},
  },
}

export default config
