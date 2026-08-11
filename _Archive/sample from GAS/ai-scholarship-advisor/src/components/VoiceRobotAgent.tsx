import React, { useState, useEffect, useRef } from "react";
import { StudentProfile } from "../types";
import { Volume2, VolumeX, Bot, Sparkles, AlertCircle, RefreshCw } from "lucide-react";

interface VoiceRobotAgentProps {
  currentStudent: StudentProfile;
  matches: any[];
  lang?: "en" | "my";
}

// Custom lists of insights that the AI will cycle through.
// Some insights are dynamic templates based on the current student's data.
const getBilingualInsights = (student: StudentProfile, topMatchName: string) => [
  {
    text: `Hai! Saya Cikgu AI DELIMa. Profil ${student.name} mempamerkan merit yang sangat cerah untuk tajaan ${topMatchName || "biasiswa utama"}.`,
    voice: `Hai! Saya Cikgu A.I. DEE LIMA. Profil ${student.name} mempamerkan merit yang sangat cerah untuk tajaan ${topMatchName || "biasiswa utama"}.`
  },
  {
    text: `Kecenderungan RIASEC menunjukkan kombinasi ${student.riasecType.join(" dan ")}. Ini sangat sesuai bagi bidang ${student.fieldOfInterest}!`,
    voice: `Kecenderungan R.I.A.S.E.C menunjukkan kombinasi ${student.riasecType.join(" dan ")}. Ini sangat sesuai bagi bidang ${student.fieldOfInterest}!`
  },
  {
    text: `PAJSK index of ${student.pajskScore}% coupled with a ${student.leadershipLevel} leadership rank injects a powerful advantage into national scholarship algorithms.`,
    voice: `P.A.J.S.K. index of ${student.pajskScore} percent, coupled with a ${student.leadershipLevel} leadership rank, injects a powerful advantage into national scholarship algorithms.`
  },
  {
    text: `Sistem Pengesanasiswa Pintar mencadangkan program SPM ${topMatchName || "pilihan penaja"} sebagai keutamaan sasaran UPU.`,
    voice: `Sistem Pengesanasiswa Pintar mencadangkan program S.P.M. ${topMatchName || "pilihan penaja"} sebagai keutamaan sasaran U.P.U.`
  },
  {
    text: `Anda boleh menyunting gred subjek ${student.name.split(" ")[0]} pada panel kiri untuk melihat perubahan kedudukan kelayakan masa-nyata.`,
    voice: `Anda boleh menyunting gred subjek ${student.name.split(" ")[0]} pada panel kiri untuk melihat perubahan kedudukan kelayakan masa-nyata.`
  },
  {
    text: `Analisis Pintar: Bidang ${student.fieldOfInterest} mempunyai permintaan industri yang amat tinggi bagi tahun 2026/2027.`,
    voice: `Analisis Pintar: Bidang ${student.fieldOfInterest} mempunyai permintaan industri yang amat tinggi bagi tahun dua ribu dua puluh enam, dua ribu dua puluh tujuh.`
  },
  {
    text: `Did you know? PETRONAS and JPA scholarships evaluate leadership potential as heavily as formal academic results. Engage in co-curricular tasks!`,
    voice: `Did you know? PETRONAS and J.P.A. scholarships evaluate leadership potential as heavily as formal academic results. Engage in co-curricular tasks!`
  },
  {
    text: `Prestasi akademik ${student.name} memuaskan kriteria asas MoE. Menilai pautan universiti sasaran sedia diselaraskan.`,
    voice: `Prestasi akademik ${student.name} memuaskan kriteria asas M.O.E. Menilai pautan universiti sasaran sedia diselaraskan.`
  }
];

