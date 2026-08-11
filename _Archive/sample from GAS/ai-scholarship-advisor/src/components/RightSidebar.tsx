import { useState } from "react";
import { Scholarship } from "../types";
import { SCHOLARSHIPS } from "../data/mockData";
import { Calendar, Bell, ChevronRight, FileCheck, Landmark, ShieldCheck, CheckSquare, XCircle, Clock } from "lucide-react";

interface RightSidebarProps {
  onApplyClick: (scholarshipName: string) => void;
  lang?: "en" | "my";
}

export default function RightSidebar({ onApplyClick, lang = "my" }: RightSidebarProps) {
  const [shownNotice, setShownNotice] = useState<boolean>(true);

  // Filter scholarships to list deadlines
  const sortedScholarships = [...SCHOLARSHIPS].sort((a, b) => a.deadlineDays - b.deadlineDays);

  return (
    <div id="right-sidebar" className="bg-white rounded-3xl border border-slate-100 shadow-sm p-5 flex flex-col gap-6">
      
      {/* Dynamic Ministry Bulletins / Notice banner */}
      {shownNotice && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 relative font-sans">
          <button
            onClick={() => setShownNotice(false)}
            className="absolute top-2.5 right-2.5 text-amber-500 hover:text-amber-800 transition-all font-bold text-xs"
            title="Dismiss Announcement"
          >
            ✕
          </button>
          <div className="flex gap-2.5 items-start">
            <span className="text-sm font-sans block shrink-0">📢</span>
            <div>
              <h4 className="text-xs font-bold text-amber-900 leading-tight">
                {lang === "en" ? "MoE Portal Announcement" : "Pengumuman Portal KPM"}
              </h4>
              <p className="text-[10px] text-amber-700 leading-relaxed mt-1 font-sans">
                {lang === "en" 
                  ? "The annual scholarship quota has been recalibrated. Ensure SPM results indicators and PAJSK indices are locked prior to 15-June validation runs."
                  : "Kuota biasiswa tahunan telah disesuaikan semula. Sila pastikan indeks keputusan SPM dan markah PAJSK disahkan sebelum tarikh saringan 15 Jun."
                }
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Upcoming Scholarship Deadlines */}
      <div>
        <div className="flex items-center justify-between mb-3.5">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-slate-500" />
            {lang === "en" ? "Upcoming Deadlines" : "Tarikh Tutup Terdekat"}
          </h3>
          <span className="text-[10px] text-red-600 bg-red-50 font-extrabold px-1.5 py-0.5 rounded flex items-center gap-0.5 font-sans animate-pulse">
            <Clock className="w-2.5 h-2.5" />
            {lang === "en" ? "Active" : "Aktif"}
          </span>
        </div>

        <div className="flex flex-col gap-3">
          {sortedScholarships.map((sch) => {
            const isClosingVerySoon = sch.deadlineDays <= 15;
            const progressColor = isClosingVerySoon ? "text-red-600 bg-red-50" : "text-slate-600 bg-slate-100";

            return (
              <div
                key={sch.id}
                className="p-3.5 rounded-xl border border-slate-100 hover:bg-slate-50/50 transition-all flex flex-col gap-2 font-sans"
              >
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <h4 className="font-bold text-xs text-slate-800 leading-tight">
                      {sch.name}
                    </h4>
                    <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-wide">
                      {sch.provider}
                    </p>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded shrink-0 ${progressColor} font-mono`}>
                    {lang === "en" ? `In ${sch.deadlineDays} days` : `${sch.deadlineDays} hari lagi`}
                  </span>
                </div>

                {/* Micro requirement checklist preview */}
                <div className="flex flex-wrap gap-1 mt-1">
                  <span className="text-[9px] text-slate-500 bg-slate-50 px-1.5 py-0.5 rounded font-sans">
                    {lang === "en" ? "Min SPM" : "Gred SPM Minimum"}: {sch.minSpmRequirement.length > 15 ? sch.minSpmRequirement.substring(0, 15) + "..." : sch.minSpmRequirement}
                  </span>
                  <span className="text-[9px] text-slate-500 bg-slate-50 px-1.5 py-0.5 rounded font-sans">
                    PAJSK: {sch.pajskRequirement}%
                  </span>
                </div>

                <button
                  onClick={() => onApplyClick(sch.name)}
                  className="mt-1 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-2xs py-1.5 rounded-lg transition-all flex items-center justify-center gap-1 shadow-xs"
                >
                  {lang === "en" ? "Apply via KPM Portal" : "Mohon di Portal KPM"}
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      <hr className="border-slate-100" />

      {/* Ministry Portal Quicklinks */}
      <div>
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 mb-3">
          <Landmark className="w-4 h-4 text-slate-500" />
          {lang === "en" ? "KPM Unified Portals" : "Portal Bersepadu KPM"}
        </h3>

        <div className="flex flex-col gap-2 font-sans text-2xs">
          <a
            href="https://delima.moe-dl.edu.my"
            target="_blank"
            rel="noreferrer"
            className="p-2.5 rounded-lg bg-slate-50 hover:bg-indigo-50/30 border border-slate-100 hover:border-indigo-100 text-slate-700 hover:text-indigo-700 font-bold flex items-center justify-between transition-all"
          >
            <span className="flex items-center gap-2">
              <span className="text-xs">🏫</span>
              {lang === "en" ? "DELIMa 2.0 Main Dashboard" : "Papan Pemuka Utama DELIMa"}
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          </a>

          <a
            href="https://sps1.moe.gov.my/pajsk"
            target="_blank"
            rel="noreferrer"
            className="p-2.5 rounded-lg bg-slate-50 hover:bg-indigo-50/30 border border-slate-100 hover:border-indigo-100 text-slate-700 hover:text-indigo-700 font-bold flex items-center justify-between transition-all"
          >
            <span className="flex items-center gap-2">
              <span className="text-xs">🏆</span>
              {lang === "en" ? "PAJSK Co-Curricular Registry" : "Sistem Rekod PAJSK & Sukan"}
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          </a>

          <a
            href="https://upu.mohe.gov.my"
            target="_blank"
            rel="noreferrer"
            className="p-2.5 rounded-lg bg-slate-50 hover:bg-indigo-50/30 border border-slate-100 hover:border-indigo-100 text-slate-700 hover:text-indigo-700 font-bold flex items-center justify-between transition-all"
          >
            <span className="flex items-center gap-2">
              <span className="text-xs">🎓</span>
              {lang === "en" ? "UPU Online Higher Education Portal" : "Sistem Kemasukan UPU Online"}
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          </a>
        </div>
      </div>

      <hr className="border-slate-100" />

      {/* Safety Compliance Certifications */}
      <div className="bg-slate-50/70 rounded-xl border border-slate-100 p-4 text-center flex flex-col items-center gap-1.5">
        <ShieldCheck className="w-5 h-5 text-emerald-600" />
        <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest leading-none font-sans">
          {lang === "en" ? "MQA & JPA Certified" : "Diperaku MQA & JPA"}
        </span>
        <p className="text-[9px] text-slate-400 leading-relaxed font-sans mt-0.5">
          {lang === "en" 
            ? "Calculations certified in line with Malaysian Qualifications Framework and civil registry standards."
            : "Sistem perkiraan diperaku selaras dengan Standard Kelayakan Malaysia (MQA) dan perkhidmatan awam (JPA)."
          }
        </p>
      </div>

    </div>
  );
}
