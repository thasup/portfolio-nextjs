import { Hero } from '@/components/sections/Hero'
import { ValueStrip } from '@/components/sections/ValueStrip'
import { Timeline } from '@/components/sections/Timeline'
import { Projects } from '@/components/sections/Projects'
import { Skills } from '@/components/sections/Skills'
import { Testimonials } from '@/components/sections/Testimonials'
import { ValueProp } from '@/components/sections/ValueProp'
import { Contact } from '@/components/sections/Contact'

export default function HomePage() {
  return (
    <>
      <Hero />
      <ValueStrip />
      <Timeline />
      <Projects />
      <Skills />
      <Testimonials />
      <ValueProp />
      <Contact />
    </>
  )
}
