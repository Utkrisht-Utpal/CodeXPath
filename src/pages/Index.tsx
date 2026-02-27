import Hero from "@/components/Hero";
import AnalyzeSection from "@/components/AnalyzeSection";
import Features from "@/components/Features";
import DemoSection from "@/components/DemoSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Hero />
      <AnalyzeSection />
      <Features />
      <DemoSection />
      <Footer />
    </div>
  );
};

export default Index;
