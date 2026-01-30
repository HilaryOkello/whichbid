"use client";

import { useState, useCallback } from "react";
import {
  FileUpload,
  CriteriaForm,
  ProcessingIndicator,
  ResultsDisplay,
  DownloadButton,
} from "@/components";
import { analyzeQuotes } from "@/lib/api";
import { ComparisonCriteria, ProcessState, QuoteAnalysis } from "@/types";
import { Calculator, RefreshCw, ClipboardCheck, AlertTriangle, Lightbulb, Zap, Search, Shield } from "lucide-react";

export default function Home() {
  const [files, setFiles] = useState<File[]>([]);
  const [processState, setProcessState] = useState<ProcessState>("idle");
  const [error, setError] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<QuoteAnalysis | null>(null);

  const handleAnalyze = useCallback(
    async (criteria: Partial<ComparisonCriteria>) => {
      if (files.length === 0) return;

      setProcessState("uploading");
      setError(null);
      setAnalysis(null);

      try {
        const progressStages: ProcessState[] = ["uploading", "extracting", "parsing", "analyzing"];
        let currentStage = 0;

        const progressInterval = setInterval(() => {
          currentStage++;
          if (currentStage < progressStages.length) {
            setProcessState(progressStages[currentStage]);
          }
        }, 1500);

        const result = await analyzeQuotes(files, criteria);

        clearInterval(progressInterval);
        setProcessState("complete");
        setAnalysis(result);
      } catch (err) {
        setProcessState("error");
        setError(err instanceof Error ? err.message : "An unexpected error occurred");
      }
    },
    [files]
  );

  const handleReset = () => {
    setFiles([]);
    setProcessState("idle");
    setError(null);
    setAnalysis(null);
  };

  const isProcessing = ["uploading", "extracting", "parsing", "analyzing"].includes(processState);

  return (
    <div className="min-h-screen bg-dark">
      {/* Header */}
      <header className="bg-dark/90 backdrop-blur-sm sticky top-0 z-50 border-b-2 border-blue-500/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-flutter-blue flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-glow-blue">
                <Calculator className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">
                  <span className="text-blue-500">Q</span>
                  <span className="text-blue-500">u</span>
                  <span className="text-blue-500">o</span>
                  <span className="text-blue-500">t</span>
                  <span className="text-yellow-500">M</span>
                  <span className="text-yellow-500">a</span>
                  <span className="text-yellow-500">t</span>
                  <span className="text-yellow-500">c</span>
                  <span className="text-yellow-500">h</span>
                  <span className="text-yellow-500">e</span>
                  <span className="text-yellow-500">r</span>
                </h1>
                <p className="text-xs text-white hover:text-blue-500 transition-colors duration-300 cursor-default">AI-Powered Quote Comparison</p>
              </div>
            </div>

            {analysis && (
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleReset}
                  className="px-4 py-2 text-sm font-medium text-white/70 hover:text-white hover:bg-white/10 transition-all duration-300 flex items-center space-x-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>New Analysis</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!analysis ? (
          <div className="space-y-8">
            {/* Hero Section */}
            <div className="text-center space-y-4 py-8 animate-fade-in">
              <h2 className="text-3xl sm:text-4xl font-bold text-blue-500 uppercase tracking-tight">
                Compare Quotes <span className="text-flutter-cyan">Intelligently</span>
              </h2>
              <p className="text-lg text-white max-w-2xl mx-auto hover:text-yellow-600 transition-colors duration-300 cursor-default">
                Upload your vendor quotes and let our AI analyze, compare, and recommend the best option
                for your needs. Detect hidden costs and make informed decisions.
              </p>
            </div>

            {/* Main Card */}
            <div className="glass overflow-hidden animate-fade-in-up">
              {/* Steps Indicator */}
              <div className="bg-white/5 border-b border-white/10 px-6 py-4">
                <div className="flex items-center justify-center space-x-4 sm:space-x-8">
                  <div className="flex items-center space-x-2 group">
                    <div
                      className={`w-8 h-8 flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                        files.length > 0
                          ? "bg-blue-500 text-white hover:bg-yellow-500"
                          : "bg-blue-500 text-white hover:bg-yellow-500"
                      }`}
                    >
                      {files.length > 0 ? "✓" : "1"}
                    </div>
                    <span className="text-sm font-medium text-white hidden sm:inline">Upload Quotes</span>
                  </div>
                  <div className="w-8 sm:w-16 h-1 bg-yellow-500 hover:bg-blue-500 transition-colors duration-300" />
                  <div className="flex items-center space-x-2 group">
                    <div
                      className={`w-8 h-8 flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                        files.length > 0 ? "bg-yellow-500 text-white hover:bg-blue-500" : "bg-yellow-500 text-white hover:bg-blue-500"
                      }`}
                    >
                      2
                    </div>
                    <span className="text-sm font-medium text-white hidden sm:inline">Set Priorities</span>
                  </div>
                  <div className="w-8 sm:w-16 h-1 bg-blue-500 hover:bg-yellow-500 transition-colors duration-300" />
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 flex items-center justify-center text-sm font-bold bg-blue-500 text-white hover:bg-yellow-500 transition-all duration-300">
                      3
                    </div>
                    <span className="text-sm font-medium text-white hidden sm:inline">Get Results</span>
                  </div>
                </div>
              </div>

              <div className="p-6 sm:p-8 space-y-8">
                {/* File Upload */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                    <span className="w-6 h-6 bg-flutter-blue text-white flex items-center justify-center text-sm">
                      1
                    </span>
                    <span>Upload Your Quotes</span>
                  </h3>
                  <FileUpload files={files} onFilesChange={setFiles} disabled={isProcessing} />
                </div>

                {/* Divider */}
                <div className="h-1 bg-yellow-500" />

                {/* Criteria Form */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                    <span className="w-6 h-6 bg-flutter-blue text-white flex items-center justify-center text-sm">
                      2
                    </span>
                    <span>Configure Analysis</span>
                  </h3>
                  <CriteriaForm onSubmit={handleAnalyze} disabled={isProcessing} fileCount={files.length} />
                </div>
              </div>
            </div>

            {/* Processing Indicator */}
            {(isProcessing || processState === "error") && (
              <ProcessingIndicator state={processState} error={error} />
            )}

            {/* Features Section */}
            {processState === "idle" && (
              <div className="grid sm:grid-cols-3 gap-6 py-8">
                {/* Blue Card - Smart Comparison */}
                <div className="bg-blue-500 p-6 text-center card-hover group transition-all duration-300 hover:shadow-[0_0_30px_rgba(59,130,246,0.4)]">
                  <div className="w-14 h-14 bg-yellow-500 mx-auto flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-110 group-hover:bg-yellow-400">
                    <Search className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="font-semibold text-white mb-2">Smart Comparison</h3>
                  <p className="text-sm text-white/80">
                    AI analyzes and normalizes quotes across different formats and structures
                  </p>
                </div>

                {/* Yellow Card - Hidden Cost Detection */}
                <div className="bg-yellow-500 p-6 text-center card-hover group transition-all duration-300 hover:shadow-[0_0_30px_rgba(234,179,8,0.4)]">
                  <div className="w-14 h-14 bg-blue-500 mx-auto flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-110 group-hover:bg-blue-400">
                    <AlertTriangle className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="font-semibold text-white mb-2">Hidden Cost Detection</h3>
                  <p className="text-sm text-white/80">
                    Identifies missing items and potential hidden costs across vendors
                  </p>
                </div>

                {/* Blue Card - AI Recommendations */}
                <div className="bg-blue-500 p-6 text-center card-hover group transition-all duration-300 hover:shadow-[0_0_30px_rgba(59,130,246,0.4)]">
                  <div className="w-14 h-14 bg-yellow-500 mx-auto flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-110 group-hover:bg-yellow-400">
                    <Lightbulb className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="font-semibold text-white mb-2">AI Recommendations</h3>
                  <p className="text-sm text-white/80">
                    Get personalized recommendations based on your specific priorities
                  </p>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Results Section */
          <div className="space-y-6 animate-fade-in">
            {/* Success Banner */}
            <div className="glass border border-blue-500/30 p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-500 flex items-center justify-center">
                  <ClipboardCheck className="w-5 h-5 text-yellow-500" />
                </div>
                <div>
                  <p className="font-semibold text-blue-500">Analysis Complete</p>
                  <p className="text-sm text-white/60">
                    Analyzed {analysis.quotes.length} quotes • Found {analysis.hidden_costs.length} hidden costs
                  </p>
                </div>
              </div>
              <DownloadButton analysis={analysis} />
            </div>

            {/* Results Display */}
            <ResultsDisplay analysis={analysis} />

            {/* Start Over Button */}
            <div className="text-center pt-8">
              <button
                onClick={handleReset}
                className="px-8 py-3 bg-white/10 text-white font-semibold hover:bg-white/20 transition-all duration-300 border border-white/10 hover:border-white/20"
              >
                Analyze New Quotes
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t-2 border-blue-500/50 bg-dark/90 backdrop-blur-sm mt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-2">
              <p className="text-xs text-white hover:text-blue-500 transition-colors duration-300 cursor-default">Powered by</p>
              <span className="font-semibold bg-gradient-to-r from-blue-500 to-yellow-500 bg-clip-text text-transparent">QuoteMatcher AI</span>
            </div>
            <p className="text-xs text-white hover:text-blue-500 transition-colors duration-300 cursor-default">
              Making procurement decisions smarter, one quote at a time.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
