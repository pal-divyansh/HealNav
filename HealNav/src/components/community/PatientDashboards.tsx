import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MapPin, Users, Search, Filter, Activity, Calendar, Phone, Mail } from "lucide-react";
import { useState } from "react";
import { PatientDetails } from "./PatientDetails";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Add more patient data
const patients = [
  {
    name: "Priya Sharma",
    age: 45,
    gender: "Female",
    email: "priya.sharma@email.com",
    phone: "+91 98765 43210",
    bloodGroup: "B+",
    location: "Noida, UP",
    condition: "Type 2 Diabetes",
    progress: "Good",
    avatar: "/placeholder.svg",
    communities: 3,
    lastVisit: "2023-12-15",
    nextAppointment: "2024-01-10",
    vitals: {
      bp: "130/85",
      sugar: "140 mg/dL",
      weight: "65 kg",
      height: "165 cm"
    },
    medicalHistory: [
      {
        date: "2023-10-15",
        condition: "Hypertension Diagnosis",
        notes: "Prescribed Amlodipine",
        doctor: "Dr. Gupta"
      },
      {
        date: "2023-08-20",
        condition: "Annual Check-up",
        notes: "All vitals normal, recommended lifestyle modifications",
        doctor: "Dr. Verma"
      },
      {
        date: "2023-05-10",
        condition: "Type 2 Diabetes Diagnosis",
        notes: "Started on Metformin",
        doctor: "Dr. Gupta"
      }
    ]
  },
  {
    name: "Rajesh Kumar",
    age: 52,
    gender: "Male",
    email: "rajesh.kumar@email.com",
    phone: "+91 98765 43211",
    bloodGroup: "O+",
    location: "Gurgaon, HR",
    condition: "Hypertension",
    progress: "Stable",
    avatar: "/placeholder.svg",
    communities: 5,
    lastVisit: "2023-11-20",
    nextAppointment: "2024-01-15",
    vitals: {
      bp: "140/90",
      sugar: "110 mg/dL",
      weight: "78 kg",
      height: "172 cm"
    },
    medicalHistory: [
      {
        date: "2023-11-01",
        condition: "Hypertension Follow-up",
        notes: "Blood pressure stabilized with current medication",
        doctor: "Dr. Patel"
      },
      {
        date: "2023-09-15",
        condition: "Hypertension Diagnosis",
        notes: "Started on beta blockers",
        doctor: "Dr. Patel"
      }
    ]
  },
  {
    name: "Anjali Desai",
    age: 28,
    gender: "Female",
    email: "anjali.desai@email.com",
    phone: "+91 98765 43212",
    bloodGroup: "A+",
    location: "Delhi, DL",
    condition: "Asthma",
    progress: "Improving",
    avatar: "/placeholder.svg",
    communities: 2,
    lastVisit: "2023-12-05",
    nextAppointment: "2024-01-20",
    vitals: {
      bp: "120/80",
      sugar: "95 mg/dL",
      weight: "55 kg",
      height: "160 cm"
    },
    medicalHistory: [
      {
        date: "2023-12-01",
        condition: "Asthma Review",
        notes: "Inhaler technique improved, reduced symptoms",
        doctor: "Dr. Khan"
      },
      {
        date: "2023-07-20",
        condition: "Asthma Diagnosis",
        notes: "Prescribed Seretide inhaler",
        doctor: "Dr. Khan"
      }
    ]
  },
  {
    name: "Amit Malhotra",
    age: 60,
    gender: "Male",
    email: "amit.malhotra@email.com",
    phone: "+91 98765 43213",
    bloodGroup: "AB-",
    location: "Greater Noida, UP",
    condition: "Arthritis",
    progress: "Stable",
    avatar: "/placeholder.svg",
    communities: 4,
    lastVisit: "2023-12-10",
    nextAppointment: "2024-01-25",
    vitals: {
      bp: "135/85",
      sugar: "105 mg/dL",
      weight: "72 kg",
      height: "168 cm"
    },
    medicalHistory: [
      {
        date: "2023-11-15",
        condition: "Arthritis Follow-up",
        notes: "Joint pain reduced with current medication",
        doctor: "Dr. Singh"
      },
      {
        date: "2023-06-10",
        condition: "Arthritis Diagnosis",
        notes: "Started on NSAIDs and physiotherapy",
        doctor: "Dr. Singh"
      }
    ]
  }
];

