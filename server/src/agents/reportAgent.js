import { generateReport } from '../services/geminiService.js';
import { AppError } from '../utils/AppError.js';

/**
 * Report Agent workflow coordinator.
 * Feeds sub-agent scoring metrics, lists, recommendations, and parameters
 * into Gemini to compile a cohesive, professional investment research report.
 * 
 * @param {Object} input - Inputs from the graph state
 * @param {string} input.companyName - Target company name
 * @param {number} input.financialScore - Quantitative financial score (0-100)
 * @param {number} input.newsScore - News sentiment score (0-100)
 * @param {number} input.riskScore - Risk rating score (0-100)
 * @param {string} input.recommendation - Rating Action (e.g. STRONG_BUY)
 * @param {number} input.confidence - Analyst confidence rating
 * @param {Array<string>} input.strengths - Financial strengths checklist
 * @param {Array<string>} input.weaknesses - Financial weaknesses checklist
 * @param {Array<string>} input.positiveFactors - Positive market drivers
 * @param {Array<string>} input.negativeFactors - Negative market drivers
 * @param {Array<string>} input.risks - Identified risk factors
 * @returns {Promise<Object>} Formatted report object containing the markdown report string.
 */
export const runReportAgent = async ({
  companyName,
  financialScore,
  newsScore,
  riskScore,
  recommendation,
  confidence,
  strengths,
  weaknesses,
  positiveFactors,
  negativeFactors,
  risks
}) => {
  if (!companyName) {
    throw new AppError('companyName is required to execute the Report Agent workflow', 400);
  }

  try {
    console.log(`[Report Agent] >>> Starting report generation workflow for "${companyName}"...`);

    const result = await generateReport({
      companyName,
      financialScore,
      newsScore,
      riskScore,
      recommendation,
      confidence,
      strengths,
      weaknesses,
      positiveFactors,
      negativeFactors,
      risks
    });

    if (!result || !result.report) {
      throw new Error('Report compilation returned an invalid format or empty string.');
    }

    console.log(`[Report Agent] >>> Compiled successfully. Report length: ${result.report.length} characters.`);

    return {
      report: result.report
    };
  } catch (error) {
    console.error(`[Report Agent Error] Failed to generate investment report for "${companyName}":`, error.message);
    
    if (error instanceof AppError) throw error;
    throw new AppError(`Report Agent compilation failed: ${error.message}`, 500);
  }
};

export default runReportAgent;
