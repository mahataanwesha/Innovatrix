"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Link as LinkIcon, MessageSquare, AlertTriangle, Shield, CheckCircle, Share2, ChevronDown, ChevronUp, Flag, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { db } from "@/lib/firebase";
import { collection, query, where, orderBy, onSnapshot } from "firebase/firestore";

interface PersonalReport {
  id: string;
  type: "file" | "link" | "chat";
  contentPreview: string;
  trustScore: number;
  riskLevel: "High" | "Medium" | "Low";
  date: string;
  factors: string[];
}

interface PersonalReportsProps {
  userEmail?: string;
}

export function PersonalReports({ userEmail }: PersonalReportsProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [reports, setReports] = useState<PersonalReport[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userEmail) {
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, "reports"),
      where("userEmail", "==", userEmail)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedReports = snapshot.docs.map((doc) => {
        const data = doc.data();
        let dateStr = "Just now";
        if (data.timestamp) {
          dateStr = data.timestamp.toDate().toLocaleString(undefined, {
            month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
          });
        }
        return {
          id: doc.id,
          type: data.type || "file",
          contentPreview: data.contentPreview || "Unknown Item",
          trustScore: data.trustScore || 0,
          riskLevel: data.riskLevel || "Medium",
          date: dateStr,
          factors: data.factors || [],
          // Keep raw timestamp for accurate sorting
          _rawTime: data.timestamp ? data.timestamp.toMillis() : Date.now(),
        };
      });
      
      // Sort client-side to avoid Firestore composite index requirement
      fetchedReports.sort((a, b) => b._rawTime - a._rawTime);
      
      setReports(fetchedReports as unknown as PersonalReport[]);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching reports:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [userEmail]);

  const handleShare = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    alert(`Shareable link generated: https://trustlayer.ai/report/${id}\nYou can send this to friends or parents!`);
  };

  const handleReportFraud = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    alert(`Report ${id} has been submitted to admin as evidence of fraud.`);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
        <Loader2 className="w-8 h-8 animate-spin mb-4" />
        <p>Loading your personal history...</p>
      </div>
    );
  }

  if (reports.length === 0) {
    return (
      <div className="glass-card p-12 text-center border border-white/10 rounded-2xl">
        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
          <Shield className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-medium mb-2">No Reports Yet</h3>
        <p className="text-muted-foreground">
          You haven't scanned any files or links yet. Head to the dashboard to verify an offer letter or link!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {reports.map((report) => {
        const isExpanded = expandedId === report.id;
        const isHighRisk = report.riskLevel === "High";
        const isSafe = report.riskLevel === "Low";

        return (
          <motion.div
            key={report.id}
            layout
            className={cn(
              "glass-card border overflow-hidden cursor-pointer transition-colors",
              isHighRisk ? "border-red-500/30 hover:bg-red-500/5" :
              isSafe ? "border-green-500/30 hover:bg-green-500/5" :
              "border-yellow-500/30 hover:bg-yellow-500/5"
            )}
            onClick={() => setExpandedId(isExpanded ? null : report.id)}
          >
            <div className="p-5 flex items-center gap-4">
              <div className={cn(
                "w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0",
                isHighRisk ? "bg-red-500/10 text-red-400" :
                isSafe ? "bg-green-500/10 text-green-400" :
                "bg-yellow-500/10 text-yellow-400"
              )}>
                {report.type === "file" ? <FileText className="w-6 h-6" /> :
                 report.type === "link" ? <LinkIcon className="w-6 h-6" /> :
                 <MessageSquare className="w-6 h-6" />}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-semibold text-lg truncate">{report.contentPreview}</h4>
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <span>{report.date}</span>
                  <span>•</span>
                  <span className={cn(
                    "font-medium",
                    isHighRisk ? "text-red-400" : isSafe ? "text-green-400" : "text-yellow-400"
                  )}>
                    {report.riskLevel} Risk (Score: {report.trustScore})
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button 
                  onClick={(e) => handleShare(e, report.id)}
                  className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors tooltip-trigger"
                  title="Share Report"
                >
                  <Share2 className="w-5 h-5 text-muted-foreground" />
                </button>
                {isExpanded ? <ChevronUp className="w-5 h-5 text-muted-foreground" /> : <ChevronDown className="w-5 h-5 text-muted-foreground" />}
              </div>
            </div>

            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="px-5 pb-5 pt-2 border-t border-white/5"
                >
                  <div className="grid md:grid-cols-2 gap-6 mt-4">
                    <div>
                      <h5 className="font-medium mb-3 flex items-center gap-2">
                        <Shield className="w-4 h-4 text-primary" />
                        AI Analysis Breakdown
                      </h5>
                      <ul className="space-y-2">
                        {report.factors.map((factor, idx) => (
                          <li key={idx} className="text-sm flex items-start gap-2 bg-white/5 p-2 rounded-lg">
                            <span className="mt-0.5 text-primary">•</span>
                            <span className="text-muted-foreground">{factor}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="flex flex-col justify-between bg-white/5 p-4 rounded-xl">
                      <div>
                        <h5 className="font-medium mb-2 text-white">Why This Was Flagged</h5>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {isHighRisk ? "Our AI strongly recommends avoiding this offer. It contains multiple red flags typical of placement scams, such as upfront payment requests and unverified origins." :
                           isSafe ? "This offer originates from a verified source and shows no typical signs of placement fraud. Proceed with standard caution." :
                           "This offer contains some suspicious elements. Please verify the recruiter directly through official company channels before proceeding."}
                        </p>
                      </div>
                      
                      {isHighRisk && (
                        <button 
                          onClick={(e) => handleReportFraud(e, report.id)}
                          className="mt-4 flex items-center justify-center gap-2 w-full py-2 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded-lg transition-colors text-sm font-medium"
                        >
                          <Flag className="w-4 h-4" />
                          Report as Fraud Evidence
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );
}
