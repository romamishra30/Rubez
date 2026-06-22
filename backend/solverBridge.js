const { spawn } = require("child_process");
const path = require("path");

function solveScramble(scramble) {
  return new Promise((resolve, reject) => {
    const solverPath = path.join(__dirname, "..", "solver", "Rubik.exe");

    const child = spawn(solverPath);

    let output = "";
    let error = "";

    child.stdout.on("data", (data) => {
      output += data.toString();
    });

    child.stderr.on("data", (data) => {
      error += data.toString();
    });

    child.on("error", (err) => {
      reject(err);
    });

    child.on("close", (code) => {
      if (code !== 0) {
        reject(new Error(error || "Solver failed"));
        return;
      }

      const lines = output.trim().split(/\r?\n/);

      const stages = [];
      const moves = [];

      lines.forEach((line) => {
        if (line.startsWith("[STAGE]")) {
          stages.push({
            name: line.replace("[STAGE]", "").trim(),
            startMoveIndex: moves.length,
          });
        } else {
          const lineMoves = line
            .trim()
            .split(/\s+/)
            .filter((move) => /^[URFDLB]2?'?$/.test(move));

          moves.push(...lineMoves);
        }
      });

      resolve({
        solution: moves,
        stages,
        rawOutput: output,
      });
    });

    child.stdin.write(scramble + "\n");
    child.stdin.end();
  });
}

module.exports = { solveScramble };
