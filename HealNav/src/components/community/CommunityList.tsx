import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, MapPin, Calendar, Star, Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const communities = [
  {
    id: 1,
    name: "Diabetes Support Network India",
    members: 1250,
    type: "Condition-Specific",
    location: "Pan India",
    topics: ["Ayurvedic Diet", "Medication Management", "Yoga"],
    rating: 4.8,
    nextMeet: "2024-01-15",
    language: ["Hindi", "English"],
    experts: 5,
    activeMembers: 850,
    description: "A supportive community for diabetes management through traditional and modern approaches.",
    meetingFrequency: "Weekly",
    upcomingEvents: [
      { title: "Diet Planning Workshop", date: "2024-01-15" },
      { title: "Yoga for Diabetics", date: "2024-01-20" }
    ],
    resources: ["Diet Charts", "Exercise Videos", "Meditation Guides"]
  },
  {
    id: 2,
    name: "Delhi NCR Wellness Group",
    members: 450,
    type: "Local",
    location: "Delhi NCR",
    topics: ["Meditation", "Mental Health", "Holistic Healing"],
    rating: 4.6,
    nextMeet: "2024-01-18",
    language: ["Hindi", "English", "Punjabi"],
    experts: 3,
    activeMembers: 380,
    description: "Local wellness community focusing on mental health and holistic well-being.",
    meetingFrequency: "Bi-weekly",
    upcomingEvents: [
      { title: "Group Meditation Session", date: "2024-01-18" },
      { title: "Stress Management Workshop", date: "2024-01-25" }
    ],
    resources: ["Meditation Tracks", "Wellness Articles", "Expert Talks"]
  },
  {
    id: 3,
    name: "Pregnancy & Maternal Care Circle",
    members: 780,
    type: "Support Group",
    location: "Pan India",
    topics: ["Prenatal Care", "Postnatal Wellness", "Baby Care", "Nutrition"],
    rating: 4.9,
    nextMeet: "2024-01-16",
    language: ["Hindi", "English", "Tamil", "Telugu"],
    experts: 6,
    activeMembers: 650,
    description: "A supportive community for expecting and new mothers, blending modern healthcare with traditional Indian practices.",
    meetingFrequency: "Twice Weekly",
    upcomingEvents: [
      { title: "Garbh Sanskar Workshop", date: "2024-01-16" },
      { title: "Postnatal Yoga Session", date: "2024-01-19" },
      { title: "New Mom's Support Circle", date: "2024-01-22" }
    ],
    resources: [
      "Pregnancy Diet Charts",
      "Traditional Recipes",
      "Exercise Videos",
      "Baby Care Guides",
      "Lactation Support Resources"
    ]
  },
  {
    id: 4,
    name: "Senior Citizens Wellness Hub",
    members: 620,
    type: "Age-Specific",
    location: "Pan India",
    topics: ["Active Aging", "Memory Health", "Joint Care", "Social Activities"],
    rating: 4.7,
    nextMeet: "2024-01-17",
    language: ["Hindi", "English", "Gujarati", "Bengali"],
    experts: 4,
    activeMembers: 450,
    description: "A vibrant community for senior citizens focusing on active aging, social connections, and holistic wellness.",
    meetingFrequency: "Daily Morning Sessions",
    upcomingEvents: [
      { title: "Morning Yoga for Seniors", date: "2024-01-17" },
      { title: "Memory Enhancement Workshop", date: "2024-01-20" },
      { title: "Social Meet & Greet", date: "2024-01-23" }
    ],
    resources: [
      "Age-Specific Exercise Videos",
      "Brain Games Collection",
      "Healthy Recipes for Seniors",
      "Social Activity Calendar",
      "Healthcare Guidelines"
    ]
  }
];

