import { useState, useEffect, useRef, useCallback } from 'react';
import { Volume2, VolumeX, ChevronRight } from 'lucide-react';
import { StudentProfile, Language, CalculatedMatch } from '../types';

interface VoiceAgentProps {
  student: StudentProfile;
  topMatch: CalculatedMatch | null;
  lang: Language;
  isPipelineDone: boolean;
}

function buildMessages(student: StudentProfile, topMatch: CalculatedMatch | null, lang: Language): string[] {
  const name = student.name.split(' ')[0];
  const score = topMatch?.score.toFixed(1) ?? 'N/A';
  const scholarship = topMatch?.scholarshipName ?? 'biasiswa terbaik';
  const riasec = student.riasecType.join('/');
  const cat = student.parentCategory;

  if (lang === 'bm') {
    return [
      `Salam, ${name}! Selamat datang ke DELIMa A.I. — Sistem Padanan Biasiswa 6-Ejen anda.`,
      `Profil akademik anda menunjukkan ${Object.values(student.spmGrades).filter(g => g.startsWith('A')).length} gred A dalam SPM. Sangat membanggakan!`,
      `Skor PAJSK anda adalah ${student.pajskScore}/100. Ini mencerminkan penglibatan aktif dalam kokurikulum.`,
      `Jenis RIASEC anda adalah ${riasec}. Ini menunjukkan kecenderungan kepada bidang ${student.preferredField}.`,
      `Impian kerjaya anda sebagai ${student.dreamCareer} sangat sesuai dengan biasiswa yang tersedia.`,
      `Kategori pendapatan keluarga ${cat} membuka peluang kepada biasiswa khusus untuk anda.`,
      topMatch
        ? `Padanan teratas: "${scholarship}" dengan skor ${score}%. Jangan lepaskan peluang ini!`
        : 'Jalankan Ejen AI untuk melihat padanan biasiswa terbaik anda!',
      `6 ejen AI sedang menganalisis profil anda menggunakan pemberat 35/20/15/15/15. Padanan yang tepat dan adil!`,
    ];
  }

  return [
    `Hello, ${name}! Welcome to DELIMa A.I. — your 6-Agent Scholarship Matching System.`,
    `Your academic profile shows ${Object.values(student.spmGrades).filter(g => g.startsWith('A')).length} A grades in SPM. Outstanding achievement!`,
    `Your PAJSK score is ${student.pajskScore}/100, reflecting strong co-curricular involvement.`,
    `Your RIASEC profile is ${riasec}, indicating a strong aptitude for ${student.preferredField}.`,
    `Your dream of becoming a ${student.dreamCareer} aligns well with the available scholarships.`,
    `As a ${cat} family, you have access to targeted scholarship opportunities designed for you.`,
    topMatch
      ? `Top match: "${scholarship}" with a score of ${score}%. Don't miss this opportunity!`
      : 'Run the AI Pipeline to discover your best scholarship matches!',
    `6 AI agents analyse your profile using weights 35/20/15/15/15 for holistic, fair matching.`,
  ];
}

