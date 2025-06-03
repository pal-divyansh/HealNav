import { Navbar } from "@/components/layout/Navbar";
import { PageHeader } from "@/components/PageHeader";
import { Footer } from "@/components/layout/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Users } from "lucide-react";

const webinars = [
  {
    title: "Latest Advances in Diabetes Management",
    date: "2024-04-15T14:00:00",
    duration: "60 min",
    speaker: "Dr. Emily Roberts",
    spots: 50,
    spotsLeft: 12,
    description: "Join us for an informative session about modern diabetes management techniques.",
  },
  {
    title: "Mental Health in the Digital Age",
    date: "2024-04-20T15:30:00",
    duration: "45 min",
    speaker: "Dr. James Wilson",
    spots: 100,
    spotsLeft: 35,
    description: "Understanding the impact of technology on mental health and wellness.",
  },
  {
    title: "AI in Healthcare: Opportunities and Challenges",
    date: "2024-05-10T16:00:00",
    duration: "90 min",
    speaker: "Dr. Sarah Thompson",
    spots: 75,
    spotsLeft: 50,
    description: "Explore the transformative impact of AI technologies in the healthcare sector.",
  },
  // Add more webinars as needed
];

export default function Webinars() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <div className="mt-16">
        <PageHeader
          title="Upcoming Health Webinars"
          subtitle="Join live interactive sessions with healthcare experts."
        />
        
        <main className="container mx-auto px-4 py-8">
          <div className="grid gap-6">
            {webinars.map((webinar) => (
              <Card key={webinar.title} className="p-6">
                <div className="flex flex-col md:flex-row md:items-center gap-6">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2">{webinar.title}</h3>
                    <p className="text-gray-600 mb-4">{webinar.description}</p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-primary" />
                        <span className="text-sm">
                          {new Date(webinar.date).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-primary" />
                        <span className="text-sm">{webinar.duration}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-primary" />
                        <span className="text-sm">
                          {webinar.spotsLeft} spots left
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-500 mb-4">
                      Speaker: {webinar.speaker}
                    </p>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <Button className="w-full md:w-auto">
                      Register Now
                    </Button>
                    <Button variant="outline" className="w-full md:w-auto">
                      Add to Calendar
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
} 