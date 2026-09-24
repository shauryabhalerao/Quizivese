import { Router } from 'express';
import multer from 'multer';
import { 
  getAiStatus,
  generateAiQuiz, 
  generateFromUploads, 
  explainQuestion, 
  generatePersonalized,
  analyzePerformance 
} from '../controllers/aiQuiz.controller.js';
import { aiLimiter } from '../middleware/rateLimiter.js';
import { validateAiGen } from '../middleware/validator.js';

const router = Router();

// Multer in-memory storage for PDF notes and images (max 10MB each, max 10 files)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB per file
    files: 10
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = [
      'application/pdf',
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/webp',
      'text/plain',
      'text/markdown'
    ];
    if (allowedMimes.includes(file.mimetype.toLowerCase())) {
      cb(null, true);
    } else {
      cb(new Error(`Unsupported file type: ${file.mimetype}. Please upload a PDF, image (JPG, PNG, WEBP), or text notes document.`));
    }
  }
});

// 0. AI Status Check Endpoint
router.get('/status', getAiStatus);

// 1. Topic Prompt Generation
router.post('/generate', aiLimiter, validateAiGen, generateAiQuiz);

// 2. Multimodal PDF & Image Upload Generation
router.post('/upload-and-generate', aiLimiter, upload.array('files', 10), generateFromUploads);

// 3. Ask AI Tutor (Explanation on Results Page)
router.post('/explain', aiLimiter, explainQuestion);

// 4. Personalized Weak Area Practice Drill
router.post('/personalized', aiLimiter, generatePersonalized);

// 5. Diagnostics & Performance Analysis
router.post('/analyze', aiLimiter, analyzePerformance);

export default router;
