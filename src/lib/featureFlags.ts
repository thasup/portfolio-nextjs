const isDev = process.env.NODE_ENV !== 'production'

export const featureFlags = {
  showWipSections: isDev,
}
