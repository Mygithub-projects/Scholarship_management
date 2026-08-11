import { useState, useCallback, useMemo } from 'react';
import { Maximize2, Minimize2, X, Bell, LogOut, ChevronRight, Home, User, BookOpen, Bot, BarChart2, Play } from 'lucide-react';
import { StudentProfile, CalculatedMatch, Language, ActiveTab, NotificationStatus } from './types';
import { STUDENTS, SCHOLARSHIPS } from './data/mockData';
import {
  computeScholarshipMatches,
  calculateStudentPotentials,
  computeCareerPathways,
  getAIReasoning,
} from './utils/matchingEngine';
import SidebarStudent from './components/SidebarStudent';
import MainContent from './components/MainContent';
import RightSidebar from './components/RightSidebar';
import AgentPipeline from './components/AgentPipeline';
import VoiceAgent from './components/VoiceAgent';
import LoginPage from './components/LoginPage';
import { applyPajskData } from './data/pajskData';

export default function App() {
  const [loggedInStudent, setLoggedInStudent] = useState<StudentProfile | null>(null);
  const [student, setStudent] = useState<StudentProfile>(STUDENTS[0]);
  const [lang, setLang] = useState<Language>('bm');
  const [fullscreen, setFullscreen] = useState(false);
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [isPipelineRunning, setIsPipelineRunning] = useState(false);
  const [isPipelineDone, setIsPipelineDone] = useState(false);
  const [matches, setMatches] = useState<CalculatedMatch[]>([]);
  const [notification, setNotification] = useState<NotificationStatus | null>(null);
  const [applyModal, setApplyModal] = useState<{ id: string; name: string } | null>(null);
  const [outOfSync, setOutOfSync] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const potentials = useMemo(() => calculateStudentPotentials(student), [student]);
  const careers = useMemo(() => computeCareerPathways(student), [student]);
  const aiReasoning = useMemo(
    () => (isPipelineDone ? getAIReasoning(student, matches, lang) : ''),
    [isPipelineDone, student, matches, lang]
  );

  // All hooks must be declared before any early return
  const handleStudentChange = useCallback((_s: StudentProfile) => {
    // When logged in, student is locked to the authenticated user — no switching
  }, []);

  const handleLogout = useCallback(() => {
    setLoggedInStudent(null);
    setIsPipelineRunning(false);
    setIsPipelineDone(false);
    setMatches([]);
    setNotification(null);
    setOutOfSync(false);
  }, []);

  const handlePipelineComplete = useCallback(() => {
    const results = computeScholarshipMatches(student, SCHOLARSHIPS);
    setMatches(results);
    setIsPipelineRunning(false);
    setIsPipelineDone(true);
    setOutOfSync(false);
    const topMatch = results[0];
    const now = new Date().toLocaleTimeString('en-MY', { hour12: false });
    setNotification({
      sent: true,
      email: student.email,
      timestamp: now,
      topScholarship: topMatch?.scholarshipName ?? 'N/A',
      matchScore: topMatch?.score ?? 0,
    });
  }, [student]);

  const handlePipelineReset = useCallback(() => {
    setIsPipelineRunning(false);
    setIsPipelineDone(false);
    setMatches([]);
    setNotification(null);
    setOutOfSync(false);
  }, []);

  const handleRunPipeline = useCallback(() => {
    setIsPipelineRunning(true);
    setIsPipelineDone(false);
    setMatches([]);
    setNotification(null);
    setOutOfSync(false);
  }, []);

  // ── Login gate — all hooks already declared above ──
  if (!loggedInStudent) {
    return (
      <LoginPage
        onLogin={s => {
          // Merge real PAJSK data into the student profile at login
          const enriched = applyPajskData(s) as StudentProfile;
          setLoggedInStudent(enriched);
          setStudent(enriched);
        }}
      />
    );
  }

  const tabs: { id: ActiveTab; labelBm: string; labelEn: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', labelBm: 'Dashboard', labelEn: 'Dashboard', icon: <Home className="w-3.5 h-3.5" /> },
    { id: 'profil', labelBm: 'Profil Murid', labelEn: 'Student Profile', icon: <User className="w-3.5 h-3.5" /> },
    { id: 'biasiswa', labelBm: 'Biasiswa', labelEn: 'Scholarships', icon: <BookOpen className="w-3.5 h-3.5" /> },
    { id: 'ejen', labelBm: 'Ejen AI', labelEn: 'AI Agents', icon: <Bot className="w-3.5 h-3.5" /> },
    { id: 'laporan', labelBm: 'Laporan', labelEn: 'Report', icon: <BarChart2 className="w-3.5 h-3.5" /> },
  ];

  return (
    <div
      className={`min-h-screen flex flex-col ${fullscreen ? 'fixed inset-0 overflow-auto z-50' : ''}`}
      style={{ background: '#f3f4f6', fontFamily: '"Outfit", sans-serif' }}
    >
      {/* ══════════════════════════════════════════════
          HEADER — White, exactly like real DELIMa
      ══════════════════════════════════════════════ */}
      <header
        className="sticky top-0 z-50"
        style={{ background: '#ffffff', borderBottom: '1.5px solid #e5e7eb', boxShadow: '0 1px 6px rgba(0,0,0,0.07)' }}
      >
        <div className="px-5 py-3 flex items-center justify-between gap-4">

          {/* LEFT — DELIMa Wordmark */}
          <div className="flex items-center gap-3 flex-shrink-0">
            {/* Jata Negara mini */}
            <div className="w-9 h-9 flex items-center justify-center rounded-full"
              style={{ background: '#003580' }}>
              <span className="text-yellow-300 font-black text-sm select-none">KPM</span>
            </div>
            <div>
              {/* DELIMa — replicate real logo letter colors */}
              <div className="flex items-center gap-1.5">
                <span className="font-black text-2xl tracking-tight leading-none select-none"
                  style={{ fontFamily: '"Outfit", sans-serif' }}>
                  <span style={{ color: '#1a56db' }}>D</span>
                  <span style={{ color: '#1a56db' }}>E</span>
                  <span style={{ color: '#1a56db' }}>L</span>
                  <span style={{ color: '#1a56db' }}>I</span>
                  <span style={{ color: '#1a56db' }}>M</span>
                  <span style={{ color: '#e02424' }}>a</span>
                </span>
                <span
                  className="text-[9px] font-black px-1.5 py-0.5 rounded-md"
                  style={{ background: '#1a56db', color: 'white', letterSpacing: '0.05em' }}
                >
                  A.I.
                </span>
              </div>
              <p className="text-[9px] text-slate-400 font-medium leading-none mt-0.5" style={{ letterSpacing: '0.03em' }}>
                {lang === 'bm' ? 'Kementerian Pendidikan Malaysia' : 'Ministry of Education Malaysia'}
              </p>
            </div>
          </div>

          {/* CENTRE — The DELIMa signature question */}
          <div className="flex-1 text-center hidden md:block">
            <p className="font-bold text-slate-700" style={{ fontSize: '13px' }}>
              {lang === 'bm'
                ? 'Apakah yang ingin anda lakukan hari ini?'
                : 'What would you like to do today?'}
            </p>
            <p className="text-[10px] text-slate-400 mt-0.5">
              {lang === 'bm' ? 'Sistem Padanan Biasiswa Agentic AI · Lepasan SPM' : 'Agentic AI Scholarship Matching System · Post-SPM'}
            </p>
          </div>

          {/* RIGHT — Language + controls + user */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Language switcher — exact DELIMa style */}
            <div className="flex items-center gap-0.5 text-xs font-semibold text-slate-500">
              <button
                onClick={() => setLang('en')}
                className={`px-2 py-1 rounded transition-colors ${lang === 'en' ? 'text-blue-700 underline font-bold' : 'hover:text-slate-700'}`}
              >En</button>
              <span className="text-slate-300">|</span>
              <button
                onClick={() => setLang('bm')}
                className={`px-2 py-1 rounded transition-colors ${lang === 'bm' ? 'text-blue-700 underline font-bold' : 'hover:text-slate-700'}`}
              >My</button>
            </div>

            {/* Bell notification */}
            <button className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors relative">
              <Bell className="w-4 h-4 text-slate-500" />
              {notification?.sent && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500" />
              )}
            </button>

            {/* Fullscreen */}
            <button
              onClick={() => setFullscreen(!fullscreen)}
              className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {fullscreen ? <Minimize2 className="w-4 h-4 text-slate-500" /> : <Maximize2 className="w-4 h-4 text-slate-500" />}
            </button>

            {/* User avatar + logout */}
            <div className="flex items-center gap-2">
              <div className="hidden sm:block text-right">
                <p className="text-[10px] font-bold text-slate-600 leading-tight truncate max-w-[100px]">{student.name.split(' ').slice(0, 2).join(' ')}</p>
                <p className="text-[9px] text-slate-400">{student.id} · {student.parentCategory}</p>
              </div>
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center font-black text-white text-sm flex-shrink-0"
                style={{ background: student.gender === 'P' ? '#7c3aed' : '#057a55' }}
              >
                {student.avatar}
              </div>
              <button
                onClick={handleLogout}
                className="p-1.5 rounded-lg hover:bg-red-50 transition-colors group"
                title="Log Keluar"
              >
                <LogOut className="w-4 h-4 text-slate-400 group-hover:text-red-500 transition-colors" />
              </button>
            </div>
          </div>
        </div>

        {/* Navigation tabs — below header, white with blue underline active */}
        <div style={{ borderTop: '1px solid #f0f0f0', background: '#fff' }}>
          <div className="px-5 flex items-center gap-0">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold border-b-2 transition-all ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-700 font-bold'
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                }`}
              >
                {tab.icon}
                <span className="hidden sm:inline">{lang === 'bm' ? tab.labelBm : tab.labelEn}</span>
              </button>
            ))}

            {/* Run Pipeline quick-access tab */}
            {!isPipelineDone && (
              <button
                onClick={() => { setActiveTab('ejen'); setTimeout(handleRunPipeline, 100); }}
                className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white transition-all"
                style={{ background: '#1a56db' }}
              >
                <Play className="w-3 h-3 fill-current" />
                {lang === 'bm' ? 'Jalankan Ejen AI' : 'Run AI Agents'}
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Out-of-sync banner */}
      {outOfSync && (
        <div style={{ background: '#fffbeb', borderBottom: '1px solid #fde68a' }} className="px-5 py-2 flex items-center justify-between">
          <span className="text-xs text-amber-700 font-semibold">
            ⚠️{' '}
            {lang === 'bm'
              ? 'Parameter pelajar telah berubah. Jalankan semula Ejen AI untuk keputusan terkini.'
              : 'Student parameters changed. Re-run AI Agents for updated results.'}
          </span>
          <button onClick={() => setOutOfSync(false)}><X className="w-4 h-4 text-amber-500" /></button>
        </div>
      )}

      {/* ══════════════════════════════════════════════
          BODY — 3-column: Blue Sidebar | Main | Right
      ══════════════════════════════════════════════ */}
      <div className="flex flex-1">

        {/* ── BLUE LEFT SIDEBAR (real DELIMa style) ── */}
        <aside
          className={`flex-shrink-0 flex flex-col transition-all duration-300 ${sidebarCollapsed ? 'w-14' : 'w-72'} hidden lg:flex`}
          style={{ background: '#1a56db', minHeight: 'calc(100vh - 97px)' }}
        >
          {/* Salam Sejahtera greeting */}
          {!sidebarCollapsed && (
            <div className="px-4 pt-4 pb-2">
              <p className="text-blue-200 text-[11px] font-medium">
                {lang === 'bm' ? 'Salam Sejahtera,' : 'Welcome,'}
              </p>
              <p className="text-white font-bold text-sm leading-tight">{student.name.split(' ')[0]}</p>
              <p className="text-blue-300 text-[10px] mt-0.5">{student.id}</p>
            </div>
          )}

          {/* Student Digital Me Card */}
          {!sidebarCollapsed && (
            <div className="px-3 pb-3">
              <SidebarStudent student={student} onStudentChange={handleStudentChange} lang={lang} locked={!!loggedInStudent} />
            </div>
          )}

          {/* Navigation Menu */}
          <nav className="flex-1 px-2 py-2">
            {!sidebarCollapsed && (
              <p className="text-blue-300 text-[9px] font-bold uppercase tracking-widest px-2 mb-2">
                {lang === 'bm' ? 'MODUL BIASISWA AI' : 'AI SCHOLARSHIP MODULES'}
              </p>
            )}
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1 text-xs font-semibold transition-all ${
                  activeTab === tab.id
                    ? 'text-white'
                    : 'text-blue-200 hover:bg-white/10 hover:text-white'
                }`}
                style={activeTab === tab.id ? { background: 'rgba(255,255,255,0.2)' } : {}}
              >
                <span className="flex-shrink-0">{tab.icon}</span>
                {!sidebarCollapsed && (
                  <>
                    <span className="flex-1 text-left">{lang === 'bm' ? tab.labelBm : tab.labelEn}</span>
                    {activeTab === tab.id && <ChevronRight className="w-3 h-3 opacity-60" />}
                  </>
                )}
              </button>
            ))}

            {/* Divider */}
            {!sidebarCollapsed && <div className="my-3 border-t border-white/10" />}

            {/* Secondary nav items like real DELIMa */}
            {!sidebarCollapsed && (
              <>
                <p className="text-blue-300 text-[9px] font-bold uppercase tracking-widest px-2 mb-2">
                  {lang === 'bm' ? 'PORTAL KPM' : 'KPM PORTALS'}
                </p>
                {[
                  { label: lang === 'bm' ? 'DELIMa Utama' : 'DELIMa Main', icon: '🏫' },
                  { label: 'UPU Online', icon: '🎓' },
                  { label: 'PAJSK Sistem', icon: '🏅' },
                  { label: 'JPA Portal', icon: '🏛️' },
                ].map(item => (
                  <div
                    key={item.label}
                    className="flex items-center gap-3 px-3 py-2 rounded-xl mb-0.5 text-blue-200 hover:bg-white/10 hover:text-white cursor-pointer transition-all text-xs"
                  >
                    <span>{item.icon}</span>
                    <span>{item.label}</span>
                    <ChevronRight className="w-3 h-3 ml-auto opacity-50" />
                  </div>
                ))}
              </>
            )}
          </nav>

          {/* Collapse toggle */}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="m-3 flex items-center justify-center gap-2 py-2 rounded-xl text-blue-300 hover:text-white hover:bg-white/10 transition-all text-xs"
          >
            {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : (
              <>
                <ChevronRight className="w-4 h-4 rotate-180" />
                <span>{lang === 'bm' ? 'Runtuhkan' : 'Collapse'}</span>
              </>
            )}
          </button>
        </aside>

        {/* ── MAIN + RIGHT SIDEBAR ── */}
        <div className="flex-1 flex flex-col min-w-0">
          <main className="flex-1 p-4">

            {/* ─── DASHBOARD / PROFIL / BIASISWA ─── */}
            {(activeTab === 'dashboard' || activeTab === 'profil' || activeTab === 'biasiswa') && (
              <div className="flex gap-4">
                {/* Mobile-only sidebar */}
                <div className="lg:hidden w-full">
                  <SidebarStudent student={student} onStudentChange={handleStudentChange} lang={lang} locked={!!loggedInStudent} />
                </div>

                {/* Main content column */}
                <div className="flex-1 min-w-0">
                  <MainContent
                    student={student}
                    matches={matches}
                    potentials={potentials}
                    careers={careers}
                    aiReasoning={aiReasoning}
                    lang={lang}
                    isPipelineDone={isPipelineDone}
                    isPipelineRunning={isPipelineRunning}
                    onApply={(id, name) => setApplyModal({ id, name })}
                    onRunPipeline={() => { setActiveTab('ejen'); setTimeout(handleRunPipeline, 100); }}
                  />
                </div>

                {/* Right sidebar */}
                <div className="w-72 flex-shrink-0 hidden xl:block">
                  <RightSidebar
                    scholarships={SCHOLARSHIPS}
                    lang={lang}
                    notification={notification}
                    onApply={(id, name) => setApplyModal({ id, name })}
                  />
                </div>
              </div>
            )}

            {/* ─── EJEN AI TAB ─── */}
            {activeTab === 'ejen' && (
              <div className="flex gap-4">
                <div className="flex-1 space-y-4">
                  <AgentPipeline
                    student={student}
                    lang={lang}
                    onPipelineComplete={handlePipelineComplete}
                    onPipelineReset={handlePipelineReset}
                    isPipelineRunning={isPipelineRunning}
                    isPipelineDone={isPipelineDone}
                  />
                  <VoiceAgent
                    student={student}
                    topMatch={matches[0] ?? null}
                    lang={lang}
                    isPipelineDone={isPipelineDone}
                  />
                </div>
                <div className="w-72 flex-shrink-0 hidden xl:block">
                  <RightSidebar
                    scholarships={SCHOLARSHIPS}
                    lang={lang}
                    notification={notification}
                    onApply={(id, name) => setApplyModal({ id, name })}
                  />
                </div>
              </div>
            )}

            {/* ─── LAPORAN TAB ─── */}
            {activeTab === 'laporan' && (
              isPipelineDone ? (
                <div className="space-y-4">
                  <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h2 className="text-lg font-black text-slate-800">
                          {lang === 'bm' ? 'Laporan Padanan Biasiswa' : 'Scholarship Matching Report'}
                        </h2>
                        <p className="text-slate-400 text-xs mt-0.5">DELIMa A.I. v2.0 · 6-Agent Analysis Pipeline</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-slate-400">{new Date().toLocaleDateString('ms-MY')}</p>
                        <p className="text-xs font-bold text-slate-600">{student.name}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                      {[
                        { label: lang === 'bm' ? 'Gred A' : 'A Grades', value: Object.values(student.spmGrades).filter(g => g.startsWith('A')).length.toString(), icon: '📚', color: '#dbeafe' },
                        { label: 'PAJSK', value: `${student.pajskScore}/100`, icon: '🏅', color: '#dcfce7' },
                        { label: 'RIASEC', value: student.riasecType.join('/'), icon: '🧠', color: '#fae8ff' },
                        { label: lang === 'bm' ? 'Aspirasi' : 'Aspiration', value: student.preferredField.split(' ')[0], icon: '🎯', color: '#fff7ed' },
                        { label: lang === 'bm' ? 'Kategori' : 'Category', value: student.parentCategory, icon: '👨‍👩‍👧', color: '#fef3c7' },
                      ].map(stat => (
                        <div key={stat.label} className="rounded-xl p-3 text-center" style={{ background: stat.color }}>
                          <div className="text-2xl">{stat.icon}</div>
                          <div className="font-black text-slate-800 text-sm mt-1">{stat.value}</div>
                          <div className="text-[10px] text-slate-500">{stat.label}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between">
                      <h3 className="font-bold text-slate-800 text-sm">
                        {lang === 'bm' ? 'Senarai Lengkap Padanan (15 Biasiswa)' : 'Complete Match Table (15 Scholarships)'}
                      </h3>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: '#dbeafe', color: '#1d4ed8' }}>
                        Wajaran: 35/20/15/15/15
                      </span>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs">
                        <thead>
                          <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                            {['#', lang === 'bm' ? 'Biasiswa' : 'Scholarship',
                              `${lang === 'bm' ? 'Akademik' : 'Academic'} 35%`,
                              'PAJSK 20%', 'Psikometrik 15%',
                              `${lang === 'bm' ? 'Aspirasi' : 'Aspiration'} 15%`,
                              `${lang === 'bm' ? 'Keluarga' : 'Parent'} 15%`,
                              lang === 'bm' ? 'Jumlah' : 'Total',
                              'Status'
                            ].map((h, i) => (
                              <th key={i} className="px-3 py-2.5 text-left font-bold text-slate-500 text-[10px] uppercase tracking-wide whitespace-nowrap">{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {matches.map((m, i) => (
                            <tr key={m.scholarshipId} style={{ background: i % 2 === 0 ? '#fff' : '#f9fafb', borderBottom: '1px solid #f1f5f9' }}>
                              <td className="px-3 py-2 font-bold text-slate-400">{i + 1}</td>
                              <td className="px-3 py-2">
                                <div className="font-bold text-slate-800 max-w-[160px] truncate text-[11px]">{m.scholarshipName}</div>
                                <div className="text-slate-400 text-[9px]">{m.provider}</div>
                              </td>
                              {[m.breakdown.academic, m.breakdown.pajsk, m.breakdown.psychometric, m.breakdown.aspiration, m.breakdown.parentBackground].map((v, vi) => (
                                <td key={vi} className="px-3 py-2 text-center">
                                  <span className="font-bold px-1.5 py-0.5 rounded text-[10px]"
                                    style={{
                                      background: v >= 80 ? '#dcfce7' : v >= 60 ? '#dbeafe' : '#fee2e2',
                                      color: v >= 80 ? '#16a34a' : v >= 60 ? '#2563eb' : '#dc2626',
                                    }}>
                                    {v.toFixed(0)}
                                  </span>
                                </td>
                              ))}
                              <td className="px-3 py-2 text-center font-black text-sm"
                                style={{ color: m.score >= 80 ? '#16a34a' : m.score >= 60 ? '#2563eb' : '#f59e0b' }}>
                                {m.score.toFixed(1)}%
                              </td>
                              <td className="px-3 py-2 text-center">
                                <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${m.eligible ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-600'}`}>
                                  {m.eligible ? (lang === 'bm' ? '✓ Layak' : '✓ Eligible') : (lang === 'bm' ? '✗ Tidak' : '✗ No')}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-16 text-center">
                  <div className="text-5xl mb-4">📊</div>
                  <p className="font-bold text-slate-700">{lang === 'bm' ? 'Tiada Laporan Dijana' : 'No Report Generated'}</p>
                  <p className="text-slate-400 text-sm mt-2 mb-4">
                    {lang === 'bm' ? 'Pergi ke tab "Ejen AI" dan jalankan analisis terlebih dahulu.' : 'Go to the "AI Agents" tab and run the analysis first.'}
                  </p>
                  <button
                    onClick={() => { setActiveTab('ejen'); setTimeout(handleRunPipeline, 100); }}
                    className="px-5 py-2.5 rounded-xl text-white text-sm font-bold"
                    style={{ background: '#1a56db' }}
                  >
                    {lang === 'bm' ? '🤖 Jalankan Ejen AI' : '🤖 Run AI Pipeline'}
                  </button>
                </div>
              )
            )}
          </main>

          {/* Footer */}
          <footer style={{ background: '#1e3a5f', borderTop: '1px solid #1a56db' }} className="py-3 px-5">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="font-black text-white text-sm tracking-wider">
                  <span style={{ color: '#60a5fa' }}>DELIm</span><span style={{ color: '#f87171' }}>a</span>
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded" style={{ background: '#1a56db', color: 'white' }}>A.I. v2.0</span>
              </div>
              <p className="text-blue-300 text-[10px] text-center">
                © 2025 Kementerian Pendidikan Malaysia · PRESTIJ Programme · Hak Cipta Terpelihara
              </p>
              <div className="flex gap-1.5">
                {['MQA', 'JPA', 'PDPA'].map(b => (
                  <span key={b} className="text-[9px] font-bold px-2 py-0.5 rounded" style={{ background: 'rgba(255,255,255,0.1)', color: '#93c5fd' }}>{b}</span>
                ))}
              </div>
            </div>
          </footer>
        </div>
      </div>

      {/* ── APPLY MODAL ── */}
      {applyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.55)' }}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-800 text-sm">{lang === 'bm' ? 'Hantar Permohonan' : 'Submit Application'}</h3>
              <button onClick={() => setApplyModal(null)}><X className="w-5 h-5 text-slate-400 hover:text-slate-600" /></button>
            </div>
            <div className="rounded-xl p-3 mb-4" style={{ background: '#eff6ff', border: '1px solid #bfdbfe' }}>
              <p className="text-xs font-bold text-blue-800">{applyModal.name}</p>
              <p className="text-xs text-blue-500 mt-0.5">{student.name}</p>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              {lang === 'bm'
                ? 'Anda akan diarahkan ke Portal Biasiswa KPM. Pastikan semua dokumen disediakan.'
                : 'You will be redirected to the KPM Scholarship Portal. Ensure all documents are ready.'}
            </p>
            <div className="flex gap-2">
              <button onClick={() => setApplyModal(null)} className="flex-1 py-2.5 rounded-xl text-xs font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 transition-colors">
                {lang === 'bm' ? 'Batal' : 'Cancel'}
              </button>
              <button
                onClick={() => { alert(lang === 'bm' ? 'Permohonan dihantar! (simulasi)' : 'Application submitted! (simulation)'); setApplyModal(null); }}
                className="flex-1 py-2.5 rounded-xl text-xs font-bold text-white transition-colors"
                style={{ background: '#1a56db' }}
              >
                {lang === 'bm' ? 'Mohon Sekarang' : 'Apply Now'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
