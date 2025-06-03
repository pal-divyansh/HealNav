import { Navbar } from "@/components/layout/Navbar";
import { PageHeader } from "@/components/PageHeader";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

const heartHealthContent = {
  introduction: `
    Heart health is crucial for overall well-being. Understanding cardiovascular health
    and taking preventive measures can significantly reduce the risk of heart disease.
  `,
  sections: [
    {
      title: "Understanding Blood Pressure",
      content: `Blood pressure is a vital sign that measures the force of blood pushing against 
      the walls of your arteries. High blood pressure (hypertension) can lead to serious 
      health problems if left untreated.`,
      externalLink: "https://www.heart.org/en/health-topics/high-blood-pressure",
      linkText: "Learn more about blood pressure at American Heart Association"
    },
    {
      title: "Heart-Healthy Diet",
      content: `A heart-healthy diet emphasizes fruits, vegetables, whole grains, and lean 
      protein sources while limiting saturated fats, trans fats, and excess sodium.`,
      externalLink: "https://www.mayoclinic.org/diseases-conditions/heart-disease/in-depth/heart-healthy-diet/art-20047702",
      linkText: "Mayo Clinic's guide to heart-healthy diet"
    }
  ]
};

export default function HeartHealth() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <div className="flex-1">
        <div className="mt-16">
          <PageHeader
            title="Heart Health"
            subtitle="Understanding and maintaining cardiovascular health"
          />
          <main className="container mx-auto px-4 py-8 space-y-8">
            <Card>
              <CardContent className="p-6 prose prose-slate max-w-none">
                <p className="text-lg text-muted-foreground">
                  {heartHealthContent.introduction}
                </p>
                
                {heartHealthContent.sections.map((section, index) => (
                  <div key={index} className="mt-8">
                    <h2 className="text-2xl font-semibold mb-4">{section.title}</h2>
                    <p className="mb-4">{section.content}</p>
                    <Button variant="outline" asChild>
                      <a 
                        href={section.externalLink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-2"
                      >
                        {section.linkText}
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
      <Footer />
    </div>
  );
} 