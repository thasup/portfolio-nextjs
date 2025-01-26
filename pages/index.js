import Head from "next/head";

import HeroPanel from "../components/HeroPanel";
import CustomHeader from "../components/CustomHeader";
import AboutMe from "../components/AboutMe";
import Skills from "../components/Skills";
import Experience from "../components/Experience";
import Portfolio from "../components/Portfolio";
import Resume from "../components/Resume";
import Contact from "../components/Contact";
import Quote from "../components/Quote";

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
      <Portfolio />
      <Resume />
      <Quote text="Someone's sitting in the shade today because someone planted a tree long time ago" author="Warren Buffett" />
      <Contact />
    </>
  );
}
