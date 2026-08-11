import { useState } from "react";
import { StudentProfile } from "../types";
import { STUDENT_PROFILES } from "../data/mockData";
import { evaluateAcademicScore } from "../utils/matchingEngine";
import { Edit3, Check, Award, GraduationCap, ShieldAlert, BookOpen, Layers, Users, X } from "lucide-react";

interface SidebarStudentProps {
  currentStudent: StudentProfile;
  onSelectStudent: (id: string) => void;
  onUpdateStudent: (updated: StudentProfile) => void;
  lang?: "en" | "my";
}

export default function SidebarStudent({
  currentStudent,
  onSelectStudent,
  onUpdateStudent,
  lang = "my",
}: SidebarStudentProps) {
  const [isEditing, setIsEditing] = useState(false);
  const acadEvaluation = evaluateAcademicScore(currentStudent.spmGrades);

  // Available subjects for the editor
  const availableSubjects = [
    "Bahasa Melayu",
    "English",
    "Sejarah",
    "Mathematics",
    "Add Mathematics",
    "Physics",
    "Chemistry",
    "Biology",
    "Sains Am",
    "Pendidikan Islam",
    "Pendidikan Moral"
  ];

  const gradesOptions = ["A+", "A", "A-", "B+", "B", "C+", "C", "D", "E", "G"];

  const handleGradeChange = (subject: string, grade: string) => {
    const updatedGrades = { ...currentStudent.spmGrades };
    if (grade === "None") {
      delete updatedGrades[subject];
    } else {
      updatedGrades[subject] = grade;
    }
    onUpdateStudent({
      ...currentStudent,
      spmGrades: updatedGrades,
    });
  };

  const handlePajskChange = (val: number) => {
    onUpdateStudent({
      ...currentStudent,
      pajskScore: val,
    });
  };

  const handleLeadershipChange = (lvl: "High" | "Medium" | "Basic") => {
    onUpdateStudent({
      ...currentStudent,
      leadershipLevel: lvl,
    });
  };

  const addAchievement = () => {
    onUpdateStudent({
      ...currentStudent,
      keyAchievements: [...currentStudent.keyAchievements, "New achievement item..."],
    });
  };

  const updateAchievement = (index: number, val: string) => {
    const updated = [...currentStudent.keyAchievements];
    updated[index] = val;
    onUpdateStudent({
      ...currentStudent,
      keyAchievements: updated,
    });
  };

  const removeAchievement = (index: number) => {
    const updated = currentStudent.keyAchievements.filter((_, i) => i !== index);
    onUpdateStudent({
      ...currentStudent,
      keyAchievements: updated,
    });
  };

  return (
    <div id="student-sidebar" className="bg-white rounded-3xl border border-slate-100 shadow-sm p-5 flex flex-col gap-6">
      {/* Profiler Selector */}
      <div>
        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2 font-sans">
          {lang === "en" ? "Select Student Record File (Simulated)" : "Pilih Fail Profil Murid (Simulasi)"}
        </label>
        <div className="grid grid-cols-2 gap-2">
          {STUDENT_PROFILES.map((student) => {
            const isSelected = student.id === currentStudent.id;
            return (
              <button
                key={student.id}
                onClick={() => onSelectStudent(student.id)}
                className={`py-2 px-3 rounded-lg text-xs font-semibold transition-all text-left truncate flex items-center justify-between ${
                  isSelected
                    ? "bg-indigo-50 border border-indigo-200 text-indigo-700 font-bold"
                    : "bg-slate-50 border border-transparent text-slate-600 hover:bg-slate-100"
                }`}
              >
                <span>{student.name.split(" ")[0]}</span>
                {isSelected && <Check className="w-3.5 h-3.5 text-indigo-600 block shrink-0 ml-1" />}
              </button>
            );
          })}
        </div>
      </div>

      <hr className="border-slate-100" />

      {/* Main Student Profile Summary - Styled like authentic DELIMa screenshot */}
      <div className="flex flex-col rounded-3xl overflow-hidden border border-rose-100 shadow-xs bg-slate-50/20">
        
        {/* Top Banner: Coral/Pink "Salam Sejahtera" */}
        <div className="bg-[#fee2e2] p-4 text-center relative">
          <span className="text-sm font-extrabold text-[#991b1b] tracking-wide font-sans block">
            {lang === "en" ? "Warm Greetings" : "Salam Sejahtera"}
          </span>
          <p className="text-[10px] text-[#b91c1c]/70 font-bold uppercase tracking-wider">
            {lang === "en" ? "Welcome back to DELIMa" : "Selamat Datang ke DELIMa"}
          </p>
        </div>

        {/* Middle Overlapping Student Image Context */}
        <div className="flex justify-center -mt-8 relative z-10">
          <div className="relative group">
            <img
              src={currentStudent.avatar}
              alt={currentStudent.name}
              referrerPolicy="no-referrer"
              className="w-18 h-18 rounded-full border-4 border-white shadow-md object-cover"
            />
            {/* Minimal edit badge button */}
            <button
              onClick={() => setIsEditing(!isEditing)}
              title={lang === "en" ? "Edit Academic Profile" : "Sunting Profil Akademik"}
              className="absolute bottom-0 right-0 p-1.5 bg-[#7209b7] text-white rounded-full shadow-lg hover:bg-indigo-700 transition-all scale-95"
            >
              <Edit3 className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Lower body: Vibrant Gold/Yellow block with authentic elements */}
        <div className="bg-gradient-to-b from-[#fef08a] via-[#fde047] to-[#facc15] p-5 pt-3 text-center flex flex-col items-center gap-2">
          <div>
            <h3 className="font-sans font-black text-[#1e1b4b] text-sm sm:text-base leading-tight uppercase tracking-tight">
              {currentStudent.name}
            </h3>
            
            <p className="text-[10px] text-[#854d0e] font-extrabold tracking-wide uppercase mt-1 leading-normal">
              {currentStudent.id === "ahmad" ? "SEKOLAH KEBANGSAAN GOPENG" : 
               currentStudent.id === "sarah" ? "SEKOLAH MENENGAH PEREMPUAN IPOH" :
               currentStudent.id === "keith" ? "SEKOLAH MENENGAH KEBANGSAAN LA SALLE" :
               currentStudent.id === "deepa" ? "SEKOLAH MENENGAH KEBANGSAAN KEPONG BARU" :
               "SEKOLAH MENENGAH KEBANGSAAN SENTUL UTAMA"}
            </p>
          </div>

          <div className="h-px bg-[#eab308]/40 w-full my-1"></div>

          {/* Golden Badge matching DIGIAL ME from mock-up */}
          <div className="flex items-center gap-1.5 bg-[#fef9c3]/90 border border-[#eab308]/60 px-3 py-1 rounded-xl shadow-xs">
            <span className="text-xs">🛡️</span>
            <span className="text-[9px] font-black tracking-widest text-[#1e1b4b] uppercase">
              DIGITAL ME
            </span>
          </div>

          <p className="text-[9px] text-[#1e1b4b]/60 font-bold uppercase tracking-wider">
            {lang === "en" ? "Track:" : "Pengkhususan:"} {currentStudent.fieldOfInterest.split(" & ")[0]}
          </p>
        </div>
      </div>

      {/* Tags box */}
      <div className="flex flex-wrap gap-1 justify-center -mt-2">
        {currentStudent.riasecType.map((tag) => (
          <span
            key={tag}
            className="text-[9px] bg-slate-100 text-slate-700 font-extrabold px-2 py-0.5 rounded-full uppercase border border-slate-200"
          >
            {tag}
          </span>
        ))}
        <span className="text-[9px] bg-purple-50 text-[#7209b7] font-extrabold px-2 py-0.5 rounded-full uppercase border border-purple-100">
          Ldr: {currentStudent.leadershipLevel}
        </span>
      </div>

      {/* Academic metrics and stats */}
      <div className="grid grid-cols-2 gap-3 mt-2">
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-center">
          <div className="flex justify-center items-center mb-1 text-slate-500">
            <GraduationCap className="w-4 h-4 mr-1 text-indigo-600" />
            <span className="text-xs font-semibold text-slate-500">
              {lang === "en" ? "SPM Result" : "Keputusan SPM"}
            </span>
          </div>
          <p className="text-lg font-bold text-slate-800">{acadEvaluation.summary}</p>
          <div className="mt-1 flex items-center justify-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></div>
            <span className="text-[10px] text-slate-500 font-medium font-mono">Index: {acadEvaluation.score}%</span>
          </div>
        </div>

        <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-center">
          <div className="flex justify-center items-center mb-1 text-slate-500">
            <Award className="w-4 h-4 mr-1 text-teal-600" />
            <span className="text-xs font-semibold text-slate-500">
              {lang === "en" ? "PAJSK Score" : "Markah PAJSK"}
            </span>
          </div>
          <p className="text-lg font-bold text-slate-800">{currentStudent.pajskScore}%</p>
          <div className="w-full bg-slate-200 h-1.5 rounded-full mt-1.5 overflow-hidden">
            <div
              className="bg-teal-500 h-full rounded-full"
              style={{ width: `${currentStudent.pajskScore}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* List of achievements */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1 font-sans">
            <Layers className="w-3.5 h-3.5 text-slate-600" />
            {lang === "en" ? "Key Qualifications" : "Kelayakan Utama"}
          </h4>
          <span className="text-[10px] text-indigo-600 font-bold bg-indigo-50 px-1.5 py-0.5 rounded font-sans">
            {lang === "en" ? "PAJSK Level" : "Tahap PAJSK"}
          </span>
        </div>
        <ul className="text-2xs text-slate-600 space-y-2 leading-relaxed font-sans">
          {currentStudent.keyAchievements.map((ach, idx) => (
            <li key={idx} className="flex gap-2 items-start">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 shrink-0" />
              <span>{ach}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Interactive Controls slide panel or inline card */}
      <div className="border border-indigo-100 bg-indigo-50/40 rounded-xl p-4">
        <div className="flex items-center justify-between mb-2 font-sans">
          <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1">
            <Edit3 className="w-3.5 h-3.5 text-indigo-600" />
            {lang === "en" ? "Interactive Parameters" : "Parameter Interaktif"}
          </h4>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="text-[10px] text-indigo-600 font-bold underline hover:text-indigo-800"
          >
            {isEditing 
              ? (lang === "en" ? "Collapse" : "Sembunyi") 
              : (lang === "en" ? "Expand Editor" : "Buka Panel")
            }
          </button>
        </div>
        <p className="text-[11px] text-slate-500 mb-3 font-sans leading-relaxed">
          {lang === "en"
            ? "Finetune SPM achievements, PAJSK limits, and witness how the Agent pipeline recalculates matching priorities."
            : "Laraskan pencapaian SPM & PAJSK untuk mensimulasikan kesan keselarasan algoritma penajaan secara langsung."
          }
        </p>

        {isEditing && (
          <div className="space-y-4 pt-2 border-t border-indigo-100/60 font-sans">
            {/* Grades grid input */}
            <div>
              <span className="text-xs font-bold text-slate-700 block mb-1.5">
                {lang === "en" ? "SPM Subject Performance" : "Prestasi Subjek SPM"}
              </span>
              <div className="grid grid-cols-1 gap-1.5 max-h-48 overflow-y-auto pr-1">
                {availableSubjects.map((sub) => {
                  const currentGrade = currentStudent.spmGrades[sub] || "None";
                  return (
                    <div key={sub} className="flex justify-between items-center text-xs bg-white p-1 px-2 rounded-lg border border-slate-100">
                      <span className="text-slate-600 text-2xs font-medium">{sub}</span>
                      <select
                        value={currentGrade}
                        onChange={(e) => handleGradeChange(sub, e.target.value)}
                        className="text-[10px] bg-slate-50 border border-slate-200 rounded font-semibold text-slate-700 py-0.5 px-1 outline-indigo-500"
                      >
                        <option value="None">{lang === "en" ? "- Absent/Not Taken -" : "- Tidak Diambil -"}</option>
                        {gradesOptions.map((gr) => (
                          <option key={gr} value={gr}>
                            {gr}
                          </option>
                        ))}
                      </select>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* PAJSK slider */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-bold text-slate-700">
                  {lang === "en" ? "Co-Curricular (PAJSK)" : "Kokurikulum (PAJSK)"}
                </span>
                <span className="text-xs font-bold text-teal-600">{currentStudent.pajskScore}%</span>
              </div>
              <input
                type="range"
                min="55"
                max="100"
                value={currentStudent.pajskScore}
                onChange={(e) => handlePajskChange(Number(e.target.value))}
                className="w-full accent-teal-600 cursor-pointer"
              />
            </div>

            {/* Leadership Level */}
            <div>
              <span className="text-xs font-bold text-slate-700 block mb-1">
                {lang === "en" ? "Leadership Level" : "Tahap Kepimpinan"}
              </span>
              <div className="grid grid-cols-3 gap-1">
                {["Basic", "Medium", "High"].map((level) => {
                  const isCurrent = currentStudent.leadershipLevel === level;
                  let translatedLabel = level;
                  if (lang === "en") {
                    translatedLabel = level;
                  } else {
                    if (level === "Basic") translatedLabel = "Asas";
                    else if (level === "Medium") translatedLabel = "Sederhana";
                    else if (level === "High") translatedLabel = "Tinggi";
                  }
                  
                  return (
                    <button
                      key={level}
                      type="button"
                      onClick={() => handleLeadershipChange(level as "High" | "Medium" | "Basic")}
                      className={`py-1 text-[10px] font-bold rounded capitalize border transition-all ${
                        isCurrent
                          ? "bg-indigo-600 text-white border-indigo-600"
                          : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      {translatedLabel}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Dynamic achievement editing list */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-bold text-slate-700">
                  {lang === "en" ? "Student Achievements" : "Pencapaian Pelajar"}
                </span>
                <button
                  type="button"
                  onClick={addAchievement}
                  className="text-[10px] text-indigo-600 font-bold hover:underline"
                >
                  {lang === "en" ? "+ Add Line" : "+ Tambah Baris"}
                </button>
              </div>
              <div className="space-y-1">
                {currentStudent.keyAchievements.map((item, index) => (
                  <div key={index} className="flex gap-1 items-center">
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => updateAchievement(index, e.target.value)}
                      className="text-2xs bg-white text-slate-700 border border-slate-200 rounded py-1 px-1.5 w-full font-sans outline-indigo-500"
                    />
                    <button
                      type="button"
                      onClick={() => removeAchievement(index)}
                      className="p-1 text-slate-400 hover:text-red-500 shrink-0"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
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
