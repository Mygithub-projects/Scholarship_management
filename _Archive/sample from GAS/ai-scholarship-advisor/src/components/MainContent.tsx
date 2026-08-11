import { useState } from "react";
import { StudentProfile, CalculatedMatch, PotentialAnalysis, CareerPathway } from "../types";
import { Award, Brain, Info, Compass, ChevronRight, Activity, Code, ExternalLink, HelpCircle } from "lucide-react";

interface MainContentProps {
  currentStudent: StudentProfile;
  matches: CalculatedMatch[];
  potentials: PotentialAnalysis;
  pathways: CareerPathway[];
  isPipelineRunning: boolean;
  lang?: "en" | "my";
}

export default function MainContent({
  currentStudent,
  matches,
  potentials,
  pathways,
  isPipelineRunning,
  lang = "my",
}: MainContentProps) {
  const [selectedMatchId, setSelectedMatchId] = useState<string | null>(null);

  // Find currently selected scholarship details if user clicked "View Requirements"
  const activeMatchDetails = matches.find(m => m.scholarshipId === selectedMatchId);

  return (
    <div id="dashboard-main-content" className="flex flex-col gap-6 relative">
      {/* Visual pending overlay when Agentic pipeline is running */}
      {isPipelineRunning && (
        <div className="absolute inset-0 bg-white/70 backdrop-blur-xs z-40 rounded-3xl flex flex-col justify-center items-center gap-4 transition-all">
          <div className="p-4 bg-indigo-50 rounded-full border border-indigo-100 flex items-center justify-center animate-spin">
            <Activity className="w-8 h-8 text-indigo-600" />
          </div>
          <div className="text-center">
            <h3 className="font-heading font-bold text-slate-800 text-lg">
              {lang === "en" ? "Agents Synchronizing..." : "Ejen Sedang Menyelaras..."}
            </h3>
            <p className="text-xs text-slate-500 font-sans mt-0.5 px-3">
              {lang === "en" 
                ? "The AI matching agents are cross-compiling grades and co-curricular portfolios."
                : "Ejen padanan pintar sedang menyelaraskan gred keputusan subjek, RIASEC, dan portfolio kokurikulum."
              }
            </p>
          </div>
        </div>
      )}

      {/* Grid containing Card 1 and Card 2 for balanced bento layout spacing */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* CARD 1: Scholarship Match Results */}
        <div id="scholarship-match-results" className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 flex flex-col gap-5">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="font-sans font-extrabold text-slate-900 text-base flex items-center gap-2">
                <span className="p-1 bg-blue-50 text-blue-600 rounded-md text-xs font-bold font-sans">🎓</span>
                {lang === "en" ? "Scholarship Match Results" : "Hasil Padanan Biasiswa"}
              </h2>
              <p className="text-2xs text-slate-400 mt-0.5">
                {lang === "en" 
                  ? "Top recommendations based on academic & co-curricular eligibility indices."
                  : "Syor biasiswa keutamaan berdasarkan indeks Merit SPM, RIASEC, dan aktiviti PAJSK."
                }
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3.5">
            {matches.map((item, index) => {
              // Custom colors based on match rank
              const isFirst = index === 0;
              const isSecond = index === 1;
              const progressColor = isFirst
                ? "bg-gradient-to-r from-blue-600 to-indigo-600"
                : isSecond
                ? "bg-gradient-to-r from-teal-500 to-teal-600"
                : "bg-slate-400";

              return (
                <div
                  key={item.scholarshipId}
                  className={`p-4 rounded-2xl border transition-all ${
                    isFirst
                      ? "bg-gradient-to-br from-indigo-50/20 via-slate-50/30 to-white border-indigo-100"
                      : "bg-white border-slate-100 hover:border-slate-200"
                  }`}
                >
                  <div className="flex justify-between items-start gap-3">
                    <div>
                      <h4 className="font-bold text-sm text-slate-800 leading-tight font-sans">
                        {item.scholarshipName}
                      </h4>
                      <p className="text-2xs font-semibold text-slate-400 mt-1 uppercase tracking-wide">
                        {item.provider}
                      </p>
                    </div>
                    {/* Visual match score marker */}
                    <div className="text-right shrink-0">
                      <span className={`text-base font-black font-sans ${isFirst ? "text-blue-600" : "text-slate-800"}`}>
                        {item.score}%
                      </span>
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none mt-0.5">
                        {lang === "en" ? "Match Score" : "Had Padanan"}
                      </p>
                    </div>
                  </div>

                  {/* Progress gauge */}
                  <div className="w-full bg-slate-100 h-2.5 rounded-full mt-3 overflow-hidden">
                    <div
                      className={`${progressColor} h-full rounded-full transition-all duration-700`}
                      style={{ width: `${item.score}%` }}
                    ></div>
                  </div>

                  {/* Criteria indicators & expand */}
                  <div className="flex justify-between items-center mt-3 pt-2 border-t border-slate-100/60 text-2xs text-slate-500 font-sans">
                    <div className="flex gap-2">
                      <span className="bg-slate-50 px-1.5 py-0.5 rounded text-[10px] font-medium">
                        {lang === "en" ? "Acad" : "Akad"}: <strong className="text-slate-800">{item.breakdown.academic}%</strong>
                      </span>
                      <span className="bg-slate-50 px-1.5 py-0.5 rounded text-[10px] font-medium">
                        PAJSK: <strong className="text-slate-800">{item.breakdown.pajsk}%</strong>
                      </span>
                      <span className="bg-slate-50 px-1.5 py-0.5 rounded text-[10px] font-medium">
                        Fit: <strong className="text-slate-800">{item.breakdown.careerFit}%</strong>
                      </span>
                    </div>

                    <button
                      onClick={() => setSelectedMatchId(selectedMatchId === item.scholarshipId ? null : item.scholarshipId)}
                      className="text-blue-600 hover:underline font-bold flex items-center gap-0.5"
                    >
                      {selectedMatchId === item.scholarshipId 
                        ? (lang === "en" ? "Hide Factors" : "Sembunyi") 
                        : (lang === "en" ? "Why recommended?" : "Mengapa disorot?")
                      }
                      <ChevronRight className="w-3 h-3 rotate-90" />
                    </button>
                  </div>

                  {/* Expand Factors block */}
                  {selectedMatchId === item.scholarshipId && (
                    <div className="mt-3 p-3 bg-slate-50 rounded-xl border border-slate-100 flex flex-col gap-1.5 font-sans animate-fade-in">
                      <h5 className="text-[10px] font-bold text-indigo-900 uppercase tracking-wider mb-1 flex items-center gap-1">
                        <Info className="w-3 h-3 text-indigo-600" />
                        {lang === "en" ? "A.I. Validation Breakdown" : "Pecahan Verifikasi A.I."}
                      </h5>
                      <ul className="space-y-1.5">
                        {item.reasons.map((r, rIdx) => {
                          let translatedReason = r;
                          if (lang === "my") {
                            translatedReason = r
                              .replace("Academic score meets SPM criteria", "Skor akademik memenuhi kriteria SPM")
                              .replace("Co-curricular PAJSK index matches", "Indeks kokurikulum PAJSK munasabah")
                              .replace("matches student's career path", "sepadan dengan haluan kerjaya murid")
                              .replace("Strong leadership index", "Indeks kepimpinan yang tinggi")
                              .replace("High STEM index performance", "Prestasi indeks STEM yang tinggi")
                              .replace("Excellent core subject average", "Purata subjek teras cemerlang");
                          }
                          return (
                            <li key={rIdx} className="text-2xs text-slate-600 flex gap-1.5 items-start leading-relaxed">
                              <span className="text-blue-500 font-bold shrink-0">✦</span>
                              <span>{translatedReason}</span>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* CARD 2: AI Recommendation Summary (Stunning dark-blue highlighted block matching design spec) */}
        <div id="ai-recommendation-advisor" className="bg-gradient-to-br from-indigo-600 to-blue-700 text-white rounded-3xl shadow-md border border-indigo-500/30 p-6 flex flex-col justify-between gap-4 relative overflow-hidden">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
          <div>
            <h2 className="font-sans font-extrabold text-white text-base flex items-center gap-2">
              <span className="mr-0.5">🤖</span>
              {lang === "en" ? "AI Recommendation" : "Utusan Ulasan A.I."}
            </h2>
            <p className="text-[10px] uppercase tracking-widest font-bold opacity-80 mt-1">
              {lang === "en" ? "Analysis Core Synthesis" : "Analisis Sintesis Teras"}
            </p>
          </div>

          <div className="flex-1 flex flex-col justify-between gap-4 leading-relaxed font-sans mt-1">
            <p className="text-sm leading-relaxed text-blue-50 font-sans">
              {lang === "en" ? (
                <>
                  Based on {currentStudent.name.split(" ")[0]}'s <span className="font-bold underline text-white">excellent academic performance</span>, strong PAJSK co-curricular index ({currentStudent.pajskScore}%) and {currentStudent.riasecType.join("-")} career style, sponsorships from JPA, PETRONAS, and Khazanah are highly prioritized. Aptitudes match engineering and digital computing tracks perfectly.
                </>
              ) : (
                <>
                  Berdasarkan pencapaian <span className="font-bold underline text-white">akademik cemerlang</span> {currentStudent.name.split(" ")[0]}, jumlah indeks ko-kurikulum PAJSK ({currentStudent.pajskScore}%) serta kecenderungan personaliti {currentStudent.riasecType.join("-")}, program biasiswa JPA, PETRONAS, dan MARA diletakkan pada keutamaan tinggi. Keserasian subjek menyokong sains data korporat atau rekayasa industri secara jitu.
                </>
              )}
            </p>

            {/* Quality badge warning */}
            <div className="bg-white/10 border border-white/20 p-3 rounded-2xl text-[10px] text-blue-100 leading-normal flex gap-2 items-start backdrop-blur-xs font-sans">
              <span className="bg-white text-blue-600 rounded-full w-4 h-4 block shrink-0 flex items-center justify-center font-bold">
                !
              </span>
              <span>
                {lang === "en" 
                  ? "Simulated adviser brief computed under scholastic sponsor laws. Quotas dynamically updated in synchronization with UPU channels."
                  : "Simulasi ulasan dijana mengikut saringan tajaan. Kuota dilaras secara dinamik mengikut keperluan semasa UPU."
                }
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* Grid containing Card 3 and Card 4 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* CARD 3: Student Potential Analysis */}
        <div id="student-potential-analysis" className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 flex flex-col gap-5">
          <div>
            <h2 className="font-sans font-extrabold text-slate-900 text-base flex items-center gap-2">
              <span className="p-1 bg-blue-50 text-blue-600 rounded-md text-xs font-bold font-sans">📊</span>
              {lang === "en" ? "Student Potential Analysis" : "Analisis Potensi Murid"}
            </h2>
            <p className="text-2xs text-slate-400 mt-0.5">
              {lang === "en" 
                ? "Evaluation metrics measuring academic and co-curricular versatility profiles."
                : "Metrik pengukur aras kecenderungan akademik teras, inovasi, komunikasi, dan kepimpinan."
              }
            </p>
          </div>

          {/* Graphic meters & customized bar charts */}
          <div className="grid grid-cols-2 gap-4">
            {/* STEM indicator */}
            <div className="space-y-1.5 bg-slate-50/60 p-3.5 rounded-2xl border border-slate-100">
              <p className="text-[10px] uppercase font-bold text-slate-400">
                {lang === "en" ? "STEM Potential" : "Potensi STEM"}
              </p>
              <div className="text-2xl sm:text-3xl font-black text-slate-850 tracking-tight leading-none">
                {potentials.stem}%
              </div>
              <div className="overflow-hidden h-1.5 rounded-full bg-slate-200 mt-2">
                <div className="h-full rounded-full bg-blue-500 transition-all duration-500" style={{ width: `${potentials.stem}%` }}></div>
              </div>
            </div>

            {/* Leadership Potential */}
            <div className="space-y-1.5 bg-slate-50/60 p-3.5 rounded-2xl border border-slate-100">
              <p className="text-[10px] uppercase font-bold text-slate-400">
                {lang === "en" ? "Leadership" : "Kepimpinan"}
              </p>
              <div className="text-2xl sm:text-3xl font-black text-slate-850 tracking-tight leading-none">
                {potentials.leadership}%
              </div>
              <div className="overflow-hidden h-1.5 rounded-full bg-slate-200 mt-2">
                <div className="h-full rounded-full bg-indigo-500 transition-all duration-500" style={{ width: `${potentials.leadership}%` }}></div>
              </div>
            </div>

            {/* Innovation potential */}
            <div className="space-y-1.5 bg-slate-50/60 p-3.5 rounded-2xl border border-slate-100">
              <p className="text-[10px] uppercase font-bold text-slate-400">
                {lang === "en" ? "Innovation" : "Inovasi"}
              </p>
              <div className="text-2xl sm:text-3xl font-black text-slate-850 tracking-tight leading-none">
                {potentials.innovation}%
              </div>
              <div className="overflow-hidden h-1.5 rounded-full bg-slate-200 mt-2">
                <div className="h-full rounded-full bg-purple-500 transition-all duration-500" style={{ width: `${potentials.innovation}%` }}></div>
              </div>
            </div>

            {/* Communication Indicator */}
            <div className="space-y-1.5 bg-slate-50/60 p-3.5 rounded-2xl border border-slate-100">
              <p className="text-[10px] uppercase font-bold text-slate-400">
                {lang === "en" ? "Communication" : "Komunikasi"}
              </p>
              <div className="text-2xl sm:text-3xl font-black text-slate-850 tracking-tight leading-none">
                {potentials.communication}%
              </div>
              <div className="overflow-hidden h-1.5 rounded-full bg-slate-200 mt-2 font-sans">
                <div className="h-full rounded-full bg-pink-500 transition-all duration-500" style={{ width: `${potentials.communication}%` }}></div>
              </div>
            </div>

          </div>
        </div>

        {/* CARD 4: Recommended Career Pathways */}
        <div id="recommended-career-pathways" className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 flex flex-col gap-4">
          <div>
            <h2 className="font-sans font-extrabold text-slate-900 text-base flex items-center gap-2 font-sans">
              <span className="p-1 bg-blue-50 text-blue-600 rounded-md text-xs font-bold font-sans">🎯</span>
              {lang === "en" ? "Recommended Career Pathways" : "Cadangan Laluan Kerjaya"}
            </h2>
            <p className="text-2xs text-slate-400 mt-0.5 font-sans">
              {lang === "en" 
                ? "Specific, actionable future directions mapped to psychometric data structures."
                : "Hala tuju terpilih yang munasabah bermula daripada minat personaliti kerjaya RIASEC."
              }
            </p>
          </div>

          <div className="flex flex-wrap gap-2 pt-1 font-sans">
            {pathways.slice(0, 4).map((pw) => {
              let displayLabel = pw.name.split(" & ").pop() || pw.name;
              if (lang === "my") {
                displayLabel = displayLabel
                  .replace("Software Development", "Pembangunan Perisian")
                  .replace("Data Science", "Sains Data")
                  .replace("Mechanical Engineering", "Kejuruteraan Mekanikal")
                  .replace("Automation", "Automasi Industri")
                  .replace("Chemical", "Kejuruteraan Kimia")
                  .replace("Electrical Engineering", "Kejuruteraan Elektrik");
              }
              return (
                <span
                  key={pw.id}
                  className="px-3.5 py-2 bg-slate-100/80 rounded-2xl text-xs font-bold text-slate-700 font-sans border border-slate-100 hover:bg-slate-200 transition-colors"
                >
                  {displayLabel} ({pw.matchPercentage}% {lang === "en" ? "match" : "sesuai"})
                </span>
              );
            })}
          </div>
          <div className="mt-2 text-2xs text-slate-400 font-sans leading-relaxed border-t border-slate-50 pt-2 font-sans">
            {lang === "en"
              ? "Suggested tracks selected based on the student's active subject performance indices and RIASEC personality vectors."
              : "Hala tuju dicadangkan mengikut taburan gred subjek aktif murid serta kecenderungan personaliti RIASEC."
            }
          </div>
        </div>

      </div>
    </div>
  );
}
