import HeroPanel from "../components/sections/HeroPanel";
import CustomHeader from "../components/sections/CustomHeader";
import AboutMe from "../components/sections/AboutMe";
import Skills from "../components/sections/Skills";
import Experience from "../components/sections/Experience";
import Portfolio from "../components/sections/Portfolio";
import Resume from "../components/sections/Resume";
import Contact from "../components/sections/Contact";
import Quote from "../components/sections/Quote";

export default function Home() {
  return (
    <>
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
