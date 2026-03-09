'use client'

import { useEffect, useState } from 'react'
import { useLocale } from 'next-intl'
import { motion, AnimatePresence } from 'framer-motion'

export function LocaleTransition({ children }: { children: React.ReactNode }) {
  const locale = useLocale()
  const [displayLocale, setDisplayLocale] = useState(locale)
  const [isTransitioning, setIsTransitioning] = useState(false)

  useEffect(() => {
    if (locale !== displayLocale) {
      setIsTransitioning(true)
      const timer = setTimeout(() => {
        setDisplayLocale(locale)
        setIsTransitioning(false)
      }, 75) // Fast blink duration
      return () => clearTimeout(timer)
    }
  }, [locale, displayLocale])

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={displayLocale}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.075 }}
        className={isTransitioning ? 'pointer-events-none' : ''}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
