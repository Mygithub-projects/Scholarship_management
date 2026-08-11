import { useState } from 'react';
import { ChevronDown, ChevronUp, Award, TrendingUp, Briefcase, Sparkles, ExternalLink } from 'lucide-react';
import { StudentProfile, CalculatedMatch, PotentialAnalysis, CareerPathway, Language } from '../types';

interface MainContentProps {
  student: StudentProfile;
  matches: CalculatedMatch[];
  potentials: PotentialAnalysis;
  careers: CareerPathway[];
  aiReasoning: string;
  lang: Language;
  isPipelineDone: boolean;
  isPipelineRunning: boolean;
  onApply: (scholarshipId: string, scholarshipName: string) => void;
  onRunPipeline?: () => void;
}

function ScoreBar({ value, color }: { value: number; color: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${value}%`, background: color }} />
      </div>
      <span className="text-xs font-bold text-slate-600 w-8 text-right">{value.toFixed(0)}</span>
    </div>
  );
}

function BreakdownBadge({ label, value, weight }: { label: string; value: number; weight: string }) {
  const color = value >= 80 ? '#16a34a' : value >= 60 ? '#2563eb' : '#dc2626';
  return (
    <div className="flex flex-col items-center gap-0.5 min-w-0">
      <div className="text-[9px] font-semibold text-slate-400 uppercase truncate">{label}</div>
      <div className="text-[10px] font-bold px-2 py-0.5 rounded-full text-white" style={{ background: color }}>
        {value.toFixed(0)}
      </div>
      <div className="text-[9px] text-slate-400">{weight}</div>
    </div>
  );
}

export default function MainContent({
  student,
  matches,
  potentials,
  careers,
  aiReasoning,
  lang,
  isPipelineDone,
  isPipelineRunning,
  onApply,
  onRunPipeline,
}: MainContentProps) {
  const [expandedMatch, setExpandedMatch] = useState<string | null>(null);

  const overlayVisible = isPipelineRunning;

  const potentialItems = [
    { key: 'stem', label: lang === 'bm' ? 'Potensi STEM' : 'STEM Potential', value: potentials.stem, color: '#2563eb', icon: '🔬' },
    { key: 'leadership', label: lang === 'bm' ? 'Kepimpinan' : 'Leadership', value: potentials.leadership, color: '#7c3aed', icon: '🏆' },
    { key: 'innovation', label: lang === 'bm' ? 'Inovasi' : 'Innovation', value: potentials.innovation, color: '#ea580c', icon: '💡' },
    { key: 'communication', label: lang === 'bm' ? 'Komunikasi' : 'Communication', value: potentials.communication, color: '#0891b2', icon: '🗣️' },
  ];

  const formatReasoning = (text: string) => {
    return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  };

  // 3 DELIMa-style hero action cards at top
  const heroCards = [
    {
      icon: '🤖',
      labelBm: 'Jalankan Ejen AI',
      labelEn: 'Run AI Agents',
      descBm: 'Analisis 6 faktor padanan biasiswa',
      descEn: 'Analyse 6 scholarship matching factors',
      bg: 'linear-gradient(135deg, #1a56db, #1e40af)',
      action: onRunPipeline,
      badge: isPipelineDone ? (lang === 'bm' ? '✓ Selesai' : '✓ Done') : null,
    },
    {
      icon: '🎓',
      labelBm: 'Semak Biasiswa',
      labelEn: 'View Scholarships',
      descBm: '15 biasiswa tersedia untuk anda',
      descEn: '15 scholarships available for you',
      bg: 'linear-gradient(135deg, #065f46, #059669)',
      action: undefined,
      badge: isPipelineDone ? `${matches.filter(m => m.eligible).length} Layak` : null,
    },
    {
      icon: '📊',
      labelBm: 'Profil Pelajar',
      labelEn: 'Student Profile',
      descBm: `${student.name.split(' ')[0]} · ${student.parentCategory} · ${student.state}`,
      descEn: `${student.name.split(' ')[0]} · ${student.parentCategory} · ${student.state}`,
      bg: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
      action: undefined,
      badge: `PAJSK ${student.pajskScore}%`,
    },
  ];

  return (
    <div className="space-y-4 relative">

      {/* ── 3 HERO ACTION CARDS — DELIMa signature row ── */}
      <div className="grid grid-cols-3 gap-3">
        {heroCards.map((card, i) => (
          <button
            key={i}
            onClick={card.action}
            disabled={!card.action}
            className={`rounded-2xl p-4 text-left transition-all shadow-sm hover:shadow-md ${card.action ? 'hover:scale-[1.02] cursor-pointer' : 'cursor-default'}`}
            style={{ background: card.bg }}
          >
            <div className="text-3xl mb-2">{card.icon}</div>
            <p className="text-white font-bold text-xs leading-tight">
              {lang === 'bm' ? card.labelBm : card.labelEn}
            </p>
            <p className="text-white/70 text-[9px] mt-0.5 leading-tight">
              {lang === 'bm' ? card.descBm : card.descEn}
            </p>
            {card.badge && (
              <span className="mt-2 inline-block text-[9px] font-bold px-2 py-0.5 rounded-full bg-white/20 text-white">
                {card.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Running overlay */}
      {overlayVisible && (
        <div className="absolute inset-0 z-10 rounded-2xl flex items-center justify-center"
          style={{ background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(4px)' }}>
          <div className="text-center">
            <div className="text-4xl mb-3 animate-pulse">🤖</div>
            <p className="text-white font-bold text-sm">
              {lang === 'bm' ? 'Ejen AI sedang memproses...' : 'AI Agents processing...'}
            </p>
            <p className="text-slate-300 text-xs mt-1">
              {lang === 'bm' ? 'Sila tunggu sebentar' : 'Please wait a moment'}
            </p>
          </div>
        </div>
      )}

      {/* Scholarship Match Results */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="px-5 py-4 flex items-center justify-between border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-yellow-500" />
            <h2 className="font-bold text-slate-800 text-sm">
              {lang === 'bm' ? 'Padanan Biasiswa (15 Biasiswa)' : 'Scholarship Matches (15 Scholarships)'}
            </h2>
          </div>
          {isPipelineDone && (
            <span className="text-[10px] font-bold px-2 py-1 rounded-full text-white" style={{ background: '#16a34a' }}>
              ✓ {lang === 'bm' ? 'Dikemas kini' : 'Updated'}
            </span>
          )}
        </div>

        <div className="p-3 space-y-2 max-h-96 overflow-y-auto">
          {matches.length === 0 ? (
            <div className="text-center py-8 text-slate-400 text-sm">
              {lang === 'bm' ? 'Jalankan Ejen AI untuk melihat padanan' : 'Run AI Pipeline to see matches'}
            </div>
          ) : (
            matches.map((match, idx) => (
              <div key={match.scholarshipId}
                className={`rounded-xl border transition-all ${match.eligible ? 'border-slate-200' : 'border-red-100 opacity-70'}`}>
                <div
                  className="flex items-center gap-3 p-3 cursor-pointer"
                  onClick={() => setExpandedMatch(expandedMatch === match.scholarshipId ? null : match.scholarshipId)}
                >
                  {/* Rank */}
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 text-white"
                    style={{
                      background: idx === 0 ? '#f59e0b' : idx === 1 ? '#94a3b8' : idx === 2 ? '#b45309' : '#e2e8f0',
                      color: idx < 3 ? 'white' : '#64748b',
                    }}>
                    {idx + 1}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <p className="text-sm font-bold text-slate-800 truncate">{match.scholarshipName}</p>
                      {!match.eligible && (
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-red-100 text-red-600">
                          {lang === 'bm' ? 'Tidak Layak' : 'Ineligible'}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400">{match.provider}</p>
                    <ScoreBar
                      value={match.score}
                      color={match.score >= 80 ? '#16a34a' : match.score >= 60 ? '#2563eb' : match.score >= 40 ? '#f59e0b' : '#ef4444'}
                    />
                  </div>

                  {/* Score */}
                  <div className="text-right flex-shrink-0">
                    <div className="text-base font-black"
                      style={{ color: match.score >= 80 ? '#16a34a' : match.score >= 60 ? '#2563eb' : '#f59e0b' }}>
                      {match.score.toFixed(1)}%
                    </div>
                    {expandedMatch === match.scholarshipId
                      ? <ChevronUp className="w-3.5 h-3.5 text-slate-400 ml-auto" />
                      : <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-auto" />}
                  </div>
                </div>

                {/* Expanded breakdown */}
                {expandedMatch === match.scholarshipId && (
                  <div className="px-3 pb-3 space-y-3 border-t border-slate-100 pt-3">
                    {/* Breakdown badges */}
                    <div className="flex justify-between gap-1">
                      <BreakdownBadge label={lang === 'bm' ? 'Akad' : 'Acad'} value={match.breakdown.academic} weight="35%" />
                      <BreakdownBadge label="PAJSK" value={match.breakdown.pajsk} weight="20%" />
                      <BreakdownBadge label="RIASEC" value={match.breakdown.psychometric} weight="15%" />
                      <BreakdownBadge label={lang === 'bm' ? 'Aspirasi' : 'Aspir'} value={match.breakdown.aspiration} weight="15%" />
                      <BreakdownBadge label={lang === 'bm' ? 'Keluarga' : 'Parent'} value={match.breakdown.parentBackground} weight="15%" />
                    </div>

                    {/* Reasons */}
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">
                        {lang === 'bm' ? 'Sebab Padanan' : 'Match Reasons'}
                      </p>
                      {match.reasons.map((reason, i) => (
                        <div key={i} className="flex items-start gap-1.5">
                          <span className="text-xs mt-0.5">
                            {i === 0 ? '🎓' : i === 1 ? '🏅' : i === 2 ? '🧠' : i === 3 ? '🎯' : '👨‍👩‍👧'}
                          </span>
                          <p className="text-xs text-slate-600 leading-snug">{reason}</p>
                        </div>
                      ))}
                    </div>

                    {match.eligible && (
                      <button
                        onClick={() => onApply(match.scholarshipId, match.scholarshipName)}
                        className="w-full py-1.5 rounded-lg text-xs font-bold text-white transition-colors flex items-center justify-center gap-1.5"
                        style={{ background: '#003580' }}
                      >
                        <ExternalLink className="w-3 h-3" />
                        {lang === 'bm' ? 'Mohon via Portal KPM' : 'Apply via KPM Portal'}
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* AI Recommendation */}
      {isPipelineDone && aiReasoning && (
        <div className="rounded-2xl p-5 text-white" style={{ background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4338ca 100%)' }}>
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-yellow-300" />
            <h3 className="font-bold text-sm text-yellow-300">
              {lang === 'bm' ? 'Cadangan Ejen AI (6-Faktor)' : 'AI Recommendation (6-Factor Analysis)'}
            </h3>
          </div>
          <div className="flex flex-wrap gap-2 mb-3">
            {['Academic 35%', 'PAJSK 20%', 'RIASEC 15%', 'Aspiration 15%', 'Parent 15%'].map(f => (
              <span key={f} className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: 'rgba(255,255,255,0.15)' }}>
                {f}
              </span>
            ))}
          </div>
          <p
            className="text-slate-200 text-xs leading-relaxed"
            dangerouslySetInnerHTML={{ __html: formatReasoning(aiReasoning) }}
          />
        </div>
      )}

      {/* Student Potential */}
      {isPipelineDone && (
        <div className="bg-white rounded-2xl shadow-sm p-5">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-purple-500" />
            <h3 className="font-bold text-slate-800 text-sm">
              {lang === 'bm' ? 'Analisis Potensi Pelajar' : 'Student Potential Analysis'}
            </h3>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {potentialItems.map(p => (
              <div key={p.key} className="rounded-xl p-3" style={{ background: '#f8fafc' }}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-base">{p.icon}</span>
                    <span className="text-xs font-semibold text-slate-600">{p.label}</span>
                  </div>
                  <span className="text-lg font-black" style={{ color: p.color }}>{p.value}%</span>
                </div>
                <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${p.value}%`, background: p.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Career Pathways */}
      {isPipelineDone && (
        <div className="bg-white rounded-2xl shadow-sm p-5">
          <div className="flex items-center gap-2 mb-4">
            <Briefcase className="w-5 h-5 text-indigo-500" />
            <h3 className="font-bold text-slate-800 text-sm">
              {lang === 'bm' ? 'Laluan Kerjaya Disyorkan' : 'Recommended Career Pathways'}
            </h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {careers.slice(0, 6).map(c => (
              <div key={c.id} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-200 bg-slate-50">
                <span className="text-xs font-semibold text-slate-700">{c.name}</span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full text-white"
                  style={{ background: c.matchPercentage >= 70 ? '#16a34a' : c.matchPercentage >= 50 ? '#2563eb' : '#94a3b8' }}>
                  {c.matchPercentage}%
                </span>
              </div>
            ))}
          </div>

          {/* Top career detail */}
          {careers[0] && (
            <div className="mt-3 rounded-xl p-3" style={{ background: 'linear-gradient(135deg, #eef2ff, #f5f3ff)' }}>
              <p className="text-xs font-bold text-indigo-700 mb-1">🏆 {careers[0].name}</p>
              <p className="text-xs text-slate-600 leading-relaxed">{careers[0].description}</p>
              <div className="flex flex-wrap gap-1 mt-2">
                {careers[0].subjectsNeeded.map(s => (
                  <span key={s} className="text-[10px] px-2 py-0.5 rounded bg-indigo-100 text-indigo-700 font-medium">{s}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Placeholder when pipeline not done */}
      {!isPipelineDone && !isPipelineRunning && (
        <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
          <div className="text-4xl mb-3">🤖</div>
          <p className="text-slate-700 font-bold text-sm mb-1">
            {lang === 'bm' ? 'Jalankan Ejen AI untuk Analisis Penuh' : 'Run AI Pipeline for Full Analysis'}
          </p>
          <p className="text-slate-400 text-xs">
            {lang === 'bm'
              ? 'Klik "Jalankan Ejen AI" di tab Ejen AI untuk memulakan padanan biasiswa 6-faktor'
              : 'Click "Run AI Pipeline" in the AI Agents tab to start 6-factor scholarship matching'}
          </p>
        </div>
      )}
    </div>
  );
}
