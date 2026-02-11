/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, KeyboardEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectLabel,
  SelectGroup,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { 
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info, AlertCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { analyzeSymptoms, type AnalysisResponse } from "@/services/gemini";

interface SymptomData {
  symptoms: string[];
  severity: string;
  duration: string;
}

interface SymptomCategory {
  category: string;
  symptoms: string[];
}

interface SymptomSeverityDetails {
  value: string;
  description: string;
  examples: string[];
  color: "default" | "secondary" | "destructive";
}

interface MedicalHistory {
  conditions: string[];
  medications: string[];
  allergies: string[];
  surgeries: string[];
}

interface LifestyleFactors {
  smoking: boolean;
  alcohol: string;
  exercise: string;
  diet: string;
  stress: string;
  sleep: string;
}

interface SymptomFormProps {
  onAnalyze: (data: AnalysisResponse) => void;
}

const symptoms: SymptomCategory[] = [
  {
    category: "General",
    symptoms: [
      "Fatigue",
      "Fever",
      "Chills",
      "Night sweats",
      "Weakness",
      "Weight loss",
      "Weight gain",
      "Loss of appetite",
    ]
  },
  {
    category: "Head & Neurological",
    symptoms: [
      "Headache",
      "Dizziness",
      "Confusion",
      "Memory problems",
      "Difficulty concentrating",
      "Blurred vision",
      "Light sensitivity",
      "Ringing in ears",
    ]
  },
  {
    category: "Respiratory",
    symptoms: [
      "Cough",
      "Shortness of breath",
      "Wheezing",
      "Chest tightness",
      "Rapid breathing",
      "Sore throat",
      "Runny nose",
      "Nasal congestion",
    ]
  },
  {
    category: "Digestive",
    symptoms: [
      "Nausea",
      "Vomiting",
      "Diarrhea",
      "Constipation",
      "Abdominal pain",
      "Bloating",
      "Heartburn",
      "Loss of appetite",
    ]
  },
  {
    category: "Musculoskeletal",
    symptoms: [
      "Muscle aches",
      "Joint pain",
      "Back pain",
      "Neck pain",
      "Muscle weakness",
      "Stiffness",
      "Swelling in joints",
      "Limited range of motion",
    ]
  },
  {
    category: "Skin",
    symptoms: [
      "Rash",
      "Itching",
      "Hives",
      "Dry skin",
      "Excessive sweating",
      "Changes in skin color",
      "Bruising easily",
      "Slow wound healing",
    ]
  },
  {
    category: "Psychological",
    symptoms: [
      "Anxiety",
      "Depression",
      "Mood swings",
      "Irritability",
      "Sleep problems",
      "Stress",
      "Panic attacks",
      "Changes in appetite",
    ]
  },
  {
    category: "Cardiovascular",
    symptoms: [
      "Chest pain",
      "Irregular heartbeat",
      "High blood pressure",
      "Rapid heart rate",
      "Swelling in legs",
      "Dizziness on standing",
      "Cold hands/feet",
      "Varicose veins",
    ]
  }
];

const severityLevels: SymptomSeverityDetails[] = [
  {
    value: "Mild",
    description: "Noticeable but doesn't interfere with daily activities",
    examples: [
      "Can work and socialize normally",
      "Symptoms are annoying but manageable",
      "No need for medication or only occasional over-the-counter remedies"
    ],
    color: "default"
  },
  {
    value: "Moderate",
    description: "Affects daily activities but doesn't prevent them",
    examples: [
      "May need to modify some activities",
      "Regular use of over-the-counter medication",
      "Symptoms are distressing but not incapacitating"
    ],
    color: "secondary"
  },
  {
    value: "Severe",
    description: "Significantly impacts or prevents daily activities",
    examples: [
      "Unable to work or need significant accommodations",
      "Difficulty performing basic tasks",
      "May require immediate medical attention"
    ],
    color: "destructive"
  }
];

const MINIMUM_SYMPTOMS = 1;
const MAXIMUM_SYMPTOMS = 5;

const commonConditions = [
  "High Blood Pressure",
  "Diabetes",
  "Asthma",
  "Heart Disease",
  "Arthritis",
  "Thyroid Disorders",
  "Cancer",
  "Anxiety/Depression",
];

const lifestyleOptions = {
  alcohol: ["None", "Occasional", "Moderate", "Heavy"],
  exercise: ["Sedentary", "Light", "Moderate", "Active"],
  diet: ["Balanced", "Vegetarian", "Vegan", "Restricted"],
  stress: ["Low", "Moderate", "High"],
  sleep: ["< 6 hours", "6-8 hours", "> 8 hours"],
};

const getDurationInDays = (duration: string): number | null => {
  const match = duration.toLowerCase().match(/^(\d+)\s*(day|days|week|weeks|month|months)$/);
  if (!match) return null;
  
  const [, value, unit] = match;
  const numValue = parseInt(value);
  
  switch (unit) {
    case 'day':
    case 'days':
      return numValue;
    case 'week':
    case 'weeks':
      return numValue * 7;
    case 'month':
    case 'months':
      return numValue * 30;
    default:
      return null;
  }
};

export function SymptomForm({ onAnalyze }: SymptomFormProps) {
  const [step, setStep] = useState(1);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [severity, setSeverity] = useState<string>("");
  const [duration, setDuration] = useState<string>("");
  const [durationError, setDurationError] = useState<string>("");
  const [medicalHistory, setMedicalHistory] = useState<MedicalHistory>({
    conditions: [],
    medications: [],
    allergies: [],
    surgeries: [],
  });
  const [lifestyle, setLifestyle] = useState<LifestyleFactors>({
    smoking: false,
    alcohol: "None",
    exercise: "Sedentary",
    diet: "Balanced",
    stress: "Low",
    sleep: "6-8 hours",
  });
  const [recentChanges, setRecentChanges] = useState<string>("");
  const [familyHistory, setFamilyHistory] = useState<string[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const totalSteps = 6;

  const getStepTitle = (step: number) => {
    switch (step) {
      case 1: return "Symptoms";
      case 2: return "Severity & Duration";
      case 3: return "Medical History";
      case 4: return "Lifestyle Factors";
      case 5: return "Recent Changes";
      case 6: return "Family History";
      default: return "";
    }
  };

  const handleAddSymptom = (symptom: string) => {
    if (!selectedSymptoms.includes(symptom) && selectedSymptoms.length < MAXIMUM_SYMPTOMS) {
      setSelectedSymptoms([...selectedSymptoms, symptom]);
    }
  };

  const handleRemoveSymptom = (symptomToRemove: string) => {
    setSelectedSymptoms(selectedSymptoms.filter(symptom => symptom !== symptomToRemove));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>, symptom: string) => {
    if (e.key === 'Enter' || e.key === 'Backspace' || e.key === 'Delete') {
      handleRemoveSymptom(symptom);
    }
  };

  const validateDuration = (value: string) => {
    setDuration(value);
    if (!value) {
      setDurationError("Duration is required");
      return false;
    }
    
    const durationPattern = /^(\d+)\s*(day|days|week|weeks|month|months)$/i;
    if (!durationPattern.test(value)) {
      setDurationError("Please enter duration like '5 days' or '2 weeks'");
      return false;
    }
    
    setDurationError("");
    return true;
  };

  const canProceedToNextStep = () => {
    switch (step) {
      case 1:
        return selectedSymptoms.length >= MINIMUM_SYMPTOMS;
      case 2:
        return severity !== "";
      case 3:
        return duration !== "" && !durationError;
      case 4:
      case 5:
      case 6:
        return true; // These steps are optional, so always allow proceeding
      default:
        return false;
    }
  };

  const handleSubmit = async () => {
    setIsAnalyzing(true);
    try {
      const analysisData = {
        symptoms: selectedSymptoms,
        severity,
        duration,
        medicalHistory,
        lifestyle,
        recentChanges,
        familyHistory,
      };

      const result = await analyzeSymptoms(analysisData);
      onAnalyze(result);
    } catch (error) {
      console.error('Error analyzing symptoms:', error);
      // Handle error appropriately
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Step {step} of {totalSteps}</h2>
        <div className="flex flex-col items-end">
          <Progress value={(step / totalSteps) * 100} className="w-[200px]" />
          <span className="text-sm text-muted-foreground mt-1">
            {getStepTitle(step)}
          </span>
        </div>
      </div>

      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Select Your Symptoms
              <Badge variant="outline">
                {selectedSymptoms.length}/{MAXIMUM_SYMPTOMS}
              </Badge>
            </CardTitle>
            <CardDescription>
              Choose the symptoms you're experiencing. You can select up to {MAXIMUM_SYMPTOMS} symptoms.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Select onValueChange={handleAddSymptom}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a symptom" />
              </SelectTrigger>
              <SelectContent>
                <ScrollArea className="h-80">
                  {symptoms.map((category) => (
                    <SelectGroup key={category.category}>
                      <SelectLabel>{category.category}</SelectLabel>
                      {category.symptoms.map((symptom) => (
                        <SelectItem
                          key={symptom}
                          value={symptom}
                          disabled={selectedSymptoms.includes(symptom) || selectedSymptoms.length >= MAXIMUM_SYMPTOMS}
                        >
                          {symptom}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  ))}
                </ScrollArea>
              </SelectContent>
            </Select>

            <div className="flex flex-wrap gap-2">
              {selectedSymptoms.map((symptom) => (
                <Badge
                  key={symptom}
                  variant="secondary"
                  className="cursor-pointer hover:bg-secondary/80 transition-colors"
                  onClick={() => handleRemoveSymptom(symptom)}
                >
                  {symptom}
                  <span className="ml-1 hover:text-primary">×</span>
                </Badge>
              ))}
            </div>
            
            {selectedSymptoms.length === 0 && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>No symptoms selected</AlertTitle>
                <AlertDescription>
                  Please select at least one symptom to continue
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      )}

      {step === 2 && (
        <Card>
          <CardHeader>
            <CardTitle>Symptom Severity</CardTitle>
            <CardDescription>
              How severe are your symptoms overall?
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Select onValueChange={setSeverity} value={severity}>
              <SelectTrigger>
                <SelectValue placeholder="Select severity level" />
              </SelectTrigger>
              <SelectContent>
                {severityLevels.map((level) => (
                  <SelectItem key={level.value} value={level.value}>
                    <div className="flex items-center gap-2">
                      <Badge variant={level.color}>{level.value}</Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {severity && (
              <div className="space-y-4">
                <div className="flex items-start gap-2">
                  <Info className="h-5 w-5 mt-0.5 text-muted-foreground" />
                  <div>
                    <h4 className="font-medium">
                      {severityLevels.find(l => l.value === severity)?.description}
                    </h4>
                    <ul className="mt-2 space-y-1">
                      {severityLevels
                        .find(l => l.value === severity)
                        ?.examples.map((example, i) => (
                          <li key={i} className="text-sm text-muted-foreground">
                            • {example}
                          </li>
                        ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {step === 3 && (
        <Card>
          <CardHeader>
            <CardTitle>Symptom Duration</CardTitle>
            <CardDescription>
              How long have you been experiencing these symptoms?
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              type="text"
              placeholder="e.g., 2 days, 1 week"
              value={duration}
              onChange={(e) => validateDuration(e.target.value)}
              className={durationError ? "border-red-500" : ""}
            />
            
            {durationError ? (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Invalid Duration</AlertTitle>
                <AlertDescription>{durationError}</AlertDescription>
              </Alert>
            ) : (
              <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>Format Guide</AlertTitle>
                <AlertDescription>
                  Enter duration as a number followed by: days, weeks, or months
                  {duration && !durationError && (
                    <div className="mt-2">
                      <Badge variant="outline">
                        ≈ {getDurationInDays(duration)} days
                      </Badge>
                    </div>
                  )}
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      )}

      {step === 3 && (
        <div className="space-y-6">
          <div className="space-y-4">
            <h3 className="font-medium">Existing Medical Conditions</h3>
            <div className="flex flex-wrap gap-2">
              {commonConditions.map((condition) => (
                <Badge
                  key={condition}
                  variant={medicalHistory.conditions.includes(condition) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => {
                    setMedicalHistory(prev => ({
                      ...prev,
                      conditions: prev.conditions.includes(condition)
                        ? prev.conditions.filter(c => c !== condition)
                        : [...prev.conditions, condition]
                    }));
                  }}
                >
                  {condition}
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="font-medium">Current Medications</h3>
            <Input
              placeholder="Enter medications separated by commas"
              value={medicalHistory.medications.join(", ")}
              onChange={(e) => setMedicalHistory(prev => ({
                ...prev,
                medications: e.target.value.split(",").map(m => m.trim()).filter(Boolean)
              }))}
            />
          </div>

          <div className="space-y-2">
            <h3 className="font-medium">Allergies</h3>
            <Input
              placeholder="Enter allergies separated by commas"
              value={medicalHistory.allergies.join(", ")}
              onChange={(e) => setMedicalHistory(prev => ({
                ...prev,
                allergies: e.target.value.split(",").map(a => a.trim()).filter(Boolean)
              }))}
            />
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <Switch
              checked={lifestyle.smoking}
              onCheckedChange={(checked) => setLifestyle(prev => ({ ...prev, smoking: checked }))}
            />
            <label>Current Smoker</label>
          </div>

          {Object.entries(lifestyleOptions).map(([factor, options]) => (
            <div key={factor} className="space-y-2">
              <h3 className="font-medium capitalize">{factor}</h3>
              <Select
                value={lifestyle[factor as keyof typeof lifestyleOptions]}
                onValueChange={(value) => setLifestyle(prev => ({ ...prev, [factor]: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {options.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ))}
        </div>
      )}

      {step === 5 && (
        <div className="space-y-4">
          <h3 className="font-medium">Recent Life Changes or Stressors</h3>
          <textarea
            className="w-full min-h-[100px] p-2 border rounded-md"
            placeholder="Describe any significant changes in your life, work, or environment..."
            value={recentChanges}
            onChange={(e) => setRecentChanges(e.target.value)}
          />
        </div>
      )}

      {step === 6 && (
        <div className="space-y-4">
          <h3 className="font-medium">Family Medical History</h3>
          <div className="flex flex-wrap gap-2">
            {commonConditions.map((condition) => (
              <Badge
                key={condition}
                variant={familyHistory.includes(condition) ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => {
                  setFamilyHistory(prev =>
                    prev.includes(condition)
                      ? prev.filter(c => c !== condition)
                      : [...prev, condition]
                  );
                }}
              >
                {condition}
              </Badge>
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-between pt-4">
        <Button
          variant="outline"
          onClick={() => setStep(Math.max(1, step - 1))}
          disabled={step === 1}
        >
          Previous
        </Button>
        <Button
          onClick={() => {
            if (step === totalSteps) {
              handleSubmit();
            } else {
              setStep(Math.min(totalSteps, step + 1));
            }
          }}
          disabled={!canProceedToNextStep() || isAnalyzing}
        >
          {step === totalSteps 
            ? (isAnalyzing ? "Analyzing..." : "Analyze Symptoms")
            : "Next"
          }
        </Button>
      </div>
    </div>
  );
}