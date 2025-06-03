
import { HeroSection } from "@/components/HeroSection";
import { FeaturesSection } from "@/components/FeaturesSection";
import { DemoSection } from "@/components/DemoSection";
import { FAQSection } from "@/components/FAQSection";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <div className="mt-16 ">
        <div className="space-y-0">
          <HeroSection />
          <FeaturesSection />
          <DemoSection />
          <FAQSection />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Index;