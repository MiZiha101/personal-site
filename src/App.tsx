import { SiteDataProvider, useSiteData } from './store/siteData';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Skills } from './components/Skills';
import { Projects } from './components/Projects';
import { Notes } from './components/Notes';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { BackToTop } from './components/BackToTop';
import { EditFab } from './components/EditFab';
import { EditDrawer } from './components/edit/EditDrawer';
import { LoginGate } from './components/auth/LoginGate';
import { SectionDivider } from './components/ui/SectionHeading';
import { useReveal } from './hooks/useReveal';

function Page() {
  const { data } = useSiteData();

  // 内容结构变化时重新扫描一次，保证新增的条目也能正常淡入
  useReveal(
    [
      data.projects.length,
      data.posts.length,
      data.skillGroups.length,
      data.profile.timeline.length,
      data.profile.campus.length,
    ].join('-'),
  );

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <SectionDivider />
        <About />
        <SectionDivider />
        <Skills />
        <SectionDivider />
        <Projects />
        <SectionDivider />
        <Notes />
        <SectionDivider />
        <Contact />
      </main>
      <Footer />
      <BackToTop />
      <EditFab />
      <EditDrawer />
      <LoginGate />
    </>
  );
}

export default function App() {
  return (
    <SiteDataProvider>
      <Page />
    </SiteDataProvider>
  );
}