export default function VoiceAgent({ student, topMatch, lang, isPipelineDone }: VoiceAgentProps) {
  const [muted, setMuted] = useState(true);
  const [msgIdx, setMsgIdx] = useState(0);
  const [speaking, setSpeaking] = useState(false);
  const [visible, setVisible] = useState(true);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const messages = buildMessages(student, topMatch, lang);

  const speak = useCallback((text: string) => {
    if (!('speechSynthesis' in window) || muted) return;
    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(text);
    utt.lang = lang === 'bm' ? 'ms-MY' : 'en-MY';
    const voices = window.speechSynthesis.getVoices();
    const malay = voices.find(v => v.lang.startsWith('ms') || v.lang.startsWith('id'));
    if (lang === 'bm' && malay) utt.voice = malay;
    utt.rate = 0.9;
    utt.onstart = () => setSpeaking(true);
    utt.onend = () => setSpeaking(false);
    utt.onerror = () => setSpeaking(false);
    window.speechSynthesis.speak(utt);
  }, [muted, lang]);

  useEffect(() => {
    synthRef.current = window.speechSynthesis;
    return () => {
      window.speechSynthesis?.cancel();
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setMsgIdx(prev => (prev + 1) % messages.length);
    }, 5000);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [msgIdx, messages.length]);

  useEffect(() => {
    speak(messages[msgIdx]);
  }, [msgIdx, speak, messages]);

  const nextMsg = () => setMsgIdx(prev => (prev + 1) % messages.length);

  if (!visible) return null;

  return (
    <div className="rounded-2xl overflow-hidden shadow-lg" style={{ background: 'linear-gradient(135deg, #1e1b4b, #312e81)' }}>
      {/* Header */}
      <div className="px-4 py-3 flex items-center justify-between border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className={`w-2.5 h-2.5 rounded-full ${speaking ? 'bg-yellow-400 animate-pulse' : 'bg-emerald-400'}`} />
          <span className="text-white text-xs font-bold">🤖 {lang === 'bm' ? 'Ejen Suara DELIMa' : 'DELIMa Voice Agent'}</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMuted(!muted)}
            className="p-1 rounded-lg hover:bg-white/10 transition-colors"
          >
            {muted
              ? <VolumeX className="w-3.5 h-3.5 text-slate-400" />
              : <Volume2 className="w-3.5 h-3.5 text-yellow-300" />}
          </button>
          <button onClick={() => setVisible(false)} className="p-1 rounded-lg hover:bg-white/10 text-slate-400 transition-colors text-xs">
            ✕
          </button>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-start gap-3">
          {/* Robot avatar */}
          <div className="flex-shrink-0">
            <div className="relative w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
              style={{ background: 'rgba(255,255,255,0.1)' }}>
              🤖
              {speaking && (
                <div className="absolute -bottom-1 -right-1 flex gap-0.5 items-end bg-yellow-400 rounded px-1 py-0.5">
                  {[3, 5, 4, 6, 3].map((h, i) => (
                    <div key={i} className="w-0.5 rounded-full bg-yellow-900 animate-bounce"
                      style={{ height: `${h}px`, animationDelay: `${i * 0.1}s` }} />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Message */}
          <div className="flex-1 min-w-0">
            <div className="bg-white/10 rounded-xl px-3 py-2.5 relative">
              <div className="absolute left-0 top-3 -translate-x-1.5 w-2.5 h-2.5 bg-white/10 rotate-45" />
              <p className="text-white text-[11px] leading-relaxed">{messages[msgIdx]}</p>
            </div>
            {/* Dots indicator */}
            <div className="flex gap-1 mt-2 items-center justify-between">
              <div className="flex gap-1">
                {messages.map((_, i) => (
                  <div
                    key={i}
                    className="rounded-full transition-all"
                    style={{
                      width: i === msgIdx ? '16px' : '4px',
                      height: '4px',
                      background: i === msgIdx ? '#facc15' : 'rgba(255,255,255,0.3)',
                    }}
                  />
                ))}
              </div>
              <button
                onClick={nextMsg}
                className="flex items-center gap-1 text-[10px] text-slate-300 hover:text-white transition-colors"
              >
                {lang === 'bm' ? 'Seterusnya' : 'Next'}
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>

        {/* Status chips */}
        <div className="flex flex-wrap gap-1.5 mt-3">
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold"
            style={{ background: 'rgba(255,255,255,0.1)', color: '#86efac' }}>
            ● 6 {lang === 'bm' ? 'Ejen Aktif' : 'Agents Active'}
          </div>
          {isPipelineDone && (
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold"
              style={{ background: 'rgba(255,255,255,0.1)', color: '#fde68a' }}>
              ✓ {lang === 'bm' ? 'Analisis Selesai' : 'Analysis Done'}
            </div>
          )}
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold"
            style={{ background: 'rgba(255,255,255,0.1)', color: '#c4b5fd' }}>
            {student.parentCategory} · {student.state}
          </div>
        </div>
      </div>
    </div>
  );
}
