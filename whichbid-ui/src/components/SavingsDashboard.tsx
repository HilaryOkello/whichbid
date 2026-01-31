"use client";

import { useEffect, useState } from "react";
import { TrendingUp, DollarSign, AlertTriangle, Award } from "lucide-react";
import { QuoteAnalysis } from "@/types";

interface SavingsDashboardProps {
    analysis: QuoteAnalysis;
}

function AnimatedNumber({ value, prefix = "", suffix = "" }: { value: number; prefix?: string; suffix?: string }) {
    const [displayValue, setDisplayValue] = useState(0);

    useEffect(() => {
        const duration = 1500; // 1.5 seconds
        const steps = 60;
        const increment = value / steps;
        let current = 0;
        const timer = setInterval(() => {
            current += increment;
            if (current >= value) {
                setDisplayValue(value);
                clearInterval(timer);
            } else {
                setDisplayValue(Math.floor(current));
            }
        }, duration / steps);
        return () => clearInterval(timer);
    }, [value]);

    return (
        <span>
            {prefix}{displayValue.toLocaleString()}{suffix}
        </span>
    );
}

export default function SavingsDashboard({ analysis }: SavingsDashboardProps) {
    const { ranking, hidden_costs, confidence } = analysis;

    // Calculate metrics
    const prices = ranking.map((q) => q.true_total);
    const highestPrice = Math.max(...prices);
    const lowestPrice = Math.min(...prices);
    const potentialSavings = highestPrice - lowestPrice;
    const bestScore = ranking.length > 0 ? ranking[0].score : 0;
    const hiddenCostsTotal = hidden_costs.reduce((sum, hc) => sum + hc.estimated_amount, 0);

    const metrics = [
        {
            icon: TrendingUp,
            label: "Potential Savings",
            value: potentialSavings,
            prefix: "$",
            color: "text-green-400",
            bgColor: "bg-green-500/20",
            borderColor: "border-green-500/30",
        },
        {
            icon: Award,
            label: "Best Deal Score",
            value: bestScore,
            suffix: "/100",
            color: "text-blue-400",
            bgColor: "bg-blue-500/20",
            borderColor: "border-blue-500/30",
        },
        {
            icon: AlertTriangle,
            label: "Hidden Costs Found",
            value: hiddenCostsTotal,
            prefix: "$",
            color: "text-yellow-400",
            bgColor: "bg-yellow-500/20",
            borderColor: "border-yellow-500/30",
        },
        {
            icon: DollarSign,
            label: "AI Confidence",
            value: Math.round(confidence * 100),
            suffix: "%",
            color: "text-purple-400",
            bgColor: "bg-purple-500/20",
            borderColor: "border-purple-500/30",
        },
    ];

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-in-up">
            {metrics.map((metric, index) => (
                <div
                    key={metric.label}
                    className={`glass ${metric.borderColor} border p-4 card-hover`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                >
                    <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 ${metric.bgColor} flex items-center justify-center rounded-lg`}>
                            <metric.icon className={`w-5 h-5 ${metric.color}`} />
                        </div>
                        <div>
                            <p className="text-xs text-white/60 uppercase tracking-wide">{metric.label}</p>
                            <p className={`text-xl font-bold ${metric.color}`}>
                                <AnimatedNumber
                                    value={metric.value}
                                    prefix={metric.prefix || ""}
                                    suffix={metric.suffix || ""}
                                />
                            </p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
