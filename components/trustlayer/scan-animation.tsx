"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Scan, Database, Brain, CheckCircle } from "lucide-react";

interface ScanAnimationProps {
  isActive: boolean;
  onComplete: () => void;
}

const scanStages = [
  { icon: Scan, label: "Scanning document...", duration: 1500 },
  { icon: Database, label: "Cross-referencing database...", duration: 1500 },
  { icon: Brain, label: "AI analysis in progress...", duration: 2000 },
  { icon: Shield, label: "Calculating trust score...", duration: 1000 },
];

export function ScanAnimation({ isActive, onComplete }: ScanAnimationProps) {
  const [currentStage, setCurrentStage] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (!isActive) {
      setCurrentStage(0);
      setIsComplete(false);
      return;
    }

    let timeout: NodeJS.Timeout;
    let totalDelay = 0;

    scanStages.forEach((stage, index) => {
      timeout = setTimeout(() => {
        setCurrentStage(index);
      }, totalDelay);
      totalDelay += stage.duration;
    });

    timeout = setTimeout(() => {
      setIsComplete(true);
      setTimeout(onComplete, 500);
    }, totalDelay);

    return () => clearTimeout(timeout);
  }, [isActive, onComplete]);

  if (!isActive) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-xl"
    >
      <div className="text-center">
        {/* Central animation */}
        <div className="relative w-48 h-48 mx-auto mb-8">
          {/* Outer ring */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 rounded-full border-2 border-dashed border-primary/30"
          />

          {/* Middle ring */}
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
            className="absolute inset-4 rounded-full border-2 border-secondary/30"
          />

          {/* Inner glow */}
          <div className="absolute inset-8 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 blur-xl" />

          {/* Center icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <AnimatePresence mode="wait">
              {!isComplete ? (
                <motion.div
                  key={currentStage}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center neon-glow"
                >
                  {(() => {
                    const Icon = scanStages[currentStage].icon;
                    return <Icon className="w-10 h-10 text-primary-foreground" />;
                  })()}
                </motion.div>
              ) : (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-20 h-20 rounded-2xl bg-green-500 flex items-center justify-center neon-glow-green"
                >
                  <CheckCircle className="w-10 h-10 text-white" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Scanning lines */}
          {!isComplete && (
            <>
              <motion.div
                animate={{ y: ["-100%", "100%"] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent"
                style={{ top: "50%" }}
              />
              <motion.div
                animate={{ x: ["-100%", "100%"] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear", delay: 0.5 }}
                className="absolute top-0 bottom-0 w-1 bg-gradient-to-b from-transparent via-secondary to-transparent"
                style={{ left: "50%" }}
              />
            </>
          )}
        </div>

        {/* Stage indicator */}
        <AnimatePresence mode="wait">
          <motion.div
            key={isComplete ? "complete" : currentStage}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="text-center"
          >
            <h3 className="text-xl font-semibold mb-2">
              {isComplete ? "Analysis Complete!" : scanStages[currentStage].label}
            </h3>
            {!isComplete && (
              <p className="text-sm text-muted-foreground">
                Step {currentStage + 1} of {scanStages.length}
              </p>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Progress dots */}
        <div className="flex items-center justify-center gap-2 mt-6">
          {scanStages.map((_, index) => (
            <motion.div
              key={index}
              animate={{
                scale: currentStage === index ? 1.2 : 1,
                opacity: index <= currentStage ? 1 : 0.3,
              }}
              className={`w-2 h-2 rounded-full ${
                index <= currentStage
                  ? "bg-primary"
                  : "bg-white/20"
              }`}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}
