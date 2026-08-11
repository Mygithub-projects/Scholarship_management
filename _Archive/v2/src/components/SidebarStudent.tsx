import { useState } from 'react';
import { ChevronDown, ChevronUp, Edit3, CreditCard, MapPin, Check } from 'lucide-react';
import { StudentProfile, SpmGrade, LeadershipLevel, ParentCategory, Language } from '../types';
import { STUDENTS } from '../data/mockData';

interface SidebarStudentProps {
  student: StudentProfile;
  onStudentChange: (s: StudentProfile) => void;
  lang: Language;
  locked?: boolean; // true = student is logged in, hide selector & student change
}

const GRADE_OPTIONS: SpmGrade[] = ['A+', 'A', 'A-', 'B+', 'B', 'C+', 'C', 'D', 'E'];

const CATEGORY_COLORS: Record<ParentCategory, { bg: string; text: string }> = {
  B40: { bg: '#dc2626', text: 'white' },
  M40: { bg: '#2563eb', text: 'white' },
  T20: { bg: '#16a34a', text: 'white' },
};

export default function SidebarStudent({ student, onStudentChange, lang, locked = false }: SidebarStudentProps) {
  const [expandParams, setExpandParams] = useState(false);
  const [expandAspiration, setExpandAspiration] = useState(false);
  const [showSelector, setShowSelector] = useState(false);

  const updateField = <K extends keyof StudentProfile>(key: K, val: StudentProfile[K]) => {
    onStudentChange({ ...student, [key]: val });
  };

  const updateGrade = (subject: string, grade: SpmGrade) => {
    onStudentChange({ ...student, spmGrades: { ...student.spmGrades, [subject]: grade } });
  };

  const catStyle = CATEGORY_COLORS[student.parentCategory];
  const aPlusCount = Object.values(student.spmGrades).filter(g => g === 'A+').length;
  const aCount = Object.values(student.spmGrades).filter(g => g === 'A').length;
  const aMinusCount = Object.values(student.spmGrades).filter(g => g === 'A-').length;

  return (
    <div className="space-y-2">

      {/* ── DIGITAL ME CARD — real DELIMa style ── */}
      <div className="rounded-2xl overflow-hidden shadow-lg" style={{ border: '2px solid rgba(255,255,255,0.2)' }}>

        {/* Top banner: teal/green like real DELIMa */}
        <div style={{ background: 'linear-gradient(135deg, #065f46, #059669)' }} className="px-3 py-2.5 text-center">
          <div className="flex items-center justify-center gap-2">
            <span className="text-white text-[11px] font-bold tracking-wide">🛡️ DIGITAL ME</span>
            <span
              className="text-[9px] font-black px-1.5 py-0.5 rounded"
              style={{ background: catStyle.bg, color: catStyle.text }}
            >
              {student.parentCategory}
            </span>
          </div>
        </div>

        {/* Yellow card body */}
        <div style={{ background: 'linear-gradient(180deg, #fef08a, #fde047 60%, #facc15)' }} className="px-4 pt-3 pb-4">

          {/* Avatar + student selector button */}
          <div className="flex items-start gap-3 mb-3">
            <div
              className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl flex-shrink-0 shadow-md"
              style={{ background: 'rgba(255,255,255,0.5)' }}
            >
              {student.avatar}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-black text-slate-900 text-sm leading-tight uppercase truncate">{student.name}</p>
              <p className="text-slate-700 text-[10px] leading-tight mt-0.5 line-clamp-2">{student.school}</p>
              {!locked && (
                <button
                  onClick={() => setShowSelector(!showSelector)}
                  className="mt-1.5 flex items-center gap-1 text-[10px] font-bold text-slate-600 hover:text-slate-900"
                >
                  <Edit3 className="w-3 h-3" />
                  {lang === 'bm' ? 'Tukar Pelajar' : 'Change Student'}
                </button>
              )}
            </div>
          </div>

          {/* Student selector dropdown — hidden when student is locked (logged-in mode) */}
          {showSelector && !locked && (
            <div className="mb-3 bg-white/70 rounded-xl p-2 backdrop-blur-sm">
              <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">
                {lang === 'bm' ? 'Pilih Rekod Pelajar' : 'Select Student Record'}
              </p>
              <div className="grid grid-cols-2 gap-1">
                {STUDENTS.map(s => (
                  <button
                    key={s.id}
                    onClick={() => { onStudentChange(s); setShowSelector(false); }}
                    className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-[10px] font-semibold text-left transition-all ${
                      s.id === student.id ? 'text-white shadow-sm' : 'bg-white/60 text-slate-600 hover:bg-white'
                    }`}
                    style={s.id === student.id ? { background: '#1a56db' } : {}}
                  >
                    <span>{s.avatar}</span>
                    <span className="truncate">{s.name.split(' ')[0]}</span>
                    {s.id === student.id && <Check className="w-3 h-3 ml-auto flex-shrink-0" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* IC & Negeri */}
          <div className="grid grid-cols-2 gap-1.5 mb-2">
            <div className="bg-white/50 rounded-lg px-2 py-1.5">
              <div className="flex items-center gap-1 mb-0.5">
                <CreditCard className="w-2.5 h-2.5 text-slate-600" />
                <span className="text-[8px] text-slate-600 font-bold uppercase">No. IC</span>
              </div>
              <p className="text-slate-900 text-[9px] font-mono font-bold">{student.icNumber}</p>
            </div>
            <div className="bg-white/50 rounded-lg px-2 py-1.5">
              <div className="flex items-center gap-1 mb-0.5">
                <MapPin className="w-2.5 h-2.5 text-slate-600" />
                <span className="text-[8px] text-slate-600 font-bold uppercase">Negeri</span>
              </div>
              <p className="text-slate-900 text-[9px] font-bold">{student.state}</p>
            </div>
          </div>

          {/* SPM summary */}
          <div className="bg-white/50 rounded-lg px-2.5 py-2 mb-2">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-bold text-slate-700">Keputusan SPM</span>
              <div className="flex gap-1.5 text-[10px] font-black text-slate-900">
                {aPlusCount > 0 && <span style={{ color: '#16a34a' }}>{aPlusCount}A+</span>}
                {aCount > 0 && <span style={{ color: '#2563eb' }}>{aCount}A</span>}
                {aMinusCount > 0 && <span style={{ color: '#7c3aed' }}>{aMinusCount}A-</span>}
              </div>
            </div>
            <div className="flex gap-0.5 flex-wrap">
              {Object.entries(student.spmGrades).map(([subj, grade]) => (
                <span
                  key={subj}
                  title={subj}
                  className="text-[9px] font-bold px-1 py-0.5 rounded"
                  style={{
                    background:
                      grade === 'A+' ? '#16a34a' :
                      grade === 'A' ? '#2563eb' :
                      grade === 'A-' ? '#7c3aed' :
                      grade.startsWith('B') ? '#d97706' : '#dc2626',
                    color: 'white',
                  }}
                >
                  {grade}
                </span>
              ))}
            </div>
          </div>

          {/* PAJSK bar */}
          <div className="bg-white/50 rounded-lg px-2.5 py-2 mb-2">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-bold text-slate-700">PAJSK</span>
              <div className="flex items-center gap-1.5">
                {student.pajskData && (
                  <span className="text-[8px] font-bold px-1.5 py-0.5 rounded"
                    style={{ background: '#1e3a5f', color: 'white' }}>
                    {student.pajskData.markah}/110
                  </span>
                )}
                <span className="text-[10px] font-black text-slate-900">{student.pajskScore.toFixed(1)}%</span>
              </div>
            </div>
            <div className="h-2.5 bg-white/60 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${Math.min(student.pajskScore, 100)}%`,
                  background: student.pajskScore >= 85 ? '#16a34a' : student.pajskScore >= 70 ? '#2563eb' : '#f59e0b',
                }}
              />
            </div>
            {/* Real PAJSK breakdown — sukan / kelab / badan beruniform */}
            {student.pajskData && (
              <div className="mt-2 space-y-1">
                <div className="flex items-start gap-1.5">
                  <span className="text-[8px] font-bold text-slate-500 w-16 flex-shrink-0 pt-0.5">⚽ Sukan</span>
                  <div>
                    <p className="text-[9px] font-bold text-slate-800 leading-tight">{student.pajskData.sukan}</p>
                    <p className="text-[8px] text-slate-500">{student.pajskData.jawatanSukan} · {student.pajskData.peringkatSukan}</p>
                  </div>
                </div>
                <div className="flex items-start gap-1.5">
                  <span className="text-[8px] font-bold text-slate-500 w-16 flex-shrink-0 pt-0.5">🏛️ Kelab</span>
                  <div>
                    <p className="text-[9px] font-bold text-slate-800 leading-tight">{student.pajskData.kelab}</p>
                    <p className="text-[8px] text-slate-500">{student.pajskData.jawatanKelab} · {student.pajskData.peringkatKelab}</p>
                  </div>
                </div>
                <div className="flex items-start gap-1.5">
                  <span className="text-[8px] font-bold text-slate-500 w-16 flex-shrink-0 pt-0.5">🎖️ BB</span>
                  <div>
                    <p className="text-[9px] font-bold text-slate-800 leading-tight">{student.pajskData.badanBeruniform}</p>
                    <p className="text-[8px] text-slate-500">{student.pajskData.jawatanBB} · {student.pajskData.peringkatBB}</p>
                  </div>
                </div>
                <div className="mt-1 rounded-lg px-2 py-1.5"
                  style={{ background: student.pajskData.pencapaian.startsWith('JOHAN') ? '#dcfce7' : student.pajskData.pencapaian.startsWith('NAIB') ? '#dbeafe' : '#f3f4f6' }}>
                  <p className="text-[9px] font-black"
                    style={{ color: student.pajskData.pencapaian.startsWith('JOHAN') ? '#16a34a' : student.pajskData.pencapaian.startsWith('NAIB') ? '#2563eb' : '#6b7280' }}>
                    🏆 {student.pajskData.pencapaian}
                  </p>
                  {student.pajskData.anugerahKhas && (
                    <p className="text-[8px] text-amber-700 font-semibold mt-0.5">⭐ {student.pajskData.anugerahKhas}</p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* RIASEC + Leadership */}
          <div className="flex flex-wrap gap-1 mb-2">
            {student.riasecType.map(r => (
              <span key={r} className="text-[9px] font-bold px-2 py-0.5 rounded-full"
                style={{ background: '#1e3a5f', color: 'white' }}>
                {r}
              </span>
            ))}
            <span className="text-[9px] font-semibold px-2 py-0.5 rounded-full bg-white/60 text-slate-700">
              Ldr: {student.leadershipLevel}
            </span>
          </div>

          {/* Dream career */}
          <div className="bg-white/50 rounded-lg px-2.5 py-1.5">
            <p className="text-[8px] font-bold text-slate-500 uppercase tracking-wide">
              {lang === 'bm' ? 'Impian Kerjaya' : 'Dream Career'}
            </p>
            <p className="text-[11px] font-bold text-slate-800">🎯 {student.dreamCareer}</p>
          </div>
        </div>
      </div>

      {/* ── ASPIRATION PANEL ── */}
      <div className="rounded-xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)' }}>
        <button
          onClick={() => setExpandAspiration(!expandAspiration)}
          className="w-full flex items-center justify-between px-3 py-2.5 text-white"
        >
          <span className="text-[11px] font-bold flex items-center gap-2">🎯 {lang === 'bm' ? 'Profil Aspirasi' : 'Aspiration Profile'}</span>
          {expandAspiration ? <ChevronUp className="w-3.5 h-3.5 text-blue-200" /> : <ChevronDown className="w-3.5 h-3.5 text-blue-200" />}
        </button>

        {expandAspiration && (
          <div className="px-3 pb-3 space-y-2">
            <div>
              <label className="block text-[9px] font-bold text-blue-200 uppercase tracking-wide mb-1">
                {lang === 'bm' ? 'Impian Kerjaya' : 'Dream Career'}
              </label>
              <input
                className="w-full text-xs rounded-lg px-2.5 py-1.5 font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-300"
                style={{ background: 'rgba(255,255,255,0.9)', border: '1px solid rgba(255,255,255,0.3)' }}
                value={student.dreamCareer}
                onChange={e => updateField('dreamCareer', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-[9px] font-bold text-blue-200 uppercase tracking-wide mb-1">
                {lang === 'bm' ? 'Bidang Pilihan' : 'Preferred Field'}
              </label>
              <input
                className="w-full text-xs rounded-lg px-2.5 py-1.5 font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-300"
                style={{ background: 'rgba(255,255,255,0.9)', border: '1px solid rgba(255,255,255,0.3)' }}
                value={student.preferredField}
                onChange={e => updateField('preferredField', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-[9px] font-bold text-blue-200 uppercase tracking-wide mb-1">RIASEC</label>
              <div className="flex flex-wrap gap-1">
                {(['Realistic', 'Investigative', 'Artistic', 'Social', 'Enterprising', 'Conventional'] as const).map(r => (
                  <button
                    key={r}
                    onClick={() => {
                      const has = student.riasecType.includes(r);
                      const updated = has ? student.riasecType.filter(x => x !== r) : [...student.riasecType, r].slice(0, 3);
                      updateField('riasecType', updated);
                    }}
                    className={`text-[9px] font-bold px-2 py-0.5 rounded-full border transition-colors ${
                      student.riasecType.includes(r)
                        ? 'text-white border-transparent'
                        : 'text-blue-200 border-blue-300/40 hover:bg-white/10'
                    }`}
                    style={student.riasecType.includes(r) ? { background: '#1e3a5f' } : {}}
                  >
                    {r[0]}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── PARENT BACKGROUND ── */}
      <div className="rounded-xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)' }}>
        <div className="px-3 py-2.5">
          <p className="text-[11px] font-bold text-white mb-2">👨‍👩‍👧 {lang === 'bm' ? 'Kategori Keluarga' : 'Parent Category'}</p>
          <div className="grid grid-cols-3 gap-1.5">
            {(['B40', 'M40', 'T20'] as ParentCategory[]).map(cat => {
              const c = CATEGORY_COLORS[cat];
              const selected = student.parentCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => updateField('parentCategory', cat)}
                  className={`py-2 rounded-lg text-xs font-black transition-all ${selected ? 'shadow-lg' : 'opacity-50 hover:opacity-80'}`}
                  style={{ background: selected ? c.bg : 'rgba(255,255,255,0.1)', color: selected ? c.text : '#93c5fd' }}
                >
                  {cat}
                </button>
              );
            })}
          </div>
          <p className="text-[9px] text-blue-200 text-center mt-1.5">
            {student.parentCategory === 'B40' && '< RM4,850/bulan'}
            {student.parentCategory === 'M40' && 'RM4,850 – RM10,970/bulan'}
            {student.parentCategory === 'T20' && '> RM10,970/bulan'}
          </p>
        </div>
      </div>

      {/* ── EDIT PARAMETERS ── */}
      <div className="rounded-xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)' }}>
        <button
          onClick={() => setExpandParams(!expandParams)}
          className="w-full flex items-center justify-between px-3 py-2.5 text-white"
        >
          <span className="text-[11px] font-bold flex items-center gap-2">
            <Edit3 className="w-3.5 h-3.5" />
            {lang === 'bm' ? 'Edit SPM / PAJSK' : 'Edit SPM / PAJSK'}
          </span>
          {expandParams ? <ChevronUp className="w-3.5 h-3.5 text-blue-200" /> : <ChevronDown className="w-3.5 h-3.5 text-blue-200" />}
        </button>

        {expandParams && (
          <div className="px-3 pb-3 space-y-2.5">
            {/* PAJSK Slider */}
            <div>
              <div className="flex justify-between mb-1">
                <label className="text-[9px] font-bold text-blue-200 uppercase tracking-wide">PAJSK</label>
                <span className="text-[10px] font-bold text-white">{student.pajskScore}/100</span>
              </div>
              <input
                type="range" min={55} max={100}
                value={student.pajskScore}
                onChange={e => updateField('pajskScore', Number(e.target.value))}
                className="w-full"
                style={{ accentColor: '#60a5fa' }}
              />
            </div>

            {/* Leadership */}
            <div>
              <label className="block text-[9px] font-bold text-blue-200 uppercase tracking-wide mb-1">
                {lang === 'bm' ? 'Kepimpinan' : 'Leadership'}
              </label>
              <div className="flex gap-1">
                {(['Basic', 'Medium', 'High'] as LeadershipLevel[]).map(l => (
                  <button
                    key={l}
                    onClick={() => updateField('leadershipLevel', l)}
                    className={`flex-1 py-1.5 rounded-lg text-[9px] font-bold transition-colors`}
                    style={{
                      background: student.leadershipLevel === l ? '#1a56db' : 'rgba(255,255,255,0.1)',
                      color: student.leadershipLevel === l ? 'white' : '#93c5fd',
                    }}
                  >
                    {lang === 'bm' ? (l === 'Basic' ? 'Asas' : l === 'Medium' ? 'Sederhana' : 'Tinggi') : l}
                  </button>
                ))}
              </div>
            </div>

            {/* SPM Grades */}
            <div>
              <label className="block text-[9px] font-bold text-blue-200 uppercase tracking-wide mb-1">
                {lang === 'bm' ? 'Gred SPM' : 'SPM Grades'}
              </label>
              <div className="space-y-1 max-h-44 overflow-y-auto pr-0.5">
                {Object.entries(student.spmGrades).map(([subj, grade]) => (
                  <div key={subj} className="flex items-center justify-between gap-2">
                    <span className="text-[9px] text-blue-100 truncate flex-1">{subj}</span>
                    <select
                      value={grade}
                      onChange={e => updateGrade(subj, e.target.value as SpmGrade)}
                      className="text-[10px] rounded px-1 py-0.5 font-bold focus:outline-none"
                      style={{ background: 'rgba(255,255,255,0.9)', color: '#1e3a5f', border: 'none' }}
                    >
                      {GRADE_OPTIONS.map(g => <option key={g} value={g}>{g}</option>)}
                    </select>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
