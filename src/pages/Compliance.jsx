import { useState, useEffect } from "react";
import { motion } from "framer-motion";
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

  useEffect(() => {
    if (typeof window !== "undefined" && !window.pdfjsLib) {
      const script = document.createElement("script");
      script.src =
        "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
      script.async = true;
      script.onload = () => {
        if (window.pdfjsLib) {
          window.pdfjsLib.GlobalWorkerOptions.workerSrc =
            "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
        }
      };
      document.head.appendChild(script);
    }
    loadFilesFromFirebase();
  }, []);

  async function loadFilesFromFirebase() {
    setLoadingFiles(true);
    try {
      const q = query(
        collection(db, "analyzedFiles"),
        orderBy("uploadDate", "desc")
      );
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
      console.error("Error loading files:", err);
    } finally {
      setLoadingFiles(false);
    }
  }

  async function saveFileToFirebase(fileData) {
    try {
      console.log("💾 Starting Firebase save...");
      const docRef = await addDoc(collection(db, "analyzedFiles"), {
        name: fileData.name,
        uploadDate: new Date(),
        analysis: fileData.analysis,
        text: fileData.text,
      });
      console.log("✅ Firebase save complete, ID:", docRef.id);
      return docRef.id;
    } catch (err) {
      console.error("❌ Error saving file:", err);
      console.error("Error details:", err.message);
      return null;
    }
  }

  async function deleteFileFromFirebase(fileId) {
    try {
      await deleteDoc(doc(db, "analyzedFiles", fileId));
      return true;
    } catch (err) {
      console.error("Error deleting file:", err);
      return false;
    }
  }

  async function extractTextFromPDF(arrayBuffer) {
    const pdfjsLib = window.pdfjsLib;
    if (!pdfjsLib) throw new Error("PDF.js not loaded");

    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let fullText = "";

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      fullText += textContent.items.map((item) => item.str).join(" ") + "\n";
    }

    return fullText;
  }

  async function extractTextFromDOCX(arrayBuffer) {
    const mammoth = await import("mammoth");
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value;
  }

  async function analyzeCompliance(text) {
    console.log("🤖 Starting Groq Llama analysis...");
    console.log("📝 Document length:", text.length, "characters");
    
    try {
      // Use Groq's Llama 3.1 8B Instant - SUPER FAST!
      const response = await fetch(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`
          },
          body: JSON.stringify({
            model: "llama-3.1-8b-instant",
            messages: [{
              role: "user",
              content: `You are an expert legal compliance analyst.
Return ONLY JSON (no markdown, no explanation):
{
  "complianceScore": number,
  "alerts": [
    {
      "priority": "High" | "Medium" | "Low",
      "issue": string,
      "location": string,
      "suggestedFix": string
    }
  ]
}

Analyze this document for compliance issues:
${text.substring(0, 5000)}`
            }],
            temperature: 0.7,
            max_tokens: 1024,
            response_format: { type: "json_object" }
          }),
        }
      );

      console.log("✅ Groq responded!", response.status);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("❌ API Error Response:", errorData);
        throw new Error(`API error: ${response.status} - ${JSON.stringify(errorData)}`);
      }

      const data = await response.json();
      console.log("📦 Full response:", data);
      
      const rawText = data.choices?.[0]?.message?.content || '{}';
      console.log("📄 Raw response:", rawText.substring(0, 200));
      
      // Try to parse JSON
      let parsed;
      try {
        parsed = JSON.parse(rawText);
      } catch (e) {
        console.warn("⚠️ Response not JSON, creating default structure");
        parsed = {
          complianceScore: 50,
          alerts: [{
            priority: "Medium",
            issue: "Unable to parse AI response",
            location: "Document",
            suggestedFix: rawText.substring(0, 200)
          }]
        };
      }
      
      console.log("✅ Parsed response:", parsed);

      if (!Array.isArray(parsed.alerts)) {
        parsed.alerts = [];
      }

      let high = 0,
        medium = 0,
        low = 0;

      parsed.alerts.forEach((a) => {
        if (a.priority === "High") high++;
        else if (a.priority === "Medium") medium++;
        else low++;
      });

      const deduction = high * 3 + medium * 2 + low;
      parsed.complianceScore = Math.max(0, 100 - deduction * 5);

      console.log("📊 Final score:", parsed.complianceScore);
      console.log("🚨 Alerts found:", parsed.alerts.length);
      
      return parsed;
    } catch (err) {
      console.error("❌ Analysis failed:", err);
      console.error("Error details:", err.message);
      throw err;
    }
  }

  async function handleFileUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    console.log("📄 File selected:", file.name, file.type, file.size);
    setModalOpen(false);
    setLoading(true);

    try {
      let text = "";

      console.log("📖 Extracting text...");
      if (file.type === "application/pdf" || file.name.endsWith(".pdf")) {
        console.log("Processing PDF...");
        text = await extractTextFromPDF(await file.arrayBuffer());
      } else if (file.name.endsWith(".docx")) {
        console.log("Processing DOCX...");
        text = await extractTextFromDOCX(await file.arrayBuffer());
      } else {
        console.log("Processing TXT...");
        text = await file.text();
      }

      console.log("✅ Text extracted, length:", text.length);
      console.log("🤖 Analyzing compliance with Gemini...");
      
      const result = await analyzeCompliance(text);
      
      console.log("✅ Analysis complete:", result);
      console.log("💾 Saving to Firebase...");

      const fileData = { name: file.name, analysis: result, text };
      
      try {
        const id = await Promise.race([
          saveFileToFirebase(fileData),
          new Promise((_, reject) => setTimeout(() => reject(new Error('Firebase timeout')), 10000))
        ]);
        
        if (id) fileData.id = id;
      } catch (saveError) {
        console.warn("⚠️ Firebase save failed or timed out:", saveError.message);
        console.log("⚠️ Continuing without saving to Firebase...");
      }

      console.log("🔄 Reloading files...");
      await loadFilesFromFirebase();
      setSelectedFile(fileData);
      setAnalysis(result);
      console.log("✅ All done!");
      console.log("📊 Setting analysis state:", result);
      console.log("🎯 Analysis object:", { complianceScore: result.complianceScore, alertCount: result.alerts?.length });
    } catch (err) {
      console.error("❌ Error:", err);
      alert("Error analyzing file: " + err.message);
    } finally {
      setLoading(false);
      console.log("🛑 Loading spinner hidden");
    }
  }

  const score = analysis?.complianceScore ?? 0;
  const progressOffset = circumference * (1 - score / 100);

  return (
    <div className="min-h-screen bg-background text-foreground ml-[260px]">
      <div className="w-full px-8 py-8">

        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-light mb-2">
            Compliance Guardian
          </h1>
          <p className="text-muted-foreground">
            AI-powered regulatory compliance analysis
          </p>
        </motion.div>

        {/* Scan Button */}
        <div className="flex justify-end mb-6">
          <button
            onClick={() => setModalOpen(true)}
            className="px-6 py-3 bg-emerald-600 text-white rounded-full hover:scale-105 transition"
          >
            Scan New Contract
          </button>
        </div>

        {/* Main Grid */}
        <div className="grid md:grid-cols-2 gap-6">

          {/* Alerts */}
          <div className="p-6 rounded-3xl bg-card border border-border">
            <h2 className="text-xl mb-4">Compliance Alerts</h2>

            {!analysis ? (
              <p className="text-muted-foreground">
                No document analyzed yet.
              </p>
            ) : analysis.alerts.length === 0 ? (
              <p className="text-green-400">
                No compliance issues found.
              </p>
            ) : (
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {analysis.alerts.map((alert, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-xl border border-border bg-muted/50"
                  >
                    <p className="font-medium">
                      {alert.priority} Priority
                    </p>
                    <p>{alert.issue}</p>
                    <p className="text-sm text-muted-foreground">
                      {alert.location}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Score */}
          <div className="p-6 rounded-3xl bg-card border border-border flex flex-col items-center">
            <h2 className="text-xl mb-6">Compliance Score</h2>

            <div className="relative w-48 h-48">
              <svg
                className="absolute w-full h-full -rotate-90"
                viewBox="0 0 192 192"
              >
                <circle
                  cx="96"
                  cy="96"
                  r={RADIUS}
                  stroke="hsl(var(--muted))"
                  strokeWidth="16"
                  fill="none"
                />
                <circle
                  cx="96"
                  cy="96"
                  r={RADIUS}
                  stroke="#10b981"
                  strokeWidth="16"
                  fill="none"
                  strokeDasharray={circumference}
                  strokeDashoffset={progressOffset}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center text-3xl">
                {score}%
              </div>
            </div>
          </div>
        </div>

        {/* Upload Modal */}
        {modalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-card p-8 rounded-3xl border border-border max-w-md w-full mx-4">
              <h2 className="text-2xl font-bold mb-4">Upload Contract</h2>
              <p className="text-muted-foreground mb-6">
                Upload a PDF, DOCX, or TXT file for compliance analysis
              </p>
              <input
                type="file"
                accept=".pdf,.docx,.txt"
                onChange={handleFileUpload}
                className="w-full p-4 rounded-xl bg-muted border border-border text-foreground file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-emerald-600 file:text-white hover:file:bg-emerald-700 cursor-pointer"
              />
              <div className="flex justify-end mt-6">
                <button
                  onClick={() => setModalOpen(false)}
                  className="px-6 py-2 rounded-full bg-muted hover:bg-muted/80 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Loading Overlay */}
        {loading && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
            <div className="bg-card p-8 rounded-3xl border border-border">
              <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mb-4"></div>
                <p className="text-lg">Analyzing document...</p>
                <p className="text-sm text-muted-foreground mt-2">This may take 10-30 seconds</p>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
