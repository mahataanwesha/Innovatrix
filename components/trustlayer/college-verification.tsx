"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  GraduationCap,
  CheckCircle,
  AlertTriangle,
  Building2,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Recruiter {
  id: string;
  name: string;
  logo?: string;
  status: "verified" | "suspicious";
  verifiedDate?: string;
  flaggedReason?: string;
}

const mockRecruiters: Recruiter[] = [
  {
    id: "1",
    name: "Infosys",
    status: "verified",
    verifiedDate: "Jan 2024",
  },
  {
    id: "2",
    name: "TCS",
    status: "verified",
    verifiedDate: "Feb 2024",
  },
  {
    id: "3",
    name: "Wipro",
    status: "verified",
    verifiedDate: "Dec 2023",
  },
  {
    id: "4",
    name: "Cognizant",
    status: "verified",
    verifiedDate: "Jan 2024",
  },
  {
    id: "5",
    name: "TechGiant Solutions",
    status: "suspicious",
    flaggedReason: "Multiple fake offer reports",
  },
  {
    id: "6",
    name: "GlobalHire India",
    status: "suspicious",
    flaggedReason: "Unverified company registration",
  },
];

export function CollegeVerification() {
  const [activeTab, setActiveTab] = useState<"verified" | "suspicious">("verified");

  const filteredRecruiters = mockRecruiters.filter(
    (r) => r.status === activeTab
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass-card p-6"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
          <GraduationCap className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold text-lg">College Verification Panel</h3>
          <p className="text-sm text-muted-foreground">
            Verified by your college placement cell
          </p>
        </div>
      </div>

      {/* Toggle */}
      <div className="flex gap-2 p-1 bg-white/5 rounded-xl mb-6">
        <button
          onClick={() => setActiveTab("verified")}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg transition-all duration-300 text-sm font-medium",
            activeTab === "verified"
              ? "bg-green-500/20 text-green-400"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <CheckCircle className="w-4 h-4" />
          Verified
        </button>
        <button
          onClick={() => setActiveTab("suspicious")}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg transition-all duration-300 text-sm font-medium",
            activeTab === "suspicious"
              ? "bg-red-500/20 text-red-400"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <AlertTriangle className="w-4 h-4" />
          Suspicious
        </button>
      </div>

      {/* List */}
      <div className="space-y-3">
        {filteredRecruiters.map((recruiter, index) => (
          <motion.div
            key={recruiter.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: index * 0.05 }}
            className={cn(
              "p-4 rounded-xl border transition-all duration-300 hover:bg-white/5 group",
              recruiter.status === "verified"
                ? "border-green-500/20"
                : "border-red-500/20"
            )}
          >
            <div className="flex items-center gap-4">
              <div
                className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center",
                  recruiter.status === "verified"
                    ? "bg-green-500/10"
                    : "bg-red-500/10"
                )}
              >
                <Building2
                  className={cn(
                    "w-6 h-6",
                    recruiter.status === "verified"
                      ? "text-green-400"
                      : "text-red-400"
                  )}
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium">{recruiter.name}</h4>
                  {recruiter.status === "verified" && (
                    <CheckCircle className="w-4 h-4 text-green-400" />
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  {recruiter.status === "verified"
                    ? `Verified since ${recruiter.verifiedDate}`
                    : recruiter.flaggedReason}
                </p>
              </div>

              <button className="p-2 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-white/10 transition-all">
                <ExternalLink className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredRecruiters.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No {activeTab} recruiters found
        </div>
      )}
    </motion.div>
  );
}
