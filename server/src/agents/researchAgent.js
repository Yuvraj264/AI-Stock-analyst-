import { getCompanyProfile, getFinancialMetrics, getHistoricalData } from '../services/yahooService.js';
import { getCompanyNews } from '../services/newsService.js';
import { AppError } from '../utils/AppError.js';

/**
 * Orchestrator agent that performs sequential research steps on a company.
 * 
 * Workflow:
 * 1. Resolves company name to ticker symbol and extracts profile data.
 * 2. Fetches key financial statistics and daily historical price history.
 * 3. Retrieves and normalizes the latest 10 news articles.
 * 
 * @param {Object} input - Workflow inputs
 * @param {string} input.companyName - Name of the target company (e.g., "Microsoft")
 * @returns {Promise<Object>} Formatted analytical research payload.
 */
export const runResearchAgent = async ({ companyName }) => {
  if (!companyName) {
    throw new AppError('companyName is required to execute the Research Agent workflow', 400);
  }

  try {
    console.log(`[Research Agent] >>> Initiating workflow for company: "${companyName}"`);

    // Step 1: Retrieve profile and resolve stock ticker
    const profile = await getCompanyProfile(companyName);
    const ticker = profile.ticker;

    // Step 2 & 3: Run data fetches concurrently for optimal latency
    console.log(`[Research Agent] >>> resolved to ticker: "${ticker}". Fetching financials & news...`);
    
    const [financialMetrics, historicalPriceData, newsData] = await Promise.all([
      getFinancialMetrics(ticker),
      // Gracefully handle historical failure (not vital if charts fail)
      getHistoricalData(ticker).catch((err) => {
        console.warn(`[Research Agent Warning] Historical data fetch failed: ${err.message}. Defaulting to empty array.`);
        return [];
      }),
      getCompanyNews(profile.companyName)
    ]);

    console.log(`[Research Agent] >>> Workflow successfully finished for "${profile.companyName}" (${ticker})`);

    // Formulate final structured output payload
    return {
      companyName: profile.companyName,
      ticker,
      profile: {
        sector: profile.sector,
        industry: profile.industry,
        summary: profile.longBusinessSummary
      },
      financialData: {
        metrics: financialMetrics,
        historical: historicalPriceData
      },
      newsData
    };
  } catch (error) {
    console.error(`[Research Agent Error] Workflow crashed for "${companyName}":`, error.message);
    
    // Propagate operational errors directly, wrap others
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(`Research Agent workflow failed: ${error.message}`, 500);
  }
};

export default runResearchAgent;
