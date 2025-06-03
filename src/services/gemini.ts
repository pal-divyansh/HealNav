import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY!);

interface AnalysisData {
  symptoms: string[];
  severity: string;
  duration: string;
  medicalHistory: {
    conditions: string[];
    medications: string[];
    allergies: string[];
    surgeries: string[];
  };
  lifestyle: {
    smoking: boolean;
    alcohol: string;
    exercise: string;
    diet: string;
    stress: string;
    sleep: string;
  };
  recentChanges: string;
  familyHistory: string[];
}

export interface AnalysisResponse {
  conditions: Array<{
    condition: string;
    probability: "High" | "Moderate" | "Low";
    description: string;
    reasoning: string[];
    commonSymptoms: string[];
    riskFactors: string[];
    suggestedTests?: string[];
  }>;
  urgencyLevel: {
    level: "Emergency" | "Urgent" | "Soon" | "Routine";
    reasoning: string[];
    timeframe: string;
  };
  lifestyleImpact: Array<{
    factor: string;
    impact: string;
    recommendations: string[];
  }>;
  medicationConsiderations: Array<{
    type: string;
    warning: string;
    recommendation: string;
  }>;
  preventiveMeasures: string[];
  followUpRecommendations: string[];
  specialistReferrals?: string[];
  redFlags: string[];
  disclaimer: string;
}

const MEDICAL_ANALYSIS_PROMPT = `You are an advanced medical analysis system. Analyze the following patient data and provide a comprehensive medical assessment. 

Patient Data:
Symptoms: {symptoms}
Severity: {severity}
Duration: {duration}
Medical History:
- Conditions: {conditions}
- Medications: {medications}
- Allergies: {allergies}
Lifestyle Factors:
- Smoking: {smoking}
- Alcohol: {alcohol}
- Exercise: {exercise}
- Diet: {diet}
- Stress: {stress}
- Sleep: {sleep}
Recent Changes: {recentChanges}
Family History: {familyHistory}

Provide a detailed analysis focusing on these key areas:

1. Potential Conditions (3-5 conditions)
2. Lifestyle Impact Analysis (at least 4 factors)
3. Medication Considerations (at least 3 types)
4. Comprehensive Recommendations

Return a detailed JSON response with the following structure:

{
  "conditions": [
    {
      "condition": "Name of condition",
      "probability": "High/Moderate/Low",
      "description": "Detailed description of the condition",
      "reasoning": [
        "Specific symptom matches",
        "Risk factor correlations",
        "Medical history relevance"
      ],
      "riskFactors": [
        "Age-related factors",
        "Lifestyle impacts",
        "Genetic predisposition"
      ],
      "suggestedTests": [
        "Specific diagnostic tests",
        "Lab work recommendations",
        "Imaging studies if relevant"
      ]
    }
  ],
  "urgencyLevel": {
    "level": "Emergency/Urgent/Soon/Routine",
    "reasoning": [
      "Detailed reason for urgency level",
      "Risk factor consideration",
      "Complication potential"
    ],
    "timeframe": "Specific timeframe recommendation"
  },
  "lifestyleImpact": [
    {
      "factor": "Specific lifestyle factor (e.g., Sleep, Exercise, Diet, Stress)",
      "impact": "Detailed description of how this factor affects the condition",
      "recommendations": [
        "Specific actionable change",
        "Practical implementation steps",
        "Expected benefits"
      ]
    }
  ],
  "medicationConsiderations": [
    {
      "type": "Category of medication (e.g., Pain relievers, Anti-inflammatory)",
      "warning": "Specific interaction or contraindication warning",
      "recommendation": "Detailed medication guidance"
    }
  ],
  "preventiveMeasures": [
    "Specific preventive action",
    "Lifestyle modification",
    "Risk reduction strategy"
  ],
  "followUpRecommendations": [
    "Timeframe for follow-up",
    "Type of healthcare provider",
    "Specific monitoring needs"
  ],
  "specialistReferrals": [
    "Specific type of specialist",
    "Reason for referral",
    "Urgency of consultation"
  ],
  "redFlags": [
    "Critical warning signs",
    "Emergency symptoms",
    "When to seek immediate care"
  ],
  "disclaimer": "Comprehensive medical disclaimer emphasizing the importance of professional medical consultation"
}

Ensure each section is thoroughly populated with specific, actionable information based on the provided symptoms and patient data. Focus on practical, evidence-based recommendations and clear explanations.`;

export async function analyzeSymptoms(data: AnalysisData): Promise<AnalysisResponse> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    
    const prompt = MEDICAL_ANALYSIS_PROMPT
      .replace("{symptoms}", data.symptoms.join(", "))
      .replace("{severity}", data.severity)
      .replace("{duration}", data.duration)
      .replace("{conditions}", data.medicalHistory.conditions.join(", ") || "None")
      .replace("{medications}", data.medicalHistory.medications.join(", ") || "None")
      .replace("{allergies}", data.medicalHistory.allergies.join(", ") || "None")
      .replace("{smoking}", data.lifestyle.smoking.toString())
      .replace("{alcohol}", data.lifestyle.alcohol)
      .replace("{exercise}", data.lifestyle.exercise)
      .replace("{diet}", data.lifestyle.diet)
      .replace("{stress}", data.lifestyle.stress)
      .replace("{sleep}", data.lifestyle.sleep)
      .replace("{recentChanges}", data.recentChanges || "None reported")
      .replace("{familyHistory}", data.familyHistory.join(", ") || "None reported");

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    try {
      const cleanedText = text
        .replace(/```json\n?|\n?```/g, '')
        .replace(/[\u201C\u201D]/g, '"')
        .replace(/\n\s*/g, ' ')
        .trim();
      
      return JSON.parse(cleanedText);
    } catch (parseError) {
      console.error('Error parsing AI response:', parseError);
      throw new Error('Failed to parse AI response');
    }
  } catch (error) {
    console.error('Error analyzing symptoms:', error);
    throw error;
  }
} 
