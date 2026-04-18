"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ParticleBackground } from "@/components/trustlayer/particle-background";
import { Sidebar } from "@/components/trustlayer/sidebar";
import { HeroSection } from "@/components/trustlayer/hero-section";
import { UploadSection } from "@/components/trustlayer/upload-section";
import { ResultsSection } from "@/components/trustlayer/results-section";
import { ScamHeatmap } from "@/components/trustlayer/scam-heatmap";
import { CommunityReports } from "@/components/trustlayer/community-reports";
import { PersonalReports } from "@/components/trustlayer/personal-reports";
import { CollegeVerification } from "@/components/trustlayer/college-verification";
import { ScanAnimation } from "@/components/trustlayer/scan-animation";
import { HowItWorks } from "@/components/trustlayer/how-it-works";
import { Footer } from "@/components/trustlayer/footer";
import { cn } from "@/lib/utils";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { LoginSection } from "@/components/trustlayer/login-section";
import { CollegeDashboard } from "@/components/trustlayer/college-dashboard";
import { AdminDashboard } from "@/components/trustlayer/admin-dashboard";

type ViewState = "hero" | "login" | "verify" | "results" | "dashboard" | "reports" | "heatmap" | "profile" | "college_dashboard" | "admin_dashboard";

// Mock analysis results
const mockAnalysisResults = [
  {
    id: "1",
    title: "Fake Domain Detected",
    description: "The domain 'techgiant-careers.com' was registered only 15 days ago and doesn't match the official company website.",
    riskLevel: "high" as const,
    icon: "domain" as const,
    details: [
      "Domain age: 15 days (suspicious for established companies)",
      "No SSL certificate found",
      "Domain registered in a different country than company HQ",
      "Similar to known phishing domains",
    ],
  },
  {
    id: "2",
    title: "Payment Request Found",
    description: "The offer letter mentions a 'registration fee' of ₹5,000 which is a common scam tactic.",
    riskLevel: "high" as const,
    icon: "payment" as const,
    details: [
      "Legitimate companies never charge candidates",
      "Payment requested before interview",
      "No official invoice or receipt mentioned",
    ],
  },
  {
    id: "3",
    title: "Unusual Language Pattern",
    description: "Multiple grammatical errors and inconsistent formatting detected in the offer letter.",
    riskLevel: "medium" as const,
    icon: "language" as const,
    details: [
      "12 grammatical errors found",
      "Inconsistent date formats",
      "Missing official letter headers",
      "Generic greeting used instead of candidate name",
    ],
  },
  {
    id: "4",
    title: "Suspicious Email Domain",
    description: "HR contact uses a Gmail address instead of official company email.",
    riskLevel: "medium" as const,
    icon: "email" as const,
    details: [
      "Free email service used for official communication",
      "Email domain doesn't match company domain",
    ],
  },
];

const mockRiskFactors = [
  {
    id: "1",
    label: "Domain Authenticity",
    score: 85,
    maxScore: 100,
    description: "Measures the legitimacy of the domain based on age, SSL, and registration details.",
  },
  {
    id: "2",
    label: "Payment Red Flags",
    score: 90,
    maxScore: 100,
    description: "Detects any requests for money or suspicious financial transactions.",
  },
  {
    id: "3",
    label: "Language Analysis",
    score: 45,
    maxScore: 100,
    description: "Analyzes grammar, spelling, and professional language usage.",
  },
  {
    id: "4",
    label: "Contact Verification",
    score: 60,
    maxScore: 100,
    description: "Verifies if contact information matches official company records.",
  },
  {
    id: "5",
    label: "Database Cross-Reference",
    score: 75,
    maxScore: 100,
    description: "Checks against our database of known scam patterns and reported frauds.",
  },
];

