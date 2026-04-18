"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Map, AlertTriangle, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { Slider } from "@/components/ui/slider";

interface CityData {
  id: string;
  name: string;
  scamCount: number;
  x: number;
  y: number;
}

const cityData: CityData[] = [
  { id: "delhi", name: "Delhi NCR", scamCount: 1247, x: 52, y: 28 },
  { id: "mumbai", name: "Mumbai", scamCount: 892, x: 38, y: 55 },
  { id: "bangalore", name: "Bangalore", scamCount: 756, x: 45, y: 75 },
  { id: "kolkata", name: "Kolkata", scamCount: 623, x: 72, y: 42 },
  { id: "chennai", name: "Chennai", scamCount: 534, x: 52, y: 80 },
  { id: "hyderabad", name: "Hyderabad", scamCount: 489, x: 48, y: 62 },
  { id: "pune", name: "Pune", scamCount: 412, x: 38, y: 58 },
  { id: "ahmedabad", name: "Ahmedabad", scamCount: 356, x: 32, y: 42 },
  { id: "jaipur", name: "Jaipur", scamCount: 287, x: 42, y: 35 },
  { id: "lucknow", name: "Lucknow", scamCount: 234, x: 56, y: 35 },
];

export function ScamHeatmap() {
  const [hoveredCity, setHoveredCity] = useState<CityData | null>(null);
  const [timelineMonth, setTimelineMonth] = useState([5]); // Default to June (0-indexed)

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const getIntensityStyle = (count: number) => {
    if (count > 700) return { size: 24, opacity: 0.9, pulse: true, color: "bg-red-500", shadowColor: "255, 77, 77" };
    if (count > 400) return { size: 18, opacity: 0.85, pulse: false, color: "bg-yellow-500", shadowColor: "234, 179, 8" };
    return { size: 14, opacity: 0.7, pulse: false, color: "bg-green-500", shadowColor: "34, 197, 94" };
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass-card p-6"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-destructive/20 flex items-center justify-center">
          <Map className="w-5 h-5 text-destructive" />
        </div>
        <div>
          <h3 className="font-semibold text-lg">Scam Heatmap</h3>
          <p className="text-sm text-muted-foreground">
            Regional fraud hotspots in India
          </p>
        </div>
      </div>

      <div className="relative aspect-[4/3] bg-gradient-to-br from-card to-background rounded-xl overflow-hidden border border-white/10">
        {/* Simplified India map outline using SVG */}
        <svg
          viewBox="0 0 100 100"
          className="absolute inset-0 w-full h-full"
          style={{ filter: "drop-shadow(0 0 20px rgba(139, 92, 246, 0.2))" }}
        >
          {/* Simplified India outline */}
          <path
            d="M35 15 L55 12 L68 18 L75 25 L78 35 L75 45 L72 55 L65 65 L58 75 L52 85 L48 88 L45 85 L42 78 L38 70 L35 60 L32 50 L28 40 L30 30 L35 15"
            fill="none"
            stroke="rgba(139, 92, 246, 0.3)"
            strokeWidth="0.5"
          />
          <path
            d="M35 15 L55 12 L68 18 L75 25 L78 35 L75 45 L72 55 L65 65 L58 75 L52 85 L48 88 L45 85 L42 78 L38 70 L35 60 L32 50 L28 40 L30 30 L35 15"
            fill="rgba(139, 92, 246, 0.05)"
          />
        </svg>

        {/* Grid overlay */}
        <div className="absolute inset-0 grid-pattern opacity-30" />

        {/* City markers */}
        {cityData.map((city) => {
          // Simulate scam count changes based on timeline
          const factor = 0.5 + (timelineMonth[0] / 11) * 0.8; 
          const currentCount = Math.floor(city.scamCount * factor);
          const styleProps = getIntensityStyle(currentCount);
          return (
            <motion.div
              key={city.id}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: Math.random() * 0.3 }}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
              style={{ left: `${city.x}%`, top: `${city.y}%` }}
              onMouseEnter={() => setHoveredCity(city)}
              onMouseLeave={() => setHoveredCity(null)}
            >
              <div
                className={cn(
                  "rounded-full transition-all duration-300",
                  styleProps.color,
                  styleProps.pulse && "animate-pulse"
                )}
                style={{
                  width: styleProps.size,
                  height: styleProps.size,
                  opacity: styleProps.opacity,
                  boxShadow: `0 0 ${styleProps.size}px rgba(${styleProps.shadowColor}, ${styleProps.opacity})`,
                }}
              />
            </motion.div>
          );
        })}

        {/* Hover tooltip */}
        {hoveredCity && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute z-20 px-4 py-3 bg-card/95 backdrop-blur-xl border border-white/20 rounded-xl shadow-xl"
            style={{
              left: `${hoveredCity.x}%`,
              top: `${hoveredCity.y - 15}%`,
              transform: "translateX(-50%)",
            }}
          >
            <div className="flex items-center gap-2 mb-1">
              <AlertTriangle className="w-4 h-4 text-destructive" />
              <span className="font-semibold text-sm">{hoveredCity.name}</span>
            </div>
            <p className="text-xs text-muted-foreground">
              <span className="text-destructive font-semibold">
                {hoveredCity.scamCount.toLocaleString()}
              </span>{" "}
              reported scams
            </p>
          </motion.div>
        )}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 mt-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500 opacity-70" />
          <span>Low Risk ({"< 400"})</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-yellow-500 opacity-85" />
          <span>Medium Risk (400-700)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-full bg-red-500 animate-pulse opacity-90" />
          <span>High Risk ({"> 700"})</span>
        </div>
      </div>

      {/* Timeline Slider */}
      <div className="mt-8 pt-6 border-t border-white/10">
        <div className="flex items-center gap-2 mb-4 text-sm font-medium text-muted-foreground">
          <Calendar className="w-4 h-4" />
          <span>Timeline: Scam Evolution (2024)</span>
        </div>
        <div className="px-2">
          <Slider
            defaultValue={[5]}
            max={11}
            step={1}
            value={timelineMonth}
            onValueChange={setTimelineMonth}
            className="mb-4"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            {months.map((month, i) => (
              <span key={month} className={timelineMonth[0] === i ? "text-primary font-bold" : ""}>
                {month}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
