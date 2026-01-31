"use client";

import { useState } from "react";
import { ComparisonCriteria } from "@/types";
import { DollarSign, Clock, Shield, Star, FileText, AlertTriangle, ChevronRight, Loader2, Sparkles } from "lucide-react";

interface CriteriaFormProps {
  onSubmit: (criteria: Partial<ComparisonCriteria>) => void;
  disabled?: boolean;
  fileCount: number;
}

const PRIORITY_OPTIONS = [
  { value: "price", label: "Price", icon: DollarSign, color: "bg-yellow-500", textColor: "text-gray-900", hoverColor: "hover:bg-yellow-400", selectedColor: "bg-yellow-500", selectedTextColor: "text-gray-900" },
  { value: "timeline", label: "Timeline", icon: Clock, color: "bg-blue-500", textColor: "text-white", hoverColor: "hover:bg-yellow-500 hover:text-gray-900", selectedColor: "bg-blue-500", selectedTextColor: "text-white" },
  { value: "warranty", label: "Warranty", icon: Shield, color: "bg-yellow-500", textColor: "text-gray-900", hoverColor: "hover:bg-yellow-400", selectedColor: "bg-yellow-500", selectedTextColor: "text-gray-900" },
  { value: "quality", label: "Quality", icon: Star, color: "bg-blue-500", textColor: "text-white", hoverColor: "hover:bg-yellow-500 hover:text-gray-900", selectedColor: "bg-blue-500", selectedTextColor: "text-white" },
  { value: "scope", label: "Scope", icon: FileText, color: "bg-yellow-500", textColor: "text-gray-900", hoverColor: "hover:bg-yellow-400", selectedColor: "bg-yellow-500", selectedTextColor: "text-gray-900" },
  { value: "risk", label: "Risk", icon: AlertTriangle, color: "bg-blue-500", textColor: "text-white", hoverColor: "hover:bg-yellow-500 hover:text-gray-900", selectedColor: "bg-blue-500", selectedTextColor: "text-white" },
];

const MUST_INCLUDE_OPTIONS = [
  { value: "permits", label: "Permits" },
  { value: "insurance", label: "Insurance" },
  { value: "warranty", label: "Warranty" },
  { value: "cleanup", label: "Cleanup" },
  { value: "materials", label: "Materials" },
  { value: "labor", label: "Labor" },
];

export default function CriteriaForm({ onSubmit, disabled, fileCount }: CriteriaFormProps) {
  const [priorities, setPriorities] = useState<string[]>(["price"]);
  const [mustInclude, setMustInclude] = useState<string[]>([]);
  const [budget, setBudget] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [isExpanded, setIsExpanded] = useState(false);

  const togglePriority = (value: string) => {
    if (priorities.includes(value)) {
      setPriorities(priorities.filter((p) => p !== value));
    } else {
      setPriorities([...priorities, value]);
    }
  };

  const toggleMustInclude = (value: string) => {
    if (mustInclude.includes(value)) {
      setMustInclude(mustInclude.filter((m) => m !== value));
    } else {
      setMustInclude([...mustInclude, value]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      priorities: priorities.length > 0 ? priorities : ["price"],
      must_include: mustInclude.length > 0 ? mustInclude : null,
      budget_limit: budget ? parseFloat(budget) : null,
      notes: notes || null,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Priorities Section */}
      <div className="space-y-3">
        <label className="block text-sm font-semibold text-white">
          What matters most to you?
          <span className="font-normal text-white/50 ml-1">(select in order of importance)</span>
        </label>
        <div className="flex flex-wrap gap-2">
          {PRIORITY_OPTIONS.map((option) => {
            const isSelected = priorities.includes(option.value);
            const order = priorities.indexOf(option.value) + 1;
            const Icon = option.icon;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => togglePriority(option.value)}
                disabled={disabled}
                className={`
                  relative px-4 py-2 text-sm font-medium transition-all duration-300 flex items-center space-x-2
                  ${isSelected
                    ? `${option.selectedColor} ${option.selectedTextColor} shadow-glow-blue`
                    : `${option.color} ${option.textColor} ${option.hoverColor}`
                  }
                  ${option.value === "price" ? "border border-white/20" : ""}
                  disabled:opacity-50 disabled:cursor-not-allowed
                  transform hover:scale-105 active:scale-95
                `}
              >
                <Icon className="w-4 h-4" />
                <span>{option.label}</span>
                {isSelected && order > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-yellow-500 text-gray-900 text-xs rounded-none flex items-center justify-center font-bold">
                    {order}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Advanced Options Toggle */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center text-sm text-blue-500 hover:text-blue-400 font-medium transition-colors duration-200"
      >
        <ChevronRight
          className={`w-4 h-4 mr-1 transition-transform duration-300 ${isExpanded ? "rotate-90" : ""}`}
        />
        {isExpanded ? "Hide" : "Show"} advanced options
      </button>

      {/* Advanced Options */}
      {isExpanded && (
        <div className="space-y-5 p-4 bg-white/5 border-2 border-blue-500 rounded-none animate-fade-in">
          {/* Must Include */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-white">
              Required items (must be included)
            </label>
            <div className="flex flex-wrap gap-2">
              {MUST_INCLUDE_OPTIONS.map((option) => {
                const isSelected = mustInclude.includes(option.value);
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => toggleMustInclude(option.value)}
                    disabled={disabled}
                    className={`
                      px-3 py-1.5 text-sm font-medium rounded-none transition-all duration-300 border
                      ${isSelected
                        ? "bg-yellow-500 text-gray-900 border-yellow-500"
                        : "bg-transparent text-white/70 border-white/20 hover:border-yellow-500 hover:text-white"
                      }
                      disabled:opacity-50 disabled:cursor-not-allowed
                      transform hover:scale-105 active:scale-95
                    `}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Budget */}
          <div className="space-y-2">
            <label htmlFor="budget" className="block text-sm font-medium text-white">
              Maximum budget
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50">$</span>
              <input
                type="number"
                id="budget"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                disabled={disabled}
                placeholder="e.g. 50000"
                className="w-full pl-8 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-none text-white placeholder-white/40 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <label htmlFor="notes" className="block text-sm font-medium text-white">
              Additional context
            </label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              disabled={disabled}
              placeholder="e.g. We need this done before March, prefer local vendors..."
              rows={3}
              className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-none text-white placeholder-white/40 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 transition-all duration-200 resize-none disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={disabled || fileCount < 1}
        className={`
          w-full py-4 px-6 font-semibold text-lg rounded-none transition-all duration-300
          flex items-center justify-center space-x-2 btn-glow
          ${fileCount < 1
            ? "bg-blue-500/30 text-white/60 cursor-not-allowed"
            : disabled
            ? "bg-blue-500/70 text-white cursor-wait"
            : "bg-blue-500 text-white hover:bg-yellow-500 hover:text-gray-900 transform hover:scale-[1.02] active:scale-[0.98]"
          }
        `}
      >
        {disabled ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Analyzing...</span>
          </>
        ) : (
          <>
            <Sparkles className="w-5 h-5" />
            <span>Analyze {fileCount} Quote{fileCount !== 1 ? "s" : ""}</span>
          </>
        )}
      </button>

      {fileCount < 1 && (
        <p className="text-center text-sm text-white">
          Upload at least one PDF quote to begin analysis
        </p>
      )}
    </form>
  );
}