interface CommunityModalProps {
  community: typeof communities[0];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function CommunityModal({ community, open, onOpenChange }: CommunityModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            {community.name}
            <Badge>{community.type}</Badge>
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="about" className="mt-6">
          <TabsList className="grid grid-cols-4 gap-4">
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
            <TabsTrigger value="members">Members</TabsTrigger>
          </TabsList>

          <TabsContent value="about" className="space-y-4">
            <div className="prose prose-sm">
              <p className="text-muted-foreground">{community.description}</p>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <h4 className="font-medium">Meeting Frequency</h4>
                  <p className="text-sm text-muted-foreground">{community.meetingFrequency}</p>
                </div>
                <div>
                  <h4 className="font-medium">Languages</h4>
                  <div className="flex gap-2 mt-1">
                    {community.language.map(lang => (
                      <Badge key={lang} variant="outline">{lang}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="events" className="space-y-4">
            <div className="divide-y">
              {community.upcomingEvents.map((event, index) => (
                <div key={index} className="py-3">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">{event.title}</h4>
                    <Badge variant="outline">
                      {new Date(event.date).toLocaleDateString('en-IN')}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="resources" className="space-y-4">
            <div className="grid grid-cols-1 gap-3">
              {community.resources.map((resource, index) => (
                <Card key={index}>
                  <CardContent className="p-4 flex justify-between items-center">
                    <span>{resource}</span>
                    <Button variant="outline" size="sm">Access</Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="members" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold">{community.members}</div>
                  <div className="text-sm text-muted-foreground">Total Members</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold">{community.experts}</div>
                  <div className="text-sm text-muted-foreground">Expert Mentors</div>
                </CardContent>
              </Card>
            </div>
            <Button className="w-full">Request to Join</Button>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

export function CommunityList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterLocation, setFilterLocation] = useState("all");
  const [selectedCommunity, setSelectedCommunity] = useState<typeof communities[0] | null>(null);

  const locations = Array.from(new Set(communities.map(c => c.location)));
  const types = Array.from(new Set(communities.map(c => c.type)));

  const filteredCommunities = communities.filter(community => {
    const matchesSearch = community.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         community.topics.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesType = filterType === "all" || community.type === filterType;
    const matchesLocation = filterLocation === "all" || community.location === filterLocation;
    return matchesSearch && matchesType && matchesLocation;
  });

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search communities..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {types.map(type => (
              <SelectItem key={type} value={type}>{type}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={filterLocation} onValueChange={setFilterLocation}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filter by location" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Locations</SelectItem>
            {locations.map(location => (
              <SelectItem key={location} value={location}>{location}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Community Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredCommunities.map((community) => (
          <Card 
            key={community.id} 
            className="hover:shadow-lg transition-shadow"
          >
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl">{community.name}</CardTitle>
                  <div className="flex items-center gap-[2.5px] mt-4">
                    <Badge variant="secondary">{community.type}</Badge>
                    {community.language.map(lang => (
                      <Badge key={lang} variant="outline">{lang}</Badge>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="font-medium">{community.rating}</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-emerald-500" />
                    <div>
                      <div className="font-medium">{community.members.toLocaleString('en-IN')}</div>
                      <div className="text-muted-foreground">Total Members</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-emerald-500" />
                    <div>
                      <div className="font-medium">{community.activeMembers.toLocaleString('en-IN')}</div>
                      <div className="text-muted-foreground">Active Members</div>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">{community.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">
                      Next Meet: {new Date(community.nextMeet).toLocaleDateString('en-IN')}
                    </span>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium mb-2">Topics:</p>
                  <div className="flex flex-wrap gap-2">
                    {community.topics.map((topic, i) => (
                      <Badge key={i} variant="secondary">
                        {topic}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button className="flex-1">Join Community</Button>
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => setSelectedCommunity(community)}
                  >
                    Learn More
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedCommunity && (
        <CommunityModal
          community={selectedCommunity}
          open={selectedCommunity !== null}
          onOpenChange={(open) => !open && setSelectedCommunity(null)}
        />
      )}
    </div>
  );
}