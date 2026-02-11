import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CommunityList } from "@/components/community/CommunityList";
import { CommunityFeatures } from "@/components/community/CommunityFeatures";

export default function Community() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <div className="flex-1">
        <div className="mt-16 container mx-auto p-6 space-y-8">
          <h1 className="text-3xl font-bold">Healthcare Community</h1>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <CommunityList />
            </div>
            <div>
              <CommunityFeatures />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
} 