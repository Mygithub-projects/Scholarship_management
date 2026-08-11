import { useState } from 'react';
import { Bell, ExternalLink, X, Clock, Mail, CheckCircle2, ChevronRight } from 'lucide-react';
import { Scholarship, Language, NotificationStatus } from '../types';

interface RightSidebarProps {
  scholarships: Scholarship[];
  lang: Language;
  notification: NotificationStatus | null;
  onApply: (id: string, name: string) => void;
}

// Mock announcements — same style as real DELIMa Pengumuman panel
const PENGUMUMAN = [
  { id: 1, date: '12 Nov 2024', title: 'Permohonan Biasiswa JPA Sesi 2025/2026 Dibuka', category: 'Biasiswa', color: '#1a56db' },
  { id: 2, date: '10 Okt 2024', title: 'Taklimat MARA YTP — Daftar Sebelum 30 Nov', category: 'MARA', color: '#dc2626' },
  { id: 3, date: '10 Okt 2024', title: 'Semakan Keputusan SPM 2024 Melalui DELIMa', category: 'SPM', color: '#059669' },
  { id: 4, date: '5 Okt 2024', title: 'PETRONAS PESP 2025 — Syarat & Kelayakan Baru', category: 'PETRONAS', color: '#0891b2' },
  { id: 5, date: '1 Okt 2024', title: 'Khazanah Global Scholarship — Aplikasi Online', category: 'Khazanah', color: '#7c3aed' },
  { id: 6, date: '25 Sep 2024', title: 'Seminar Padanan Biasiswa DELIMa A.I. — Nov 2024', category: 'DELIMa', color: '#d97706' },
  { id: 7, date: '20 Sep 2024', title: 'Kemaskini Sistem PAJSK — Rekod Kokurikulum', category: 'PAJSK', color: '#065f46' },
  { id: 8, date: '15 Sep 2024', title: 'Biasiswa Guru KPM 2025 — Permohonan Kini Dibuka', category: 'KPM', color: '#003580' },
];

