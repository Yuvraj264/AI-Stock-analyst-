import { calculateFinancialScore } from '../services/scoringService.js';
import { AppError } from '../utils/AppError.js';

/**
 * Normalizes percentage values from decimals (e.g. 0.158 -> 15.8)
 */
const normalizePercentage = (val) => {
  if (val === null || val === undefined) return 0;
  if (Math.abs(val) <= 1.0 && val !== 0) {
    return val * 100;
  }
  return val;
};

/**
 * Normalizes debt to equity ratio (e.g. 145.8 -> 1.458)
 */
const normalizeDebtRatio = (val) => {
  if (val === null || val === undefined) return null;
  if (val > 3.0) {
    return val / 100;
  }
  return val;
};

/**
 * Formats currency values into readable Billions (B), Millions (M), or standard notations.
 */
const formatCurrency = (value) => {
  if (value === null || value === undefined) return '$0';
  const absVal = Math.abs(value);
  if (absVal >= 1e9) {
    return `$${(value / 1e9).toFixed(2)}B`;
  }
  if (absVal >= 1e6) {
    return `$${(value / 1e6).toFixed(2)}M`;
  }
  return `$${value.toLocaleString()}`;
};

/**
 * Analyzes financial metrics and generates descriptive strengths and weaknesses.
 * @param {Object} metrics - Standard financial metrics payload
 * @returns {Object} Strengths and weaknesses collections
 */
const detectStrengthsAndWeaknesses = (metrics) => {
  const strengths = [];
  const weaknesses = [];

  // 1. Evaluate Revenue Growth
  if (metrics.revenueGrowth !== null && metrics.revenueGrowth !== undefined) {
    const growth = normalizePercentage(metrics.revenueGrowth);
    if (growth > 20) {
      strengths.push(`High Revenue Growth: Revenue growth is outstanding at ${growth.toFixed(2)}% year-over-year.`);
    } else if (growth >= 10) {
      strengths.push(`Strong Revenue Growth: Solid revenue growth of ${growth.toFixed(2)}% year-over-year.`);
    } else if (growth < 0) {
      weaknesses.push(`Negative Revenue Growth: Revenue is contracting at ${growth.toFixed(2)}% year-over-year.`);
    } else if (growth < 5) {
      weaknesses.push(`Low Revenue Growth: Revenue growth is slow at ${growth.toFixed(2)}% year-over-year.`);
    }
  } else {
    weaknesses.push('Missing Data: Revenue growth metrics are unavailable.');
  }

  // 2. Evaluate Leverage (Debt to Equity)
  if (metrics.debtToEquity !== null && metrics.debtToEquity !== undefined) {
    const ratio = normalizeDebtRatio(metrics.debtToEquity);
    if (ratio < 0.5) {
      strengths.push(`Low Debt: Conservative balance sheet leverage with a low Debt-to-Equity ratio of ${ratio.toFixed(2)}.`);
    } else if (ratio > 2.0) {
      weaknesses.push(`High Debt: Highly leveraged balance sheet with a critical Debt-to-Equity ratio of ${ratio.toFixed(2)}.`);
    } else if (ratio > 1.0) {
      weaknesses.push(`Moderate Leverage: Elevated Debt-to-Equity ratio of ${ratio.toFixed(2)}.`);
    }
  } else {
    weaknesses.push('Missing Data: Debt-to-Equity leverage metric is unavailable.');
  }

  // 3. Evaluate Profitability (Return on Equity)
  if (metrics.roe !== null && metrics.roe !== undefined) {
    const roe = normalizePercentage(metrics.roe);
    if (roe >= 20) {
      strengths.push(`Strong ROE: Excellent return on equity of ${roe.toFixed(2)}% indicates high management and capital efficiency.`);
    } else if (roe >= 10) {
      strengths.push(`Healthy ROE: Healthy return on equity of ${roe.toFixed(2)}% shows solid operational performance.`);
    } else if (roe < 5) {
      weaknesses.push(`Weak ROE: Depressed return on equity of ${roe.toFixed(2)}% indicates poor capital allocation efficiency.`);
    }
  } else {
    weaknesses.push('Missing Data: Return on Equity (ROE) metric is unavailable.');
  }

  // 4. Evaluate Cash Flow
  const fcf = metrics.freeCashFlow;
  const ocf = metrics.operatingCashFlow;
  const primaryCashFlow = fcf !== null && fcf !== undefined ? fcf : ocf;

  if (primaryCashFlow !== null && primaryCashFlow !== undefined) {
    const name = fcf !== null && fcf !== undefined ? 'Free Cash Flow' : 'Operating Cash Flow';
    if (primaryCashFlow > 0) {
      strengths.push(`Positive Cash Flow: Highly liquid operations generating a positive ${name} of ${formatCurrency(primaryCashFlow)}.`);
    } else {
      weaknesses.push(`Negative Cash Flow: Negative ${name} of ${formatCurrency(primaryCashFlow)} highlights possible operational cash burn.`);
    }
  } else {
    weaknesses.push('Missing Data: Cash Flow metrics are completely unavailable.');
  }

  // 5. Evaluate Valuation (P/E Ratio)
  if (metrics.peRatio !== null && metrics.peRatio !== undefined) {
    const pe = metrics.peRatio;
    if (pe < 0) {
      weaknesses.push(`Negative P/E: Negative P/E ratio of ${pe.toFixed(2)} due to net unprofitable earnings.`);
    } else if (pe >= 10 && pe <= 30) {
      strengths.push(`Attractive Valuation: Balanced pricing with a healthy P/E ratio of ${pe.toFixed(2)} (within the 10-30 range).`);
    } else if (pe > 50) {
      weaknesses.push(`Overvalued P/E Ratio: High valuation multiple with a P/E of ${pe.toFixed(2)}, suggesting stock premium pricing.`);
    }
  } else {
    weaknesses.push('Missing Data: P/E valuation multiple is unavailable.');
  }

  return { strengths, weaknesses };
};

/**
 * Financial Agent workflow runner.
 * Evaluates standard financial datasets and returns clean scores, sub-score breakdowns, and qualitative feedback.
 * 
 * @param {Object} input - Agent inputs
 * @param {Object} input.financialData - Dataset containing ticker metrics and history
 * @returns {Promise<Object>} Formatted evaluation output
 */
export const runFinancialAgent = async ({ financialData }) => {
  if (!financialData) {
    throw new AppError('financialData is required to execute the Financial Agent workflow', 400);
  }

  // Extract inner metrics block
  const metrics = financialData.metrics || financialData;

  try {
    console.log(`[Financial Agent] >>> Starting quantitative analysis for ticker: "${metrics.ticker || 'UNKNOWN'}"`);

    // 1. Calculate scores and sub-breakdown
    const { financialScore, breakdown } = calculateFinancialScore(financialData);

    // 2. Perform strengths and weaknesses code analytics
    const { strengths, weaknesses } = detectStrengthsAndWeaknesses(metrics);

    console.log(`[Financial Agent] >>> Analysis complete. Financial Health Score: ${financialScore}/100.`);

    return {
      financialScore,
      breakdown,
      strengths,
      weaknesses
    };
  } catch (error) {
    console.error('[Financial Agent Error] Quantitative analysis failed:', error.message);
    if (error instanceof AppError) throw error;
    throw new AppError(`Financial Agent analysis failed: ${error.message}`, 500);
  }
};

export default runFinancialAgent;
