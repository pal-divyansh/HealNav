import { PageHeader } from "@/components/PageHeader";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import {PatientDashboards} from "@/components/community/PatientDashboards";
import { CommunityList } from "@/components/community/CommunityList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Community() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <PageHeader
        title="Community Hub"
        subtitle="Connect with others, track your progress, and achieve your health goals together."
      />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        {/* <SearchBar /> */}
        
        <Tabs defaultValue="dashboards" className="mt-8">
          <TabsList className="grid w-full grid-cols-2 max-w-[400px] mx-auto">
            <TabsTrigger value="dashboards">Patient Dashboards</TabsTrigger>
            <TabsTrigger value="communities">Communities</TabsTrigger>
          </TabsList>
          
          <TabsContent value="dashboards" className="mt-6">
            <PatientDashboards />
          </TabsContent>
          
          <TabsContent value="communities" className="mt-6">
            <CommunityList />
          </TabsContent>
        </Tabs>
      </main>
      
      <Footer />
    </div>
  );
}