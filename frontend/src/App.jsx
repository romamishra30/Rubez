import { useEffect, useState } from "react";
import Cube3D from "./components/Cube3D";
import StretchyToggle from "./components/StretchyToggle";
import { solveCube } from "./api/solverApi.js";
import { Play, Pause, RotateCcw } from "lucide-react";

function generateScramble(length = 10) {
  const moves = ["R", "L", "U", "D", "F", "B"];
  const suffixes = ["", "'", "2"];
  let scramble = [];

  for (let i = 0; i < length; i++) {
    const move = moves[Math.floor(Math.random() * moves.length)];
    const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];

    if (scramble.length > 0 && scramble[scramble.length - 1][0] === move) {
      i--;
      continue;
    }

    scramble.push(move + suffix);
  }

  return scramble.join(" ");
}

const methodSteps = [
  "Cross",
  "First Layer Corners",
  "Middle Layer Edges",
  "Orient Last Layer",
  "Permute Last Layer",
];

function Panel({ title, children, className = "" }) {
  return (
    <div
      className={`rounded-xl border border-cyan-400/40 bg-[#03070d]/90 p-3 shadow-[0_0_18px_rgba(0,255,255,0.15)] ${className}`}
    >
      <h2 className="mb-3 text-sm font-black tracking-wide bg-gradient-to-r from-cyan-300 to-pink-300 bg-clip-text text-transparent drop-shadow-[0_0_10px_#00eaff]">
        {title}
      </h2>
      {children}
    </div>
  );
}

