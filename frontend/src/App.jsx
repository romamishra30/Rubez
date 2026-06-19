import { useState } from "react";
import Cube3D from "./components/Cube3D";
import StretchyToggle from "./components/StretchyToggle";
import { solveCube } from "./api/solverApi.js";

const methodSteps = [
  "Cross",
  "First Layer Corners",
  "Middle Layer Edges",
  "Orient Last Layer",
  "Permute Last Layer",
];

const currentStage = 2;

function Panel({ title, children, className = "" }) {
  return (
    <div
      className={`rounded-xl border border-cyan-400/40 bg-[#03070d]/90 p-3 shadow-[0_0_18px_rgba(0,255,255,0.15)] ${className}`}
    >
      <h2 className="mb-3 text-sm font-bold tracking-wide text-cyan-300 drop-shadow-[0_0_8px_#00eaff]">
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

export default function App() {
  const [neonMode, setNeonMode] = useState(false);
  const [solution, setSolution] = useState([]);
  const [scramble, setScramble] = useState("R U R' U' F2 D L2 B' U2 R2");

  const [activeBtn, setActiveBtn] = useState("");

  const handleSolve = async () => {
    const result = await solveCube(scramble);
    setSolution(result.solution);
  };

  const handleReset = () => {
    setSolution([]);
    setScramble("R U R' U' F2 D L2 B' U2 R2");
  };

  const currentMove = 0;

  const progress =
    solution.length > 0 ? ((currentMove + 1) / solution.length) * 100 : 0;

  const movesMade = solution.length ? currentMove : 0;

  const status =
    solution.length === 0
      ? "Not Solved"
      : currentMove === solution.length - 1
        ? "Solved"
        : "Solving";

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
        </header>

        <aside className="row-span-2 flex h-full min-h-0 flex-col gap-2 overflow-hidden">
          <Panel title="INPUT">
            <label className="mb-2 block text-[11px] font-bold text-cyan-300">
              SCRAMBLE / CUBE STATE
            </label>

            <input
              value={scramble}
              onChange={(e) => setScramble(e.target.value)}
              className="w-full rounded-md border border-cyan-400/30 bg-black/40 px-3 py-2 text-sm text-white outline-none"
            />

            <div className="mt-3 grid grid-cols-2 gap-2">
              <Button
                primary
                active={activeBtn === "solve"}
                onClick={() => {
                  setActiveBtn("solve");
                  handleSolve();
                }}
              >
                ▶ Solve
              </Button>

              <Button
                active={activeBtn === "reset"}
                onClick={() => {
                  setActiveBtn("reset");
                }}
              >
                ↻ Reset
              </Button>
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
            className="flex flex-1 flex-col overflow-hidden"
          >
            <div className="flex flex-1 flex-col justify-between text-sm">
              {methodSteps.map((step, index) => {
                const isDone = index < currentStage;
                const isCurrent = index === currentStage;

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
            <div className="absolute left-1/2 top-1/2 h-[620px] w-[620px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-400/20 shadow-[0_0_30px_rgba(0,255,255,0.18)]" />
            <div className="absolute left-1/2 top-1/2 h-[470px] w-[470px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-300/25 shadow-[0_0_40px_rgba(0,255,255,0.18)]" />
            <div className="absolute left-1/2 top-1/2 h-[320px] w-[320px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-fuchsia-400/25 shadow-[0_0_35px_rgba(255,0,255,0.18)]" />
            <div className="absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 animate-spin rounded-full border-t-2 border-cyan-300/70 border-b-transparent border-l-transparent border-r-transparent [animation-duration:18s]" />
            <div className="absolute left-1/2 top-1/2 h-[390px] w-[390px] -translate-x-1/2 -translate-y-1/2 animate-spin rounded-full border-b-2 border-fuchsia-400/70 border-l-transparent border-r-transparent border-t-transparent [animation-duration:25s]" />
          </div>

          <Cube3D neonMode={neonMode} />

          <div className="absolute bottom-4 left-0 right-0 text-center text-xs font-bold tracking-wide text-cyan-300">
            DRAG TO ROTATE &nbsp; • &nbsp; SCROLL TO ZOOM
          </div>
        </main>

        <div className="flex min-h-0 flex-col gap-2 overflow-hidden">
          <Panel title="CUBE INFO" className="flex-1">
            <div className="space-y-3 text-sm">
              <p className="flex justify-between">
                <span>Moves made</span>
                <b>
                  {movesMade} / {solution.length}
                </b>
              </p>

              <p className="flex justify-between">
                <span>Total moves</span>
                <b className="text-cyan-300">{solution.length}</b>
              </p>

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
            <div className="mb-3 grid grid-cols-4 gap-2">
              <Button>◀ First</Button>
              <Button>◀ Prev</Button>
              <Button>▶ Next</Button>
              <Button>⏭ Last</Button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Button primary>▶ Play</Button>
              <Button>Ⅱ Pause</Button>
            </div>

            <div className="mt-4">
              <label className="mb-2 block text-[11px] font-bold text-cyan-300">
                ANIMATION SPEED
              </label>
              <input
                type="range"
                defaultValue="60"
                className="w-full accent-cyan-300"
              />
            </div>
          </Panel>
        </div>

        <Panel
          title="SOLUTION"
          className="col-start-2 col-span-2 overflow-hidden"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8 text-sm font-bold">
              <span className="text-cyan-300">{solution.length} MOVES</span>
              <span className="text-fuchsia-400">~ 6.23s</span>
            </div>

            <button className="rounded-md border border-cyan-400/40 px-4 py-2 text-xs hover:bg-cyan-400/10">
              COPY
            </button>
          </div>

          <div className="mt-4 flex justify-between text-sm">
            <span>
              Current Move:
              <span className="ml-2 text-cyan-300">
                {solution[currentMove] || "-"}
              </span>
            </span>

            <span>
              Move{" "}
              <span className="font-bold text-cyan-300">
                {solution.length ? currentMove + 1 : 0}
              </span>{" "}
              / {solution.length}
            </span>
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
