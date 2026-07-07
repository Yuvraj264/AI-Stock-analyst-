import { analyzeNews } from '../services/geminiService.js';
import { AppError } from '../utils/AppError.js';

/**
 * Validates and clamps sentiment scores into target boundaries.
 * 
 * Rules:
 * - Positive sentiment: 70 - 100
 * - Neutral sentiment: 40 - 70
 * - Negative sentiment: 0 - 40
 * 
 * @param {string} sentiment - 'Positive' | 'Neutral' | 'Negative'
 * @param {number} rawScore - Raw score returned by the LLM
 * @returns {number} Clamped and validated score
 */
const alignScoreToSentimentBounds = (sentiment, rawScore) => {
  const score = typeof rawScore === 'number' ? Math.round(rawScore) : parseInt(rawScore, 10) || 50;

  if (sentiment === 'Positive') {
    return Math.max(70, Math.min(100, score));
  }
  if (sentiment === 'Negative') {
    return Math.max(0, Math.min(40, score));
  }
  // Neutral sentiment
  return Math.max(40, Math.min(70, score));
};

/**
 * News Agent workflow coordinator.
 * Accepts aggregated news feeds, dispatches them for sentiment scoring,
 * validates schemas, and maps scores to target boundary constraints.
 * 
 * @param {Object} input - Agent inputs
 * @param {string} input.companyName - Resolved company name (e.g. "Tesla Inc.")
 * @param {Array} input.newsData - Array of articles
 * @returns {Promise<Object>} Formatted news sentiment report
 */
export const runNewsAgent = async ({ companyName, newsData }) => {
  if (!companyName) {
    throw new AppError('companyName is required to execute the News Agent workflow', 400);
  }

  const articles = newsData || [];
  if (articles.length === 0) {
    console.warn(`[News Agent Warning] No news articles provided for "${companyName}". Outputting default neutral stance.`);
    return {
      newsScore: 50,
      sentiment: 'Neutral',
      positiveFactors: ['Stable baseline visibility.'],
      negativeFactors: ['No recent public news feeds available.'],
      summary: `Neutral stance for ${companyName} due to absence of recent public news coverage.`
    };
  }

  try {
    console.log(`[News Agent] >>> Starting sentiment evaluation for "${companyName}" across ${articles.length} articles.`);

    // 1. Invoke Gemini sentiment parser
    const analysis = await analyzeNews(companyName, articles);

    // 2. Schema check and response validation
    const sentiment = ['Positive', 'Neutral', 'Negative'].includes(analysis.sentiment)
      ? analysis.sentiment
      : 'Neutral';

    const rawScore = typeof analysis.score === 'number' ? analysis.score : 50;
    const summary = analysis.summary || 'No summary analysis provided.';
    const positiveFactors = Array.isArray(analysis.positiveFactors) ? analysis.positiveFactors : [];
    const negativeFactors = Array.isArray(analysis.negativeFactors) ? analysis.negativeFactors : [];

    // 3. Align scores strictly within required ranges
    const alignedScore = alignScoreToSentimentBounds(sentiment, rawScore);

    console.log(`[News Agent] >>> Completed. Sentiment: "${sentiment}", Score: ${alignedScore}/100.`);

    return {
      newsScore: alignedScore,
      sentiment,
      positiveFactors,
      negativeFactors,
      summary
    };
  } catch (error) {
    console.error(`[News Agent Error] Analysis pipeline failed for "${companyName}":`, error.message);
    
    if (error instanceof AppError) throw error;
    throw new AppError(`News Agent execution failed: ${error.message}`, 500);
  }
};

export default runNewsAgent;
