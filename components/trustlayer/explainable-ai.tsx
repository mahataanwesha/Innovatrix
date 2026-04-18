"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, ChevronDown, ChevronUp, Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface RiskFactor {
  id: string;
  label: string;
  score: number;
  maxScore: number;
  description: string;
}

interface ExplainableAIProps {
  factors: RiskFactor[];
}

export function ExplainableAI({ factors }: ExplainableAIProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const getBarColor = (percentage: number) => {
    if (percentage >= 70) return "bg-red-500";
    if (percentage >= 40) return "bg-yellow-500";
    return "bg-green-500";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="glass-card overflow-hidden"
    >
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-5 flex items-center justify-between text-left"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-secondary/20 flex items-center justify-center">
            <Brain className="w-5 h-5 text-secondary" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">Why This Is Flagged</h3>
            <p className="text-sm text-muted-foreground">
              AI-powered risk breakdown
            </p>
          </div>
        </div>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-5 h-5 text-muted-foreground" />
        </motion.div>
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 space-y-4">
              {factors.map((factor, index) => {
                const percentage = (factor.score / factor.maxScore) * 100;
                return (
                  <motion.div
                    key={factor.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{factor.label}</span>
                        <div className="group relative">
                          <Info className="w-3.5 h-3.5 text-muted-foreground cursor-help" />
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-card border border-border rounded-lg text-xs text-muted-foreground w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                            {factor.description}
                          </div>
                        </div>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {factor.score}/{factor.maxScore}
                      </span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 0.8, delay: 0.2 + index * 0.1 }}
                        className={cn("h-full rounded-full", getBarColor(percentage))}
                        style={{
                          boxShadow:
                            percentage >= 70
                              ? "0 0 10px rgba(255, 77, 77, 0.5)"
                              : percentage >= 40
                              ? "0 0 10px rgba(255, 200, 87, 0.5)"
                              : "0 0 10px rgba(34, 197, 94, 0.5)",
                        }}
                      />
                    </div>
                  </motion.div>
                );
              })}

              <div className="mt-4 p-3 bg-white/5 rounded-xl">
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Our AI analyzes multiple factors including domain age, payment
                  requests, language patterns, and cross-references with known scam
                  databases to calculate the risk score.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
