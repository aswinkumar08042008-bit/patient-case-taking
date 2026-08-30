const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "MediVoice backend is running!",
  });
  app.get("/api/test", (req, res) => {
  res.json({
    success: true,
    message: "MediVoice API is connected!",
  });
});
app.post("/api/chat", (req, res) => {
  const { message, language } = req.body;

  console.log("Patient message:", message);
  console.log("Language:", language);

  res.json({
    success: true,
    reply: `I received your message: ${message}`,
  });
});
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`MediVoice backend running on http://localhost:${PORT}`);
});