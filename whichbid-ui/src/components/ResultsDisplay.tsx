"use client";

import { QuoteAnalysis } from "@/types";
import { Lightbulb, BarChart3, AlertTriangle, FileText, Info, DollarSign } from "lucide-react";

interface ResultsDisplayProps {
  analysis: QuoteAnalysis;
}

export default function ResultsDisplay({ analysis }: ResultsDisplayProps) {
  const { ranking, hidden_costs, recommendation, reasoning, confidence, caveats, criteria_used } = analysis;

  return (
    <div className="space-y-6">
      {/* Recommendation Card */}
      <div className="glass p-6 border-2 border-blue-500 card-hover">
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 bg-blue-500 flex items-center justify-center flex-shrink-0">
            <Lightbulb className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold mb-2 text-foreground">AI Recommendation</h3>
            <p className="text-muted-foreground leading-relaxed">{recommendation}</p>
            <div className="mt-4 flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground">Confidence:</span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 h-2 bg-card overflow-hidden">
                    <div
                      className="h-full bg-blue-500 transition-all duration-500"
                      style={{ width: `${confidence * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-blue-500">{Math.round(confidence * 100)}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Rankings Table */}
      <div className="glass overflow-hidden border-2 border-yellow-500">
        <div className="px-6 py-4 border-b-2 border-yellow-500 bg-white/5">
          <h3 className="font-semibold text-white flex items-center space-x-2">
            <BarChart3 className="w-5 h-5 text-blue-500" />
            <span>Quote Rankings</span>
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/5">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Rank</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Vendor</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">Base Price</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">True Total</th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider">Score</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Pros</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Cons</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {ranking.map((quote, index) => (
                <tr
                  key={quote.vendor}
                  className={`transition-colors duration-200 hover:bg-white/5 ${index === 0 ? "bg-blue-500/10" : ""}`}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div
                      className={`w-8 h-8 flex items-center justify-center font-bold text-sm ${
                        index === 0
                          ? "bg-yellow-500 text-white"
                          : index === 1
                           ? "bg-card/30 text-foreground"
                           : index === 2
                           ? "bg-yellow-500 text-white"
                           : "bg-card/10 text-muted-foreground"
                      }`}
                    >
                      {index + 1}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-semibold text-foreground">{quote.vendor}</div>
                  </td>
                  <td className="px-6 py-4 text-right whitespace-nowrap">
                    <span className="text-muted-foreground">${quote.base_price.toLocaleString()}</span>
                  </td>
                  <td className="px-6 py-4 text-right whitespace-nowrap">
                    <span className="font-semibold text-foreground">${quote.true_total.toLocaleString()}</span>
                    {quote.true_total > quote.base_price && (
                      <span className="block text-xs text-red-400">
                        +${(quote.true_total - quote.base_price).toLocaleString()} hidden
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div
                      className={`inline-flex items-center px-3 py-1 text-sm font-semibold ${
                        quote.score >= 80
                          ? "bg-blue-500/20 text-blue-500 border border-blue-500/30"
                          : quote.score >= 60
                          ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                          : "bg-red-500/20 text-red-400 border border-red-500/30"
                      }`}
                    >
                      {quote.score}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <ul className="text-sm text-blue-500 space-y-1">
                      {quote.pros.slice(0, 2).map((pro, i) => (
                        <li key={i} className="flex items-start">
                          <span className="mr-1">+</span>
                          <span>{pro}</span>
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className="px-6 py-4">
                    <ul className="text-sm text-red-400 space-y-1">
                      {quote.cons.slice(0, 2).map((con, i) => (
                        <li key={i} className="flex items-start">
                          <span className="mr-1">-</span>
                          <span>{con}</span>
                        </li>
                      ))}
                    </ul>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Hidden Costs */}
      {hidden_costs.length > 0 && (
        <div className="glass rounded-none overflow-hidden">
          <div className="px-6 py-4 border-b border-yellow-500/30 bg-yellow-500/10">
            <h3 className="font-semibold text-yellow-500 flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5" />
              <span>Hidden Costs Detected</span>
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {hidden_costs.map((cost, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-4 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-none transition-all duration-200 hover:bg-yellow-500/15"
                >
                  <div className="w-10 h-10 bg-yellow-500 rounded-none flex items-center justify-center flex-shrink-0">
                    <DollarSign className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-foreground">{cost.vendor}</span>
                      <span className="font-bold text-yellow-500">${cost.estimated_amount.toLocaleString()}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{cost.item}</p>
                    <p className="text-xs text-muted-foreground mt-1">{cost.reason}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Reasoning */}
      <div className="glass rounded-none overflow-hidden border-2 border-blue-500">
        <div className="px-6 py-4 border-b-2 border-blue-500 bg-card/50">
          <h3 className="font-semibold text-foreground flex items-center space-x-2">
            <FileText className="w-5 h-5 text-blue-500" />
            <span>Analysis Reasoning</span>
          </h3>
        </div>
        <div className="p-6">
          <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{reasoning}</p>

          {/* Criteria Used */}
          <div className="mt-4 pt-4 border-t-2 border-yellow-500">
            <p className="text-sm text-muted-foreground mb-2">Criteria used for scoring:</p>
            <div className="flex flex-wrap gap-2">
              {criteria_used.priorities.map((priority, i) => (
                <span
                  key={priority}
                  className="inline-flex items-center px-3 py-1 text-xs font-medium bg-blue-500/10 text-blue-500 border border-blue-500/30 rounded-none"
                >
                  #{i + 1} {priority}
                </span>
              ))}
              {criteria_used.budget_limit && (
                <span className="inline-flex items-center px-3 py-1 text-xs font-medium bg-yellow-500/10 text-yellow-500 border border-yellow-500/30 rounded-none">
                  Budget: ${criteria_used.budget_limit.toLocaleString()}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Caveats */}
      {caveats.length > 0 && (
        <div className="glass rounded-none overflow-hidden">
          <div className="px-6 py-4 border-b border-border bg-card/50">
          <h3 className="font-semibold text-foreground flex items-center space-x-2">
              <Info className="w-5 h-5 text-muted-foreground" />
              <span>Important Caveats</span>
            </h3>
          </div>
          <div className="p-6">
            <ul className="space-y-2">
              {caveats.map((caveat, index) => (
                <li key={index} className="flex items-start space-x-2 text-sm text-muted-foreground">
                  <span className="text-muted-foreground mt-0.5">•</span>
                  <span>{caveat}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
