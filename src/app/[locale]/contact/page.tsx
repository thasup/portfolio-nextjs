import { Contact } from '@/components/sections/Contact'
import { siteConfig } from '@/data/siteConfig'

export const metadata = {
  title: `Contact | ${siteConfig.name}`,
  description: 'Reach out for job opportunities, consulting, or just to say hello.',
}

export default function ContactPage() {
  return (
    <div className="pt-24 pb-16">
      <Contact />
    </div>
  )
}
