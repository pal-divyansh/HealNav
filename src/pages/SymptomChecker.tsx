import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { Footer } from "@/components/layout/Footer";
import { SymptomForm } from "@/components/symptom-checker/SymptomForm";
import { AnalysisResults } from "@/components/symptom-checker/AnalysisResults";
import { AnalysisResponse } from "@/services/gemini";

export default function SymptomChecker() {
  const [analysisResult, setAnalysisResult] = useState<AnalysisResponse | null>(null);
  const [showForm, setShowForm] = useState(true);
  const location = useLocation();

  // Reset the form when navigating to the page with fresh state
  useEffect(() => {
    if (location.state?.fresh) {
      setAnalysisResult(null);
      setShowForm(true);
      // Clear the state to prevent repeated resets
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const handleAnalysis = (result: AnalysisResponse) => {
    setAnalysisResult(result);
    setShowForm(false);
  };

  const handleReset = () => {
    setAnalysisResult(null);
    setShowForm(true);
  };

  return (
    <div className="flex flex-col bg-gray-50">
      <Navbar />
      <div className="mt-16 min-h-screen">
        <PageHeader
          title="Symptom Checker"
          subtitle="AI-powered insights to help you understand your health better."
        />
        
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <Card className="p-6">
              {showForm ? (
                <SymptomForm onAnalyze={handleAnalysis} />
              ) : (
                <AnalysisResults data={analysisResult!} onReset={handleReset} />
              )}
            </Card>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}