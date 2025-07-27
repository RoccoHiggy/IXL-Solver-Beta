const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const Tesseract = require('tesseract.js');
const { evaluate } = require('mathjs');

const app = express();
app.use(cors()); // ✅ Enable CORS for cross-origin requests
app.use(bodyParser.json({ limit: '10mb' }));

// Root route for Render check
app.get('/', (req, res) => {
  res.send('✅ Math Solver Backend with CORS is running!');
});

// Solve endpoint for OCR math problems
app.post('/solve', async (req, res) => {
  const imageData = req.body.image.split(',')[1];
  const buffer = Buffer.from(imageData, 'base64');

  try {
    const { data: { text } } = await Tesseract.recognize(buffer, 'eng');
    const cleaned = text.trim().replace(/\n/g, '');

    let result;
    try {
      result = evaluate(cleaned);
    } catch {
      result = 'Could not solve: ' + cleaned;
    }

    res.json({ extracted: cleaned, result: result.toString() });
  } catch (err) {
    res.status(500).json({ error: 'OCR failed', details: err.message });
  }
});

// Use dynamic port for Render or fallback to 5000
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`✅ Server with CORS running on port ${port}`));