export default function VoiceRobotAgent({ currentStudent, matches, lang = "my" }: VoiceRobotAgentProps) {
  const [isSpeechEnabled, setIsSpeechEnabled] = useState(false);
  const [insightIndex, setInsightIndex] = useState(0);
  const [currentSpeechText, setCurrentSpeechText] = useState("");
  const [isSpeakingNow, setIsSpeakingNow] = useState(false);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const synthesisRef = useRef<SpeechSynthesisUtterance | null>(null);

  const topMatchName = matches[0]?.scholarshipName || "";
  const insights = getBilingualInsights(currentStudent, topMatchName);

  // Function to perform Text-To-Speech using SpeechSynthesis API
  const speakTextRef = useRef<(text: string) => void>(() => {});

  speakTextRef.current = (textToSpeak: string) => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;

    // First cancel prior speech
    window.speechSynthesis.cancel();
    setIsSpeakingNow(false);

    if (!isSpeechEnabled) return;

    try {
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      
      // Attempt to find a suitable English or Malay sounding voice
      const voices = window.speechSynthesis.getVoices();
      
      // Detect if we should use Malay voice or English depending on message content
      const containsMalayKeywords = /Hai|saya|mempamerkan|kecenderungan|menunjukkan|sesuai|pilihan|menyunting|gred|prestasi|pencapaian/i.test(textToSpeak);
      
      let selectedVoice = null;
      if (containsMalayKeywords) {
        // Try searching for Indonesian/Malay voice indices
        selectedVoice = voices.find(v => v.lang.startsWith("id") || v.lang.startsWith("ms"));
      } else {
        selectedVoice = voices.find(v => v.lang.startsWith("en"));
      }
      
      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }
      
      utterance.rate = 0.95; // Slightly slower speed for clearer robotic narration
      utterance.pitch = 1.05; // Friendly pitch

      utterance.onstart = () => {
        setIsSpeakingNow(true);
      };

      utterance.onend = () => {
        setIsSpeakingNow(false);
      };

      utterance.onerror = (e) => {
        console.warn("Speech synthesis issue:", e);
        setIsSpeakingNow(false);
      };

      synthesisRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.error("Failed to execute TTS:", err);
      setIsSpeakingNow(false);
    }
  };

  // Switch index and trigger speech synthesis periodically every 5 seconds
  useEffect(() => {
    // Generate initial message
    const currentInsight = insights[insightIndex % insights.length];
    setCurrentSpeechText(currentInsight.text);
    
    // Wait for voice list loading from browser
    if (typeof window !== "undefined" && window.speechSynthesis) {
      if (window.speechSynthesis.getVoices().length === 0) {
        window.speechSynthesis.onvoiceschanged = () => {
          if (isSpeechEnabled) {
            speakTextRef.current(currentInsight.voice);
          }
        };
      } else {
        if (isSpeechEnabled) {
          speakTextRef.current(currentInsight.voice);
        }
      }
    }

    // Set up the 5-second interval timer
    timerRef.current = setInterval(() => {
      setInsightIndex((prevIndex) => {
        const nextIndex = prevIndex + 1;
        const nextInsight = insights[nextIndex % insights.length];
        setCurrentSpeechText(nextInsight.text);
        
        if (isSpeechEnabled) {
          // Speak the voice narrative
          speakTextRef.current(nextInsight.voice);
        }
        return nextIndex;
      });
    }, 5000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, [isSpeechEnabled, currentStudent.id, topMatchName]); // clear and re-trigger whenever student or speech setting shifts

  // Direct manual trigger to step to next insight immediately
  const handleNextInsight = () => {
    const nextIndex = insightIndex + 1;
    setInsightIndex(nextIndex);
    const nextInsight = insights[nextIndex % insights.length];
    setCurrentSpeechText(nextInsight.text);
    if (isSpeechEnabled) {
      speakTextRef.current(nextInsight.voice);
    }
  };

  const toggleSpeechSettings = () => {
    const nextState = !isSpeechEnabled;
    setIsSpeechEnabled(nextState);
    
    if (nextState) {
      // Just unmuted - Speak immediately
      const currentInsight = insights[insightIndex % insights.length];
      setTimeout(() => {
        speakTextRef.current(currentInsight.voice);
      }, 50);
    } else {
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      setIsSpeakingNow(false);
    }
  };

  return (
    <div 
      id="voice-robot-agent" 
      className="bg-gradient-to-br from-[#1e1e38] to-[#121226] text-white rounded-3xl p-5 border border-purple-950/40 shadow-xl relative overflow-hidden flex flex-col sm:flex-row gap-4 items-center transition-all duration-300"
    >
      {/* Visual background atmospheric elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-purple-600/15 rounded-full blur-2xl pointer-events-none"></div>
      <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-pink-600/10 rounded-full blur-xl pointer-events-none"></div>

      {/* Robot Animated Core representation */}
      <div className="flex flex-col items-center gap-2 relative">
        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#9d4edd] to-[#e0aaff] flex items-center justify-center shadow-lg relative ${isSpeakingNow ? "animate-pulse border-2 border-[#ff9e00]" : "border border-purple-500/20"}`}>
          <Bot className={`w-8 h-8 text-white ${isSpeakingNow ? "scale-105" : "scale-100"} transition-all duration-300`} />
          
          {/* Reactive speech glow points */}
          {isSpeakingNow && (
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ff9e00] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[#e0aaff]"></span>
            </span>
          )}
        </div>

        {/* Dynamic Speech Waves */}
        <div className="flex items-center gap-0.5 h-3 mt-1 px-1">
          {[1, 2, 3, 4, 5, 4, 3, 2, 1].map((val, idx) => (
            <span 
              key={idx} 
              className={`w-0.5 bg-gradient-to-t from-[#aa2277] to-[#e0aaff] rounded-full transition-all duration-150`}
              style={{
                height: isSpeakingNow ? `${Math.min(100, Math.max(20, val * 20))}px` : "2px",
                animationName: isSpeakingNow ? "pulse" : "none",
                animationDuration: "0.8s",
                animationTimingFunction: "ease-in-out",
                animationIterationCount: "infinite",
                animationDirection: "alternate",
                animationDelay: `${idx * 0.08}s`
              }}
            />
          ))}
        </div>
      </div>

      {/* Main text content & feedback bubbles */}
      <div className="flex-1 flex flex-col justify-between w-full">
        <div>
          <div className="flex items-center gap-2 justify-between">
            <div className="flex items-center gap-1.5 text-xs font-extrabold text-[#e0aaff] uppercase tracking-wider font-sans">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span>Ejen Suara DELIMa A.I. 5s</span>
            </div>
            
            {/* Direct cycle manual update button */}
            <button
              onClick={handleNextInsight}
              title="Speak next diagnostic tip directly"
              className="p-1 hover:bg-white/10 rounded text-slate-400 hover:text-white transition-colors flex items-center gap-1 text-[9px] uppercase tracking-wide font-mono font-bold"
            >
              <RefreshCw className="w-3 h-3 animate-reverse" />
              <span>Next Tip</span>
            </button>
          </div>

          {/* Speech Bubble simulation */}
          <div className="mt-2 text-xs text-slate-200 leading-relaxed font-sans bg-white/5 border border-purple-900/40 px-4 py-2.5 rounded-2xl relative">
            <div className="absolute top-1/2 -left-1.5 -translate-y-1/2 w-0 h-0 border-t-[5px] border-t-transparent border-b-[5px] border-b-transparent border-r-[6px] border-r-white/5 hidden sm:block"></div>
            {currentSpeechText}
          </div>
        </div>

        {/* Controller Bar */}
        <div className="mt-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 pt-2 border-t border-purple-900/30">
          <div className="flex items-center gap-1.5">
            {isSpeechEnabled ? (
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold bg-[#ecfdf5] text-[#059669]">
                📢 Suara Aktif
              </span>
            ) : (
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold bg-[#fef2f2] text-[#dc2626]">
                🔇 Suara Mute (Teks Sahaja)
              </span>
            )}
            <span className="text-[10px] text-slate-400 font-mono">
              Auto-cycle: 5s
            </span>
          </div>

          <button
            onClick={toggleSpeechSettings}
            id="btn-unmute-ai-robot"
            className={`font-sans font-bold flex items-center gap-1.5 text-xs px-4 py-1.5 rounded-xl transition-all ${
              isSpeechEnabled
                ? "bg-[#dc2626]/20 hover:bg-[#dc2626]/30 text-[#fecaca] border border-[#dc2626]/50"
                : "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-md shadow-purple-500/15"
            }`}
          >
            {isSpeechEnabled ? (
              <>
                <VolumeX className="w-4 h-4" />
                <span>Senyapkan Suara</span>
              </>
            ) : (
              <>
                <Volume2 className="w-4 h-4 animate-bounce" />
                <span>Hubungkan Suara (Unmute Robot)</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
