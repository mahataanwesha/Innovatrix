"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Building, ShieldCheck, Mail, Lock, Loader2, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";

interface LoginSectionProps {
  onLogin: (role: string, user: { email: string; displayName: string }) => void;
}

export function LoginSection({ onLogin }: LoginSectionProps) {
  const [selectedRole, setSelectedRole] = useState<"student" | "college" | "admin">("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const roles = [
    {
      id: "student" as const,
      icon: User,
      title: "Student",
      desc: "Verify offers & report scams",
      color: "from-blue-500/20 to-cyan-500/20",
      activeColor: "border-blue-500 text-blue-500",
      defaultEmail: "student@college.edu"
    },
    {
      id: "college" as const,
      icon: Building,
      title: "College Cell",
      desc: "Approve recruiters & drives",
      color: "from-purple-500/20 to-pink-500/20",
      activeColor: "border-purple-500 text-purple-500",
      defaultEmail: "admin@placement.edu"
    },
    {
      id: "admin" as const,
      icon: ShieldCheck,
      title: "Admin",
      desc: "Manage platform integrity",
      color: "from-orange-500/20 to-red-500/20",
      activeColor: "border-orange-500 text-orange-500",
      defaultEmail: "system@trustlayer.in"
    }
  ];

  // Pre-fill email for demo purposes when clicking roles
  const handleRoleSelect = (roleId: "student" | "college" | "admin") => {
    setSelectedRole(roleId);
    const role = roles.find(r => r.id === roleId);
    if (role) {
      setEmail(role.defaultEmail);
      setPassword("password123");
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError("");
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      onLogin(selectedRole, {
        email: user.email || "",
        displayName: user.displayName || user.email?.split("@")[0] || "User",
      });
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Google Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      if (password === "password123") {
        onLogin(selectedRole, {
          email,
          displayName: email.split("@")[0] || "User"
        });
      } else {
        setError("Invalid credentials. Try 'password123'");
      }
    }, 1000);
  };

  return (
    <section className="min-h-screen flex items-center justify-center py-16 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mx-auto mb-4 neon-glow">
            <ShieldCheck className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-3xl font-bold mb-2">
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              {selectedRole === "admin" ? "Admin Control Access" : "Welcome to TrustLayer"}
            </span>
          </h2>
          <p className={cn("text-sm font-medium", selectedRole === "admin" ? "text-red-400" : "text-muted-foreground")}>
            {selectedRole === "admin" ? "⚠️ Authorized Personnel Only" : "Select your role to continue"}
          </p>
        </div>

        <div className="glass-card p-8">
          {/* Role Selection */}
          <div className="grid grid-cols-3 gap-3 mb-8">
            {roles.map((role) => {
              const Icon = role.icon;
              const isActive = selectedRole === role.id;
              
              return (
                <button
                  key={role.id}
                  onClick={() => handleRoleSelect(role.id)}
                  className={cn(
                    "flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all duration-300",
                    isActive 
                      ? role.activeColor + " bg-gradient-to-br " + role.color
                      : "border-white/10 text-muted-foreground hover:bg-white/5 hover:border-white/20"
                  )}
                >
                  <Icon className="w-6 h-6" />
                  <span className="text-xs font-semibold">{role.title}</span>
                </button>
              );
            })}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-muted-foreground">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-foreground"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-muted-foreground">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-foreground"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <AnimatePresence>
              {error && (
                <motion.p 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-sm text-red-400 text-center"
                >
                  {error}
                </motion.p>
              )}
            </AnimatePresence>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 mt-6 rounded-xl font-semibold text-lg bg-gradient-to-r from-primary to-secondary text-primary-foreground transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 neon-glow disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Sign In <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <div className="relative mt-8 mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-background text-muted-foreground">Or continue with</span>
            </div>
          </div>

          <button
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full py-3 rounded-xl font-medium bg-white/5 hover:bg-white/10 border border-white/10 transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden="true">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Sign in with Google
          </button>
        </div>
      </motion.div>
    </section>
  );
}
