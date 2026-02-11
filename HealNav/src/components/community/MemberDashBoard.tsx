import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Settings, MessageSquare, Trophy, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function MemberDashboard() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center space-y-4">
            <Avatar className="h-24 w-24">
              <AvatarImage src="/placeholder.svg" alt="Profile picture" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <div className="text-center">
              <h3 className="font-semibold text-lg">John Doe</h3>
              <Badge variant="secondary" className="mt-1">Premium Member</Badge>
            </div>
          </div>
          
          <div className="mt-6 space-y-2">
            <Button variant="outline" className="w-full justify-start">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <MessageSquare className="mr-2 h-4 w-4" />
              Messages
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Trophy className="mr-2 h-4 w-4" />
              Achievements
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <HelpCircle className="mr-2 h-4 w-4" />
              Support
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}