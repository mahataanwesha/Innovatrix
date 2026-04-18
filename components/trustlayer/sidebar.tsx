"use client";

import Image from "next/image";

import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Shield,
  FileWarning,
  Map,
  User,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  activeSection: string;
  onNavigate: (section: string) => void;
  isCollapsed: boolean;
  onToggle: () => void;
}

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "verify", label: "Verify", icon: Shield },
  { id: "reports", label: "Reports", icon: FileWarning },
  { id: "heatmap", label: "Heatmap", icon: Map },
  { id: "profile", label: "Profile", icon: User },
];

export function Sidebar({ activeSection, onNavigate, isCollapsed, onToggle }: SidebarProps) {
  return (
    <motion.aside
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className={cn(
        "fixed left-0 top-0 h-full z-40 glass border-r border-white/10 transition-all duration-300",
        isCollapsed ? "w-20" : "w-64"
      )}
    >
      <div className="flex flex-col h-full p-4">
        <div className="flex items-center justify-between mb-8">
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-3"
            >
              <div className="w-10 h-10 flex items-center justify-center neon-glow">
                <Image src="/logo.png" alt="TrustLayer Logo" width={40} height={40} className="object-contain" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                TrustLayer
              </span>
            </motion.div>
          )}
          {isCollapsed && (
            <div className="w-10 h-10 flex items-center justify-center neon-glow mx-auto">
              <Image src="/logo.png" alt="TrustLayer Logo" width={40} height={40} className="object-contain" />
            </div>
          )}
        </div>

        <nav className="flex-1 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;

            return (
              <motion.button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                whileHover={{ scale: 1.02, x: 4 }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300",
                  isActive
                    ? "bg-primary/20 text-primary neon-glow"
                    : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                )}
              >
                <Icon className={cn("w-5 h-5 flex-shrink-0", isActive && "text-primary")} />
                {!isCollapsed && (
                  <span className="font-medium">{item.label}</span>
                )}
              </motion.button>
            );
          })}
        </nav>

        <motion.button
          onClick={onToggle}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mt-auto p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors self-end"
        >
          {isCollapsed ? (
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          ) : (
            <ChevronLeft className="w-5 h-5 text-muted-foreground" />
          )}
        </motion.button>
      </div>
    </motion.aside>
  );
}
