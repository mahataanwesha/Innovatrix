"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Users,
  ThumbsUp,
  ThumbsDown,
  AlertTriangle,
  Shield,
  Building2,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ReportedRecruiter {
  id: string;
  name: string;
  company: string;
  riskLevel: "high" | "medium" | "low";
  reportCount: number;
  upvotes: number;
  downvotes: number;
  lastReported: string;
}

const mockReports: ReportedRecruiter[] = [
  {
    id: "1",
    name: "Priya Sharma (Fake HR)",
    company: "TechGiant Solutions",
    riskLevel: "high",
    reportCount: 156,
    upvotes: 234,
    downvotes: 12,
    lastReported: "2 hours ago",
  },
  {
    id: "2",
    name: "Recruitment Team",
    company: "GlobalHire India",
    riskLevel: "high",
    reportCount: 89,
    upvotes: 178,
    downvotes: 8,
    lastReported: "5 hours ago",
  },
  {
    id: "3",
    name: "HR Department",
    company: "FastTrack Careers",
    riskLevel: "medium",
    reportCount: 45,
    upvotes: 67,
    downvotes: 23,
    lastReported: "1 day ago",
  },
  {
    id: "4",
    name: "Job Portal Team",
    company: "QuickJobs.in",
    riskLevel: "medium",
    reportCount: 34,
    upvotes: 45,
    downvotes: 15,
    lastReported: "2 days ago",
  },
  {
    id: "5",
    name: "Campus Recruitment",
    company: "EduPlace Services",
    riskLevel: "low",
    reportCount: 12,
    upvotes: 23,
    downvotes: 18,
    lastReported: "5 days ago",
  },
];

const riskStyles = {
  high: {
    bg: "bg-red-500/10",
    border: "border-red-500/30",
    text: "text-red-400",
    label: "High Risk",
  },
  medium: {
    bg: "bg-yellow-500/10",
    border: "border-yellow-500/30",
    text: "text-yellow-400",
    label: "Suspicious",
  },
  low: {
    bg: "bg-green-500/10",
    border: "border-green-500/30",
    text: "text-green-400",
    label: "Under Review",
  },
};

export function CommunityReports() {
  const [reports, setReports] = useState(mockReports);

  const handleVote = (id: string, type: "up" | "down") => {
    setReports((prev) =>
      prev.map((report) =>
        report.id === id
          ? {
              ...report,
              upvotes: type === "up" ? report.upvotes + 1 : report.upvotes,
              downvotes: type === "down" ? report.downvotes + 1 : report.downvotes,
            }
          : report
      )
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass-card p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-secondary/20 flex items-center justify-center">
            <Users className="w-5 h-5 text-secondary" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">Community Reports</h3>
            <p className="text-sm text-muted-foreground">
              Recruiters flagged by students
            </p>
          </div>
        </div>
        <span className="text-sm text-muted-foreground">
          {reports.length} reports
        </span>
      </div>

      <div className="space-y-3">
        {reports.map((report, index) => {
          const risk = riskStyles[report.riskLevel];
          return (
            <motion.div
              key={report.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className={cn(
                "p-4 rounded-xl border transition-all duration-300 hover:bg-white/5",
                risk.border
              )}
            >
              <div className="flex items-start gap-4">
                <div
                  className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0",
                    risk.bg
                  )}
                >
                  {report.riskLevel === "high" ? (
                    <AlertTriangle className={cn("w-5 h-5", risk.text)} />
                  ) : report.riskLevel === "medium" ? (
                    <Shield className={cn("w-5 h-5", risk.text)} />
                  ) : (
                    <Building2 className={cn("w-5 h-5", risk.text)} />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium truncate">{report.name}</h4>
                    <span
                      className={cn(
                        "px-2 py-0.5 rounded-full text-xs font-medium",
                        risk.bg,
                        risk.text
                      )}
                    >
                      {risk.label}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {report.company}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>{report.reportCount} reports</span>
                    <span>{report.lastReported}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleVote(report.id, "up")}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-green-500/20 transition-colors group"
                  >
                    <ThumbsUp className="w-4 h-4 text-muted-foreground group-hover:text-green-400" />
                    <span className="text-sm text-muted-foreground group-hover:text-green-400">
                      {report.upvotes}
                    </span>
                  </button>
                  <button
                    onClick={() => handleVote(report.id, "down")}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-red-500/20 transition-colors group"
                  >
                    <ThumbsDown className="w-4 h-4 text-muted-foreground group-hover:text-red-400" />
                    <span className="text-sm text-muted-foreground group-hover:text-red-400">
                      {report.downvotes}
                    </span>
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
