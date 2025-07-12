

require('dotenv').config();
const express = require('express');
const multer = require('multer');
const pdf = require('pdf-parse');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const router = express.Router();
const port = process.env.PORT || 3002;

// Middleware
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Multer setup for file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Not a PDF file!'), false);
    }
  },
});

// Google Gemini AI setup
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Use the router for all API routes
app.use('/api', router);

// Routes
router.get('/', (req, res) => {
  res.send('Hello from the backend API!');
});

router.post('/upload', upload.single('transcript'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded.' });
  }

  try {
    const data = await pdf(req.file.buffer);
    const text = data.text;

    // 2. Generate the prompt for Gemini
    const prompt = `
You are a savage roaster. Your job is to first analyze the provided raw text from a university result PDF, identify the subjects, grades, and GPA, and then roast the user's academic performance. Be brutally honest, savage, and funny. Use some Hinglish (Hindi words in English script) abusive words to make it more impactful.

Here is the grading scale for reference, there's only these grades, nothing else than this:
O: 10 (Outstanding)
A+: 9 (Excellent)
A: 8 (Very Good)
B+: 7 (Good)
B: 6 (Above Average)
C: 5 (Average)
D: 4 (Pass)
F: 0 (Fail)

Here is the raw text from the user's result PDF. Parse it to find their grades and GPA information:
---
${text}
---

Now, roast the user based on the data you extracted. IMPORTANT: A subject ending with subject code TW is the internal/practical part of the main theory subject with the same name. They are NOT repeated subjects. You should be extra critical of high grades in 'Term Work' subjects as they are generally easier to score in. Analyze the user's semester-wise GPA trend (SGPA/CGPA). If their GPA improved, give a backhanded compliment. If it dropped, be extra brutal. If the user has high marks overall, roast them for being a bookworm with no life. If they have low marks, well, you know what to do. The roast should be short, direct, and savage, at last give them a reality and personality check based on subjects they are good at and subjects they are bad at.
`.trim();

    // 3. Send to Gemini and get the roast
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const roastText = response.text();

    res.json({ roast: roastText });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to process the PDF.' });
  }
});

// Error handling for multer
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    return res.status(400).json({ error: error.message });
  }
  if (error) {
    return res.status(400).json({ error: error.message });
  }
  next();
});


// Start the server only if this file is run directly
if (require.main === module) {
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
}

module.exports = app;