export function PatientDashboards() {
  const [selectedPatient, setSelectedPatient] = useState<typeof patients[0] | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCondition, setFilterCondition] = useState("all");
  const [view, setView] = useState<"grid" | "list">("grid");

  const filteredPatients = patients.filter(patient => {
    const matchesSearch = patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         patient.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         patient.condition.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCondition = filterCondition === "all" || patient.condition === filterCondition;
    return matchesSearch && matchesCondition;
  });

  const conditions = Array.from(new Set(patients.map(p => p.condition)));

  return (
    <div className="space-y-6">
      {/* Search and Filter Section */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search patients..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={filterCondition} onValueChange={setFilterCondition}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filter by condition" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Conditions</SelectItem>
            {conditions.map(condition => (
              <SelectItem key={condition} value={condition}>{condition}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="flex gap-2">
          <Button
            variant={view === "grid" ? "default" : "outline"}
            size="icon"
            onClick={() => setView("grid")}
          >
            <Filter className="h-4 w-4" />
          </Button>
          <Button
            variant={view === "list" ? "default" : "outline"}
            size="icon"
            onClick={() => setView("list")}
          >
            <Activity className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{patients.length}</div>
            <div className="text-sm text-gray-500">Total Patients</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">
              {patients.filter(p => p.progress === "Good").length}
            </div>
            <div className="text-sm text-gray-500">Good Progress</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">
              {patients.filter(p => new Date(p.nextAppointment) > new Date()).length}
            </div>
            <div className="text-sm text-gray-500">Upcoming Appointments</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">
              {patients.reduce((acc, p) => acc + p.communities, 0)}
            </div>
            <div className="text-sm text-gray-500">Total Communities</div>
          </CardContent>
        </Card>
      </div>

      {/* Patient Cards */}
      <div className={view === "grid" ? 
        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : 
        "space-y-4"
      }>
        {filteredPatients.map((patient, index) => (
          <Card 
            key={index} 
            className={`hover:shadow-lg transition-shadow cursor-pointer ${
              view === "list" ? "flex items-center" : ""
            }`}
            onClick={() => setSelectedPatient(patient)}
          >
            <CardHeader className={`flex flex-row items-center space-x-4 pb-2 ${
              view === "list" ? "flex-1" : ""
            }`}>
              <Avatar className="h-12 w-12">
                <AvatarImage src={patient.avatar} alt={patient.name} />
                <AvatarFallback>{patient.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <CardTitle className="text-lg flex items-center gap-2">
                  {patient.name}
                  <Badge variant="outline">{patient.bloodGroup}</Badge>
                </CardTitle>
                <div className="flex items-center text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4 mr-1" />
                  {patient.location}
                </div>
                {view === "list" && (
                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center gap-1">
                      <Phone className="h-4 w-4" />
                      <span className="text-sm">{patient.phone}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Mail className="h-4 w-4" />
                      <span className="text-sm">{patient.email}</span>
                    </div>
                  </div>
                )}
              </div>
            </CardHeader>
            {view === "grid" && (
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Condition:</span>
                    <Badge variant="secondary">{patient.condition}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Progress:</span>
                    <Badge 
                      variant={
                        patient.progress === "Good" ? "default" : 
                        patient.progress === "Improving" ? "default" : 
                        "secondary"
                      }
                    >
                      {patient.progress}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>Next: {new Date(patient.nextAppointment).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>{patient.communities} Communities</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>

      {selectedPatient && (
        <PatientDetails
          patient={selectedPatient}
          open={selectedPatient !== null}
          onOpenChange={(open: boolean) => !open && setSelectedPatient(null)}
        />
      )}
    </div>
  );
}