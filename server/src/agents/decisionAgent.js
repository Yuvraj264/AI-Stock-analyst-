import { computeDecision } from '../services/decisionService.js';
import { AppError } from '../utils/AppError.js';

/**
 * Validates that a sub-score input is a valid number between 0 and 100.
 * 
 * @param {string} name - Name of the score field
 * @param {number} value - Sub-score value
 */
const validateScore = (name, value) => {
  if (value === undefined || value === null) {
    throw new AppError(`Missing required score input: "${name}"`, 400);
  }
  const num = Number(value);
  if (isNaN(num)) {
    throw new AppError(`Invalid score type for "${name}". Must be a number.`, 400);
  }
  if (num < 0 || num > 100) {
    throw new AppError(`Score "${name}" must be between 0 and 100. Received: ${value}`, 400);
  }
};

/**
 * Decision Agent workflow coordinator.
 * Validates sub-scores, triggers weighted calculations, and maps recommendation classifications.
 * 
 * @param {Object} input - Input properties
 * @param {number} input.financialScore - Financial Health score (0-100)
 * @param {number} input.newsScore - News Sentiment score (0-100)
 * @param {number} input.riskScore - Risk Safety score (0-100)
 * @returns {Promise<Object>} Formatted decision output: { finalScore, recommendation, confidence }
 */
export const runDecisionAgent = async ({ financialScore, newsScore, riskScore }) => {
  try {
    console.log('[Decision Agent] >>> Initiating quantitative evaluation workflow...');
    console.log(`[Decision Agent] Inputs - Financial: ${financialScore}, News: ${newsScore}, Risk: ${riskScore}`);

    // Validate sub-scores
    validateScore('financialScore', financialScore);
    validateScore('newsScore', newsScore);
    validateScore('riskScore', riskScore);

    // Compute decision properties
    const decision = computeDecision(
      Number(financialScore),
      Number(newsScore),
      Number(riskScore)
    );

    console.log(`[Decision Agent] >>> Completed. Result: "${decision.recommendation}" (Score: ${decision.finalScore}/100, Confidence: ${decision.confidence}%)`);

    return decision;
  } catch (error) {
    console.error('[Decision Agent Error] Evaluation workflow failed:', error.message);
    
    if (error instanceof AppError) throw error;
    throw new AppError(`Decision Agent execution failed: ${error.message}`, 500);
  }
};

export default runDecisionAgent;
