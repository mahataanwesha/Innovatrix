"use client";

import { motion } from "framer-motion";
import {
  Globe,
  CreditCard,
  MessageSquareWarning,
  FileWarning,
  Mail,
  Phone,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface AnalysisResult {
  id: string;
  title: string;
  description: string;
  riskLevel: "high" | "medium" | "low";
  icon: "domain" | "payment" | "language" | "document" | "email" | "phone";
  details?: string[];
}

interface AnalysisPanelProps {
  results: AnalysisResult[];
  isScanning: boolean;
}

const iconMap = {
  domain: Globe,
  payment: CreditCard,
  language: MessageSquareWarning,
  document: FileWarning,
  email: Mail,
  phone: Phone,
};

const riskColors = {
  high: {
    bg: "bg-red-500/10",
    border: "border-red-500/30",
    text: "text-red-400",
    icon: XCircle,
    label: "High Risk",
  },
  medium: {
    bg: "bg-yellow-500/10",
    border: "border-yellow-500/30",
    text: "text-yellow-400",
    icon: AlertTriangle,
    label: "Suspicious",
  },
  low: {
    bg: "bg-green-500/10",
    border: "border-green-500/30",
    text: "text-green-400",
    icon: CheckCircle,
    label: "Safe",
  },
};

export function AnalysisPanel({ results, isScanning }: AnalysisPanelProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-4"
    >
      <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <FileWarning className="w-5 h-5 text-primary" />
        AI Analysis Results
      </h3>

      {isScanning && (
        <div className="relative glass-card p-6 overflow-hidden">
          <div className="scan-line" />
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center animate-pulse">
              <Globe className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1">
              <div className="h-4 bg-white/10 rounded animate-pulse mb-2 w-3/4" />
              <div className="h-3 bg-white/5 rounded animate-pulse w-1/2" />
            </div>
          </div>
        </div>
      )}

      {!isScanning &&
        results.map((result, index) => {
          const normalizedRiskLevel = (result.riskLevel?.toLowerCase() || "medium") as keyof typeof riskColors;
          const risk = riskColors[normalizedRiskLevel] || riskColors.medium;
          const Icon = iconMap[result.icon as keyof typeof iconMap] || FileWarning;
          const RiskIcon = risk.icon;
          const isExpanded = expandedId === result.id;

          return (
            <motion.div
              key={result.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className={cn(
                "glass-card border overflow-hidden transition-all duration-300",
                risk.border,
                result.riskLevel === "high" && "neon-glow-red"
              )}
            >
              <button
                onClick={() =>
                  setExpandedId(isExpanded ? null : result.id)
                }
                className="w-full p-4 flex items-center gap-4 text-left"
              >
                <div
                  className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center",
                    risk.bg
                  )}
                >
                  <Icon className={cn("w-6 h-6", risk.text)} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold truncate">{result.title}</h4>
                    <span
                      className={cn(
                        "px-2 py-0.5 rounded-full text-xs font-medium flex items-center gap-1",
                        risk.bg,
                        risk.text
                      )}
                    >
                      <RiskIcon className="w-3 h-3" />
                      {risk.label}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-1">
                    {result.description}
                  </p>
                </div>

                <div className="flex-shrink-0">
                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-muted-foreground" />
                  )}
                </div>
              </button>

              {/* Expanded Details */}
              <motion.div
                initial={false}
                animate={{
                  height: isExpanded ? "auto" : 0,
                  opacity: isExpanded ? 1 : 0,
                }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                {result.details && (
                  <div className="px-4 pb-4 pt-0 border-t border-white/10">
                    <div className="pt-4 space-y-2">
                      {result.details.map((detail, i) => (
                        <div
                          key={i}
                          className="flex items-start gap-2 text-sm text-muted-foreground"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                          {detail}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            </motion.div>
          );
        })}
    </motion.div>
  );
}
