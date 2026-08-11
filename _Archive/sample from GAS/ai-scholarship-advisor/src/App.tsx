import { useState, useEffect } from "react";
import { StudentProfile } from "./types";
import { STUDENT_PROFILES } from "./data/mockData";
import {
  computeScholarshipMatches,
  calculateStudentPotentials,
  computeCareerPathways,
} from "./utils/matchingEngine";

import SidebarStudent from "./components/SidebarStudent";
import AgentStatusTimeline from "./components/AgentStatusTimeline";
import MainContent from "./components/MainContent";
import RightSidebar from "./components/RightSidebar";
import VoiceRobotAgent from "./components/VoiceRobotAgent";

import {
  GraduationCap,
  Sparkles,
  BookOpen,
  Award,
  Globe,
  Bell,
  HelpCircle,
  FileCheck,
  CheckCircle,
  Lightbulb,
  XCircle,
  Maximize,
  Minimize
} from "lucide-react";

export default function App() {
  // Load initial student record
  const [selectedStudentId, setSelectedStudentId] = useState<string>("ahmad");
  const [activeStudent, setActiveStudent] = useState<StudentProfile>(
    STUDENT_PROFILES[0]
  );

  // Fullscreen state & toggle
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Language preference state: 'en' for English, 'my' for Malay
  const [lang, setLang] = useState<"en" | "my">("my");

  useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", onFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", onFullscreenChange);
  }, []);

  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error("Error attempting to enable fullscreen:", err);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  // States for matching run progress
  const [isPipelineRunning, setIsPipelineRunning] = useState<boolean>(false);
  const [hasPipelineRun, setHasPipelineRun] = useState<boolean>(true); // initially true for high-fidelity instant showcase

  // Apply workflow triggers
  const [modalScholarship, setModalScholarship] = useState<string | null>(null);

  // Synchronize student data on manual switch
  const handleSelectStudent = (id: string) => {
    const student = STUDENT_PROFILES.find((s) => s.id === id);
    if (student) {
      setActiveStudent(JSON.parse(JSON.stringify(student))); // Deep copy
      setIsPipelineRunning(false);
      setHasPipelineRun(true); // show cached calculation directly
    }
    setSelectedStudentId(id);
  };

  const handleUpdateStudent = (updated: StudentProfile) => {
    setActiveStudent(updated);
    // When values are updated, mark pipeline as pending fresh run to encourage clicking the "Run AI Pipeline" button
    setHasPipelineRun(false);
  };

  const startPipeline = () => {
    setIsPipelineRunning(true);
  };

  const completePipeline = () => {
    setIsPipelineRunning(false);
    setHasPipelineRun(true);
  };

  // Live analytics matched on current state
  const matches = computeScholarshipMatches(activeStudent);
  const potentials = calculateStudentPotentials(activeStudent);
  const pathways = computeCareerPathways(activeStudent);

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col text-slate-800 antialiased font-sans">
      {/* 1. MINISTRY OF EDUCATION MALAYSIA HEADER (DELIMa Vibe) */}
      <header className="bg-white border-b border-rose-100/60 sticky top-0 z-50 shadow-xs px-4 sm:px-6 lg:px-8 py-3">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Left Area: Traditional DELIMa Striped Text Logo */}
          <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-start">
            <div className="flex items-center gap-3">
              <div className="relative group flex items-baseline">
                {/* Custom Striped DELIMa Wordmark */}
                <span 
                  className="text-3xl font-black tracking-tight font-sans select-none" 
                  style={{
                    backgroundImage: 'repeating-linear-gradient(90deg, #aa2277, #aa2277 1px, transparent 1px, transparent 3px)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    fontFamily: '"Outfit", sans-serif',
                  }}
                >
                  DELIMa
                </span>
                <span className="text-[9px] bg-pink-150 text-[#b52b7c] font-black px-1 py-0.2 rounded-md ml-1.5 border border-[#b52b7c]/20 uppercase">
                  A.I.
                </span>
              </div>
              <div className="hidden sm:block h-8 w-px bg-slate-200"></div>
              <div className="hidden sm:block">
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider leading-none">
                  Kementerian Pendidikan Malaysia
                </p>
                <h4 className="text-2xs font-extrabold text-[#7e22ce] mt-0.5 tracking-tight">
                  {lang === "en" ? "Smart Scholar Tracking System" : "Sistem Pengesanasiswa Pintar"}
                </h4>
              </div>
            </div>

            {/* Mobile Actions: Language Selector & Fullscreen for easy use */}
            <div className="flex items-center gap-2 md:hidden">
              <button
                onClick={handleToggleFullscreen}
                className="p-1.5 rounded-lg bg-[#faf5ff] text-[#7e22ce] border border-[#f3e8ff] hover:bg-[#f3e8ff] transition-colors"
                title={lang === "en" ? "Fullscreen" : "Skrin Penuh"}
              >
                {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Middle Area: Interactive Question of DELIMa Home Screen */}
          <div className="text-center md:block flex-1 max-w-lg">
            <h2 className="text-sm sm:text-base font-bold text-[#7209b7] font-sans">
              {lang === "en" ? "What would you like to explore today?" : "Apakah yang ingin anda lakukan hari ini?"}
            </h2>
            <p className="text-[10px] text-slate-400 font-medium">
              {lang === "en" ? "Analyze criteria filters & pre-university sponsor requirements" : "Teroka gred kelayakan murid & panduan penajaan universiti"}
            </p>
          </div>

          {/* Right Area: Language preference & User identity & Fullscreen Action */}
          <div className="flex items-center gap-4 self-end md:self-auto w-full md:w-auto justify-between md:justify-end">
            <div className="flex items-center gap-3.5">
              {/* Language selection matching DELIMa screenshot exactly */}
              <div className="text-2xs text-slate-400 font-bold tracking-tight">
                <button 
                  onClick={() => setLang("en")}
                  className={`hover:text-[#7209b7] font-sans transition-all px-1 py-0.5 rounded ${lang === "en" ? "text-[#7209b7] font-black underline bg-purple-50" : "text-slate-400"}`}
                >
                  En
                </button>
                <span className="mx-1 text-slate-200">|</span>
                <button 
                  onClick={() => setLang("my")}
                  className={`hover:text-[#7209b7] font-sans transition-all px-1 py-0.5 rounded ${lang === "my" ? "text-[#7209b7] font-black underline bg-purple-50" : "text-slate-400"}`}
                >
                  My
                </button>
                <span className="mx-1 text-slate-200">|</span>
                <span className="hover:text-[#7209b7] cursor-pointer text-xs select-none" style={{ fontFamily: 'sans-serif' }}>جاوي</span>
              </div>

              {/* Fullscreen Button for desktop */}
              <button
                onClick={handleToggleFullscreen}
                className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#faf5ff] text-[#7209b7] border border-[#f3e8ff] hover:bg-[#f3e8ff] transition-all text-xs font-bold"
              >
                {isFullscreen ? (
                  <>
                    <Minimize className="w-3.5 h-3.5" />
                    <span>{lang === "en" ? "Exit Fullscreen" : "Keluar Skrin Penuh"}</span>
                  </>
                ) : (
                  <>
                    <Maximize className="w-3.5 h-3.5" />
                    <span>{lang === "en" ? "Fullscreen Mode" : "Skrin Penuh"}</span>
                  </>
                )}
              </button>
            </div>

            <div className="flex items-center gap-2">
              <div className="text-right hidden xl:block">
                <p className="text-[10px] font-bold text-slate-500">g-17155479@moe-dl.edu.my</p>
                <span className="text-[8px] bg-[#fee2e2] text-[#991b1b] font-black px-1.5 py-0.2 rounded uppercase">
                  DELIMa Counselor
                </span>
              </div>
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-600 flex items-center justify-center text-white font-black text-xs">
                M
              </div>
            </div>
          </div>

        </div>
      </header>

      {/* 2. SUB HEADER / INTRODUCTION */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-indigo-950 text-white py-8 px-4 sm:px-6 lg:px-8 shadow-inner font-sans">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <span className="text-[10px] font-extrabold tracking-widest text-indigo-200 bg-indigo-950/40 px-2.5 py-1 rounded-full uppercase font-sans">
              {lang === "en" ? "Academic Support Module 2026/2027" : "Modul Sokongan Akademik UPU 2026/2027"}
            </span>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight leading-tight">
              {lang === "en" ? "SPM Scholar Matching & Diagnostic Simulator" : "Simulator Diagnostik & Padanan Biasiswa Lepasan SPM"}
            </h2>
            <p className="text-xs sm:text-xs text-indigo-100 font-sans leading-relaxed">
              {lang === "en" 
                ? "Ensure national graduates have direct access to corporate pre-tertiary funding lines. Adjust academic marks, leadership attributes, and execute active simulation diagnostics to evaluate alignment algorithms."
                : "Memastikan calon lepasan SPM mendapat akses terbaik kepada pembiayaan program persediaan tinggi korporat. Laraskan pemboleh ubah keputusan akademik atau status kokurikulum (PAJSK), lalu laksanakan simulasi untuk menilai pengiraan gred."
              }
            </p>
          </div>

          <div className="flex items-center gap-3.5 bg-white/10 backdrop-blur-xs px-4 py-3 rounded-xl border border-white/10 shrink-0">
            <div className="p-2 bg-indigo-600 rounded-lg text-white">
              <Sparkles className="w-5 h-5 text-indigo-100" />
            </div>
            <div>
              <p className="text-2xs text-indigo-200 font-bold uppercase tracking-wide">
                {lang === "en" ? "Orchestration Nodes" : "Hab Kawalan Utama"}
              </p>
              <h4 className="text-xs font-bold text-white leading-normal mt-0.5">
                {lang === "en" ? "4 Autonomic AI Experts Active" : "4 Ejen Pintar Autonomi Aktif"}
              </h4>
            </div>
          </div>
        </div>
      </div>

      {/* 3. CORE LAYOUT DOCK */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 flex flex-col gap-6 w-full">
        
        {/* Out-of-sync alert reminder */}
        {!hasPipelineRun && (
          <div className="bg-indigo-50 border-l-4 border-indigo-600 p-4 rounded-r-xl shadow-xs flex items-center justify-between gap-4 font-sans leading-relaxed text-xs">
            <div className="flex items-center gap-2.5">
              <Lightbulb className="w-4 h-4 text-indigo-600 block shrink-0" />
              <span className="text-indigo-850 font-medium font-sans">
                {lang === "en" ? (
                  <>
                    <strong>Parameters modified!</strong> Student academic/PAJSK matrices have changed. Click the **\"Run AI Pipeline\"** button above the console log to compile fresh scholarship alignments.
                  </>
                ) : (
                  <>
                    <strong>Parameter telah diubahsuai!</strong> Gred SPM atau rekod PAJSK murid telah dikemas kini. Sila tekan butang **\"Jalankan Saluran A.I.\"** untuk mengira semula keserasian penaja biasiswa.
                  </>
                )}
              </span>
            </div>
            <button
              onClick={startPipeline}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-1.5 px-3 rounded-xl transition-all shadow-xs shrink-0"
            >
              {lang === "en" ? "Analyze changes" : "Analisis perubahan"}
            </button>
          </div>
        )}

        {/* Dynamic Agentic Status Orchestrator Bar */}
        <AgentStatusTimeline
          onPipelineStart={startPipeline}
          onPipelineComplete={completePipeline}
          isPipelineRunning={isPipelineRunning}
          lang={lang}
        />

        {/* 5-Second Voice Robot Agent Companion */}
        <VoiceRobotAgent
          currentStudent={activeStudent}
          matches={matches}
          lang={lang}
        />

        {/* Bento Grid layout dividing sidebars */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* LEFT SIDEBAR: Student Profile Card (4 Columns) */}
          <div className="lg:col-span-3">
            <SidebarStudent
              currentStudent={activeStudent}
              onSelectStudent={handleSelectStudent}
              onUpdateStudent={handleUpdateStudent}
              lang={lang}
            />
          </div>

          {/* MAIN COLUMN CONTENT CARD (6 Columns) */}
          <div className="lg:col-span-6">
            <MainContent
              currentStudent={activeStudent}
              matches={matches}
              potentials={potentials}
              pathways={pathways}
              isPipelineRunning={isPipelineRunning}
              lang={lang}
            />
          </div>

          {/* RIGHT SIDEBAR: Upcoming deadlines & Quick-links (3 Columns) */}
          <div className="lg:col-span-3">
            <RightSidebar onApplyClick={(name) => setModalScholarship(name)} lang={lang} />
          </div>

        </div>
      </main>

      {/* 4. APPLICATION MODAL / DIALOG */}
      {modalScholarship && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative border border-slate-100 font-sans">
            <button
              onClick={() => setModalScholarship(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
              title="Close modal"
            >
              ✕
            </button>

            <div className="flex flex-col items-center text-center gap-3">
              <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center p-2">
                <FileCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {lang === "en" ? "Compile Application Package" : "Menyediakan Pakej Permohonan"}
                </h3>
                <p className="text-2xs font-semibold text-emerald-600 uppercase tracking-widest mt-1">
                  {lang === "en" ? "KPM Sync Ready" : "KPM Sedia Disegerak"}
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 w-full text-left mt-2">
                <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">
                  {lang === "en" ? "Target Scholarship" : "Sponsorship Sasaran"}
                </span>
                <span className="text-xs font-bold text-slate-800 font-sans block mt-0.5">
                  {modalScholarship}
                </span>

                <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider mt-3">
                  {lang === "en" ? "Attachments Included" : "Fail Lampiran Diserahkan"}
                </span>
                <ul className="mt-1 space-y-1 text-2xs text-slate-600">
                  <li className="flex items-center gap-1.5">
                    <span className="text-emerald-500">✓</span> {lang === "en" ? "SPM Official Certificate (Locked via MoE)" : "Sijil Rasmi SPM (Disah dari KPM)"}
                  </li>
                  <li className="flex items-center gap-1.5">
                    <span className="text-emerald-500">✓</span> {lang === "en" ? "PAJSK Extracurricular Portfolio index" : "Indeks Portfolio Kokurikulum PAJSK"}
                  </li>
                  <li className="flex items-center gap-1.5">
                    <span className="text-emerald-500">✓</span> {lang === "en" ? "Dynamic RIASEC Matching score sheet" : "Lembaran Analisis Keserasian Kerjaya RIASEC"}
                  </li>
                </ul>
              </div>

              <p className="text-xs text-slate-500 font-sans leading-relaxed px-1">
                {lang === "en" 
                  ? "Your credentials are encrypted and synchronized against the central civil service verification registries. Press transmit to complete entry request."
                  : "Butiran permohonan anda disulitkan secara selamat dan diselaraskan terus dengan pangkalan data JPA & UPU. Tekan butang di bawah untuk penghantaran rasmi."
                }
              </p>

              <button
                onClick={() => setModalScholarship(null)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-2.5 rounded-xl transition-all"
              >
                {lang === "en" ? "Transmit Application to UPU" : "Hantar Permohonan Sistem UPU"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. FOOTER */}
      <footer className="bg-white border-t border-slate-100 py-6 px-4 md:px-8 mt-12 text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 font-sans text-xs">
          <div className="text-center md:text-left">
            <p className="font-semibold text-slate-700 font-sans">
              DELIMa (Digital Educational Learning Initiative Malaysia)
            </p>
            <p className="text-2xs text-slate-400 mt-1 font-sans">
              Design engineered in collaboration with the Kementerian Pendidikan Malaysia. Powered by simulated agentic pipelines.
            </p>
          </div>
          <div className="flex gap-4">
            <span className="text-[10px] bg-slate-100 text-slate-600 font-bold px-2 py-0.5 rounded font-sans">
              VERSION 2.15-PROTOTYPE
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
