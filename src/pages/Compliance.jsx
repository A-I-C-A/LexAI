import { useState, useEffect } from "react";
import { motion } from 'framer-motion';
import { GoogleGenerativeAI } from "@google/generative-ai";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  orderBy,
  query,
} from "firebase/firestore";
import app from "../firebase/firebase";

const db = getFirestore(app);

export default function ComplianceGuardian() {
  const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

  const [modalOpen, setModalOpen] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [analyzedFiles, setAnalyzedFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loadingFiles, setLoadingFiles] = useState(true);

  const RADIUS = 80;
  const circumference = 2 * Math.PI * RADIUS;

  // Initialize PDF.js worker from CDN
  useEffect(() => {
    if (typeof window !== "undefined" && !window.pdfjsLib) {
      const script = document.createElement("script");
      script.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
      script.async = true;
      script.onload = () => {
        if (window.pdfjsLib) {
          window.pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
        }
      };
      document.head.appendChild(script);
    }
    loadFilesFromFirebase();
  }, []);

  async function loadFilesFromFirebase() {
    setLoadingFiles(true);
    try {
      const q = query(collection(db, "analyzedFiles"), orderBy("uploadDate", "desc"));
      const querySnapshot = await getDocs(q);
      const files = [];
      querySnapshot.forEach((docSnap) => {
        files.push({
          id: docSnap.id,
          ...docSnap.data(),
        });
      });
      setAnalyzedFiles(files);
    } catch (err) {
      console.error("Error loading files from Firebase:", err);
    } finally {
      setLoadingFiles(false);
    }
  }

  async function saveFileToFirebase(fileData) {
    try {
      const docRef = await addDoc(collection(db, "analyzedFiles"), {
        name: fileData.name,
        uploadDate: new Date(),
        analysis: fileData.analysis,
        text: fileData.text,
      });
      return docRef.id;
    } catch (err) {
      console.error("Error saving file to Firebase:", err);
      return null;
    }
  }

  async function deleteFileFromFirebase(fileId) {
    try {
      await deleteDoc(doc(db, "analyzedFiles", fileId));
      return true;
    } catch (err) {
      console.error("Error deleting file from Firebase:", err);
      return false;
    }
  }

  // Extract text from PDF
  async function extractTextFromPDF(arrayBuffer) {
    try {
      const pdfjsLib = window.pdfjsLib;
      if (!pdfjsLib) {
        throw new Error("PDF.js library not loaded");
      }

      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      let fullText = "";

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map((item) => item.str).join(" ");
        fullText += pageText + "\n";
      }

      return fullText;
    } catch (err) {
      console.error("Error extracting PDF text:", err);
      throw err;
    }
  }

  // Extract text from DOCX
  async function extractTextFromDOCX(arrayBuffer) {
    try {
      const mammoth = await import("mammoth");
      const result = await mammoth.extractRawText({ arrayBuffer });
      return result.value;
    } catch (err) {
      console.error("Error extracting DOCX text:", err);
      throw err;
    }
  }

  async function analyzeCompliance(text) {
    const maxRetries = 3;
    let attempt = 0;

    while (attempt < maxRetries) {
      try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        const result = await model.generateContent({
          contents: [
            {
              role: "user",
              parts: [
                {
                  text: `
You are an expert legal compliance analyst with experience reviewing contracts, agreements, and other legal documents. 
Analyze the following document carefully and identify any compliance issues, regulatory risks, missing or ambiguous clauses, and potential legal violations. 
Provide actionable recommendations for resolving each issue.

Instructions:
1. Return ONLY raw JSON (no markdown, no extra text, no triple backticks).
2. JSON must follow this exact structure:
{
  "complianceScore": <number 0-100>, 
  "alerts": [
    {
      "priority": "High" | "Medium" | "Low", 
      "issue": "Description of the compliance problem, legal risk, or missing/ambiguous clause",
      "location": "Specific section, clause, or page where the issue occurs",
      "suggestedFix": "Clear, legally sound recommendation to resolve the issue"
    }
  ]
}
3. Evaluate the document strictly from a legal perspective.
4. Assign 'High' priority to any issue that could lead to legal liability, fines, regulatory penalties, or contractual disputes.
5. Assign 'Medium' priority to issues that are significant but not immediately critical (e.g., may cause operational or reputational risk).
6. Assign 'Low' priority to minor issues, wording inconsistencies, or recommendations that improve clarity but are not legally critical.
7. If no issues are found, return an empty alerts array and a complianceScore of 100.

Document:\n${text}

`                },
              ],
            },
          ],
          generationConfig: { responseMimeType: "application/json" },
        });

        let parsed;
        try {
          const raw = result?.response ? await result.response.text() : JSON.stringify(result);
          parsed = JSON.parse(raw);
        } catch (parseErr) {
          console.error("Failed to parse model output. Returning default:", parseErr);
          return { complianceScore: 0, alerts: [] };
        }

        // Recalculate complianceScore based on alert priorities
        if (Array.isArray(parsed.alerts)) {
          let high = 0, medium = 0, low = 0;
          parsed.alerts.forEach(a => {
            if (a.priority === "High") high++;
            else if (a.priority === "Medium") medium++;
            else if (a.priority === "Low") low++;
          });
          const penaltyPerIssue = 5; // You can adjust this value
          let deduction = high * 3 + medium * 2 + low * 1;
          let score = Math.max(0, 100 - deduction * penaltyPerIssue);
          parsed.complianceScore = score;
        }

        if (typeof parsed.complianceScore !== "number" || !Array.isArray(parsed.alerts)) {
          console.warn("Model output invalid, using fallback structure");
          return { complianceScore: 0, alerts: [] };
        }

        return parsed;
      } catch (err) {
        if (err && err.message && err.message.includes("503") && attempt < maxRetries - 1) {
          console.warn(`Retrying due to 503 error... attempt ${attempt + 1}`);
          await new Promise((r) => setTimeout(r, 2000 * (attempt + 1)));
          attempt++;
        } else {
          console.error("Failed to analyze compliance:", err);
          return { complianceScore: 0, alerts: [] };
        }
      }
    }
    return { complianceScore: 0, alerts: [] };
  }

  async function handleFileUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    setModalOpen(false);
    setLoading(true);

    try {
      let text = "";
      const fileType = file.type;

      try {
        // Try PDF extraction if it's a PDF
        if (fileType === "application/pdf" || file.name.endsWith(".pdf")) {
          const buffer = await file.arrayBuffer();
          text = await extractTextFromPDF(buffer);
        }
        // Try DOCX extraction if it's a DOCX
        else if (
          fileType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
          file.name.endsWith(".docx")
        ) {
          const buffer = await file.arrayBuffer();
          text = await extractTextFromDOCX(buffer);
        }
        // Fall back to text extraction for TXT files
        else {
          text = await file.text();
        }
      } catch (readErr) {
        console.warn("Primary extraction method failed, attempting ArrayBuffer fallback", readErr);
        try {
          const buffer = await file.arrayBuffer();
          const decoder = new TextDecoder("utf-8");
          text = decoder.decode(buffer);
        } catch (bufErr) {
          console.error("Failed to extract text from file:", bufErr);
          text = "";
        }
      }

      if (!text.trim()) {
        throw new Error("No text could be extracted from the file");
      }

      const result = await analyzeCompliance(text);

      const fileData = {
        name: file.name,
        analysis: result,
        text: text,
      };

      const firebaseId = await saveFileToFirebase(fileData);

      if (firebaseId) {
        fileData.id = firebaseId;
        await loadFilesFromFirebase();
        setAnalysis(result);
        setSelectedFile(fileData);
      } else {
        const localFileData = {
          ...fileData,
          id: Date.now(),
          uploadDate: new Date(),
        };
        setAnalyzedFiles((prev) => [localFileData, ...prev]);
        setAnalysis(result);
        setSelectedFile(localFileData);
      }

      console.log("Extracted text (truncated):", text.slice(0, 500));
    } catch (err) {
      console.error("Error analyzing file:", err);
      alert(`Error: ${err.message}`);
      setAnalysis({ complianceScore: 0, alerts: [] });
    } finally {
      setLoading(false);
    }
  }

  function handleFileClick(fileData) {
    setAnalysis(fileData.analysis);
    setSelectedFile(fileData);
  }

  async function deleteFile(fileId) {
    const success = await deleteFileFromFirebase(fileId);
    if (success) {
      setAnalyzedFiles((prev) => prev.filter((file) => file.id !== fileId));
      if (selectedFile && selectedFile.id === fileId) {
        setAnalysis(null);
        setSelectedFile(null);
      }
    }
  }

  function formatDate(date) {
    if (!date) return "";
    if (date && typeof date.toDate === "function") {
      return date.toDate().toLocaleDateString();
    }
    if (date instanceof Date) {
      return date.toLocaleDateString();
    }
    return new Date(date).toLocaleDateString();
  }

  const score = analysis?.complianceScore ?? 0;
  const progressOffset = circumference * (1 - score / 100);

  return (
    <div className="min-h-screen bg-dark-background text-dark-foreground p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-light tracking-tighter mb-2">Compliance Guardian</h1>
          <p className="text-muted-foreground font-light">AI-powered regulatory compliance analysis</p>
        </motion.div>

        <div className="flex justify-center md:justify-end mb-6">
          <button
            onClick={() => setModalOpen(true)}
            className="px-6 py-3 bg-black text-black font-medium rounded-full hover:scale-105 transition-transform duration-300 shadow-lg"
          >
            Scan New Contract
          </button>
        </div>

        {loading && (
          <div className="mb-6 p-4 rounded-2xl bg-[#0E0E0E] backdrop-blur-xl border border-white/10 flex items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-white/20 border-t-white mr-3"></div>
            <span className="font-light">Analyzing document...</span>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          {/* Compliance Alerts */}
          <motion.div 
            className="p-6 rounded-3xl bg-[#0E0E0E] backdrop-blur-xl border border-white/10"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-xl font-medium tracking-tight mb-4">
              Compliance Alerts
              {selectedFile && (
                <span className="text-sm text-muted-foreground font-light ml-2">({selectedFile.name})</span>
              )}
            </h2>
            {!analysis ? (
              <p className="text-muted-foreground font-light">No document analyzed yet.</p>
            ) : analysis.alerts.length === 0 ? (
              <div className="text-center p-8">
                <p className="text-green-400 font-medium mb-2">No compliance issues found!</p>
                <p className="text-muted-foreground text-sm font-light">This document appears to be compliant.</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {analysis.alerts.map((alert, idx) => (
                  <motion.div
                    key={idx}
                    className={`border rounded-2xl p-4 backdrop-blur-xl ${
                      alert.priority === "High"
                        ? "border-red-500/30 bg-red-500/10"
                        : "border-yellow-500/30 bg-yellow-500/10"
                    }`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <div className="flex items-center mb-2">
                      <span
                        className={`inline-block w-3 h-3 rounded-full mr-2 ${
                          alert.priority === "High" ? "bg-red-500" : "bg-yellow-500"
                        }`}
                      ></span>
                      <span className="font-medium">{alert.priority} Priority</span>
                    </div>
                    <p className="mb-2">
                      <span className="font-medium">Issue:</span>{" "}
                      <span className="text-foreground/80 font-light">{alert.issue}</span>
                    </p>
                    <p className="mb-2">
                      <span className="font-medium">Location:</span>{" "}
                      <span className="text-foreground/80 font-light">{alert.location}</span>
                    </p>
                    <p>
                      <span className="font-medium text-green-400">Suggested Fix:</span>{" "}
                      <span className="text-foreground/80 font-light">{alert.suggestedFix}</span>
                    </p>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Compliance Score */}
          <motion.div
          className="p-6 rounded-3xl bg-[#0E0E0E] backdrop-blur-xl border border-white/10 flex flex-col items-center text-center"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-xl font-medium tracking-tight mb-6">Compliance Score</h2>
          <div className="relative w-48 h-48 mb-4">
            <svg className="absolute top-0 left-0 w-full h-full transform -rotate-90" viewBox="0 0 192 192">
              <circle cx="96" cy="96" r={RADIUS} stroke="rgba(255,255,255,0.1)" strokeWidth="16" fill="none" />
              <circle
                cx="96"
                cy="96"
                r={RADIUS}
                stroke={
                  score >= 80 ? "#10b981" : score >= 60 ? "#f59e0b" : "#ef4444"
                }
                strokeWidth="16"
                fill="none"
                strokeDasharray={circumference}
                strokeDashoffset={progressOffset}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-4xl font-medium">{analysis ? analysis.complianceScore : 0}%</div>
              <div className="text-sm text-muted-foreground font-light mt-1">
                {score >= 80 ? "Excellent" : score >= 60 ? "Good" : "Needs Work"}
              </div>
            </div>
          </div>
          {selectedFile && (
            <p className="text-sm text-muted-foreground font-light text-center truncate max-w-full">{selectedFile.name}</p>
          )}
        </motion.div>
      </div>

      {/* Upload Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
          <motion.div 
            className="p-6 rounded-3xl bg-[#0E0E0E] backdrop-blur-xl border border-white/10 w-96 max-w-[90vw]"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-xl font-medium tracking-tight mb-4 text-center">
              Upload Document
            </h2>
            <input
              type="file"
              accept=".pdf,.docx,.txt"
              onChange={handleFileUpload}
              className="block w-full text-foreground mb-4 font-light file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-black file:text-black file:font-medium hover:file:scale-105 file:transition-transform file:duration-300"
            />
            <button
              className="w-full py-3 bg-[#0E0E0E] backdrop-blur-xl border border-white/10 text-white font-medium rounded-full hover:bg-white/15 transition-all duration-300"
              onClick={() => setModalOpen(false)}
            >
              Cancel
            </button>
          </motion.div>
        </div>
      )}

      {/* Previously Analyzed Documents */}
      {(loadingFiles || analyzedFiles.length > 0) && (
        <motion.div 
          className="mt-6 p-6 rounded-3xl bg-[#0E0E0E] backdrop-blur-xl border border-white/10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h2 className="text-xl font-medium tracking-tight mb-4">
            Previously Analyzed Documents
          </h2>
          {loadingFiles ? (
            <div className="text-center text-muted-foreground font-light">Loading files...</div>
          ) : (
            <div className="grid gap-2 max-h-60 overflow-y-auto">
              {analyzedFiles.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center justify-between bg-[#0E0E0E] backdrop-blur-xl border border-white/10 rounded-2xl p-3 hover:bg-[#0E0E0E] transition-all duration-300"
                >
                  <button
                    onClick={() => handleFileClick(file)}
                    className={`flex-1 text-left hover:text-white transition-colors font-light ${
                      selectedFile && selectedFile.id === file.id
                        ? "text-white font-medium"
                        : "text-foreground"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="truncate max-w-xs">{file.name}</span>
                      <div className="flex items-center space-x-2 ml-4">
                        <span className="text-xs text-muted-foreground font-light">
                          {formatDate(file.uploadDate)}
                        </span>
                        <span
                          className={`text-xs px-2 py-1 rounded-full font-medium ${
                            (file?.analysis?.complianceScore ?? 0) >= 80
                              ? "bg-green-500/20 text-green-400 border border-green-500/30"
                              : (file?.analysis?.complianceScore ?? 0) >= 60
                              ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                              : "bg-red-500/20 text-red-400 border border-red-500/30"
                          }`}
                        >
                          {file?.analysis?.complianceScore ?? 0}%
                        </span>
                      </div>
                    </div>
                  </button>
                  <button
                    onClick={() => deleteFile(file.id)}
                    className="ml-2 text-red-400 hover:text-red-300 text-sm p-2 rounded-full hover:bg-red-500/20 transition-all duration-300"
                    title="Delete file"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      )}

      {/* Legal & Regulatory Updates */}
      <motion.div 
        className="mt-6 p-6 rounded-3xl bg-[#0E0E0E] backdrop-blur-xl border border-white/10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <h2 className="text-xl font-medium tracking-tight mb-4">Legal & Regulatory Updates</h2>
        <ul className="space-y-3">
          <li className="flex items-start">
            <span className="text-red-400 mr-2"></span>
            <div>
              <strong className="font-medium">EU AI Act Implementation</strong>
              <p className="text-sm text-muted-foreground font-light">New transparency requirements for AI systems effective 2025</p>
            </div>
          </li>
          <li className="flex items-start">
            <span className="text-yellow-400 mr-2"></span>
            <div>
              <strong className="font-medium">GDPR Amendment</strong>
              <p className="text-sm text-muted-foreground font-light">Enhanced data processing consent requirements - Under review</p>
            </div>
          </li>
          <li className="flex items-start">
            <span className="text-blue-400 mr-2"></span>
            <div>
              <strong className="font-medium">Data Privacy Law v2.1</strong>
              <p className="text-sm text-muted-foreground font-light">Cross-border data transfer regulations - Enforcement 2025</p>
            </div>
          </li>
          <li className="flex items-start">
            <span className="text-green-400 mr-2"></span>
            <div>
              <strong className="font-medium">Contract Law Updates</strong>
              <p className="text-sm text-muted-foreground font-light">New standards for digital contract enforceability</p>
            </div>
          </li>
        </ul>

        <div className="mt-4 p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl backdrop-blur-xl">
          <p className="text-amber-200 text-sm font-light">
            <strong className="font-medium">Legal Disclaimer:</strong> This tool provides automated analysis for informational purposes only. Always consult qualified legal counsel for official legal advice and compliance verification.
          </p>
        </div>
      </motion.div>
      </div>
    </div>
  );
}

