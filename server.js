const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const Tesseract = require('tesseract.js');
const { OpenAI } = require('openai');

const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));

const openai = new OpenAI({
  apiKey: "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"
});

app.get('/', (req, res) => {
  res.send("✅ Backend with ChatGPT is live!");
});

app.post('/solve', async (req, res) => {
  const imageData = req.body.image.split(',')[1];
  const buffer = Buffer.from(imageData, 'base64');

  try {
    const { data: { text } } = await Tesseract.recognize(buffer, 'eng');
    const question = text.trim().replace(/\n/g, ' ');

    const chatResponse = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: "You are a helpful math tutor. Solve the problem clearly and step by step." },
        { role: "user", content: `Solve this math problem: ${question}` }
      ]
    });

    const solution = chatResponse.choices[0].message.content;
    res.json({ extracted: question, result: solution });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log("✅ Server with OCR + ChatGPT running on port " + port));