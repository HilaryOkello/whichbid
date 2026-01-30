// API Types matching the backend Pydantic models

export interface ComparisonCriteria {
  priorities: string[];
  must_include: string[] | null;
  budget_limit: number | null;
  notes: string | null;
}

export interface QuoteLineItem {
  description: string;
  category: string;
  quantity: number | null;
  unit_price: number | null;
  total: number;
}

export interface ParsedQuote {
  vendor_name: string;
  quote_date: string | null;
  valid_until: string | null;
  line_items: QuoteLineItem[];
  subtotal: number;
  tax: number | null;
  total: number;
  payment_terms: string | null;
  timeline: string | null;
  notes: string | null;
}

export interface HiddenCost {
  vendor: string;
  item: string;
  estimated_amount: number;
  reason: string;
}

export interface RankedQuote {
  vendor: string;
  base_price: number;
  true_total: number;
  score: number;
  pros: string[];
  cons: string[];
}

export interface QuoteAnalysis {
  criteria_used: ComparisonCriteria;
  quotes: ParsedQuote[];
  normalized_categories: string[];
  hidden_costs: HiddenCost[];
  ranking: RankedQuote[];
  recommendation: string;
  reasoning: string;
  confidence: number;
  caveats: string[];
}

// UI State Types
export type ProcessState =
  | "idle"
  | "uploading"
  | "extracting"
  | "parsing"
  | "analyzing"
  | "complete"
  | "error";

export interface ProcessStep {
  id: ProcessState;
  label: string;
  description: string;
}

export const PROCESS_STEPS: ProcessStep[] = [
  { id: "uploading", label: "Uploading", description: "Uploading your PDF files..." },
  { id: "extracting", label: "Extracting", description: "Extracting text from quotes..." },
  { id: "parsing", label: "Parsing", description: "AI is parsing quote details..." },
  { id: "analyzing", label: "Analyzing", description: "AI is comparing and scoring quotes..." },
  { id: "complete", label: "Complete", description: "Analysis complete!" },
];
