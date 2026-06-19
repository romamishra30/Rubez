async function solveScramble(scramble) {
  console.log("Received scramble:", scramble);

  return {
    solution: ["U", "R", "U'", "R'", "F2"],
  };
}

module.exports = { solveScramble };