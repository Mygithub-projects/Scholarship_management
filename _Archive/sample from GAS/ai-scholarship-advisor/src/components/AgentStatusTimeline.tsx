import { useState, useEffect } from "react";
import { AgentState, AgentStatus } from "../types";
import { Terminal, Play, RotateCcw, Cpu, Search, CheckCircle, HelpCircle, Activity } from "lucide-react";

interface AgentStatusTimelineProps {
  onPipelineStart: () => void;
  onPipelineComplete: () => void;
  isPipelineRunning: boolean;
  lang?: "en" | "my";
}

export default function AgentStatusTimeline({
  onPipelineStart,
  onPipelineComplete,
  isPipelineRunning,
  lang = "my",
}: AgentStatusTimelineProps) {
  const [pipelineStep, setPipelineStep] = useState<number>(0); // 0: Idle, 1-4: Agents active, 5: Done
  const [currentProgress, setCurrentProgress] = useState<number>(0);
  const [systemLogs, setSystemLogs] = useState<string[]>([]);

  // Local agent list representing state to display
  const [agents, setAgents] = useState<AgentState[]>([
    {
      id: "profiler",
      name: "Student Profiling Agent",
      title: "Agent 1",
      status: "idle",
      progress: 0,
      log: "Idle - Waiting for student record signal",
    },
    {
      id: "knowledge",
      name: "Scholarship Knowledge Agent",
      title: "Agent 2",
      status: "idle",
      progress: 0,
      log: "Idle - Standby for filtered schema constraints",
    },
    {
      id: "matching",
      name: "Matching Agent",
      title: "Agent 3",
      status: "idle",
      progress: 0,
      log: "Idle - Standby for quantitative scoring matrices",
    },
    {
      id: "reasoning",
      name: "Reasoning Agent",
      title: "Agent 4",
      status: "idle",
      progress: 0,
      log: "Idle - Standby to synthesize recommendation narrative",
    },
  ]);

  // Handle running the pipeline
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isPipelineRunning) {
      // 1. Kickstart pipeline
      if (pipelineStep === 0) {
        setPipelineStep(1);
        setSystemLogs(["[System] Initializing scholarship matching workflow...", "[System] Booting orchestration container successful."]);
        setAgents((prev) =>
          prev.map((a, idx) =>
            idx === 0
              ? { ...a, status: "running", progress: 0, log: "Analyzing SPM transcript and co-curricular grades..." }
              : { ...a, status: "idle", progress: 0 }
          )
        );
      }

      // Step-by-step progress simulation
      if (pipelineStep >= 1 && pipelineStep <= 4) {
        let prog = 0;
        const currentAgentIndex = pipelineStep - 1;

        // Custom logs for each agent step to make it feel genuine
        let stepLogs: string[] = [];
        if (pipelineStep === 1) {
          stepLogs = [
            `[Agent 1: Profiler] Ingesting SPM subject grades...`,
            `[Agent 1: Profiler] Calculating academic strength coefficient...`,
            `[Agent 1: Profiler] Mapping RIASEC vectors to career interest profile...`
          ];
        } else if (pipelineStep === 2) {
          stepLogs = [
            `[Agent 2: Knowledge] Accessing JPA, PETRONAS, and Khazanah eligibility criteria...`,
            `[Agent 2: Knowledge] Filtering out scholarships based on minimum required SPM grade points...`,
            `[Agent 2: Knowledge] Ingesting co-curricular (PAJSK) minimum rulesets...`
          ];
        } else if (pipelineStep === 3) {
          stepLogs = [
            `[Agent 3: Matching] Constructing multidimensional affinity array...`,
            `[Agent 3: Matching] Calculating weights: 40% Academic, 25% PAJSK, 20% Career Fit, 15% Leadership.`,
            `[Agent 3: Matching] Optimizing compatibility scoring list...`
          ];
        } else if (pipelineStep === 4) {
          stepLogs = [
            `[Agent 4: Reasoning] Generating natural language rationale...`,
            `[Agent 4: Reasoning] Synthesizing career domain pathways...`,
            `[Agent 4: Reasoning] Formatting evaluation brief...`
          ];
        }

        let logIdx = 0;
        interval = setInterval(() => {
          prog += 10;
          if (prog <= 100) {
            // Update current agent progress
            setAgents((prev) =>
              prev.map((a, i) =>
                i === currentAgentIndex ? { ...a, progress: prog } : a
              )
            );

            // Add simulated agent diagnostic log at certain milestones
            if (prog === 30 && stepLogs[0]) {
              setSystemLogs((prev) => [...prev, stepLogs[0]]);
            }
            if (prog === 60 && stepLogs[1]) {
              setSystemLogs((prev) => [...prev, stepLogs[1]]);
            }
            if (prog === 90 && stepLogs[2]) {
              setSystemLogs((prev) => [...prev, stepLogs[2]]);
            }
          } else {
            // Step complete
            clearInterval(interval);
            setSystemLogs((prev) => [...prev, `[System] ${agents[currentAgentIndex].name} finished execution successfully.`]);
            
            setAgents((prev) =>
              prev.map((a, i) => {
                if (i === currentAgentIndex) {
                  return { ...a, status: "completed", progress: 100, log: "Execution complete. Output buffered." };
                } else if (i === currentAgentIndex + 1) {
                  return { ...a, status: "running", progress: 0, log: "Analyzing data constraints..." };
                }
                return a;
              })
            );

            // Move to next step
            if (pipelineStep < 4) {
              setPipelineStep(pipelineStep + 1);
            } else {
              setPipelineStep(5);
              onPipelineComplete();
              setSystemLogs((prev) => [
                ...prev,
                `[System] Global matching pipeline ended. Results compiled.`,
                `[System] Output delivered to Ministry DELIMa dashboard UI.`
              ]);
            }
          }
        }, 120);
      }
    }

    return () => clearInterval(interval);
  }, [isPipelineRunning, pipelineStep]);

  const triggerReset = () => {
    setPipelineStep(0);
    setAgents([
      {
        id: "profiler",
        name: "Student Profiling Agent",
        title: "Agent 1",
        status: "idle",
        progress: 0,
        log: "Idle - Waiting for student record signal",
      },
      {
        id: "knowledge",
        name: "Scholarship Knowledge Agent",
        title: "Agent 2",
        status: "idle",
        progress: 0,
        log: "Idle - Standby for filtered schema constraints",
      },
      {
        id: "matching",
        name: "Matching Agent",
        title: "Agent 3",
        status: "idle",
        progress: 0,
        log: "Idle - Standby for quantitative scoring matrices",
      },
      {
        id: "reasoning",
        name: "Reasoning Agent",
        title: "Agent 4",
        status: "idle",
        progress: 0,
        log: "Idle - Standby to synthesize recommendation narrative",
      },
    ]);
    setSystemLogs(["[System] Pipeline reset. Setting up idle execution state."]);
  };

  const currentActiveAgent = pipelineStep >= 1 && pipelineStep <= 4 ? agents[pipelineStep - 1] : null;

  return (
    <div id="agent-timeline" className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 flex flex-col gap-6">
      {/* Header and trigger */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-bold text-indigo-900 flex items-center gap-2">
            <Cpu className="w-4 h-4 text-indigo-600" />
            🤖 Agentic AI Pipeline Orchestrator
          </h2>
          <p className="text-2xs text-slate-500 mt-1 font-sans">
            DELIMa matches students by sending parameters to 4 separate autonomous agents.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {pipelineStep === 5 ? (
            <button
              onClick={triggerReset}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs py-2 px-3 rounded-lg flex items-center gap-1.5 transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Engine
            </button>
          ) : (
            <button
              onClick={onPipelineStart}
              disabled={isPipelineRunning}
              className={`font-semibold text-xs py-2 px-4 rounded-lg flex items-center gap-1.5 transition-all border ${
                isPipelineRunning
                  ? "bg-indigo-50 border-indigo-200 text-indigo-400 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700 text-white border-indigo-600 shadow-sm shadow-indigo-100"
              }`}
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              {isPipelineRunning ? "Running Simulation..." : "Run AI Pipeline"}
            </button>
          )}
        </div>
      </div>

      {/* Grid of four agents displaying status, logs, current step indicators */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {agents.map((agent, index) => {
          const isCurrentActive = currentActiveAgent?.id === agent.id;
          const isDone = agent.status === "completed";
          const isWaiting = agent.status === "idle";

          return (
            <div
              key={agent.id}
              className={`p-4 rounded-xl border transition-all flex flex-col gap-2.5 relative overflow-hidden ${
                isCurrentActive
                  ? "bg-indigo-50/70 border-indigo-200 shadow-sm"
                  : isDone
                  ? "bg-emerald-50/40 border-emerald-100"
                  : "bg-slate-50 border-slate-100"
              }`}
            >
              {/* Pulse light for current running agent */}
              {isCurrentActive && (
                <div className="absolute top-2 right-2 flex items-center gap-1">
                  <Activity className="w-3 h-3 text-indigo-600 animate-pulse" />
                  <span className="text-[9px] font-bold text-indigo-600 uppercase tracking-widest animate-pulse">
                    Active
                  </span>
                </div>
              )}

              <div className="flex items-center gap-2">
                <span
                  className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                    isCurrentActive
                      ? "bg-indigo-600 text-white"
                      : isDone
                      ? "bg-emerald-600 text-white"
                      : "bg-slate-300 text-slate-600"
                  }`}
                >
                  {agent.title}
                </span>
                <span className="text-xs font-semibold text-slate-800 font-sans truncate pr-8">
                  {agent.name}
                </span>
              </div>

              {/* Progress Bar inside card */}
              <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden mt-1">
                <div
                  className={`h-full rounded-full transition-all duration-150 ${
                    isDone
                      ? "bg-emerald-500"
                      : isCurrentActive
                      ? "bg-indigo-600"
                      : "bg-slate-300"
                  }`}
                  style={{ width: `${agent.progress}%` }}
                ></div>
              </div>

              <div className="flex justify-between items-center mt-1">
                <span className="text-[10px] text-slate-500 font-sans italic truncate max-w-[130px]">
                  {agent.status === "completed"
                    ? "✓ Processing complete"
                    : agent.status === "running"
                    ? "⚡ Orchestration active..."
                    : "💤 Standing by for input"}
                </span>
                <span className="text-[10px] font-mono font-bold text-slate-700">
                  {agent.progress}%
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Simulated Live System Logs Terminal */}
      <div className="bg-slate-950 rounded-xl p-4 font-mono text-[11px] leading-relaxed text-slate-200 border border-slate-800">
        <div className="flex items-center justify-between mb-2 pb-2 border-b border-slate-800 text-slate-400">
          <span className="flex items-center gap-1.5 font-sans font-bold text-2xs uppercase tracking-wider">
            <Terminal className="w-3.5 h-3.5 text-indigo-400 font-sans" />
            Agent Console Out Logs (Simulated Server-Side)
          </span>
          <span className="text-[10px]">Port: 3000 | Sandbox Status: Ready</span>
        </div>
        <div className="space-y-1.5 max-h-32 overflow-y-auto pr-2 custom-scrollbar flex flex-col">
          {systemLogs.length === 0 ? (
            <span className="text-slate-500 italic">Waiting for pipeline run key command... Click "Run AI Pipeline" to view agent processing pipelines.</span>
          ) : (
            systemLogs.map((log, index) => {
              let color = "text-indigo-400";
              if (log.includes("[System]")) color = "text-teal-400";
              else if (log.includes("Agent 1")) color = "text-sky-300";
              else if (log.includes("Agent 2")) color = "text-purple-300";
              else if (log.includes("Agent 3")) color = "text-amber-300";
              else if (log.includes("Agent 4")) color = "text-fuchsia-300";

              return (
                <div key={index} className="flex gap-1.5 items-start">
                  <span className="text-slate-500 shrink-0">[{new Date().toLocaleTimeString()}]</span>
                  <span className={color}>{log}</span>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
