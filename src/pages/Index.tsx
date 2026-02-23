import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import SkillsSection from "@/components/SkillsSection";
import SkillLogosMarquee from "@/components/SkillLogosMarquee";
import ProjectsSection from "@/components/ProjectsSection";
import ExperienceSection from "@/components/ExperienceSection";
import CertificationsSection from "@/components/CertificationsSection";
import ChatSection from "@/components/ChatSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <Hero />
        <SkillsSection />
        <SkillLogosMarquee />
        <ProjectsSection />
        <ExperienceSection />
        <CertificationsSection />
        <ChatSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
