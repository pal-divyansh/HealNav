import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PageHeader } from "@/components/PageHeader";
import { MedicalChatbot } from "@/components/MedicalChatbot";

export default function MedicalBot() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <div className="mt-16">
        <PageHeader
          title="AI Medical Assistant"
          subtitle="Get instant health guidance and support through our intelligent medical chatbot."
        />
        
        <main className="flex-1 container mx-auto px-4 py-8">
          <MedicalChatbot />
        </main>
      </div>
      <Footer />
    </div>
  );
}