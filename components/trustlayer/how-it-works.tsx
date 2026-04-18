"use client";

import { motion } from "framer-motion";
import { UploadCloud, Search, ShieldCheck, Share2 } from "lucide-react";

const steps = [
  {
    icon: UploadCloud,
    title: "1. Upload & Submit",
    description: "Upload an offer letter (PDF/Image), paste a suspicious link, or drop in a chat snippet. Our system handles all formats.",
  },
  {
    icon: Search,
    title: "2. AI & Rule-Based Analysis",
    description: "The AI instantly scans for scam keywords, verifies domain authenticity, checks payment requests, and cross-references our verified recruiter database.",
  },
  {
    icon: ShieldCheck,
    title: "3. Get Your Trust Score",
    description: "Receive a detailed breakdown and a Trust Score (0-100). We clearly highlight what is safe and explain why certain things were flagged.",
  },
  {
    icon: Share2,
    title: "4. Share & Report",
    description: "Easily generate a shareable link to get a second opinion from parents or mentors, or report malicious domains directly to authorities.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 px-4 relative">
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            How <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">TrustLayer</span> Works
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            A seamless, transparent process designed to give you absolute clarity and peace of mind before you make any career decisions.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="glass-card p-6 flex flex-col items-center text-center hover:-translate-y-2 transition-transform duration-300"
            >
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mb-6 neon-glow">
                <step.icon className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">{step.title}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
    </section>
  );
}
