import { siteConfig } from '@/data/siteConfig'
import { SectionHeader } from '@/components/shared/SectionHeader'
import { Timeline } from '@/components/sections/Timeline'
import Image from 'next/image'
import Link from 'next/link'

export const metadata = {
  title: `About Me | ${siteConfig.name}`,
  description: siteConfig.tagline,
}

export default function AboutPage() {
  return (
    <div className="pt-24 pb-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 mb-20 text-center">
         <SectionHeader
            label="ABOUT ME"
            title="The Journey So Far"
          />
          <div className="mx-auto flex justify-center mb-10 w-full">
            <div className="relative h-64 w-64 md:h-80 md:w-80 overflow-hidden rounded-full border-4 border-border bg-muted">
                {/* Fallback pattern matching the hero avatar */ }
                 <div className="flex h-full w-full items-center justify-center text-5xl md:text-7xl font-bold bg-muted text-muted-foreground p-8">
                  {siteConfig.name.split(' ').map(n => n[0]).join('')}
                </div>
            </div>
          </div>

          <div className="text-lg md:text-xl leading-relaxed text-muted-foreground space-y-6 text-left mb-12">
             <p>
               I'm Thanachon Suppasatian, a Senior Software Engineer based in Bangkok. My 4-year journey has been intentionally broad—ranging from headless CMS platforms to Web3 smart contracts and B2B e-commerce architectures.
             </p>
             <p>
               Right now, I am pivoting entirely into the AI Engineering space. I believe that integrating LLMs into existing product interfaces is the most profound shift in UX since the mobile phone.
             </p>
             <p>
                My guiding philosophy is that engineering should serve the business and the end-user. I consider myself a Product Owner as much as an Engineer, and over the next 10 years, I am building the holistic skillset required to found a successful SaaS company.
             </p>
          </div>

           <div className="flex justify-center flex-wrap gap-4">
               <Link href="/projects" className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90">
                 View Recent Work
               </Link>
               {siteConfig.resumeUrl && (
                  <a href={siteConfig.resumeUrl} target="_blank" className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground">
                    Download Resume
                  </a>
               )}
           </div>
      </div>
      
      {/* We reuse the timeline section here as the story */}
      <Timeline />
    </div>
  )
}
