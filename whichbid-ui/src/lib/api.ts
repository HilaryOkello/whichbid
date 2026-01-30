import { ComparisonCriteria, QuoteAnalysis } from "@/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function analyzeQuotes(
  files: File[],
  criteria?: Partial<ComparisonCriteria>,
  onProgress?: (state: string) => void
): Promise<QuoteAnalysis> {
  const formData = new FormData();

  // Add files
  files.forEach((file) => {
    formData.append("files", file);
  });

  // Add criteria if provided
  if (criteria) {
    const criteriaPayload: ComparisonCriteria = {
      priorities: criteria.priorities || ["price"],
      must_include: criteria.must_include || null,
      budget_limit: criteria.budget_limit || null,
      notes: criteria.notes || null,
    };
    formData.append("criteria", JSON.stringify(criteriaPayload));
  }

  onProgress?.("uploading");

  const response = await fetch(`${API_BASE_URL}/quotes/analyze`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: "Unknown error" }));
    throw new Error(error.detail || `HTTP ${response.status}: ${response.statusText}`);
  }

  onProgress?.("complete");
  return response.json();
}

export async function checkHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    return response.ok;
  } catch {
    return false;
  }
}