export default function TrustLayerApp() {
  const [viewState, setViewState] = useState<ViewState>("hero");
  const [activeSection, setActiveSection] = useState("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [showScanAnimation, setShowScanAnimation] = useState(false);
  const [reportsTab, setReportsTab] = useState<"personal" | "community">("personal");
  const [userRole, setUserRole] = useState<string>("student");
  const [currentUser, setCurrentUser] = useState({ email: "student@college.edu", displayName: "Student User" });

  const handleGetStarted = () => {
    setViewState("login");
  };

  const handleLogin = (role: string, user: { email: string; displayName: string }) => {
    setUserRole(role);
    setCurrentUser(user);
    if (role === "student") {
      setViewState("verify");
      setActiveSection("verify");
    } else if (role === "college") {
      setViewState("college_dashboard");
    } else if (role === "admin") {
      setViewState("admin_dashboard");
    } else {
      setViewState("dashboard");
      setActiveSection("dashboard");
    }
  };

  const handleLogout = () => {
    setViewState("login");
    setUserRole("student");
  };

  const [score, setScore] = useState(23);
  const [dynamicAnalysisResults, setDynamicAnalysisResults] = useState(mockAnalysisResults);
  const [dynamicRiskFactors, setDynamicRiskFactors] = useState(mockRiskFactors);

  const handleAnalyze = useCallback(async (data: { type: string; content: string | File }) => {
    setIsScanning(true);
    setShowScanAnimation(true);

    try {
      const formData = new FormData();
      formData.append("inputType", data.type);
      if (data.type === "file" && data.content instanceof File) {
        formData.append("file", data.content);
      } else {
        formData.append("content", data.content as string);
      }

      const response = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      });

      const resData = await response.json();
      if (resData.status === "success") {
        setScore(resData.data.trustScore);
        
        // Save the result to Firebase Firestore
        try {
          let preview = "Document";
          if (data.type === "file" && data.content instanceof File) {
            preview = data.content.name;
          } else if (typeof data.content === "string") {
            preview = data.content.substring(0, 60) + (data.content.length > 60 ? "..." : "");
          }

          await addDoc(collection(db, "reports"), {
            userEmail: currentUser.email,
            type: data.type,
            contentPreview: preview,
            trustScore: resData.data.trustScore,
            riskLevel: resData.data.riskLevel === "Safe" ? "Low" : resData.data.riskLevel, // normalize UI
            factors: resData.data.factors,
            timestamp: serverTimestamp(),
          });
        } catch (dbErr) {
          console.error("Error saving report to Firebase:", dbErr);
        }

        // Map factors to dynamic results
        const newResults = resData.data.factors.map((factor: string, i: number) => ({
          id: String(i),
          title: "Risk Factor Detected",
          description: factor,
          riskLevel: resData.data.riskLevel.toLowerCase() as any,
          icon: "domain" as any,
        }));

          if (newResults.length > 0) {
            setDynamicAnalysisResults(newResults);
          } else {
            setDynamicAnalysisResults([{
               id: "0", title: "Safe", description: "No major risks detected", riskLevel: "low", icon: "document" as any
            }]);
          }

          // Update risk factors dynamically based on score
          const isHighRisk = resData.data.trustScore < 40;
          setDynamicRiskFactors([
            {
              id: "1",
              label: "Domain Authenticity",
              score: isHighRisk ? 20 : 95,
              maxScore: 100,
              description: isHighRisk ? "Domain age or SSL issues detected." : "Domain appears legitimate and verified.",
            },
            {
              id: "2",
              label: "Payment Red Flags",
              score: isHighRisk ? 30 : 100,
              maxScore: 100,
              description: isHighRisk ? "Suspicious payment requests found in content." : "No unusual financial requests detected.",
            },
            {
              id: "3",
              label: "Language Analysis",
              score: isHighRisk ? 45 : 90,
              maxScore: 100,
              description: "Analyzes grammar, spelling, and professional language usage.",
            },
            {
              id: "4",
              label: "Contact Verification",
              score: isHighRisk ? 20 : 85,
              maxScore: 100,
              description: isHighRisk ? "Unverified recruiter email domain." : "Contact information matches known safe patterns.",
            }
          ]);
        } else {
          throw new Error(resData.message || "Failed to analyze");
        }
      } catch (e) {
        console.error("Analysis failed:", e);
        // Set dynamic results to show the error rather than the hardcoded 23
        setScore(0);
        setDynamicAnalysisResults([{
           id: "error", title: "Analysis Failed", description: "Failed to connect to the backend server or process the request. Please try again.", riskLevel: "high", icon: "document" as any
        }]);
        setDynamicRiskFactors([]);
      }
  }, [currentUser.email]);

  const handleScanComplete = useCallback(() => {
    setShowScanAnimation(false);
    setIsScanning(false);
    setViewState("results");
  }, []);

  const handleBackToVerify = () => {
    setViewState("verify");
  };

  const handleNavigate = (section: string) => {
    setActiveSection(section);
    if (section === "verify") {
      setViewState("verify");
    } else if (section === "dashboard") {
      setViewState("dashboard");
    } else if (section === "reports") {
      setViewState("reports");
    } else if (section === "heatmap") {
      setViewState("heatmap");
    } else if (section === "profile") {
      setViewState("profile");
    }
  };

  const showSidebar = viewState !== "hero" && viewState !== "login" && viewState !== "college_dashboard" && viewState !== "admin_dashboard";

  if (viewState === "college_dashboard") {
    return (
      <div className="min-h-screen gradient-bg relative overflow-hidden">
        <ParticleBackground />
        <CollegeDashboard onLogout={handleLogout} />
      </div>
    );
  }

  if (viewState === "admin_dashboard") {
    return (
      <div className="min-h-screen bg-black relative overflow-hidden">
        <ParticleBackground />
        <AdminDashboard onLogout={handleLogout} />
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-bg gradient-mesh relative overflow-hidden">
      <ParticleBackground />

      {/* Grid pattern overlay */}
      <div className="fixed inset-0 grid-pattern pointer-events-none z-0" />

      {/* Sidebar */}
      <AnimatePresence>
        {showSidebar && (
          <Sidebar
            activeSection={activeSection}
            onNavigate={handleNavigate}
            isCollapsed={sidebarCollapsed}
            onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
          />
        )}
      </AnimatePresence>

      {/* Main content */}
      <main
        className={cn(
          "relative z-10 transition-all duration-300",
          showSidebar && (sidebarCollapsed ? "ml-20" : "ml-64")
        )}
      >
        <AnimatePresence mode="wait">
          {viewState === "hero" && (
            <motion.div
              key="hero"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <HeroSection onGetStarted={handleGetStarted} />
              <HowItWorks />
            </motion.div>
          )}

          {viewState === "login" && (
            <motion.div
              key="login"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <LoginSection onLogin={handleLogin} />
            </motion.div>
          )}

          {viewState === "verify" && (
            <motion.div
              key="verify"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="min-h-screen pt-8"
            >
              <UploadSection onAnalyze={handleAnalyze} isAnalyzing={isScanning} />
            </motion.div>
          )}

          {viewState === "results" && (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="min-h-screen pt-8"
            >
              <ResultsSection
                score={score}
                analysisResults={dynamicAnalysisResults}
                riskFactors={dynamicRiskFactors}
                onBack={handleBackToVerify}
              />
            </motion.div>
          )}

          {viewState === "dashboard" && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="min-h-screen p-8"
            >
              <div className="max-w-6xl mx-auto">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-8"
                >
                  <h1 className="text-3xl font-bold mb-2">
                    <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                      Dashboard
                    </span>
                  </h1>
                  <p className="text-muted-foreground">
                    Overview of scam detection activity
                  </p>
                </motion.div>

                {/* Stats */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                  {[
                    { label: "Total Scans", value: "1,247", change: "+12%" },
                    { label: "Scams Detected", value: "342", change: "+8%" },
                    { label: "Safe Offers", value: "856", change: "+15%" },
                    { label: "Under Review", value: "49", change: "-3%" },
                  ].map((stat, index) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="glass-card p-6"
                    >
                      <p className="text-sm text-muted-foreground mb-1">
                        {stat.label}
                      </p>
                      <div className="flex items-end justify-between">
                        <span className="text-3xl font-bold">{stat.value}</span>
                        <span
                          className={cn(
                            "text-sm font-medium",
                            stat.change.startsWith("+")
                              ? "text-green-400"
                              : "text-red-400"
                          )}
                        >
                          {stat.change}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="grid lg:grid-cols-2 gap-6">
                  <ScamHeatmap />
                  <CollegeVerification />
                </div>
              </div>
            </motion.div>
          )}

          {viewState === "reports" && (
            <motion.div
              key="reports"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="min-h-screen p-8"
            >
              <div className="max-w-4xl mx-auto">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-8"
                >
                  <h1 className="text-3xl font-bold mb-2">
                    <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                      Verification Reports
                    </span>
                  </h1>
                  <p className="text-muted-foreground">
                    Your personal verification history and community fraud reports
                  </p>
                </motion.div>

                <div className="glass-card p-2 mb-8 inline-flex rounded-xl relative">
                  <button
                    onClick={() => setReportsTab("personal")}
                    className={cn(
                      "px-6 py-2 rounded-lg font-medium transition-colors relative z-10",
                      reportsTab === "personal" ? "text-white" : "text-muted-foreground hover:text-white"
                    )}
                  >
                    Personal History
                  </button>
                  <button
                    onClick={() => setReportsTab("community")}
                    className={cn(
                      "px-6 py-2 rounded-lg font-medium transition-colors relative z-10",
                      reportsTab === "community" ? "text-white" : "text-muted-foreground hover:text-white"
                    )}
                  >
                    Community Reports
                  </button>
                  
                  <div
                    className={cn(
                      "absolute top-2 bottom-2 w-[160px] bg-white/10 rounded-lg transition-transform duration-300 pointer-events-none",
                      reportsTab === "community" ? "translate-x-full ml-1" : "translate-x-0"
                    )}
                  />
                </div>

                {reportsTab === "personal" ? <PersonalReports userEmail={currentUser.email} /> : <CommunityReports />}
              </div>
            </motion.div>
          )}

          {viewState === "heatmap" && (
            <motion.div
              key="heatmap"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="min-h-screen p-8"
            >
              <div className="max-w-4xl mx-auto">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-8"
                >
                  <h1 className="text-3xl font-bold mb-2">
                    <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                      Scam Heatmap
                    </span>
                  </h1>
                  <p className="text-muted-foreground">
                    Regional fraud hotspots across India
                  </p>
                </motion.div>
                <ScamHeatmap />
              </div>
            </motion.div>
          )}

          {viewState === "profile" && (
            <motion.div
              key="profile"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="min-h-screen p-8"
            >
              <div className="max-w-2xl mx-auto">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-8"
                >
                  <h1 className="text-3xl font-bold mb-2">
                    <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                      Profile
                    </span>
                  </h1>
                  <p className="text-muted-foreground">
                    Manage your account and preferences
                  </p>
                </motion.div>

                <div className="glass-card p-8">
                  <div className="flex items-center gap-6 mb-8">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-3xl font-bold text-primary-foreground uppercase">
                      {currentUser.displayName.charAt(0)}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">{currentUser.displayName}</h2>
                      <p className="text-muted-foreground">
                        {currentUser.email}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                      <span className="text-muted-foreground">Domain / Affiliation</span>
                      <span className="font-medium">{currentUser.email.split('@')[1] || "N/A"}</span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                      <span className="text-muted-foreground">Member Since</span>
                      <span className="font-medium">January 2024</span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                      <span className="text-muted-foreground">Total Scans</span>
                      <span className="font-medium">47</span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                      <span className="text-muted-foreground">Reports Submitted</span>
                      <span className="font-medium">3</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <Footer />
      </main>

      {/* Scan Animation Overlay */}
      <AnimatePresence>
        {showScanAnimation && (
          <ScanAnimation isActive={showScanAnimation} onComplete={handleScanComplete} />
        )}
      </AnimatePresence>
    </div>
  );
}
