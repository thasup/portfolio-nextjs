import Head from "next/head";

import HeroPanel from "../components/sections/HeroPanel";
import CustomHeader from "../components/sections/CustomHeader";
import AboutMe from "../components/sections/AboutMe";
import Skills from "../components/sections/Skills";
import Experience from "../components/sections/Experience";
import Portfolio from "../components/sections/Portfolio";
import Resume from "../components/sections/Resume";
import Contact from "../components/sections/Contact";
import Quote from "../components/sections/Quote";
import ShowcaseSection from "../components/ShowcaseSection";
import ProjectSection from "../components/ProjectSection";

export default function Home() {
  return (
    <>
      <Head>
        <title>Hi! I&apos;m Thanachon | Portfolio</title>
        <meta name="description" content="Thanachon's portfolio website" />
      </Head>
      <HeroPanel />
      <CustomHeader />
      <AboutMe />
      <Quote text="Luck Is What Happens When Preparation Meets Opportunity." author="Seneca" />
      <Skills />
      <Experience />
      <Quote text="Believe you can and you're halfway there." author="Theodore Roosevelt" />
      <Portfolio
        showcase={<ShowcaseSection />}
        project={<ProjectSection />}
      />
      <Resume />
      <Quote text="Someone's sitting in the shade today because someone planted a tree long time ago" author="Warren Buffett" />
      <Contact />
    </>
  );
}
