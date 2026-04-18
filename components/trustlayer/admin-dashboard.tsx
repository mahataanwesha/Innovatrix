"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Users, 
  ShieldCheck, 
  AlertOctagon, 
  Settings, 
  Activity, 
  Map as MapIcon, 
  LogOut,
  Ban,
  Trash2,
  Eye,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Send,
  Lock,
  Clock
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AdminDashboardProps {
  onLogout: () => void;
}

export function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState("dashboard");

  const sidebarItems = [
    { id: "dashboard", label: "Dashboard", icon: Activity },
    { id: "users", label: "Users Management", icon: Users },
    { id: "recruiters", label: "Recruiter Management", icon: ShieldCheck },
    { id: "scams", label: "Scam Reports", icon: AlertOctagon },
    { id: "verification", label: "Verification Control", icon: Settings },
    { id: "heatmap", label: "Heatmap Analytics", icon: MapIcon },
    { id: "logs", label: "System Logs", icon: Lock },
  ];

  const stats = [
    { title: "Total Users", value: "8,432", icon: Users, color: "from-blue-500/20 to-indigo-500/20", textColor: "text-blue-400" },
    { title: "Total Reports", value: "1,204", icon: AlertTriangle, color: "from-amber-500/20 to-yellow-500/20", textColor: "text-amber-400" },
    { title: "Active Scams", value: "89", icon: AlertOctagon, color: "from-red-500/20 to-rose-500/20", textColor: "text-red-400" },
    { title: "Verified Recruiters", value: "456", icon: ShieldCheck, color: "from-emerald-500/20 to-green-500/20", textColor: "text-emerald-400" },
  ];

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/10 bg-black/60 backdrop-blur-xl hidden md:flex flex-col">
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500/20 to-orange-500/20 flex items-center justify-center neon-glow-red">
              <ShieldCheck className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <h2 className="font-bold text-sm tracking-wide">TrustLayer</h2>
              <p className="text-xs font-semibold text-red-400">Admin Control</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
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
                    ? "bg-red-500/10 text-red-400 border border-red-500/20" 
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
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-500/5 rounded-full blur-[100px] -z-10 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[100px] -z-10 pointer-events-none" />

        <div className="max-w-6xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-1">
                {sidebarItems.find(i => i.id === activeTab)?.label}
              </h1>
              <p className="text-muted-foreground">
                Authorized Personnel Only. Maintain platform integrity.
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
            </motion.div>
          )}

          {activeTab === "users" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card border border-white/5 overflow-hidden">
              <table className="w-full text-left text-sm">
                <thead className="bg-white/5 border-b border-white/10">
                  <tr>
                    <th className="p-4 font-medium text-muted-foreground">Name</th>
                    <th className="p-4 font-medium text-muted-foreground">Email</th>
                    <th className="p-4 font-medium text-muted-foreground">Role</th>
                    <th className="p-4 font-medium text-muted-foreground">Status</th>
                    <th className="p-4 font-medium text-muted-foreground text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {[
                    { name: "Rahul Sharma", email: "rahul@gmail.com", role: "Student", status: "Active" },
                    { name: "IIT Delhi Cell", email: "admin@iitd.ac.in", role: "College", status: "Active" },
                    { name: "Suspicious User", email: "scammer99@temp.com", role: "Student", status: "Blocked" },
                  ].map((row, i) => (
                    <tr key={i} className="hover:bg-white/5 transition-colors">
                      <td className="p-4 font-medium">{row.name}</td>
                      <td className="p-4 text-muted-foreground">{row.email}</td>
                      <td className="p-4">
                        <span className={cn("px-2 py-1 rounded-md text-xs font-medium border", row.role === "College" ? "bg-purple-500/10 text-purple-400 border-purple-500/20" : "bg-blue-500/10 text-blue-400 border-blue-500/20")}>
                          {row.role}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={cn("px-2 py-1 rounded-md text-xs font-medium", row.status === "Active" ? "text-green-400" : "text-red-400")}>
                          {row.status}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button className="p-2 rounded-lg text-muted-foreground hover:text-white bg-white/5 hover:bg-white/10 transition-colors"><Eye className="w-4 h-4" /></button>
                          <button className="p-2 rounded-lg text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 transition-colors border border-amber-500/20"><Ban className="w-4 h-4" /></button>
                          <button className="p-2 rounded-lg text-red-400 bg-red-500/10 hover:bg-red-500/20 transition-colors border border-red-500/20"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
          )}

          {activeTab === "recruiters" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              {[
                { name: "TechGiant HR", company: "TechGiant", status: "Verified" },
                { name: "Unknown Caller", company: "Global Info", status: "Flagged" },
                { name: "Startup Founder", company: "NextGen AI", status: "Pending" },
              ].map((rec, i) => (
                <div key={i} className="glass-card p-5 border border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center",
                      rec.status === "Verified" && "bg-green-500/20 text-green-400",
                      rec.status === "Flagged" && "bg-red-500/20 text-red-400",
                      rec.status === "Pending" && "bg-amber-500/20 text-amber-400"
                    )}>
                      {rec.status === "Verified" ? <CheckCircle className="w-6 h-6" /> : rec.status === "Flagged" ? <AlertTriangle className="w-6 h-6" /> : <Clock className="w-6 h-6" />}
                    </div>
                    <div>
                      <h3 className="font-bold">{rec.name}</h3>
                      <p className="text-sm text-muted-foreground">{rec.company} • {rec.status}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {rec.status !== "Verified" && (
                      <button className="px-4 py-2 rounded-lg text-sm font-medium bg-green-500/10 text-green-400 hover:bg-green-500 hover:text-white transition-all border border-green-500/20">
                        Approve
                      </button>
                    )}
                    {rec.status !== "Flagged" && (
                      <button className="px-4 py-2 rounded-lg text-sm font-medium bg-amber-500/10 text-amber-400 hover:bg-amber-500 hover:text-white transition-all border border-amber-500/20">
                        Mark Scam
                      </button>
                    )}
                    <button className="px-4 py-2 rounded-lg text-sm font-medium bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all border border-red-500/20">
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {activeTab === "scams" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              {[
                { name: "Fake DataEntry", company: "WorkFromHome Inc", issue: "Registration Fee Requested", count: 45 },
              ].map((scam, i) => (
                <div key={i} className="glass-card p-6 border-2 border-red-500/50 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
                  <div className="absolute inset-0 bg-red-500/5" />
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-bold text-lg text-white">{scam.issue}</h3>
                      <span className="px-2 py-0.5 rounded text-xs font-bold bg-red-500 text-white shadow-[0_0_10px_rgba(239,68,68,0.5)]">
                        CRITICAL
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">Recruiter: {scam.name} • {scam.company}</p>
                    <p className="text-sm text-red-400 mt-2 font-medium">
                      Reported {scam.count} times across platform
                    </p>
                  </div>
                  <div className="flex flex-col gap-2 relative z-10 w-full md:w-auto">
                    <button className="w-full flex justify-center items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold bg-red-600 text-white hover:bg-red-500 transition-all shadow-[0_0_15px_rgba(239,68,68,0.4)]">
                      <AlertOctagon className="w-4 h-4" /> Confirm Scam
                    </button>
                    <button className="w-full flex justify-center items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-neutral-800 text-white hover:bg-neutral-700 transition-colors">
                      <Ban className="w-4 h-4" /> Add to Blacklist
                    </button>
                    <button className="w-full flex justify-center items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-blue-500/20 text-blue-400 hover:bg-blue-500 hover:text-white transition-all border border-blue-500/30">
                      <Send className="w-4 h-4" /> Alert Users
                    </button>
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {activeTab === "verification" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-8 border border-white/5 max-w-2xl">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Settings className="w-5 h-5 text-primary" /> Global Override Panel
              </h2>
              <p className="text-muted-foreground mb-8">
                Manually force-approve special case recruiters or override college decisions. Actions taken here are permanent.
              </p>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-muted-foreground">Recruiter Domain / Email</label>
                  <input type="text" placeholder="e.g. @startup.io" className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-primary text-foreground" />
                </div>
                <button className="px-6 py-3 rounded-xl font-bold bg-gradient-to-r from-primary to-secondary text-primary-foreground">
                  Force Verify Domain
                </button>
              </div>
            </motion.div>
          )}

          {activeTab === "heatmap" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-6 border border-white/5 text-center min-h-[400px] flex flex-col items-center justify-center">
              <MapIcon className="w-16 h-16 text-muted-foreground/30 mb-4" />
              <h3 className="text-xl font-medium mb-2">Platform-Wide Heatmap</h3>
              <p className="text-muted-foreground max-w-md mx-auto mb-8">
                Advanced map visualization showing scam trends, density, and origins across India.
              </p>
              <div className="flex gap-4">
                <select className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-sm focus:outline-none">
                  <option>All Scam Types</option>
                  <option>Fake Offers</option>
                  <option>Payment Requests</option>
                </select>
                <select className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-sm focus:outline-none">
                  <option>Last 30 Days</option>
                  <option>Last 6 Months</option>
                  <option>All Time</option>
                </select>
              </div>
            </motion.div>
          )}

          {activeTab === "logs" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card border border-white/5 overflow-hidden">
              <div className="p-4 bg-black/40 font-mono text-sm text-green-400 h-[400px] overflow-y-auto space-y-2">
                <p>[2026-04-17 12:00:01] SYSTEM: Admin logged in from 192.168.1.1</p>
                <p>[2026-04-17 12:05:22] USER: Student user_891 submitted a scam report</p>
                <p>[2026-04-17 12:15:44] COLLEGE: IIT Delhi cell approved recruiter @tcs.com</p>
                <p className="text-red-400">[2026-04-17 12:20:10] SECURITY: 5 failed login attempts for admin@trustlayer.in</p>
                <p>[2026-04-17 12:30:05] SYSTEM: Daily database backup completed successfully.</p>
                <p className="animate-pulse">_</p>
              </div>
            </motion.div>
          )}

        </div>
      </main>
    </div>
  );
}
