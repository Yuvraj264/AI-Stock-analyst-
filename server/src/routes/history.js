import express from 'express';
import {
  getAnalysisHistory,
  getAnalysisDetail,
  deleteAnalysisRecord
} from '../controllers/analysisController.js';
import { validateObjectId } from '../middleware/validate.js';

const router = express.Router();

/**
 * @route   GET /api/history
 * @desc    Fetch reverse chronological history of all analysis runs
 * @access  Public
 */
router.get('/', getAnalysisHistory);

/**
 * @route   GET /api/history/:id
 * @desc    Fetch a specific stock analysis document by ID
 * @access  Public
 */
router.get('/:id', validateObjectId, getAnalysisDetail);

/**
 * @route   DELETE /api/history/:id
 * @desc    Delete a specific stock analysis record from the database
 * @access  Public
 */
router.delete('/:id', validateObjectId, deleteAnalysisRecord);

export default router;
