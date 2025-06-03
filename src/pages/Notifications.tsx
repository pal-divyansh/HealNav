/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useRef } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Bell, Calendar, Clock, Pill, Check, X, Plus, Trash2, Filter, MoreVertical } from "lucide-react";
import { Footer } from "@/components/layout/Footer";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Notification {
  id: string;
  title: string;
  description: string;
  time: string;
  icon: any;
  active: boolean;
  type: string;
  category: 'all' | 'medication' | 'appointment' | 'exercise';
}

interface Preference {
  name: string;
  description: string;
  enabled: boolean;
}

const initialNotifications: Notification[] = [
  {
    id: "1",
    title: "Medication Reminder",
    description: "Take vitamin D supplement",
    time: "Daily at 9:00 AM",
    icon: Pill,
    active: true,
    type: "medication",
    category: 'medication',
  },
  {
    id: "2",
    title: "Appointment",
    description: "Annual check-up with Dr. Smith",
    time: "March 15, 2024 at 2:30 PM",
    icon: Calendar,
    active: true,
    type: "appointment",
    category: 'appointment',
  },
  {
    id: "3",
    title: "Exercise Reminder",
    description: "30 minutes of cardio",
    time: "Every Monday, Wednesday, Friday at 6:00 PM",
    icon: Clock,
    active: false,
    type: "exercise",
    category: 'exercise',
  },
];

const preferences: Preference[] = [
  { name: "Email Notifications", description: "Receive updates via email", enabled: true },
  { name: "SMS Notifications", description: "Get text message alerts", enabled: false },
  { name: "Push Notifications", description: "Browser notifications", enabled: true },
  { name: "Weekly Summary", description: "Receive weekly health report", enabled: true },
];

