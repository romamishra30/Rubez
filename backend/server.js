const express = require("express");
const cors = require("cors");
const { solveScramble } = require("./solverBridge");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "RUBEZ backend running" });
});

app.post("/solve", async (req, res) => {
  try {
    const { scramble } = req.body;

    if (!scramble) {
      return res.status(400).json({ error: "Scramble is required" });
    }

    const result = await solveScramble(scramble);

    res.json({
      success: true,
      scramble,
      solution: result.solution,
      moveCount: result.solution.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});