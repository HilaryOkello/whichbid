"use client";

import { useState, useEffect } from "react";
import { History, ChevronDown, Clock, X } from "lucide-react";
import { QuoteAnalysis } from "@/types";

interface HistoryEntry {
    id: string;
    date: string;
    vendors: string[];
    recommendation: string;
    bestScore: number;
    savings: number;
    analysis: QuoteAnalysis;
}

interface AnalysisHistoryProps {
    currentAnalysis: QuoteAnalysis | null;
    onLoadAnalysis: (analysis: QuoteAnalysis) => void;
}

const STORAGE_KEY = "whichbid-history";
const MAX_HISTORY = 5;

export function saveToHistory(analysis: QuoteAnalysis): void {
    if (typeof window === "undefined") return;

    const existing = getHistory();
    const vendors = analysis.ranking.map((r) => r.vendor);
    const prices = analysis.ranking.map((q) => q.true_total);
    const savings = Math.max(...prices) - Math.min(...prices);

    const entry: HistoryEntry = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        vendors,
        recommendation: analysis.recommendation.slice(0, 100) + "...",
        bestScore: analysis.ranking[0]?.score || 0,
        savings,
        analysis,
    };

    const updated = [entry, ...existing].slice(0, MAX_HISTORY);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

export function getHistory(): HistoryEntry[] {
    if (typeof window === "undefined") return [];
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    } catch {
        return [];
    }
}

export function clearHistory(): void {
    if (typeof window === "undefined") return;
    localStorage.removeItem(STORAGE_KEY);
}

export default function AnalysisHistory({ currentAnalysis, onLoadAnalysis }: AnalysisHistoryProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [history, setHistory] = useState<HistoryEntry[]>([]);

    useEffect(() => {
        setHistory(getHistory());
    }, [currentAnalysis]);

    const handleLoad = (entry: HistoryEntry) => {
        onLoadAnalysis(entry.analysis);
        setIsOpen(false);
    };

    const handleClear = () => {
        clearHistory();
        setHistory([]);
    };

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    if (history.length === 0) return null;

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center space-x-2 px-3 py-2 text-sm text-white/70 hover:text-white hover:bg-white/10 transition-all duration-300 rounded-lg"
            >
                <History className="w-4 h-4" />
                <span className="hidden sm:inline">History</span>
                <span className="bg-blue-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                    {history.length}
                </span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
            </button>

            {isOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Dropdown */}
                    <div className="absolute right-0 mt-2 w-80 glass border border-white/10 rounded-lg shadow-xl z-50 animate-fade-in overflow-hidden">
                        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
                            <h4 className="font-semibold text-white">Recent Analyses</h4>
                            <button
                                onClick={handleClear}
                                className="text-xs text-red-400 hover:text-red-300 transition-colors"
                            >
                                Clear All
                            </button>
                        </div>

                        <div className="max-h-64 overflow-y-auto">
                            {history.map((entry) => (
                                <button
                                    key={entry.id}
                                    onClick={() => handleLoad(entry)}
                                    className="w-full px-4 py-3 text-left hover:bg-white/5 transition-colors border-b border-white/5 last:border-0"
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-white truncate">
                                                {entry.vendors.join(" vs ")}
                                            </p>
                                            <div className="flex items-center space-x-3 mt-1">
                                                <span className="text-xs text-green-400">
                                                    Save ${entry.savings.toLocaleString()}
                                                </span>
                                                <span className="text-xs text-blue-400">
                                                    Score: {entry.bestScore}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex items-center text-xs text-white/40 ml-2">
                                            <Clock className="w-3 h-3 mr-1" />
                                            {formatDate(entry.date)}
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
