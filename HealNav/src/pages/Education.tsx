import { Navbar } from "@/components/layout/Navbar";
import { PageHeader } from "@/components/PageHeader";
import { Footer } from "@/components/layout/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Video, Calendar, Calculator, Users } from "lucide-react";
import { Link } from "react-router-dom";

const educationalResources = [
  {
    title: "Health Articles",
    type: "Article Collection",
    description: "Comprehensive guides about various health conditions and preventive care.",
    icon: BookOpen,
    link: "/education/articles",
    color: "text-blue-500",
    bgColor: "bg-blue-50"
  },
  {
    title: "Video Library",
    type: "Video Content",
    description: "Expert-led videos covering various health topics and wellness practices.",
    icon: Video,
    link: "/education/videos",
    color: "text-purple-500",
    bgColor: "bg-purple-50"
  },
  {
    title: "Live Webinars",
    type: "Interactive Sessions",
    description: "Join live sessions with healthcare professionals and wellness experts.",
    icon: Calendar,
    link: "/education/webinars",
    color: "text-emerald-500",
    bgColor: "bg-emerald-50"
  },
  {
    title: "Health Tools",
    type: "Interactive Tools",
    description: "BMI calculator, calorie counter, and other useful health assessment tools.",
    icon: Calculator,
    link: "/education/tools",
    color: "text-amber-500",
    bgColor: "bg-amber-50"
  },
  {
    title: "Healthcare Community",
    type: "Community Platform",
    description: "Connect with others, share experiences, and join health-focused groups.",
    icon: Users,
    link: "/education/community",
    color: "text-rose-500",
    bgColor: "bg-rose-50"
  }
];

const featuredArticles = [
  {
    title: "Mental Health & Wellness",
    description: "Understanding mental wellness and self-care practices.",
    link: "/education/articles/mental-health",
    icon: "🧠"
  },
  {
    title: "Nutrition Guide",
    description: "Essential information about balanced diet and healthy eating.",
    link: "/education/articles/nutrition",
    icon: "🥗"
  },
  {
    title: "Upcoming Webinar",
    description: "Latest Advances in Diabetes Management - Join Live Session",
    link: "/education/webinars",
    icon: "📅"
  }
];

export default function Education() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <div className="mt-16">
        <PageHeader
          title="Health Education Center"
          subtitle="Explore our comprehensive collection of health and wellness resources."
        />
        
        <main className="flex-1 container mx-auto px-4 py-8 space-y-12">
          {/* Main Resources */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {educationalResources.map((resource) => (
              <Card key={resource.title} className="p-6 hover:shadow-lg transition-all">
                <div className="flex items-start space-x-4">
                  <div className={`p-3 rounded-lg ${resource.bgColor}`}>
                    <resource.icon className={`h-6 w-6 ${resource.color}`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-1">{resource.title}</h3>
                    <p className="text-sm text-gray-500 mb-1">{resource.type}</p>
                    <p className="text-sm text-gray-600 mb-4">{resource.description}</p>
                    <Button variant="outline" asChild>
                      <Link to={resource.link}>Explore Now</Link>
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Featured Content */}
          <div>
            <h2 className="text-2xl font-semibold mb-6">Featured Content</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredArticles.map((article) => (
                <Card key={article.title} className="p-6 hover:shadow-lg transition-all">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xl">{article.icon}</span>
                    <h3 className="font-semibold">{article.title}</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    {article.description}
                  </p>
                  <Button variant="link" asChild className="px-0">
                    <Link to={article.link}>Learn More →</Link>
                  </Button>
                </Card>
              ))}
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}