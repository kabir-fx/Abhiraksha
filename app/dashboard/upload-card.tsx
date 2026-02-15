"use client";

import { useRef, useState } from "react";
import {
  UploadCloud,
  File,
  X,
  Loader2,
  AlertCircle,
  ShieldCheck,
  Activity,
  Receipt,
} from "lucide-react";

const ICON_MAP = {
  ShieldCheck,
  Activity,
  Receipt,
} as const;
import ExtractionResults from "./extraction-results";

interface UploadCardProps {
  id: string;
  title: string;
  description: string;
  iconName: keyof typeof ICON_MAP;
  color: string;
  bgColor: string;
  hoverBorder: string;
  documentType: "insurance" | "discharge" | "bill";
  animationDelay: string;
  mode?: "upload" | "lookup";
  onResult?: (data: ExtractionData | null) => void;
}

type UploadState =
  | "idle"
  | "selected"
  | "uploading"
  | "success"
  | "error"
  | "searching";

export interface ExtractionData {
  success: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: Record<string, any> | null;
  raw_text: string;
  confidence: Record<string, boolean>;
}

export default function UploadCard({
  id,
  title,
  description,
  iconName,
  color,
  bgColor,
  hoverBorder,
  documentType,
  animationDelay,
  mode = "upload",
  onResult,
}: UploadCardProps) {
  const Icon = ICON_MAP[iconName];
  const fileInputRef = useRef<HTMLInputElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [state, setState] = useState<UploadState>("idle");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [result, setResult] = useState<ExtractionData | null>(null);
  const [error, setError] = useState<string>("");

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      setError("Please select a PDF file.");
      setState("error");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError("File too large. Maximum size is 10MB.");
      setState("error");
      return;
    }

    setSelectedFile(file);
    setError("");
    setState("selected");
    setResult(null);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setState("uploading");
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("type", documentType);

      const response = await fetch("/api/extract", {
        method: "POST",
        body: formData,
      });

      const json = await response.json();

      if (!response.ok) {
        throw new Error(json.error || "Extraction failed");
      }

      setResult(json);
      setState("success");
      onResult?.(json);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setState("error");
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setState("searching");
    setError("");
    setResult(null);

    try {
      const response = await fetch("/api/policy/lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ policyNumber: searchQuery }),
      });

      const json = await response.json();

      if (!response.ok) {
        throw new Error(json.error || "Policy lookup failed");
      }

      setResult(json);
      setState("success");
      onResult?.(json);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lookup failed.");
      setState("error");
    }
  };

  const handleReset = () => {
    setState("idle");
    setSelectedFile(null);
    setSearchQuery("");
    setResult(null);
    setError("");
    onResult?.(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div
      className={`bg-white rounded-2xl border border-gray-200 p-6 flex flex-col transition-all duration-300 animate-slide-up ${
        state === "success"
          ? "border-emerald-200 shadow-md"
          : state === "error"
            ? "border-red-200"
            : hoverBorder
      }`}
      style={{ animationDelay }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div
          className={`w-12 h-12 rounded-xl ${bgColor} flex items-center justify-center shrink-0`}
        >
          <Icon className={`w-6 h-6 ${color}`} />
        </div>
        <div>
          <h3 className="text-base font-bold text-gray-900">{title}</h3>
          <p className="text-xs text-gray-500">{description}</p>
        </div>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,application/pdf"
        onChange={handleFileSelect}
        className="hidden"
        id={`file-${id}`}
      />

      {/* State: Idle (Upload Mode) */}
      {state === "idle" && mode === "upload" && (
        <button
          onClick={() => fileInputRef.current?.click()}
          className="mt-auto w-full py-3 rounded-xl border-2 border-dashed border-gray-200 text-gray-500 text-sm font-medium hover:border-brand-300 hover:text-brand-600 hover:bg-brand-50/30 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
        >
          <UploadCloud className="w-4 h-4" />
          Select PDF
        </button>
      )}

      {/* State: Idle (Lookup Mode) */}
      {state === "idle" && mode === "lookup" && (
        <div className="mt-auto flex gap-2 space-y-3">
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Enter Policy Number"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-[80%] h-11 px-4 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <button
            onClick={handleSearch}
            disabled={!searchQuery.trim()}
            className="w-[20%] h-11 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium rounded-xl shadow-sm transition-all duration-200 cursor-pointer flex items-center justify-center"
          >
            Search
          </button>
        </div>
      )}

      {/* State: File selected */}
      {state === "selected" && selectedFile && (
        <div className="mt-auto space-y-3">
          <div className="flex items-center gap-2 p-2.5 bg-gray-50 rounded-lg">
            <File className="w-4 h-4 text-gray-400 shrink-0" />
            <span className="text-sm text-gray-700 truncate flex-1">
              {selectedFile.name}
            </span>
            <button
              onClick={handleReset}
              className="p-1 hover:bg-gray-200 rounded transition-colors cursor-pointer"
            >
              <X className="w-3 h-3 text-gray-400" />
            </button>
          </div>
          <button
            onClick={handleUpload}
            className="w-full py-2.5 bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium rounded-xl shadow-sm transition-all duration-200 cursor-pointer"
          >
            Extract Data
          </button>
        </div>
      )}

      {/* State: Uploading / Searching */}
      {(state === "uploading" || state === "searching") && (
        <div className="mt-auto flex items-center justify-center gap-2 py-3 text-brand-600">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span className="text-sm font-medium">
            {state === "uploading" ? "Extracting…" : "Searching…"}
          </span>
        </div>
      )}

      {/* State: Error */}
      {state === "error" && (
        <div className="mt-auto space-y-3">
          <div className="flex items-center gap-2 p-2.5 bg-red-50 rounded-lg text-red-600">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span className="text-sm">{error}</span>
          </div>
          <button
            onClick={handleReset}
            className="w-full py-2.5 border border-gray-200 text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-50 transition-all duration-200 cursor-pointer"
          >
            Try Again
          </button>
        </div>
      )}

      {/* State: Success */}
      {state === "success" && result && (
        <div className="mt-2 space-y-3">
          {result.data && (
            <ExtractionResults
              type={documentType}
              data={result.data}
              confidence={result.confidence}
            />
          )}
          <button
            onClick={handleReset}
            className="w-full py-2 border border-gray-200 text-gray-500 text-xs font-medium rounded-lg hover:bg-gray-50 transition-all duration-200 cursor-pointer"
          >
            {mode === "upload"
              ? "Upload Different File"
              : "Search Another Policy"}
          </button>
        </div>
      )}
    </div>
  );
}
