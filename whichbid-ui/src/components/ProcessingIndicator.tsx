"use client";

import { ProcessState, PROCESS_STEPS } from "@/types";
import { X, Check, Loader2 } from "lucide-react";

interface ProcessingIndicatorProps {
  state: ProcessState;
  error?: string | null;
}

export default function ProcessingIndicator({ state, error }: ProcessingIndicatorProps) {
  if (state === "idle") return null;

  const currentStepIndex = PROCESS_STEPS.findIndex((s) => s.id === state);
  const currentStep = PROCESS_STEPS.find((s) => s.id === state);

  return (
    <div className="glass rounded-none p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center space-x-3">
        {state === "error" ? (
          <div className="w-12 h-12 bg-red-500 rounded-none flex items-center justify-center">
            <X className="w-6 h-6 text-white" />
          </div>
        ) : state === "complete" ? (
          <div className="w-12 h-12 bg-blue-500 rounded-none flex items-center justify-center">
            <Check className="w-6 h-6 text-white" />
          </div>
        ) : (
          <div className="w-12 h-12 bg-blue-500 rounded-none flex items-center justify-center animate-pulse-glow">
            <Loader2 className="w-6 h-6 text-white animate-spin" />
          </div>
        )}
        <div>
          <h3 className="font-semibold text-white">
            {state === "error" ? "Analysis Failed" : state === "complete" ? "Analysis Complete" : "AI Processing"}
          </h3>
          <p className="text-sm text-white/60">
            {state === "error" ? error : currentStep?.description}
          </p>
        </div>
      </div>

      {/* Progress Steps */}
      {state !== "error" && (
        <div className="space-y-3">
          {PROCESS_STEPS.map((step, index) => {
            const isComplete = currentStepIndex > index || state === "complete";
            const isCurrent = currentStepIndex === index && state !== "complete";
            const isPending = currentStepIndex < index && state !== "complete";

            return (
              <div key={step.id} className="flex items-center space-x-3">
                {/* Step Indicator */}
                <div
                  className={`
                    w-8 h-8 rounded-none flex items-center justify-center text-sm font-medium transition-all duration-300
                    ${isComplete ? "bg-blue-500 text-white" : ""}
                    ${isCurrent ? "bg-blue-500 text-white animate-pulse" : ""}
                    ${isPending ? "bg-white/10 text-white/40" : ""}
                  `}
                >
                  {isComplete ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    index + 1
                  )}
                </div>

                {/* Step Label */}
                <div className="flex-1">
                  <p
                    className={`text-sm font-medium transition-colors duration-200 ${
                      isComplete || isCurrent ? "text-white" : "text-white/40"
                    }`}
                  >
                    {step.label}
                  </p>
                </div>

                {/* Status */}
                {isCurrent && (
                  <span className="text-xs text-blue-500 font-medium px-2 py-1 bg-blue-500/10 border border-blue-500/30 rounded-none">
                    In Progress
                  </span>
                )}
                {isComplete && (
                  <span className="text-xs text-blue-500 font-medium px-2 py-1 bg-blue-500/10 border border-blue-500/30 rounded-none">
                    Done
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Progress Bar */}
      {state !== "error" && state !== "complete" && (
        <div className="space-y-2">
          <div className="h-2 bg-white/10 rounded-none overflow-hidden">
            <div
              className="h-full bg-blue-500 rounded-none transition-all duration-500 ease-out progress-bar"
              style={{
                width: `${((currentStepIndex + 1) / PROCESS_STEPS.length) * 100}%`,
              }}
            />
          </div>
          <p className="text-xs text-white/50 text-right">
            Step {currentStepIndex + 1} of {PROCESS_STEPS.length}
          </p>
        </div>
      )}

      {/* Error State */}
      {state === "error" && error && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-none">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}
    </div>
  );
}
