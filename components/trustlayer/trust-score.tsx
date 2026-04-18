"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface TrustScoreProps {
  score: number;
  isAnimating?: boolean;
}

export function TrustScore({ score, isAnimating = true }: TrustScoreProps) {
  const [displayScore, setDisplayScore] = useState(0);

  const getScoreColor = (value: number) => {
    if (value >= 70) return { color: "#22C55E", label: "Safe", glow: "neon-glow-green" };
    if (value >= 40) return { color: "#FFC857", label: "Suspicious", glow: "" };
    return { color: "#FF4D4D", label: "High Risk", glow: "neon-glow-red" };
  };

  const scoreInfo = getScoreColor(score);
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (displayScore / 100) * circumference;

  useEffect(() => {
    if (!isAnimating) {
      setDisplayScore(score);
      return;
    }

    const duration = 1500;
    const startTime = Date.now();
    const startValue = 0;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(startValue + (score - startValue) * easeOut);
      
      setDisplayScore(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [score, isAnimating]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center"
    >
      <div className={cn("relative", scoreInfo.glow)}>
        <svg width="200" height="200" viewBox="0 0 100 100" className="transform -rotate-90">
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="8"
          />
          {/* Progress circle */}
          <motion.circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke={scoreInfo.color}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            style={{
              filter: `drop-shadow(0 0 10px ${scoreInfo.color})`,
            }}
          />
        </svg>
        
        {/* Score display */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            key={displayScore}
            initial={{ scale: 1.2, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-5xl font-bold"
            style={{ color: scoreInfo.color }}
          >
            {displayScore}
          </motion.span>
          <span className="text-sm text-muted-foreground mt-1">Trust Score</span>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className={cn(
          "mt-4 px-4 py-2 rounded-full text-sm font-semibold",
          score >= 70 && "bg-green-500/20 text-green-400",
          score >= 40 && score < 70 && "bg-yellow-500/20 text-yellow-400",
          score < 40 && "bg-red-500/20 text-red-400"
        )}
      >
        {scoreInfo.label}
      </motion.div>
    </motion.div>
  );
}
