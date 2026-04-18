"use client";

import { motion } from "framer-motion";
import { TrustScore } from "./trust-score";
import { AnalysisPanel } from "./analysis-panel";
import { ExplainableAI } from "./explainable-ai";
import { ArrowLeft, Share2, Download, Flag } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AnalysisResult {
  id: string;
  title: string;
  description: string;
  riskLevel: "high" | "medium" | "low";
  icon: "domain" | "payment" | "language" | "document" | "email" | "phone";
  details?: string[];
}

interface RiskFactor {
  id: string;
  label: string;
  score: number;
  maxScore: number;
  description: string;
}

interface ResultsSectionProps {
  score: number;
  analysisResults: AnalysisResult[];
  riskFactors: RiskFactor[];
  onBack: () => void;
}

export function ResultsSection({
  score,
  analysisResults,
  riskFactors,
  onBack,
}: ResultsSectionProps) {
  return (
    <section className="py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <Button
            variant="ghost"
            onClick={onBack}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Verify
          </Button>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="bg-white/5 border-white/10 hover:bg-white/10"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="bg-white/5 border-white/10 hover:bg-white/10"
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20"
            >
              <Flag className="w-4 h-4 mr-2" />
              Report
            </Button>
          </div>
        </motion.div>

        {/* Main content grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Trust Score - Left column */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-1"
          >
            <div className="glass-card p-8 flex flex-col items-center">
              <TrustScore score={score} />

              <div className="w-full mt-8 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Scan Time</span>
                  <span className="font-medium">6.2 seconds</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Checks Performed</span>
                  <span className="font-medium">24 checks</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Database Match</span>
                  <span className="font-medium text-red-400">3 matches</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Analysis & Explainable AI - Right columns */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 space-y-6"
          >
            <AnalysisPanel results={analysisResults} isScanning={false} />
            <ExplainableAI factors={riskFactors} />
          </motion.div>
        </div>

        {/* Warning banner for high risk */}
        {score < 40 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-8 p-6 rounded-2xl bg-red-500/10 border border-red-500/30 neon-glow-red pulse-glow"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center flex-shrink-0">
                <Flag className="w-6 h-6 text-red-400" />
              </div>
              <div>
                <h4 className="text-lg font-semibold text-red-400 mb-2 glitch">
                  High Risk Detected
                </h4>
                <p className="text-muted-foreground leading-relaxed">
                  Our AI has detected multiple red flags in this offer. We strongly
                  recommend not proceeding with this recruiter. If you have already
                  shared personal information, please contact your college placement
                  cell immediately.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
