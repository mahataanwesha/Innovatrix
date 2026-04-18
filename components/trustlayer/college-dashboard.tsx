"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Building, 
  Users, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Map as MapIcon, 
  LogOut,
  ChevronRight,
  ShieldAlert,
  ShieldCheck,
  TrendingUp
} from "lucide-react";
import { cn } from "@/lib/utils";

interface CollegeDashboardProps {
  onLogout: () => void;
}

export function CollegeDashboard({ onLogout }: CollegeDashboardProps) {
  const [activeTab, setActiveTab] = useState("dashboard");

  const sidebarItems = [
    { id: "dashboard", label: "Dashboard", icon: TrendingUp },
    { id: "verified", label: "Verified Recruiters", icon: ShieldCheck },
    { id: "pending", label: "Pending Requests", icon: Clock },
    { id: "scams", label: "Scam Reports", icon: ShieldAlert },
    { id: "heatmap", label: "Heatmap", icon: MapIcon },
  ];

  const stats = [
    { title: "Total Verified Recruiters", value: "142", icon: Users, color: "from-blue-500/20 to-cyan-500/20", textColor: "text-blue-400" },
    { title: "Pending Approvals", value: "8", icon: Clock, color: "from-amber-500/20 to-yellow-500/20", textColor: "text-amber-400" },
    { title: "Reported Scams", value: "24", icon: AlertTriangle, color: "from-red-500/20 to-rose-500/20", textColor: "text-red-400" },
    { title: "Active Drives", value: "12", icon: Building, color: "from-purple-500/20 to-pink-500/20", textColor: "text-purple-400" },
  ];

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/10 bg-black/50 backdrop-blur-xl hidden md:flex flex-col">
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center neon-glow">
              <Building className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h2 className="font-bold text-sm">Placement Cell</h2>
              <p className="text-xs text-muted-foreground">Admin Portal</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 text-sm font-medium",
                  isActive 
                    ? "bg-purple-500/10 text-purple-400 border border-purple-500/20" 
                    : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                )}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10">
          <button 
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors text-sm font-medium"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8 relative">
        {/* Background gradient effects */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl -z-10 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -z-10 pointer-events-none" />

        <div className="max-w-6xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-1">
                {sidebarItems.find(i => i.id === activeTab)?.label}
              </h1>
              <p className="text-muted-foreground">
                Manage verifications and protect your students.
              </p>
            </div>
          </div>

          {activeTab === "dashboard" && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, i) => {
                  const Icon = stat.icon;
                  return (
                    <div key={i} className="glass-card p-6 border border-white/5 relative overflow-hidden group">
                      <div className={cn("absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br", stat.color)} />
                      <div className="relative z-10">
                        <div className="flex items-center justify-between mb-4">
                          <Icon className={cn("w-6 h-6", stat.textColor)} />
                          <span className="text-2xl font-bold">{stat.value}</span>
                        </div>
                        <h3 className="text-sm font-medium text-muted-foreground">{stat.title}</h3>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {/* Recent Activity Mock */}
              <div className="glass-card p-6 border border-white/5">
                <h3 className="text-lg font-bold mb-6">Recent Activity</h3>
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                          <CheckCircle className="w-5 h-5 text-blue-400" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">Infosys verification approved</p>
                          <p className="text-xs text-muted-foreground">2 hours ago</p>
                        </div>
                      </div>
                      <button className="text-muted-foreground hover:text-white">
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "verified" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card border border-white/5 overflow-hidden">
              <table className="w-full text-left text-sm">
                <thead className="bg-white/5 border-b border-white/10">
                  <tr>
                    <th className="p-4 font-medium text-muted-foreground">Recruiter Name</th>
                    <th className="p-4 font-medium text-muted-foreground">Company</th>
                    <th className="p-4 font-medium text-muted-foreground">Email Domain</th>
                    <th className="p-4 font-medium text-muted-foreground">Status</th>
                    <th className="p-4 font-medium text-muted-foreground text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {[
                    { name: "Rahul Sharma", company: "TCS", domain: "@tcs.com" },
                    { name: "Priya Patel", company: "Infosys", domain: "@infosys.com" },
                    { name: "Amit Kumar", company: "Wipro", domain: "@wipro.com" },
                  ].map((row, i) => (
                    <tr key={i} className="hover:bg-white/5 transition-colors">
                      <td className="p-4 font-medium">{row.name}</td>
                      <td className="p-4">{row.company}</td>
                      <td className="p-4 text-muted-foreground">{row.domain}</td>
                      <td className="p-4">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/20">
                          <CheckCircle className="w-3.5 h-3.5" /> Verified
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button className="px-3 py-1.5 rounded-lg text-xs font-medium bg-white/5 hover:bg-white/10 transition-colors">Details</button>
                          <button className="px-3 py-1.5 rounded-lg text-xs font-medium bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors border border-red-500/20">Remove</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
          )}

          {activeTab === "pending" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              {[
                { name: "Suresh Gupta", company: "TechNova Solutions", email: "hr@technova.in" },
                { name: "Anita Desai", company: "Global Info", email: "careers@globalinfo.com" }
              ].map((req, i) => (
                <div key={i} className="glass-card p-6 border border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 group">
                  <div className="flex items-center gap-6">
                    <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center">
                      <Clock className="w-6 h-6 text-amber-400" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{req.company}</h3>
                      <p className="text-sm text-muted-foreground">Requested by {req.name} ({req.email})</p>
                      <button className="text-blue-400 text-sm mt-2 hover:underline">View submitted proof</button>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-medium bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500 hover:text-white transition-all duration-300">
                      <CheckCircle className="w-4 h-4" /> Approve
                    </button>
                    <button className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-medium bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500 hover:text-white transition-all duration-300">
                      <XCircle className="w-4 h-4" /> Reject
                    </button>
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {activeTab === "scams" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              {[
                { name: "Unkown Caller", issue: "Fake Interview Call", count: 12, risk: "High" },
                { name: "DataEntry Jobs", issue: "Registration Fee Requested", count: 5, risk: "Medium" },
              ].map((scam, i) => (
                <div key={i} className="glass-card p-6 border-l-4 border-l-red-500 border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-bold text-lg">{scam.issue}</h3>
                      <span className="px-2 py-0.5 rounded text-xs font-medium bg-red-500/20 text-red-400 border border-red-500/30">
                        {scam.risk} Risk
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">Reported against: {scam.name}</p>
                    <p className="text-xs text-amber-400 mt-2 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" /> Reported by {scam.count} students
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <button className="px-4 py-2 rounded-lg text-sm font-medium bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all border border-red-500/20">
                      Mark as High Risk
                    </button>
                    <button className="px-4 py-2 rounded-lg text-sm font-medium bg-white/5 hover:bg-white/10 transition-colors">
                      Forward to Admin
                    </button>
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {activeTab === "heatmap" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-6 border border-white/5 text-center min-h-[400px] flex flex-col items-center justify-center">
              <MapIcon className="w-16 h-16 text-muted-foreground/30 mb-4" />
              <h3 className="text-xl font-medium mb-2">Scam Density Heatmap</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Interactive map visualization of reported scams across different regions. Currently showing data for the last 30 days.
              </p>
              <div className="mt-8 flex gap-2">
                <button className="px-4 py-2 rounded-lg bg-white/10 text-sm font-medium">Last 7 Days</button>
                <button className="px-4 py-2 rounded-lg bg-primary/20 text-primary border border-primary/30 text-sm font-medium">Last 30 Days</button>
              </div>
            </motion.div>
          )}

        </div>
      </main>
    </div>
  );
}
