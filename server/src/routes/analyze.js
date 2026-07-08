import express from 'express';
import { runAnalysis } from '../controllers/analysisController.js';
import { validateCompanyQuery } from '../middleware/validate.js';

const router = express.Router();

/**
 * @route   POST /api/analyze
 * @desc    Submit a new company name to trigger LangGraph research and analysis
 * @access  Public
 */
router.post('/', validateCompanyQuery, runAnalysis);

export default router;