export default function RightSidebar({ scholarships, lang, notification, onApply }: RightSidebarProps) {
  const [dismissed, setDismissed] = useState(false);
  const [showAllAnn, setShowAllAnn] = useState(false);
  const [showAllDeadlines, setShowAllDeadlines] = useState(false);

  const sorted = [...scholarships].sort((a, b) => a.deadlineDays - b.deadlineDays);
  const visibleScholarships = showAllDeadlines ? sorted : sorted.slice(0, 5);
  const visibleAnn = showAllAnn ? PENGUMUMAN : PENGUMUMAN.slice(0, 5);

  const urgencyColor = (days: number) => {
    if (days <= 14) return { bg: '#fee2e2', text: '#dc2626' };
    if (days <= 25) return { bg: '#fef3c7', text: '#d97706' };
    return { bg: '#dcfce7', text: '#16a34a' };
  };

  return (
    <div className="space-y-3">

      {/* ── AGENT 6 NOTIFICATION (shown when pipeline done) ── */}
      {notification && (
        <div className="rounded-2xl overflow-hidden shadow-sm" style={{ border: '1px solid #a7f3d0' }}>
          <div className="px-3 py-2 flex items-center gap-2" style={{ background: '#064e3b' }}>
            <Mail className="w-4 h-4 text-emerald-300" />
            <span className="text-[11px] font-bold text-emerald-200">
              {lang === 'bm' ? 'Ejen 6 — Notifikasi Dihantar' : 'Agent 6 — Notification Sent'}
            </span>
          </div>
          <div className="p-3" style={{ background: '#f0fdf4' }}>
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span className="text-xs font-bold text-emerald-700">
                {lang === 'bm' ? 'E-mel Berjaya Dihantar' : 'Email Sent Successfully'}
              </span>
            </div>
            <div className="space-y-1 text-[10px] text-slate-600 mb-2">
              <div><span className="text-slate-400 w-10 inline-block">To:</span> <span className="font-mono text-emerald-700 text-[9px]">{notification.email}</span></div>
              <div><span className="text-slate-400 w-10 inline-block">Masa:</span> <span>{notification.timestamp}</span></div>
              <div><span className="text-slate-400 w-10 inline-block">Skor:</span> <span className="font-bold text-emerald-700">{notification.matchScore.toFixed(1)}%</span></div>
            </div>
            <div className="rounded-lg px-2.5 py-1.5 text-[10px] text-emerald-800 font-medium" style={{ background: '#d1fae5' }}>
              🏆 {lang === 'bm' ? 'Cadangan Utama:' : 'Top Recommendation:'} <strong>{notification.topScholarship}</strong>
            </div>
          </div>
        </div>
      )}

      {/* ── PENGUMUMAN — exact real DELIMa right panel style ── */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden" style={{ border: '1px solid #e5e7eb' }}>

        {/* Header — blue background like real DELIMa */}
        <div className="px-4 py-3 flex items-center justify-between" style={{ background: '#1a56db' }}>
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-white" />
            <h3 className="font-bold text-white text-xs tracking-wide">
              {lang === 'bm' ? 'Pengumuman' : 'Announcements'}
            </h3>
          </div>
          <span className="text-[10px] font-black px-2 py-0.5 rounded-full text-blue-700 bg-white">
            {PENGUMUMAN.length}
          </span>
        </div>

        {/* KPM announcement banner */}
        {!dismissed && (
          <div className="mx-3 mt-3 rounded-xl p-2.5 flex items-start gap-2" style={{ background: '#fffbeb', border: '1px solid #fde68a' }}>
            <span className="text-sm flex-shrink-0">📢</span>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-bold text-amber-800 leading-tight">
                {lang === 'bm' ? 'Portal Biasiswa KPM 2025' : 'KPM Scholarship Portal 2025'}
              </p>
              <p className="text-[9px] text-amber-700 mt-0.5 leading-snug">
                {lang === 'bm'
                  ? 'Sesi permohonan baru telah dibuka. Semak kelayakan anda.'
                  : 'New application session now open. Check your eligibility.'}
              </p>
            </div>
            <button onClick={() => setDismissed(true)} className="text-amber-400 flex-shrink-0">
              <X className="w-3 h-3" />
            </button>
          </div>
        )}

        {/* Announcements list — DELIMa style: date + colored left border */}
        <div className="p-3 space-y-1.5">
          {visibleAnn.map(ann => (
            <div
              key={ann.id}
              className="flex items-start gap-2 p-2 rounded-lg cursor-pointer transition-colors hover:bg-slate-50"
              style={{ borderLeft: `3px solid ${ann.color}` }}
            >
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-semibold text-slate-700 leading-tight line-clamp-2">{ann.title}</p>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="text-[8px] font-bold px-1.5 py-0.5 rounded" style={{ background: ann.color + '20', color: ann.color }}>
                    {ann.category}
                  </span>
                  <span className="text-[8px] text-slate-400">{ann.date}</span>
                </div>
              </div>
              <ChevronRight className="w-3 h-3 text-slate-300 flex-shrink-0 mt-1" />
            </div>
          ))}
        </div>

        <div className="px-3 pb-3">
          <button
            onClick={() => setShowAllAnn(!showAllAnn)}
            className="w-full py-1.5 text-[10px] font-bold rounded-lg transition-colors"
            style={{ background: '#f1f5f9', color: '#1a56db' }}
          >
            {showAllAnn
              ? (lang === 'bm' ? '↑ Tunjuk Kurang' : '↑ Show Less')
              : (lang === 'bm' ? `Lihat Semua (${PENGUMUMAN.length}) →` : `View All (${PENGUMUMAN.length}) →`)}
          </button>
        </div>
      </div>

      {/* ── TARIKH TUTUP BIASISWA ── */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden" style={{ border: '1px solid #e5e7eb' }}>
        <div className="px-4 py-3 flex items-center justify-between" style={{ borderBottom: '1px solid #f3f4f6' }}>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-red-500" />
            <h3 className="font-bold text-slate-800 text-xs">
              {lang === 'bm' ? 'Tarikh Tutup Biasiswa' : 'Scholarship Deadlines'}
            </h3>
          </div>
          <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
        </div>

        <div className="p-3 space-y-1.5">
          {visibleScholarships.map(s => {
            const uc = urgencyColor(s.deadlineDays);
            return (
              <div key={s.id} className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-50 transition-colors">
                <div className="w-1 h-8 rounded-full flex-shrink-0" style={{ background: s.deadlineDays <= 14 ? '#dc2626' : s.deadlineDays <= 25 ? '#d97706' : '#16a34a' }} />
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-bold text-slate-700 truncate leading-tight">{s.name}</p>
                  <p className="text-[8px] text-slate-400 truncate">{s.provider}</p>
                </div>
                <div className="text-[10px] font-bold px-1.5 py-0.5 rounded flex-shrink-0" style={{ background: uc.bg, color: uc.text }}>
                  {s.deadlineDays}{lang === 'bm' ? 'h' : 'd'}
                </div>
              </div>
            );
          })}
        </div>

        {sorted.length > 5 && (
          <div className="px-3 pb-3">
            <button
              onClick={() => setShowAllDeadlines(!showAllDeadlines)}
              className="w-full py-1.5 text-[10px] font-bold rounded-lg"
              style={{ background: '#f1f5f9', color: '#475569' }}
            >
              {showAllDeadlines ? '↑ Kurang' : `↓ ${lang === 'bm' ? 'Semua' : 'All'} (${sorted.length})`}
            </button>
          </div>
        )}
      </div>

      {/* ── APPLY QUICK BUTTONS ── */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden" style={{ border: '1px solid #e5e7eb' }}>
        <div className="px-4 py-3" style={{ borderBottom: '1px solid #f3f4f6' }}>
          <h3 className="font-bold text-slate-800 text-xs">
            🚨 {lang === 'bm' ? 'Mohon Sekarang' : 'Apply Now'}
          </h3>
        </div>
        <div className="p-3 space-y-2">
          {sorted.slice(0, 3).map(s => (
            <button
              key={s.id}
              onClick={() => onApply(s.id, s.name)}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-left transition-opacity hover:opacity-90"
              style={{ background: 'linear-gradient(90deg, #1e3a5f, #1a56db)' }}
            >
              <div className="flex-1 min-w-0">
                <p className="text-white text-[10px] font-bold leading-tight truncate">{s.name}</p>
                <p className="text-blue-200 text-[9px]">{s.amount}</p>
              </div>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded flex-shrink-0" style={{ background: '#dc2626', color: 'white' }}>
                {s.deadlineDays}{lang === 'bm' ? 'h' : 'd'}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* ── PORTAL RASMI KPM ── */}
      <div className="bg-white rounded-2xl shadow-sm p-4" style={{ border: '1px solid #e5e7eb' }}>
        <h3 className="font-bold text-slate-700 text-xs mb-3 flex items-center gap-2">
          <ExternalLink className="w-3.5 h-3.5 text-blue-500" />
          {lang === 'bm' ? 'Portal Rasmi KPM' : 'KPM Official Portals'}
        </h3>
        <div className="space-y-1.5">
          {[
            { label: 'DELIMa 2.0 Dashboard', color: '#1a56db', icon: '🏫' },
            { label: 'PAJSK Sistem Rekod', color: '#7c3aed', icon: '🏅' },
            { label: 'UPU Online', color: '#0891b2', icon: '🎓' },
            { label: 'MyScholarship Portal', color: '#16a34a', icon: '🏛️' },
          ].map(link => (
            <div
              key={link.label}
              className="flex items-center justify-between px-3 py-2 rounded-xl cursor-pointer hover:opacity-90 transition-opacity"
              style={{ background: link.color }}
            >
              <span className="text-white text-[10px] font-bold flex items-center gap-1.5">
                <span>{link.icon}</span> {link.label}
              </span>
              <ExternalLink className="w-3 h-3 text-white/70" />
            </div>
          ))}
        </div>
      </div>

      {/* Compliance */}
      <div className="rounded-xl p-3 text-center" style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}>
        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
          {lang === 'bm' ? 'Pematuhan & Verifikasi' : 'Compliance & Verified'}
        </p>
        <div className="flex flex-wrap gap-1 justify-center">
          {['MQA', 'JPA', 'PDPA', 'KPM v2.15'].map(b => (
            <span key={b} className="text-[9px] font-semibold px-2 py-0.5 rounded bg-slate-200 text-slate-600">{b}</span>
          ))}
        </div>
      </div>

    </div>
  );
}
