import Hero from '@/components/sections/Hero';
import Marquee from '@/components/sections/Marquee';
import About from '@/components/sections/About';
import Experience from '@/components/sections/Experience';
import Projects from '@/components/sections/Projects';
import Stack from '@/components/sections/Stack';
import Achievements from '@/components/sections/Achievements';
import Education from '@/components/sections/Education';
import Contact from '@/components/sections/Contact';
import Footer from '@/components/sections/Footer';

export default function Home() {
  return (
    <>
      <Hero />
      <Marquee />
      <About />
      <Experience />
      <Projects />
      <Stack />
      <Achievements />
      <Education />
      <Contact />
      <Footer />
    </>
  );
}
