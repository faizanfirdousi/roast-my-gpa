

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

    // 1. Extract subject and grade pairs
    const results = [];
    // First, stitch together lines that may have been broken during PDF extraction.
    const stitchedText = text.replace(/-\n([A-Z_0-9]+)/g, '-$1').replace(/([a-zA-Z])\s+([a-zA-Z])/g, '$1$2');
    const lines = stitchedText.split('\n');

    lines.forEach(line => {
        // This regex is designed to be robust and capture all parts of the course line.
        const courseRegex = /^(\*?[A-Z0-9/\-_]+(?:_TW)?(?:-\d)?)\s*([A-Z][A-Z\s\-&,()]+[A-Z])\s*(\d+)\s*(\d+)\s*([A-Z][+]?|O)\s*(\d+)/;
        const match = line.match(courseRegex);

        if (match) {
            const subjectCode = match[1].trim();
            const subjectName = match[2].trim();
            const grade = match[5].trim();
            const gradePoint = parseInt(match[6], 10);
            const isTermWork = subjectCode.endsWith('_TW');

            results.push({
                subject: subjectName,
                code: subjectCode,
                grade: grade,
                gradePoint: gradePoint,
                isTermWork: isTermWork
            });
        }
    });

    if (results.length === 0) {
        return res.status(400).json({ error: 'Could not parse any subjects and grades from the PDF.' });
    }

    // Extract GPA
    let gpa = null;
    const gpaMatch = text.match(/(?:CGPA|SGPA|GPA)\s*:\s*(\d(?:\.\d{1,2})?)/i);
    if (gpaMatch && gpaMatch[1]) {
        gpa = gpaMatch[1];
    }

    // Extract all GPA-related lines to show semester-wise performance
    const gpaLines = text.match(/.*(CGPA|SGPA).*/gi) || [];
    const gpaInfo = gpaLines.map(line => line.trim()).join('\n');

    // 2. Generate the prompt for Gemini
    const prompt = `
You are a savage roaster. Your job is to roast the user's academic performance based on their grades. Be brutally honest, savage, and funny. Use some Hinglish (Hindi words in English script) abusive words to make it more impactful.

Here is the grading scale for reference, there's only these grades , nothing else than this
O: 10 (Outstanding)
A+: 9 (Excellent)
A: 8 (Very Good)
B+: 7 (Good)
B: 6 (Above Average)
C: 5 (Average)
D: 4 (Pass)
F: 0 (Fail)

Here are the user's grades:
${results.map(r => `- ${r.code}${r.isTermWork ? ' (Term Work)' : ''}: ${r.grade} (Grade Point: ${r.gradePoint})`).join('\n')}

Here is the user's GPA information:
${gpa ? `Overall GPA: ${gpa}\n` : ''}${gpaInfo}

Now, roast the user. IMPORTANT: A subject ending with subject code TW is the internal/practical part of the main theory subject with the same name. They are NOT repeated subjects. You should be extra critical of high grades in 'Term Work' subjects as they are generally easier to score in. Analyze user's semester-wise GPA trend. If their GPA improved, give a backhanded compliment. If it dropped, be extra brutal. If the user has high marks overall, roast them for being a bookworm with no life. If they have low marks, well, you know what to do. The roast should be short, direct, and savage, at last give them reality and personality check based on subjects they are good at and subjects they are bad at.
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
