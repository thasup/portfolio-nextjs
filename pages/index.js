import Head from "next/head";

import HeroPanel from "../components/HeroPanel";
import CustomHeader from "../components/CustomHeader";
import AboutMe from "../components/AboutMe";
import Skills from "../components/Skills";
import Experience from "../components/Experience";
import Showcase from "../components/Showcase";
import Project from "../components/Project";
import Education from "../components/Education";
import Resume from "../components/Resume";
import Contact from "../components/Contact";

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
      <Skills />
      <Experience showcase={<Showcase />} project={<Project />} />
      <Education />
      <Resume />
      <Contact />
    </>
  );
}
