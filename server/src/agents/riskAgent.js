import { analyzeRisk } from '../services/geminiService.js';
import { AppError } from '../utils/AppError.js';

/**
 * Clamps and aligns risk scores to target boundaries.
 * 
 * Rules:
 * - Low Risk   : 70 - 100
 * - Medium Risk: 40 - 70
 * - High Risk  : 0 - 40
 * 
 * Note: A higher score represents higher safety / lower investment risk.
 * 
 * @param {string} riskLevel - 'Low' | 'Medium' | 'High'
 * @param {number} rawScore - Raw score returned by the LLM
 * @returns {number} Clamped score
 */
const alignRiskScoreToBounds = (riskLevel, rawScore) => {
  const score = typeof rawScore === 'number' ? Math.round(rawScore) : parseInt(rawScore, 10) || 50;

  if (riskLevel === 'Low') {
    return Math.max(70, Math.min(100, score));
  }
  if (riskLevel === 'High') {
    return Math.max(0, Math.min(40, score));
  }
  // Medium Risk
  return Math.max(40, Math.min(70, score));
};

/**
 * Risk Agent workflow coordinator.
 * Feeds stock metrics, sentiment scores, and summary details to Gemini
 * to extract, validate, and clamp risk indicators.
 * 
 * @param {Object} input - Agent inputs
 * @param {string} input.companyName - Name of the target stock company
 * @param {Object} input.financialData - Resolved financial metrics
 * @param {number} input.financialScore - Quantitative financial score (0-100)
 * @param {string} input.newsSummary - Market sentiment summary
 * @param {string} input.sentiment - News sentiment classification ('Positive'|'Neutral'|'Negative')
 * @returns {Promise<Object>} Formatted Risk Report
 */
export const runRiskAgent = async ({
  companyName,
  financialData,
  financialScore,
  newsSummary,
  sentiment
}) => {
  if (!companyName) {
    throw new AppError('companyName is required to execute the Risk Agent workflow', 400);
  }

  try {
    console.log(`[Risk Agent] >>> Initiating risk analysis workflow for: "${companyName}"`);

    // 1. Invoke risk evaluation module
    const analysis = await analyzeRisk({
      companyName,
      financialData,
      financialScore,
      newsSummary,
      sentiment
    });

    // 2. Validate response properties
    const riskLevel = ['Low', 'Medium', 'High'].includes(analysis.riskLevel)
      ? analysis.riskLevel
      : 'Medium';

    const rawScore = typeof analysis.riskScore === 'number' ? analysis.riskScore : 50;
    const risks = Array.isArray(analysis.risks) ? analysis.risks : [];
    const mitigationFactors = Array.isArray(analysis.mitigationFactors) ? analysis.mitigationFactors : [];
    const summary = analysis.summary || 'No risk summary analysis provided.';

    // 3. Align scores to target boundaries
    const alignedScore = alignRiskScoreToBounds(riskLevel, rawScore);

    console.log(`[Risk Agent] >>> Completed. Risk Level: "${riskLevel}", Score: ${alignedScore}/100.`);

    return {
      riskScore: alignedScore,
      riskLevel,
      risks,
      mitigationFactors,
      summary
    };
  } catch (error) {
    console.error(`[Risk Agent Error] Risk analysis workflow failed for "${companyName}":`, error.message);
    
    if (error instanceof AppError) throw error;
    throw new AppError(`Risk Agent execution failed: ${error.message}`, 500);
  }
};

export default runRiskAgent;
