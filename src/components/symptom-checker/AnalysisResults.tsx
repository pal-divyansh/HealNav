import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Activity, Brain, Shield, Clock, FileText, Printer, 
  AlertTriangle, Heart, Stethoscope, Calendar, User, 
  Clipboard, ArrowRight, PieChart, Pill, Siren, MapPin
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import type { AnalysisResponse } from "@/services/gemini";
import { useNavigate } from "react-router-dom";

interface AnalysisResultsProps {
  data: AnalysisResponse;
  onReset: () => void;
}

export function AnalysisResults({ data, onReset }: AnalysisResultsProps) {
  const navigate = useNavigate();

  if (!data || !data.urgencyLevel) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 animate-pulse" />
              <p>Analyzing symptoms...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handlePrintReport = () => {
    const report = `
MEDICAL ANALYSIS REPORT
Generated: ${new Date().toLocaleString()}

URGENCY LEVEL: ${data.urgencyLevel.level}
Timeframe: ${data.urgencyLevel.timeframe}
${data.urgencyLevel.reasoning.map(r => `- ${r}`).join('\n')}

POTENTIAL CONDITIONS
${data.conditions.map(c => `
${c.condition} (${c.probability} Probability)
Description: ${c.description}
Reasoning:
${c.reasoning.map(r => `- ${r}`).join('\n')}
Risk Factors:
${c.riskFactors.map(r => `- ${r}`).join('\n')}
${c.suggestedTests ? `\nSuggested Tests:\n${c.suggestedTests.map(t => `- ${t}`).join('\n')}` : ''}
`).join('\n')}

LIFESTYLE IMPACT ANALYSIS
${data.lifestyleImpact.map(l => `
${l.factor}:
Impact: ${l.impact}
Recommendations:
${l.recommendations.map(r => `- ${r}`).join('\n')}
`).join('\n')}

MEDICATION CONSIDERATIONS
${data.medicationConsiderations.map(m => `
${m.type}:
Warning: ${m.warning}
Recommendation: ${m.recommendation}
`).join('\n')}

PREVENTIVE MEASURES
${data.preventiveMeasures.map(m => `- ${m}`).join('\n')}

FOLLOW-UP RECOMMENDATIONS
${data.followUpRecommendations.map(r => `- ${r}`).join('\n')}

${data.specialistReferrals?.length ? `\nSPECIALIST REFERRALS\n${data.specialistReferrals.map(s => `- ${s}`).join('\n')}` : ''}

⚠️ RED FLAGS - IMPORTANT WARNINGS
${data.redFlags.map(r => `- ${r}`).join('\n')}

DISCLAIMER
${data.disclaimer}
    `;

    const printWindow = window.open('', '', 'width=800,height=600');
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Medical Analysis Report</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                padding: 40px;
                white-space: pre-wrap;
              }
              h1, h2 { color: #2563eb; }
              .warning { color: #dc2626; }
              .section { margin: 20px 0; }
              .disclaimer {
                margin-top: 20px;
                padding: 10px;
                background: #fee2e2;
                border-radius: 4px;
              }
            </style>
          </head>
          <body>${report}</body>
        </html>
      `);
      printWindow.document.close();
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 250);
    }
  };

  const handleFindNearbyFacilities = () => {
    navigate(`/resources`);
  };

  return (
    <div className="space-y-6">
      <Alert variant={data.urgencyLevel.level === "Emergency" ? "destructive" : "default"}>
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Urgency Level: {data.urgencyLevel.level}</AlertTitle>
        <AlertDescription>
          {data.urgencyLevel.timeframe}
          <ul className="mt-2 space-y-1">
            {data.urgencyLevel.reasoning.map((reason, index) => (
              <li key={index}>• {reason}</li>
            ))}
          </ul>
        </AlertDescription>
      </Alert>

      {data.redFlags.length > 0 && (
        <Alert variant="destructive">
          <Siren className="h-4 w-4" />
          <AlertTitle>Important Warning Signs</AlertTitle>
          <AlertDescription>
            <ul className="mt-2 space-y-1">
              {data.redFlags.map((flag, index) => (
                <li key={index}>• {flag}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="conditions" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="conditions">Conditions</TabsTrigger>
          <TabsTrigger value="lifestyle">Lifestyle</TabsTrigger>
          <TabsTrigger value="medications">Medications</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
        </TabsList>

        <TabsContent value="conditions">
          <div className="space-y-4">
            {data.conditions.map((condition, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{condition.condition}</CardTitle>
                    <Badge variant={
                      condition.probability === "High" ? "destructive" :
                      condition.probability === "Moderate" ? "secondary" :
                      "outline"
                    }>
                      {condition.probability} Probability
                    </Badge>
                  </div>
                  <CardDescription>{condition.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Reasoning</h4>
                      <ul className="space-y-1">
                        {condition.reasoning.map((reason, idx) => (
                          <li key={idx} className="text-sm">• {reason}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Risk Factors</h4>
                      <div className="flex flex-wrap gap-2">
                        {condition.riskFactors.map((factor, idx) => (
                          <Badge key={idx} variant="outline">{factor}</Badge>
                        ))}
                      </div>
                    </div>
                    {condition.suggestedTests && (
                      <div>
                        <h4 className="font-medium mb-2">Suggested Tests</h4>
                        <ul className="space-y-1">
                          {condition.suggestedTests.map((test, idx) => (
                            <li key={idx} className="text-sm">• {test}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="lifestyle">
          <div className="space-y-4">
            {data.lifestyleImpact && data.lifestyleImpact.map((impact, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    <CardTitle>{impact.factor}</CardTitle>
                  </div>
                  <CardDescription>{impact.impact}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-1">
                    {impact.recommendations.map((rec, idx) => (
                      <li key={idx} className="text-sm">• {rec}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="medications">
          <div className="space-y-4">
            {data.medicationConsiderations && data.medicationConsiderations.map((med, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Pill className="h-5 w-5" />
                    <CardTitle>{med.type}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <Alert variant="destructive" className="mb-4">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Warning</AlertTitle>
                    <AlertDescription>{med.warning}</AlertDescription>
                  </Alert>
                  <p className="text-sm">{med.recommendation}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="recommendations">
          <div className="space-y-4">
            {data.preventiveMeasures && data.preventiveMeasures.length > 0 && (
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    <CardTitle>Preventive Measures</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-1">
                    {data.preventiveMeasures.map((measure, index) => (
                      <li key={index} className="text-sm">• {measure}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {data.followUpRecommendations && data.followUpRecommendations.length > 0 && (
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    <CardTitle>Follow-up Recommendations</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-1">
                    {data.followUpRecommendations.map((rec, index) => (
                      <li key={index} className="text-sm">• {rec}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {data.specialistReferrals && data.specialistReferrals.length > 0 && (
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Stethoscope className="h-5 w-5" />
                    <CardTitle>Specialist Referrals</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-1">
                    {data.specialistReferrals.map((specialist, index) => (
                      <li key={index} className="text-sm">• {specialist}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex gap-4">
        <Button className="flex-1" onClick={handlePrintReport}>
          <Printer className="w-4 h-4 mr-2" />
          Print Report
        </Button>
        <Button 
          variant="default" 
          className="flex-1"
          onClick={handleFindNearbyFacilities}
        >
          <MapPin className="w-4 h-4 mr-2" />
          Find Nearby Facilities
        </Button>
        <Button variant="outline" className="flex-1" onClick={onReset}>
          Check New Symptoms
        </Button>
      </div>

      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Medical Disclaimer</AlertTitle>
        <AlertDescription>{data.disclaimer}</AlertDescription>
      </Alert>
    </div>
  );
}