"use client";

import { useState, useCallback } from "react";
import { Download, Sparkles, Loader2 } from "lucide-react";
import UploadCard, { type ExtractionData } from "./upload-card";
import ClaimVerdictPanel, { type ClaimVerdict } from "./claim-verdict";

type DocumentType = "insurance" | "discharge" | "bill";

interface Section {
  id: string;
  title: string;
  description: string;
  iconName: "ShieldCheck" | "Activity" | "Receipt";
  color: string;
  bgColor: string;
  hoverBorder: string;
  documentType: DocumentType;
  mode?: "upload" | "lookup";
}

interface DashboardContentProps {
  sections: Section[];
}

export default function DashboardContent({ sections }: DashboardContentProps) {
  const [results, setResults] = useState<
    Record<DocumentType, ExtractionData | null>
  >({
    insurance: null,
    discharge: null,
    bill: null,
  });
  const [analyzing, setAnalyzing] = useState(false);
  const [verdict, setVerdict] = useState<ClaimVerdict | null>(null);
  const [analyzeError, setAnalyzeError] = useState("");

  const handleResult = useCallback(
    (type: DocumentType) => (data: ExtractionData | null) => {
      setResults((prev) => ({ ...prev, [type]: data }));
      // Clear previous verdict when data changes
      setVerdict(null);
      setAnalyzeError("");
    },
    [],
  );

  const hasAnyData = Object.values(results).some(
    (r) => r !== null && r.data !== null,
  );

  const buildConsolidatedJson = () => {
    const data: Record<string, unknown> = {};
    for (const type of ["insurance", "discharge", "bill"] as DocumentType[]) {
      const result = results[type];
      data[type] = result?.data ?? null;
    }
    return data;
  };

  const handleExport = () => {
    const exportData = {
      exported_at: new Date().toISOString(),
      ...buildConsolidatedJson(),
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `claim-export-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleAnalyze = async () => {
    setAnalyzing(true);
    setAnalyzeError("");
    setVerdict(null);

    try {
      const response = await fetch("/api/claim/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(buildConsolidatedJson()),
      });

      const json = await response.json();

      if (!response.ok) {
        throw new Error(json.error || "Analysis failed");
      }

      setVerdict(json.verdict);
    } catch (err) {
      setAnalyzeError(err instanceof Error ? err.message : "Analysis failed.");
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <>
      {/* Upload Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 items-start">
        {sections.map((section, index) => (
          <UploadCard
            key={section.id}
            {...section}
            animationDelay={`${index * 100}ms`}
            onResult={handleResult(section.documentType)}
          />
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-3 mb-8 animate-fade-in">
        <button
          onClick={handleExport}
          disabled={!hasAnyData}
          className="inline-flex items-center gap-2 px-5 py-2.5 border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed text-gray-700 text-sm font-medium rounded-xl shadow-sm transition-all duration-200 cursor-pointer"
        >
          <Download className="w-4 h-4" />
          Export JSON
        </button>
        <button
          onClick={handleAnalyze}
          disabled={!hasAnyData || analyzing}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-600 hover:bg-brand-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium rounded-xl shadow-sm transition-all duration-200 cursor-pointer"
        >
          {analyzing ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Sparkles className="w-4 h-4" />
          )}
          {analyzing ? "Analyzing…" : "Analyze Claim"}
        </button>
      </div>

      {/* Error */}
      {analyzeError && (
        <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600 animate-fade-in">
          {analyzeError}
        </div>
      )}

      {/* Verdict */}
      {verdict && (
        <div className="mb-12">
          <ClaimVerdictPanel verdict={verdict} />
        </div>
      )}
    </>
  );
}