export default function Notifications() {
  const [notificationsList, setNotificationsList] = useState<Notification[]>(initialNotifications);
  const [userPreferences, setUserPreferences] = useState<Preference[]>(preferences);
  const [isAddingReminder, setIsAddingReminder] = useState(false);
  const [newReminder, setNewReminder] = useState({
    title: "",
    description: "",
    type: "medication",
    time: "",
  });
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>([]);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const toggleNotification = (id: string) => {
    setNotificationsList((prev) =>
      prev.map((notification) =>
        notification.id === id
          ? { ...notification, active: !notification.active }
          : notification
      )
    );
    toast({
      title: "Notification Updated",
      description: "Your notification preferences have been saved.",
    });
  };

  const togglePreference = (index: number) => {
    const updatedPreferences = [...userPreferences];
    updatedPreferences[index].enabled = !updatedPreferences[index].enabled;
    setUserPreferences(updatedPreferences);
    toast({
      title: "Preferences Updated",
      description: "Your notification preferences have been saved.",
    });
  };

  const handleAddReminder = () => {
    if (!newReminder.title || !newReminder.description || !newReminder.time) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    const iconMap: { [key: string]: any } = {
      medication: Pill,
      appointment: Calendar,
      exercise: Clock,
    };

    const newNotification: Notification = {
      id: Date.now().toString(),
      title: newReminder.title,
      description: newReminder.description,
      time: newReminder.time,
      icon: iconMap[newReminder.type] || Bell,
      active: true,
      type: newReminder.type,
      category: 'medication',
    };

    setNotificationsList((prev) => [newNotification, ...prev]);
    setNewReminder({ title: "", description: "", type: "medication", time: "" });
    setIsAddingReminder(false);
    toast({
      title: "Reminder Added",
      description: "Your new reminder has been created successfully.",
    });
  };

  const handleMarkAsDone = (id: string) => {
    setNotificationsList((prev) =>
      prev.map((notification) =>
        notification.id === id
          ? { ...notification, active: false }
          : notification
      )
    );
    toast({
      title: "Marked as Done",
      description: "The reminder has been marked as completed.",
    });
  };

  const handleSnooze = (id: string) => {
    toast({
      title: "Reminder Snoozed",
      description: "This reminder will notify you again in 1 hour.",
    });
  };

  const handleDelete = (id: string) => {
    setNotificationsList((prev) => prev.filter((notification) => notification.id !== id));
    toast({
      title: "Notification Deleted",
      description: "The reminder has been removed.",
    });
  };

  const handleBatchAction = (action: 'delete' | 'markDone' | 'snooze') => {
    switch (action) {
      case 'delete':
        setNotificationsList((prev) => 
          prev.filter((notification) => !selectedNotifications.includes(notification.id))
        );
        break;
      // ... other cases
    }
    setSelectedNotifications([]);
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file",
        variant: "destructive",
      });
      return;
    }

    // Check file size (e.g., 5MB limit)
    const MAX_SIZE = 5 * 1024 * 1024; // 5MB
    if (file.size > MAX_SIZE) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 5MB",
        variant: "destructive",
      });
      return;
    }

    try {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Image = reader.result as string;
        
        // Add the image to the new reminder
        setNewReminder(prev => ({
          ...prev,
          image: base64Image
        }));
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error processing image:', error);
      toast({
        title: "Error",
        description: "Failed to process the image",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <div className="mt-16">
        <PageHeader
          title="Smart Notifications"
          subtitle="Stay on top of your health goals with timely reminders."
        />
        
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto space-y-8">
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">Notification Preferences</h2>
              <div className="space-y-4">
                {userPreferences.map((preference, index) => (
                  <div key={preference.name} className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="text-sm font-medium">{preference.name}</div>
                      <div className="text-sm text-gray-500">{preference.description}</div>
                    </div>
                    <Switch
                      checked={preference.enabled}
                      onCheckedChange={() => togglePreference(index)}
                    />
                  </div>
                ))}
              </div>
            </Card>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Active Reminders</h2>
                
                {selectedNotifications.length > 0 && (
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleBatchAction('delete')}
                    >
                      Delete Selected
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleBatchAction('markDone')}
                    >
                      Mark Selected Done
                    </Button>
                  </div>
                )}
              </div>

              <Tabs defaultValue="all" className="w-full">
                <TabsList>
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="medication">Medication</TabsTrigger>
                  <TabsTrigger value="appointment">Appointments</TabsTrigger>
                  <TabsTrigger value="exercise">Exercise</TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="space-y-4">
                  {notificationsList.map((notification) => (
                    <Card key={notification.id} className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex gap-4 items-center">
                          <input
                            type="checkbox"
                            className="mt-1"
                            checked={selectedNotifications.includes(notification.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedNotifications([...selectedNotifications, notification.id]);
                              } else {
                                setSelectedNotifications(selectedNotifications.filter(id => id !== notification.id));
                              }
                            }}
                          />
                          <div className="flex items-center justify-center p-2 max-h-10 bg-primary/10 rounded-lg">
                            <notification.icon className="w-5 h-5 text-emerald-500" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium">{notification.title}</h3>
                              <Badge variant="outline">{notification.type}</Badge>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">
                              {notification.description}
                            </p>
                            <p className="text-sm text-gray-500 mt-2">
                              {notification.time}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={notification.active}
                            onCheckedChange={() => toggleNotification(notification.id)}
                          />
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuItem onClick={() => handleMarkAsDone(notification.id)}>
                                <Check className="w-4 h-4 mr-2" /> Mark as Done
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleSnooze(notification.id)}>
                                <Clock className="w-4 h-4 mr-2" /> Snooze
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleDelete(notification.id)}
                                className="text-red-600"
                              >
                                <Trash2 className="w-4 h-4 mr-2" /> Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </Card>
                  ))}
                </TabsContent>
                
                {/* Add similar TabsContent for other categories */}
              </Tabs>
            </div>

            <Dialog open={isAddingReminder} onOpenChange={setIsAddingReminder}>
              <DialogTrigger asChild>
                <Card className="p-6 bg-primary/5 border-primary/20 cursor-pointer hover:bg-primary/10 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary/10 rounded-full">
                      <Plus className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">Want more reminders?</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Set up custom notifications for your specific health goals.
                      </p>
                    </div>
                  </div>
                </Card>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Reminder</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Title</label>
                    <Input
                      value={newReminder.title}
                      onChange={(e) => setNewReminder({ ...newReminder, title: e.target.value })}
                      placeholder="Enter reminder title"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Description</label>
                    <Input
                      value={newReminder.description}
                      onChange={(e) => setNewReminder({ ...newReminder, description: e.target.value })}
                      placeholder="Enter reminder description"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Type</label>
                    <Select
                      value={newReminder.type}
                      onValueChange={(value) => setNewReminder({ ...newReminder, type: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select reminder type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="medication">Medication</SelectItem>
                        <SelectItem value="appointment">Appointment</SelectItem>
                        <SelectItem value="exercise">Exercise</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Time</label>
                    <Input
                      type="text"
                      value={newReminder.time}
                      onChange={(e) => setNewReminder({ ...newReminder, time: e.target.value })}
                      placeholder="e.g., Daily at 9:00 AM"
                    />
                  </div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                  <Button className="w-full" onClick={handleAddReminder}>
                    Add Reminder
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}