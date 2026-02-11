import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, Phone, Mail, Calendar, Activity, Heart, Ruler, Weight, Droplet } from "lucide-react";

interface PatientDetailsProps {
  patient: {
    name: string;
    age: number;
    gender: string;
    email: string;
    phone: string;
    bloodGroup: string;
    location: string;
    condition: string;
    progress: string;
    avatar: string;
    communities: number;
    lastVisit: string;
    nextAppointment: string;
    vitals: {
      bp: string;
      sugar: string;
      weight: string;
      height: string;
    };
    medicalHistory: Array<{
      date: string;
      condition: string;
      notes: string;
      doctor: string;
    }>;
  };
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PatientDetails({ patient, open, onOpenChange }: PatientDetailsProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={patient.avatar} alt={patient.name} />
              <AvatarFallback>{patient.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <div>
              <DialogTitle className="text-2xl flex items-center gap-2">
                {patient.name}
                <Badge>{patient.gender}</Badge>
                <Badge variant="outline">{patient.bloodGroup}</Badge>
              </DialogTitle>
              <div className="flex items-center gap-4 mt-2 text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Activity className="w-4 h-4" />
                  {patient.age} years
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {patient.location}
                </span>
              </div>
            </div>
          </div>
        </DialogHeader>

        <Tabs defaultValue="overview" className="mt-6">
          <TabsList className="grid grid-cols-4 gap-4 bg-muted">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="vitals">Vitals</TabsTrigger>
            <TabsTrigger value="history">Medical History</TabsTrigger>
            <TabsTrigger value="contact">Contact Info</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-4 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-2">Current Condition</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Diagnosis:</span>
                      <Badge variant="secondary">{patient.condition}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Progress:</span>
                      <Badge variant="outline">{patient.progress}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-2">Appointments</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4" />
                      <span>Last Visit: {new Date(patient.lastVisit).toLocaleDateString('en-IN')}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4" />
                      <span>Next Appointment: {new Date(patient.nextAppointment).toLocaleDateString('en-IN')}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="vitals" className="mt-4">
            <Card>
              <CardContent className="pt-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-2 text-center p-4 bg-muted rounded-lg">
                    <Heart className="w-6 h-6 mx-auto text-red-500" />
                    <div className="text-sm font-medium">Blood Pressure</div>
                    <div className="text-2xl font-bold">{patient.vitals.bp}</div>
                  </div>
                  <div className="space-y-2 text-center p-4 bg-muted rounded-lg">
                    <Droplet className="w-6 h-6 mx-auto text-blue-500" />
                    <div className="text-sm font-medium">Blood Sugar</div>
                    <div className="text-2xl font-bold">{patient.vitals.sugar}</div>
                  </div>
                  <div className="space-y-2 text-center p-4 bg-muted rounded-lg">
                    <Weight className="w-6 h-6 mx-auto text-emerald-500" />
                    <div className="text-sm font-medium">Weight</div>
                    <div className="text-2xl font-bold">{patient.vitals.weight}</div>
                  </div>
                  <div className="space-y-2 text-center p-4 bg-muted rounded-lg">
                    <Ruler className="w-6 h-6 mx-auto text-purple-500" />
                    <div className="text-sm font-medium">Height</div>
                    <div className="text-2xl font-bold">{patient.vitals.height}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="mt-4">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-6">
                  {patient.medicalHistory.map((record, index) => (
                    <div key={index} className="relative pl-4 border-l-2 border-emerald-500">
                      <div className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-emerald-500" />
                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <span className="font-semibold">{record.condition}</span>
                          <span className="text-sm text-muted-foreground">
                            {new Date(record.date).toLocaleDateString('en-IN')}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">{record.notes}</p>
                        <p className="text-sm font-medium">{record.doctor}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contact" className="mt-4">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Phone className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <div className="font-medium">Phone</div>
                      <div className="text-muted-foreground">{patient.phone}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <div className="font-medium">Email</div>
                      <div className="text-muted-foreground">{patient.email}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <div className="font-medium">Location</div>
                      <div className="text-muted-foreground">{patient.location}</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}