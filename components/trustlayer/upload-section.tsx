"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDropzone } from "react-dropzone";
import {
  Upload,
  Link,
  MessageSquare,
  FileText,
  X,
  Loader2,
  Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";

type InputType = "file" | "link" | "chat";

interface UploadSectionProps {
  onAnalyze: (data: { type: InputType; content: string | File }) => void;
  isAnalyzing: boolean;
}

export function UploadSection({ onAnalyze, isAnalyzing }: UploadSectionProps) {
  const [activeTab, setActiveTab] = useState<InputType>("file");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [linkInput, setLinkInput] = useState("");
  const [chatInput, setChatInput] = useState("");

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setUploadedFile(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "image/*": [".png", ".jpg", ".jpeg"],
      "application/msword": [".doc"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
    },
    maxFiles: 1,
  });

  const handleAnalyze = () => {
    if (activeTab === "file" && uploadedFile) {
      onAnalyze({ type: "file", content: uploadedFile });
    } else if (activeTab === "link" && linkInput) {
      onAnalyze({ type: "link", content: linkInput });
    } else if (activeTab === "chat" && chatInput) {
      onAnalyze({ type: "chat", content: chatInput });
    }
  };

  const tabs = [
    { id: "file" as const, icon: Upload, label: "Upload" },
    { id: "link" as const, icon: Link, label: "Link" },
    { id: "chat" as const, icon: MessageSquare, label: "Chat" },
  ];

  const canAnalyze =
    (activeTab === "file" && uploadedFile) ||
    (activeTab === "link" && linkInput) ||
    (activeTab === "chat" && chatInput);

  return (
    <section className="py-16 px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="max-w-2xl mx-auto"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-3">
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Start Your Verification
            </span>
          </h2>
          <p className="text-muted-foreground">
            Upload an offer letter, paste a link, or share suspicious chat
          </p>
        </div>

        <div className="glass-card p-6">
          {/* Tabs */}
          <div className="flex gap-2 mb-6 p-1 bg-white/5 rounded-xl">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-2 py-3 rounded-lg transition-all duration-300",
                    activeTab === tab.id
                      ? "bg-gradient-to-r from-primary/20 to-secondary/20 text-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                  )}
                >
                  <Icon className="w-6 h-6" />
                </button>
              );
            })}
          </div>

          {/* Content */}
          <AnimatePresence mode="wait">
            {activeTab === "file" && (
              <motion.div
                key="file"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {!uploadedFile ? (
                  <div
                    {...getRootProps()}
                    className={cn(
                      "relative border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-300",
                      isDragActive
                        ? "border-primary bg-primary/10"
                        : "border-white/20 hover:border-primary/50 hover:bg-white/5"
                    )}
                  >
                    <input {...getInputProps()} />
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                        <Upload className="w-8 h-8 text-primary" />
                      </div>
                      <div>
                        <p className="text-lg font-medium mb-1">
                          {isDragActive
                            ? "Drop your file here"
                            : "Drag & drop your offer letter"}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          or click to browse (PDF, DOC, DOCX, Images)
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl">
                    <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                      <FileText className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{uploadedFile.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {(uploadedFile.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                    <button
                      onClick={() => setUploadedFile(null)}
                      className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                    >
                      <X className="w-5 h-5 text-muted-foreground" />
                    </button>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === "link" && (
              <motion.div
                key="link"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <div className="relative">
                  <Link className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="url"
                    value={linkInput}
                    onChange={(e) => setLinkInput(e.target.value)}
                    placeholder="Paste suspicious website URL..."
                    className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                </div>
              </motion.div>
            )}

            {activeTab === "chat" && (
              <motion.div
                key="chat"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <textarea
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Paste the suspicious chat conversation or message here..."
                  rows={5}
                  className="w-full px-4 py-4 bg-white/5 border border-white/10 rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all resize-none"
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Analyze Button */}
          <motion.button
            onClick={handleAnalyze}
            disabled={!canAnalyze || isAnalyzing}
            whileHover={{ scale: canAnalyze ? 1.02 : 1 }}
            whileTap={{ scale: canAnalyze ? 0.98 : 1 }}
            className={cn(
              "w-full mt-6 py-4 rounded-xl font-semibold text-lg transition-all duration-300 flex items-center justify-center gap-2",
              canAnalyze
                ? "bg-gradient-to-r from-primary to-secondary text-primary-foreground neon-glow"
                : "bg-white/10 text-muted-foreground cursor-not-allowed"
            )}
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Shield className="w-5 h-5" />
                Analyze Now
              </>
            )}
          </motion.button>
        </div>
      </motion.div>
    </section>
  );
}
