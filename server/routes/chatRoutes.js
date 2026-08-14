

const express = require("express");
const router = express.Router();

const { askGemini } = require("../services/geminiService");

router.post("/", async (req, res) => {
  try {
    const reply = await askGemini(req.body.message);

    res.json({ reply });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      reply: "AI is unavailable",
    });
  }
});

module.exports = router;