function Button({ children, primary = false, onClick, active = false }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-md border px-2 py-2 text-[11px] font-bold uppercase transition-all duration-200
      ${
        active
          ? "border-cyan-300 bg-cyan-400/20 text-white shadow-[0_0_20px_rgba(0,255,255,0.7)]"
          : "border-cyan-500/40 bg-black/30 text-cyan-100 hover:bg-cyan-400/10"
      }`}
    >
      {children}
    </button>
  );
}

function parseMoves(text = "") {
  return text.trim().split(/\s+/).filter(Boolean);
}

export default function App() {
  const [visualMoves, setVisualMoves] = useState([]);
  const [mode, setMode] = useState("idle");
  const [neonMode, setNeonMode] = useState(false);
  const [solution, setSolution] = useState([]);
  const [scramble, setScramble] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentMove, setCurrentMove] = useState(0);

  const [seconds, setSeconds] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);

  const [activeBtn, setActiveBtn] = useState("");
  const [speedMultiplier, setSpeedMultiplier] = useState(1);
  const activeMoves = mode === "scramble" ? visualMoves : solution;
  const animationSpeed =
    mode === "scramble" ? 200 / speedMultiplier : 800 / speedMultiplier;
  const [stages, setStages] = useState([]);

  const handleGenerateScramble = () => {
    const newScramble = generateScramble();
    const moves = parseMoves(newScramble);

    setScramble(newScramble);
    setSolution([]);
    setVisualMoves(moves);
    setCurrentMove(0);
    setIsPlaying(true);
    setMode("scramble");
    setSeconds(0);
    setTimerRunning(false);
  };

  const getCurrentStage = () => {
    if (mode !== "solve") return -1;
    if (!stages.length) return -1;

    let stageIndex = 0;

    for (let i = 0; i < stages.length; i++) {
      if (currentMove >= stages[i].startMoveIndex) {
        stageIndex = i;
      }
    }

    return stageIndex;
  };

  const currentStage = getCurrentStage();

  const handleSolve = async () => {
    const result = await solveCube(scramble);

    console.log("Backend result:", result);
    console.log("Solution moves:", result.solution);
    console.log("Solution length:", result.solution.length);

    setSolution(result.solution);
    setStages(result.stages || []);
    setMode("solve");
    setCurrentMove(0);

    // Reset and start timer for this solve
    setSeconds(0);
    setTimerRunning(true);

    setIsPlaying(false);
  };

  const handleAutoSolve = async () => {
    let moves = solution;

    if (moves.length === 0) {
      const result = await solveCube(scramble);

      moves = result.solution;

      setSolution(result.solution);
      setStages(result.stages || []);
    }

    setMode("solve");
    setCurrentMove(0);
    setSeconds(0);
    setTimerRunning(true);
    setIsPlaying(true);
  };

  const handleReset = () => {
    setSolution([]);
    setCurrentMove(0);
    setIsPlaying(false);

    setSeconds(0);
    setTimerRunning(false);

    setScramble("R U R' U' F2 D L2 B' U2 R2");
  };

  const startTimerIfNeeded = () => {
    if (!timerRunning) {
      setTimerRunning(true);
    }
  };

  const handleNext = () => {
    if (currentMove < solution.length - 1) {
      setCurrentMove((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentMove > 0) {
      setCurrentMove((prev) => prev - 1);
    }
  };

  const handleFirst = () => {
    setCurrentMove(0);
  };

  const handleLast = () => {
    if (solution.length > 0) {
      setCurrentMove(solution.length - 1);
    }
  };

  const handlePlay = () => {
    if (solution.length > 0) {
      setIsPlaying(true);
      setTimerRunning(true);
    }
  };

  const handlePause = () => {
    setIsPlaying(false);
    setTimerRunning(false);
  };

  const progress =
    solution.length > 0 ? ((currentMove + 1) / solution.length) * 100 : 0;

  const movesMade = solution.length ? currentMove + 1 : 0;
  const status =
    solution.length === 0
      ? "Not Solved"
      : currentMove === solution.length - 1
        ? "Solved"
        : "Solving";

  const formatTime = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;

    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  useEffect(() => {
    if (!timerRunning) return;

    const timer = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timerRunning]);

  useEffect(() => {
    if (!isPlaying || activeMoves.length === 0) return;

    const timer = setInterval(() => {
      setCurrentMove((prev) => {
        if (prev >= activeMoves.length - 1) {
          setIsPlaying(false);
          setTimerRunning(false);
          return prev;
        }

        return prev + 1;
      });
    }, animationSpeed);

    return () => clearInterval(timer);
  }, [isPlaying, activeMoves.length, animationSpeed]);
  return (
    <div className="h-screen w-screen overflow-hidden bg-[#020408] p-2 text-cyan-100">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_45%_40%,rgba(0,255,255,0.12),transparent_30%),radial-gradient(circle_at_75%_55%,rgba(255,0,200,0.10),transparent_26%)]" />

      <div className="relative grid h-full grid-cols-[270px_minmax(0,1fr)_300px] grid-rows-[64px_minmax(0,1fr)_160px] gap-2">
        <header className="col-span-3 flex items-center rounded-xl border border-cyan-400/35 bg-[#03070d]/90 px-5 shadow-[0_0_18px_rgba(0,255,255,0.15)]">
          <div className="mr-4 text-3xl text-cyan-300 drop-shadow-[0_0_10px_#00eaff]">
            ◇
          </div>

          <div>
            <h1 className="text-2xl font-black tracking-wide text-cyan-300 drop-shadow-[0_0_10px_#00eaff]">
              RUBEZ
            </h1>
            <p className="mt-0.5 text-[11px] tracking-wider text-cyan-400/70 uppercase">
              Rubik's Cube Solver • Beginner Method
            </p>
          </div>

          <div className="ml-auto flex items-center gap-4 rounded-xl border border-cyan-400/30 bg-[#06111d] px-4 py-2 shadow-[0_0_12px_rgba(0,255,255,0.15)]">
            <button
              onClick={() => setTimerRunning(!timerRunning)}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-cyan-400/30 bg-cyan-400/10 hover:bg-cyan-400/20"
            >
              {timerRunning ? "❚❚" : "▷"}
            </button>

            <span className="font-mono text-xl font-bold tracking-wider text-cyan-300">
              {formatTime(seconds)}
            </span>

            <button
              onClick={() => {
                setSeconds(0);
                setTimerRunning(false);
              }}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-cyan-400/30 bg-cyan-400/10 hover:bg-cyan-400/20"
            >
              ↻
            </button>
          </div>
        </header>

        <aside className="row-span-2 flex h-full min-h-0 flex-col gap-2 overflow-hidden">
          <Panel title="SCRAMBLE TRAINER">
            <label className="mb-2 block text-[11px] font-bold text-cyan-300">
              RANDOM SCRAMBLE
            </label>

            <div className="rounded-md border border-cyan-400/30 bg-black/40 px-3 py-2 text-sm text-white">
              {scramble}
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2">
              <Button primary onClick={handleSolve}>
                Solve
              </Button>

              <Button onClick={handleGenerateScramble}>↻ New Scramble</Button>
            </div>
          </Panel>

          <Panel title="DISPLAY">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold">VISUAL MODE</span>
              <StretchyToggle checked={neonMode} onChange={setNeonMode} />
            </div>
          </Panel>

          <Panel
  title="METHOD STEPS"
  className="flex flex-1 flex-col overflow-hidden shadow-[0_0_30px_rgba(236,72,153,0.18)]"
>
            <div className="flex flex-1 flex-col justify-between text-sm">
              {methodSteps.map((step, index) => {
                const isDone = currentStage > index;
                const isCurrent = currentStage === index;

                return (
                  <div
                    key={index}
                    className={`flex items-center gap-3 rounded-md border px-3 py-3 transition ${
                      isCurrent
                        ? "border-cyan-300 bg-cyan-400/15 shadow-[0_0_16px_rgba(0,255,255,0.35)]"
                        : isDone
                          ? "border-green-400/40 bg-green-400/10"
                          : "border-cyan-400/20 bg-black/30"
                    }`}
                  >
                    <span
                      className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                        isDone
                          ? "bg-green-400/30 text-green-300"
                          : isCurrent
                            ? "bg-cyan-400/30 text-cyan-100"
                            : "bg-cyan-400/10 text-cyan-400"
                      }`}
                    >
                      {isDone ? "✓" : isCurrent ? "▶" : index + 1}
                    </span>

                    <span
                      className={isCurrent ? "font-bold text-cyan-200" : ""}
                    >
                      {step}
                    </span>
                  </div>
                );
              })}
            </div>
          </Panel>
        </aside>

        <main className="relative min-h-0 overflow-hidden rounded-xl border border-cyan-400/35 bg-[#020408]/90 shadow-[0_0_22px_rgba(0,255,255,0.14)]">
          <div className="absolute left-4 top-4 z-10 text-sm font-bold text-cyan-300 drop-shadow-[0_0_8px_#00eaff]">
            3D CUBE
          </div>
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute left-1/2 top-1/2 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-400/15 shadow-[0_0_35px_rgba(0,255,255,0.22)]" />

            <div className="absolute left-1/2 top-1/2 h-[560px] w-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-300/25 shadow-[0_0_45px_rgba(0,255,255,0.18)]" />

            <div className="absolute left-1/2 top-1/2 h-[390px] w-[390px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-fuchsia-400/30 shadow-[0_0_40px_rgba(255,0,255,0.20)]" />

            <div className="absolute left-1/2 top-1/2 h-[660px] w-[660px] -translate-x-1/2 -translate-y-1/2 animate-spin rounded-full border-t-2 border-cyan-300/70 border-b-transparent border-l-transparent border-r-transparent [animation-duration:18s]" />

            <div className="absolute left-1/2 top-1/2 h-[460px] w-[460px] -translate-x-1/2 -translate-y-1/2 animate-spin rounded-full border-b-2 border-fuchsia-400/70 border-l-transparent border-r-transparent border-t-transparent [animation-duration:25s]" />
          </div>
          <Cube3D
            neonMode={neonMode}
            scramble={mode === "scramble" ? "" : scramble}
            solution={mode === "scramble" ? visualMoves : solution}
            currentMoveIndex={currentMove}
            currentMove={
              (mode === "scramble" ? visualMoves : solution)[currentMove]
            }
            mode={mode}
          />
          <div className="absolute bottom-4 left-0 right-0 text-center text-xs font-bold tracking-wide text-cyan-300">
            DRAG TO ROTATE &nbsp; • &nbsp; SCROLL TO ZOOM
          </div>
        </main>

        <div className="flex min-h-0 flex-col gap-2 overflow-hidden">
          <Panel title="CUBE INFO" className="h-[150px] shrink-0">
            <div className="space-y-3 text-sm">
              <p className="flex justify-between">
                <span>Current move</span>
                <b className="text-cyan-300">{solution[currentMove] || "-"}</b>
              </p>

              <p className="flex justify-between">
                <span>Current stage</span>
                <b className="text-cyan-300">{methodSteps[currentStage]}</b>
              </p>

              <p className="flex justify-between">
                <span>Status</span>
                <b
                  className={
                    status === "Solved"
                      ? "text-green-400"
                      : status === "Solving"
                        ? "text-yellow-400"
                        : "text-red-400"
                  }
                >
                  {status}
                </b>
              </p>
            </div>
          </Panel>

          <Panel title="CONTROLS" className="flex-1">
            <div className="mb-4 grid grid-cols-4 gap-1">
              <Button onClick={handleFirst}>First</Button>

              <Button onClick={handlePrev}>
                <span className="font-sans text-cyan-100">◀︎</span> Prev
              </Button>

              <Button onClick={handleNext}>
                <span className="font-sans text-cyan-100">NEXT</span> ▶︎
              </Button>

              <Button onClick={handleLast}>Last</Button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Button primary onClick={handlePlay}>
                Play
              </Button>

              <Button onClick={handlePause}>Pause</Button>
            </div>

            <div className="mt-4">
              <label className="mb-2 block text-[11px] font-bold text-cyan-300">
                ANIMATION SPEED
              </label>

              <div className="px-2">
                <input
                  type="range"
                  min="0"
                  max="2"
                  step="1"
                  value={[0.5, 1, 2].indexOf(speedMultiplier)}
                  onChange={(e) =>
                    setSpeedMultiplier([0.5, 1, 2][Number(e.target.value)])
                  }
                  className="w-full accent-cyan-300"
                />

                <div className="mt-2 flex items-center justify-between text-[10px] text-cyan-200">
                  <span>0.5x</span>

                  <span className="rounded-full border border-cyan-300/40 bg-cyan-400/10 px-3 py-1 text-xs font-bold text-cyan-100">
                    {speedMultiplier}x
                  </span>

                  <span>2x</span>
                </div>
                <div className="mt-6">
                  <button
                    onClick={handleAutoSolve}
                    className="w-full rounded-xl border border-cyan-300/40 bg-cyan-400/15 py-3 text-sm font-bold uppercase tracking-wide text-cyan-100 shadow-[0_0_15px_rgba(0,255,255,0.25)] transition-all duration-200 hover:bg-cyan-400/25 hover:shadow-[0_0_25px_rgba(0,255,255,0.4)]"
                  >
                    Auto Solve Cube
                  </button>
                </div>
              </div>
            </div>
          </Panel>
        </div>

        <Panel
          title={
            <div className="flex items-center justify-between w-full">
              <span>SOLUTION</span>
            </div>
          }
          className="col-start-2 col-span-2 overflow-hidden"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="w-full flex flex-wrap justify-center gap-5.5">
              {" "}
              {[
                "U",
                "U'",
                "U2",
                "D",
                "D'",
                "D2",
                "R",
                "R'",
                "R2",
                "L",
                "L'",
                "L2",
                "F",
                "F'",
                "F2",
                "B",
                "B'",
                "B2",
              ].map((move) => (
                <span
                  key={move}
                  className={`rounded-md border px-4 py-2 text-xs font-bold transition ${
                    solution[currentMove] === move && mode === "solve"
                      ? "border-cyan-300 bg-cyan-400/25 text-white shadow-[0_0_12px_rgba(0,255,255,0.8)]"
                      : "border-cyan-400/30 bg-black/30 text-cyan-100"
                  }`}
                >
                  {move}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-5 grid grid-cols-3 items-center text-sm">
            <div>
              Current Move:
              <span className="ml-2 font-bold text-cyan-300">
                {solution[currentMove] || "-"}
              </span>
            </div>

            <div className="text-center">
              Move{" "}
              <span className="font-bold text-cyan-300">
                {solution.length ? currentMove + 1 : 0}
              </span>{" "}
              / {solution.length}
            </div>

            <div className="flex justify-end">
              <button
                onClick={() =>
                  navigator.clipboard.writeText(solution.join(" "))
                }
                className="rounded-md border border-cyan-400/40 px-3 py-1 text-xs hover:bg-cyan-400/10"
              >
                COPY
              </button>
            </div>
          </div>

          <div className="mt-3 h-2 rounded-full bg-cyan-900/60">
            <div
              className="h-2 rounded-full bg-cyan-300 shadow-[0_0_12px_#00eaff]"
              style={{ width: `${progress}%` }}
            />
          </div>
        </Panel>
      </div>
    </div>
  );
}
