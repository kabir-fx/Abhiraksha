"use client";

import {
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  TrendingUp,
} from "lucide-react";

export interface ClaimVerdict {
  decision: "Accepted" | "Rejected" | "Pending";
  confidence_score: number;
  reasoning: string[];
  missing_info: string[];
}

const DECISION_CONFIG = {
  Accepted: {
    icon: CheckCircle2,
    color: "text-emerald-600",
    bgColor: "bg-emerald-50",
    borderColor: "border-emerald-200",
    badgeBg: "bg-emerald-100",
    badgeText: "text-emerald-700",
    barColor: "bg-emerald-500",
  },
  Rejected: {
    icon: XCircle,
    color: "text-red-600",
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
    badgeBg: "bg-red-100",
    badgeText: "text-red-700",
    barColor: "bg-red-500",
  },
  Pending: {
    icon: Clock,
    color: "text-amber-600",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
    badgeBg: "bg-amber-100",
    badgeText: "text-amber-700",
    barColor: "bg-amber-500",
  },
};

export default function ClaimVerdictPanel({
  verdict,
}: {
  verdict: ClaimVerdict;
}) {
  const config = DECISION_CONFIG[verdict.decision];
  const Icon = config.icon;

  return (
    <div
      className={`bg-white rounded-2xl border ${config.borderColor} shadow-sm overflow-hidden animate-slide-up`}
    >
      {/* Header */}
      <div className={`${config.bgColor} px-6 py-5`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl bg-white/70 flex items-center justify-center`}
            >
              <Icon className={`w-5 h-5 ${config.color}`} />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">
                AI Claim Verdict
              </h3>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-bold ${config.badgeBg} ${config.badgeText} mt-0.5`}
              >
                {verdict.decision}
              </span>
            </div>
          </div>

          {/* Confidence Score */}
          <div className="text-right">
            <div className="flex items-center gap-1.5 text-gray-500 text-xs mb-1">
              <TrendingUp className="w-3.5 h-3.5" />
              Confidence
            </div>
            <span className={`text-2xl font-bold ${config.color}`}>
              {verdict.confidence_score}%
            </span>
          </div>
        </div>

        {/* Confidence Bar */}
        <div className="mt-3 w-full bg-white/50 rounded-full h-1.5">
          <div
            className={`${config.barColor} h-1.5 rounded-full transition-all duration-700 ease-out`}
            style={{ width: `${verdict.confidence_score}%` }}
          />
        </div>
      </div>

      {/* Body */}
      <div className="px-6 py-5 space-y-5">
        {/* Reasoning */}
        {verdict.reasoning.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-2.5 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-gray-400" />
              Reasoning
            </h4>
            <ul className="space-y-2">
              {verdict.reasoning.map((reason, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-sm text-gray-600"
                >
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-gray-300 mt-1.5 shrink-0" />
                  <span>{reason}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Missing Info */}
        {verdict.missing_info.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-2.5 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              Missing Information
            </h4>
            <div className="flex flex-wrap gap-2">
              {verdict.missing_info.map((item, i) => (
                <span
                  key={i}
                  className="inline-flex items-center px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-100 text-xs text-amber-700 font-medium"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
