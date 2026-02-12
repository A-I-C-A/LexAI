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
      const docRef = await addDoc(collection(db, "analyzedFiles"), {
        name: fileData.name,
        uploadDate: new Date(),
        analysis: fileData.analysis,
        text: fileData.text,
      });
      return docRef.id;
    } catch (err) {
      console.error("Error saving file:", err);
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
    try {
      const model = genAI.getGenerativeModel({
        model: "gemini-2.0-flash",
      });

      const result = await model.generateContent({
        contents: [
          {
            role: "user",
            parts: [
              {
                text: `
You are an expert legal compliance analyst.
Return ONLY JSON:
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
Document:
${text}
`,
              },
            ],
          },
        ],
        generationConfig: { responseMimeType: "application/json" },
      });

      const raw = await result.response.text();
      const parsed = JSON.parse(raw);

      if (!Array.isArray(parsed.alerts))
        return { complianceScore: 0, alerts: [] };

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

      return parsed;
    } catch (err) {
      console.error("Analysis failed:", err);
      return { complianceScore: 0, alerts: [] };
    }
  }

  async function handleFileUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    setModalOpen(false);
    setLoading(true);

    try {
      let text = "";

      if (file.type === "application/pdf" || file.name.endsWith(".pdf")) {
        text = await extractTextFromPDF(await file.arrayBuffer());
      } else if (file.name.endsWith(".docx")) {
        text = await extractTextFromDOCX(await file.arrayBuffer());
      } else {
        text = await file.text();
      }

      const result = await analyzeCompliance(text);

      const fileData = { name: file.name, analysis: result, text };
      const id = await saveFileToFirebase(fileData);

      if (id) fileData.id = id;

      await loadFilesFromFirebase();
      setSelectedFile(fileData);
      setAnalysis(result);
    } catch (err) {
      alert("Error analyzing file.");
    } finally {
      setLoading(false);
    }
  }

  const score = analysis?.complianceScore ?? 0;
  const progressOffset = circumference * (1 - score / 100);

  return (
    <div className="min-h-screen bg-dark-background text-dark-foreground ml-[260px]">
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
            className="px-6 py-3 bg-white text-black rounded-full hover:scale-105 transition"
          >
            Scan New Contract
          </button>
        </div>

        {/* Main Grid */}
        <div className="grid md:grid-cols-2 gap-6">

          {/* Alerts */}
          <div className="p-6 rounded-3xl bg-[#0E0E0E] border border-white/10">
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
                    className="p-4 rounded-xl border border-white/10 bg-white/5"
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
          <div className="p-6 rounded-3xl bg-[#0E0E0E] border border-white/10 flex flex-col items-center">
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
                  stroke="rgba(255,255,255,0.1)"
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

      </div>
    </div>
  );
}
