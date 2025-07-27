const express = require('express');
const bodyParser = require('body-parser');
const Tesseract = require('tesseract.js');
const { evaluate } = require('mathjs');

const app = express();
app.use(bodyParser.json({ limit: '10mb' }));

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

app.listen(5000, () => console.log('Server running on http://localhost:5000'));