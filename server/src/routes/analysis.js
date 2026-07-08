import express from 'express';
import { runAnalysis, getAnalysisHistory } from '../controllers/analysisController.js';

const router = express.Router();

// Orchestrate new analysis flow
router.post('/', runAnalysis);

// Retrieve previous analyses logs
router.get('/', getAnalysisHistory);

export default router;
