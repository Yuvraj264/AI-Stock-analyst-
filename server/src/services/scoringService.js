/**
 * Safe normalizer for growth/yield fields which can be returned as either decimals or percentages.
 * e.g., 0.158 (decimal) is normalized to 15.8 (%)
 */
const normalizePercentage = (val) => {
  if (val === null || val === undefined) return 0;
  // If it's a small decimal (between -1.0 and 1.0), scale to percentage representation
  if (Math.abs(val) <= 1.0 && val !== 0) {
    return val * 100;
  }
  return val;
};

/**
 * Safe normalizer for Debt-to-Equity ratios.
 * Yahoo Finance returns Debt/Equity as a percentage (e.g., 18.738 representing 18.738% or 0.18738 ratio).
 * This converts it to a standard ratio representation.
 */
const normalizeDebtRatio = (val) => {
  if (val === null || val === undefined) return null;
  // If value is greater than 3.0, it is likely represented as a percentage (e.g., 145.8 representing 1.458 ratio)
  if (val > 3.0) {
    return val / 100;
  }
  return val;
};

/**
 * 1. Revenue Growth Score
 * Rules:
 * > 20% = 20 points
 * 10% - 20% = 15 points
 * 0% - 10% = 10 points
 * Negative = 0 points
 */
export const calculateRevenueScore = (revenueGrowth) => {
  if (revenueGrowth === null || revenueGrowth === undefined) return 0;
  const growth = normalizePercentage(revenueGrowth);

  if (growth > 20) return 20;
  if (growth >= 10) return 15;
  if (growth >= 0) return 10;
  return 0; // Negative
};

/**
 * 2. Return on Equity (ROE) Score
 * Rules:
 * > 20% = 20 points
 * 10% - 20% = 15 points
 * 5% - 10% = 10 points
 * < 5% = 0 points
 */
export const calculateProfitabilityScore = (roe) => {
  if (roe === null || roe === undefined) return 0;
  const roePercentage = normalizePercentage(roe);

  if (roePercentage > 20) return 20;
  if (roePercentage >= 10) return 15;
  if (roePercentage >= 5) return 10;
  return 0; // < 5%
};

/**
 * 3. Debt to Equity Score
 * Rules:
 * < 0.5 = 20 points
 * 0.5 - 1 = 15 points
 * 1 - 2 = 10 points
 * > 2 = 0 points
 */
export const calculateDebtScore = (debtToEquity) => {
  const ratio = normalizeDebtRatio(debtToEquity);
  if (ratio === null || ratio === undefined) return 0;

  if (ratio < 0.5) return 20;
  if (ratio <= 1.0) return 15;
  if (ratio <= 2.0) return 10;
  return 0; // > 2
};

/**
 * 4. Cash Flow Score
 * Rules:
 * Positive = 20 points
 * Negative = 0 points
 */
export const calculateCashFlowScore = (freeCashFlow) => {
  if (freeCashFlow === null || freeCashFlow === undefined) return 0;
  return freeCashFlow > 0 ? 20 : 0;
};

/**
 * 5. PE Ratio Score
 * Rules:
 * 10 - 30 = 20 points
 * 30 - 50 = 10 points
 * Above 50 = 5 points
 * Negative = 0 points
 * *Note: If PE is positive but less than 10 (undervalued/distressed range), we score it 10 points.
 */
export const calculateValuationScore = (peRatio) => {
  if (peRatio === null || peRatio === undefined) return 0;
  
  if (peRatio < 0) return 0;
  if (peRatio >= 10 && peRatio <= 30) return 20;
  if (peRatio > 30 && peRatio <= 50) return 10;
  if (peRatio > 50) return 5;
  
  // Handling 0 <= peRatio < 10 case
  return 10;
};

/**
 * Aggregates all financial sub-scores into a final financial score out of 100.
 * @param {Object} financialData - Financial metrics block
 * @returns {Object} Aggregated score object and breakdown details
 */
export const calculateFinancialScore = (financialData) => {
  // Extract metrics block safely (supports both nested and flat inputs)
  const metrics = financialData?.metrics || financialData || {};

  console.log(`[Scoring Service] Executing calculations for ticker: "${metrics.ticker || 'UNKNOWN'}"`);

  const revenueScore = calculateRevenueScore(metrics.revenueGrowth);
  const profitabilityScore = calculateProfitabilityScore(metrics.roe);
  const debtScore = calculateDebtScore(metrics.debtToEquity);
  const cashFlowScore = calculateCashFlowScore(metrics.freeCashFlow || metrics.operatingCashFlow);
  const valuationScore = calculateValuationScore(metrics.peRatio);

  const finalScore = revenueScore + profitabilityScore + debtScore + cashFlowScore + valuationScore;

  return {
    financialScore: finalScore,
    breakdown: {
      revenue: revenueScore,
      debt: debtScore,
      roe: profitabilityScore,
      cashFlow: cashFlowScore,
      valuation: valuationScore
    }
  };
};

export default {
  calculateRevenueScore,
  calculateProfitabilityScore,
  calculateDebtScore,
  calculateCashFlowScore,
  calculateValuationScore,
  calculateFinancialScore
};
