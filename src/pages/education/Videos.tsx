import { Navbar } from "@/components/layout/Navbar";
import { PageHeader } from "@/components/PageHeader";
import { Footer } from "@/components/layout/Footer";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Play, Clock, BookOpen, ThumbsUp, Share2 } from "lucide-react";

interface Video {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  duration: string;
  views: number;
  likes: number;
  category: string;
  tags: string[];
  instructor: string;
  date: string;
}

const healthVideos: Record<string, Video[]> = {
  featured: [
    {
      id: "1",
      title: "Understanding Mental Health: A Comprehensive Guide",
      description: "Learn about the fundamentals of mental health and well-being from expert psychologists.",
      thumbnail: "/mental-health.jpg",
      duration: "15:30",
      views: 15000,
      likes: 1200,
      category: "Mental Health",
      tags: ["Mental Health", "Psychology", "Well-being"],
      instructor: "Dr. Sarah Johnson",
      date: "2024-03-15"
    },
    {
      id: "2",
      title: "Nutrition Essentials: Building a Healthy Diet",
      description: "Expert nutritionists share key principles for maintaining a balanced and healthy diet.",
      thumbnail: "/nutrition.jpg",
      duration: "12:45",
      views: 12000,
      likes: 950,
      category: "Nutrition",
      tags: ["Nutrition", "Diet", "Health"],
      instructor: "Dr. Michael Chen",
      date: "2024-03-10"
    }
  ],
  nutrition: [
    {
      id: "3",
      title: "Meal Prep Basics for Busy Professionals",
      description: "Learn efficient meal preparation techniques for a healthy lifestyle.",
      thumbnail: "/meal-prep.jpg",
      duration: "18:20",
      views: 8500,
      likes: 720,
      category: "Nutrition",
      tags: ["Meal Prep", "Cooking", "Healthy Eating"],
      instructor: "Chef Maria Garcia",
      date: "2024-03-08"
    }
  ],
  fitness: [
    {
      id: "4",
      title: "Home Workout Series: No Equipment Needed",
      description: "Full-body workout routines you can do at home without any special equipment.",
      thumbnail: "/fitness.jpg",
      duration: "25:15",
      views: 20000,
      likes: 1500,
      category: "Fitness",
      tags: ["Workout", "Fitness", "Home Exercise"],
      instructor: "Alex Thompson",
      date: "2024-03-05"
    }
  ],
  wellness: [
    {
      id: "5",
      title: "Stress Management Through Mindfulness",
      description: "Discover effective mindfulness techniques for managing daily stress.",
      thumbnail: "/mindfulness.jpg",
      duration: "20:10",
      views: 10000,
      likes: 850,
      category: "Wellness",
      tags: ["Mindfulness", "Stress", "Mental Health"],
      instructor: "Dr. Emma Wilson",
      date: "2024-03-01"
    }
  ]
};

export default function Videos() {
  return (
    <div className="flex flex-col bg-gray-50">
      <Navbar />
      <div className="min-h-[88vh] mt-16">
        <PageHeader
          title="Educational Health Videos"
          subtitle="Learn from expert-led videos on various health topics"
        />
        
        <main className="container mx-auto px-4 py-8 space-y-8">
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input 
                placeholder="Search videos..." 
                className="pl-10"
              />
            </div>
          </div>

          {/* Video Categories */}
          <Tabs defaultValue="featured" className="space-y-6">
            <TabsList className="grid w-full max-w-[600px] grid-cols-4 mx-auto">
              <TabsTrigger value="featured">Featured</TabsTrigger>
              <TabsTrigger value="nutrition">Nutrition</TabsTrigger>
              <TabsTrigger value="fitness">Fitness</TabsTrigger>
              <TabsTrigger value="wellness">Wellness</TabsTrigger>
            </TabsList>

            {Object.entries(healthVideos).map(([category, videos]) => (
              <TabsContent key={category} value={category}>
                <div className="grid md:grid-cols-2 gap-6">
                  {videos.map((video) => (
                    <Card key={video.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                      <div className="relative">
                        <img 
                          src={video.thumbnail} 
                          alt={video.title}
                          className=" w-full h-48 object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                          <Button size="icon" variant="ghost" className="text-white">
                            <Play className="h-12 w-12" />
                          </Button>
                        </div>
                        <Badge className="absolute top-2 right-2">
                          {video.duration}
                        </Badge>
                      </div>
                      
                      <div className="p-4 space-y-4">
                        <div>
                          <h3 className="font-semibold text-lg line-clamp-2">{video.title}</h3>
                          <p className="text-sm text-gray-500 mt-1">{video.instructor}</p>
                        </div>
                        
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {video.description}
                        </p>
                        
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <div className="flex items-center gap-4">
                            <span className="flex items-center gap-1">
                              <BookOpen className="h-4 w-4" />
                              {video.views.toLocaleString()} views
                            </span>
                            <span className="flex items-center gap-1">
                              <ThumbsUp className="h-4 w-4" />
                              {video.likes.toLocaleString()}
                            </span>
                          </div>
                          <Button size="icon" variant="ghost">
                            <Share2 className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {video.tags.map((tag) => (
                            <Badge key={tag} variant="secondary">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </main>
      </div>
      <Footer />
    </div>
  );
} 