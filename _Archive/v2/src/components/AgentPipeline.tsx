import { useState, useEffect, useRef, useCallback } from 'react';
import { Play, RotateCcw, CheckCircle2, Clock, Loader2, AlertTriangle } from 'lucide-react';
import { AgentState, AgentStatus, StudentProfile, Language } from '../types';

interface AgentPipelineProps {
  student: StudentProfile;
  lang: Language;
  onPipelineComplete: () => void;
  onPipelineReset: () => void;
  isPipelineRunning: boolean;
  isPipelineDone: boolean;
}

const INITIAL_AGENTS: AgentState[] = [
  {
    id: 'agent1',
    name: 'Academic Profiling Agent',
    nameBm: 'Ejen Profil Akademik',
    description: 'Analyses SPM grades → Academic Score + Subject Strengths',
    status: 'idle',
    progress: 0,
    output: '',
    icon: '📚',
  },
  {
    id: 'agent2',
    name: 'PAJSK Analysis Agent',
    nameBm: 'Ejen Analisis PAJSK',
    description: 'Co-curricular → Leadership + Achievement Profile',
    status: 'idle',
    progress: 0,
    output: '',
    icon: '🏅',
  },
  {
    id: 'agent3',
    name: 'Psychometric Agent',
    nameBm: 'Ejen Psikometrik',
    description: 'RIASEC → Interest + Personality Profile',
    status: 'idle',
    progress: 0,
    output: '',
    icon: '🧠',
  },
  {
    id: 'agent4',
    name: 'Aspiration Agent',
    nameBm: 'Ejen Aspirasi',
    description: 'Dream Career + Preferred Field → Aspiration Profile',
    status: 'idle',
    progress: 0,
    output: '',
    icon: '🎯',
  },
  {
    id: 'agent5',
    name: 'Scholarship Matching Agent',
    nameBm: 'Ejen Padanan Biasiswa',
    description: 'All profiles + Parent Background → Ranked List',
    status: 'idle',
    progress: 0,
    output: '',
    icon: '🔗',
  },
  {
    id: 'agent6',
    name: 'Recommendation & Notification Agent',
    nameBm: 'Ejen Cadangan & Notifikasi',
    description: 'Explains decisions + sends email alerts',
    status: 'idle',
    progress: 0,
    output: '',
    icon: '📧',
  },
];

function generateLogs(agentId: string, student: StudentProfile): string[] {
  const name = student.name.split(' ')[0];
  const map: Record<string, string[]> = {
    agent1: [
      `[INIT] Academic Profiling Agent v2.1 activated for ${name}`,
      `[SCAN] Loading SPM transcript: ${Object.keys(student.spmGrades).length} subjects detected`,
      `[CALC] Mapping grades to GPA points (A+=10, A=9, A-=8...)`,
      `[PROC] Computing subject strength matrix...`,
      `[DONE] Academic score computed. A grades: ${Object.values(student.spmGrades).filter(g => g.startsWith('A')).length}/${Object.keys(student.spmGrades).length}`,
    ],
    agent2: [
      `[INIT] PAJSK Analysis Agent v2.0 activated`,
      `[LOAD] PAJSK score: ${student.pajskScore}/100`,
      `[EVAL] Leadership level: ${student.leadershipLevel}`,
      `[PROC] Indexing ${student.keyAchievements.length} co-curricular achievements...`,
      `[DONE] Achievement profile generated. Leadership tier: ${student.leadershipLevel}`,
    ],
    agent3: [
      `[INIT] Psychometric Agent v2.3 activated`,
      `[LOAD] RIASEC profile: [${student.riasecType.join(', ')}]`,
      `[PROC] Cross-referencing Holland Code with career aptitude database...`,
      `[MATCH] Interest vectors computed for 15 scholarship categories`,
      `[DONE] Psychometric profile finalised. Primary code: ${student.riasecType[0]}`,
    ],
    agent4: [
      `[INIT] Aspiration Agent v2.1 activated`,
      `[LOAD] Dream career: "${student.dreamCareer}"`,
      `[LOAD] Preferred field: "${student.preferredField}"`,
      `[PROC] Mapping career aspirations to scholarship fields...`,
      `[DONE] Aspiration profile aligned. Field match vectors computed.`,
    ],
    agent5: [
      `[INIT] Scholarship Matching Agent v3.0 activated`,
      `[LOAD] Parent category: ${student.parentCategory} — applying weighting factor`,
      `[PROC] Applying 5-factor model: Academic(35%) + PAJSK(20%) + RIASEC(15%) + Aspiration(15%) + Parent(15%)`,
      `[CALC] Scoring 15 scholarships against student profile...`,
      `[RANK] Sorting scholarship matches by composite weighted score`,
      `[DONE] Ranked list of 15 scholarships generated successfully`,
    ],
    agent6: [
      `[INIT] Recommendation & Notification Agent v2.5 activated`,
      `[PROC] Generating bilingual narrative explanation for top matches...`,
      `[SEND] Composing email notification for ${student.email}`,
      `[SEND] Dispatching scholarship alert → ${student.email}`,
      `[DONE] Email sent. Recommendation report finalised.`,
    ],
  };
  return map[agentId] ?? [];
}

