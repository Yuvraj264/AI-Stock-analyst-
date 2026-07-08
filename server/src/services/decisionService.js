/**
 * Quantitative decision helper service.
 * Performs weighted sub-scores calculations and boundary distance evaluations.
 */

/**
 * Calculates confidence based on the distance from key decision thresholds (60 and 80).
 * 
 * Rules:
 * - Scores exactly at 60 or 80 represent borderline transitions (lowest confidence: 50%).
 * - High distance from thresholds (e.g., approaching 100, 70, or 0) represents high confidence (approaching 100%).
 * 
 * @param {number} finalScore - Calculated final score (0-100)
 * @returns {number} Confidence value (0-100)
 */
export const calculateConfidence = (finalScore) => {
  const score = Math.max(0, Math.min(100, Math.round(finalScore)));

  // 1. INVEST zone (80 - 100)
  if (score >= 80) {
    const distance = score - 80; // Range: 0 to 20
    return Math.round(50 + (distance * 2.5)); // Maps [0, 20] to [50, 100]
  }

  // 2. PASS zone (0 - 59)
  if (score < 60) {
    const distance = 60 - score; // Range: 1 to 60
    return Math.round(50 + (distance * (50 / 60))); // Maps [1, 60] to [50.8, 100]
  }

  // 3. HOLD zone (60 - 79)
  // Midpoint is 70 (highest confidence for a clear hold).
  // Distance from nearest boundary (60 or 80) ranges from 0 to 10.
  const distance = Math.min(score - 60, 80 - score);
  return Math.round(50 + (distance * 5)); // Maps [0, 10] to [50, 100]
};

/**
 * Determines investment recommendation classification.
 * 
 * @param {number} finalScore - Weighted final score (0-100)
 * @returns {string} 'INVEST' | 'HOLD' | 'PASS'
 */
export const determineRecommendation = (finalScore) => {
  const score = Math.round(finalScore);
  if (score >= 80) return 'INVEST';
  if (score >= 60) return 'HOLD';
  return 'PASS';
};

/**
 * Performs core decision calculations.
 * 
 * @param {number} financialScore - Financial sub-score (0-100)
 * @param {number} newsScore - News sub-score (0-100)
 * @param {number} riskScore - Risk safety sub-score (0-100)
 * @returns {Object} { finalScore, recommendation, confidence }
 */
export const computeDecision = (financialScore, newsScore, riskScore) => {
  // Weights: Financial = 50%, News = 30%, Risk = 20%
  const finalScoreRaw = (financialScore * 0.5) + (newsScore * 0.3) + (riskScore * 0.2);
  const finalScore = Math.round(finalScoreRaw);
  
  const recommendation = determineRecommendation(finalScore);
  const confidence = calculateConfidence(finalScore);

  return {
    finalScore,
    recommendation,
    confidence
  };
};

export default {
  calculateConfidence,
  determineRecommendation,
  computeDecision
};