export default function AgentPipeline({
  student,
  lang,
  onPipelineComplete,
  onPipelineReset,
  isPipelineRunning,
  isPipelineDone,
}: AgentPipelineProps) {
  const [agents, setAgents] = useState<AgentState[]>(INITIAL_AGENTS);
  const [consoleLogs, setConsoleLogs] = useState<string[]>([]);
  const [currentAgentIndex, setCurrentAgentIndex] = useState(-1);
  const consoleRef = useRef<HTMLDivElement>(null);
  const intervalsRef = useRef<ReturnType<typeof setInterval>[]>([]);

  const clearAllIntervals = useCallback(() => {
    intervalsRef.current.forEach(clearInterval);
    intervalsRef.current = [];
  }, []);

  const appendLog = useCallback((line: string) => {
    const ts = new Date().toLocaleTimeString('en-MY', { hour12: false });
    setConsoleLogs(prev => [...prev, `[${ts}] ${line}`]);
  }, []);

  useEffect(() => {
    if (consoleRef.current) {
      consoleRef.current.scrollTop = consoleRef.current.scrollHeight;
    }
  }, [consoleLogs]);

  const runAgent = useCallback((index: number, agentsArr: AgentState[]) => {
    if (index >= agentsArr.length) {
      onPipelineComplete();
      return;
    }

    setCurrentAgentIndex(index);
    const logs = generateLogs(agentsArr[index].id, student);
    let logIdx = 0;
    let progress = 0;

    setAgents(prev => prev.map((a, i) =>
      i === index ? { ...a, status: 'running' as AgentStatus, progress: 0 } : a
    ));

    const iv = setInterval(() => {
      progress += 10;
      if (logIdx < logs.length) {
        appendLog(logs[logIdx]);
        logIdx++;
      }

      setAgents(prev => prev.map((a, i) =>
        i === index ? { ...a, progress, output: logs[logIdx - 1] ?? '' } : a
      ));

      if (progress >= 100) {
        clearInterval(iv);
        setAgents(prev => prev.map((a, i) =>
          i === index ? { ...a, status: 'done' as AgentStatus, progress: 100 } : a
        ));
        setTimeout(() => runAgent(index + 1, agentsArr), 400);
      }
    }, 130);

    intervalsRef.current.push(iv);
  }, [student, appendLog, onPipelineComplete]);

  const handleRun = () => {
    clearAllIntervals();
    const fresh = INITIAL_AGENTS.map(a => ({ ...a, status: 'idle' as AgentStatus, progress: 0, output: '' }));
    setAgents(fresh);
    setConsoleLogs([]);
    setCurrentAgentIndex(-1);
    appendLog('[SYSTEM] DELIMa A.I. Multi-Agent Pipeline v2.0 initialised');
    appendLog(`[SYSTEM] Target student: ${student.name} | State: ${student.state} | Category: ${student.parentCategory}`);
    setTimeout(() => runAgent(0, fresh), 300);
  };

  const handleReset = () => {
    clearAllIntervals();
    setAgents(INITIAL_AGENTS.map(a => ({ ...a, status: 'idle' as AgentStatus, progress: 0, output: '' })));
    setConsoleLogs([]);
    setCurrentAgentIndex(-1);
    onPipelineReset();
  };

  useEffect(() => {
    return () => clearAllIntervals();
  }, [clearAllIntervals]);

  const statusIcon = (status: AgentStatus, idx: number) => {
    if (status === 'done') return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
    if (status === 'running') return <Loader2 className="w-4 h-4 text-yellow-300 animate-spin" />;
    if (idx <= currentAgentIndex) return <AlertTriangle className="w-4 h-4 text-red-400" />;
    return <Clock className="w-4 h-4 text-slate-400" />;
  };

  const statusColor = (status: AgentStatus) => {
    if (status === 'done') return 'border-emerald-500 bg-emerald-950/40';
    if (status === 'running') return 'border-yellow-400 bg-yellow-950/40 ring-2 ring-yellow-400/30';
    return 'border-slate-700 bg-slate-800/60';
  };

  return (
    <div className="rounded-2xl overflow-hidden shadow-lg" style={{ background: '#0f172a' }}>
      {/* Header */}
      <div className="px-5 py-4 flex items-center justify-between" style={{ background: '#1e293b' }}>
        <div>
          <h3 className="font-bold text-white text-sm flex items-center gap-2">
            <span className="text-lg">🤖</span>
            {lang === 'bm' ? 'Talian Paip 6-Ejen A.I.' : '6-Agent A.I. Pipeline'}
          </h3>
          <p className="text-slate-400 text-xs mt-0.5">
            {lang === 'bm' ? 'Padanan Biasiswa Holistik — Faktor 35/20/15/15/15' : 'Holistic Scholarship Matching — Weights 35/20/15/15/15'}
          </p>
        </div>
        <div className="flex gap-2">
          {(isPipelineRunning || isPipelineDone) && (
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 bg-slate-700 hover:bg-slate-600 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              {lang === 'bm' ? 'Tetapkan Semula' : 'Reset'}
            </button>
          )}
          {!isPipelineRunning && (
            <button
              onClick={handleRun}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold text-white transition-all"
              style={{ background: isPipelineDone ? '#16a34a' : '#003580' }}
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              {isPipelineDone
                ? (lang === 'bm' ? 'Jalankan Semula' : 'Re-run Pipeline')
                : (lang === 'bm' ? 'Jalankan Ejen A.I.' : 'Run A.I. Pipeline')}
            </button>
          )}
          {isPipelineRunning && (
            <div className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold text-yellow-300 bg-yellow-900/40">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              {lang === 'bm' ? 'Sedang Berjalan...' : 'Processing...'}
            </div>
          )}
        </div>
      </div>

      {/* Agent Grid 3×2 */}
      <div className="p-4 grid grid-cols-3 gap-3">
        {agents.map((agent, idx) => (
          <div
            key={agent.id}
            className={`rounded-xl border p-3 transition-all duration-300 ${statusColor(agent.status)}`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <span className="text-base">{agent.icon}</span>
                <span className="text-slate-400 text-xs font-mono">#{idx + 1}</span>
              </div>
              {statusIcon(agent.status, idx)}
            </div>
            <p className="text-white text-xs font-semibold leading-tight mb-1">
              {lang === 'bm' ? agent.nameBm : agent.name}
            </p>
            <p className="text-slate-500 text-[10px] leading-tight mb-2">{agent.description}</p>
            {/* Progress bar */}
            <div className="h-1 bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-200"
                style={{
                  width: `${agent.progress}%`,
                  background: agent.status === 'done' ? '#10b981'
                    : agent.status === 'running' ? '#facc15'
                    : '#334155',
                }}
              />
            </div>
            {agent.status === 'running' && (
              <p className="text-yellow-400 text-[9px] mt-1 font-mono truncate">{agent.output}</p>
            )}
            {agent.status === 'done' && (
              <p className="text-emerald-400 text-[9px] mt-1 font-mono">✓ Selesai / Done</p>
            )}
          </div>
        ))}
      </div>

      {/* Console */}
      {consoleLogs.length > 0 && (
        <div className="mx-4 mb-4">
          <div className="rounded-xl overflow-hidden border border-slate-700">
            <div className="px-3 py-1.5 flex items-center gap-2" style={{ background: '#1e293b' }}>
              <div className="flex gap-1">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
              </div>
              <span className="text-slate-400 text-xs font-mono">DELIMa A.I. Agent Console</span>
            </div>
            <div
              ref={consoleRef}
              className="p-3 font-mono text-[10px] leading-5 overflow-y-auto"
              style={{ background: '#020617', maxHeight: '160px', color: '#94a3b8' }}
            >
              {consoleLogs.map((log, i) => {
                const isSystem = log.includes('[SYSTEM]');
                const isDone = log.includes('[DONE]');
                const isSend = log.includes('[SEND]');
                const color = isSystem ? '#60a5fa' : isDone ? '#34d399' : isSend ? '#f472b6' : '#94a3b8';
                return (
                  <div key={i} style={{ color }}>{log}</div>
                );
              })}
              {isPipelineRunning && (
                <div className="flex gap-1 mt-1" style={{ color: '#facc15' }}>
                  <span>▋</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
