import { runFinancialAgent } from './src/agents/financialAgent.js';

/**
 * Verification test script.
 * Simulates multiple stock profiles with diverse financial health metrics
 * to check scoring boundaries and deterministic strength/weakness output logs.
 */
async function testFinancialAgent() {
  // Scenario 1: Clean TSLA parameters from previous run
  const tslaMetrics = {
    ticker: "TSLA",
    marketCap: 1576540176384,
    currentPrice: 419.77,
    revenue: 97878999040,
    revenueGrowth: 0.158, // 15.8% (solid growth)
    peRatio: 381.60907,   // highly overvalued PE
    roe: 0.04901,         // low ROE (4.9%)
    debtToEquity: 18.738, // very low debt (0.18 ratio)
    freeCashFlow: 5251999744, // highly positive cash flow
    operatingCashFlow: 16528000000
  };

  // Scenario 2: Unprofitable company with excessive debt and shrinking revenue
  const distressedMetrics = {
    ticker: "DISTRESSED",
    marketCap: 50000000,
    currentPrice: 5.50,
    revenue: 12000000,
    revenueGrowth: -0.05, // -5% contraction
    peRatio: -12.4,       // negative PE (unprofitable)
    roe: -0.15,           // negative ROE
    debtToEquity: 250.0,  // high debt (2.5 ratio)
    freeCashFlow: -3500000, // cash burning
    operatingCashFlow: -2000000
  };

  // Scenario 3: High-quality company with perfect financials and cheap multiples
  const premiumMetrics = {
    ticker: "GOLD",
    marketCap: 300000000000,
    currentPrice: 150.00,
    revenue: 80000000000,
    revenueGrowth: 0.25,   // 25% growth
    peRatio: 22.5,         // perfect valuation multiple
    roe: 0.32,             // 32% return on equity
    debtToEquity: 35.0,    // low debt (0.35 ratio)
    freeCashFlow: 15000000000, // rich free cash flow
    operatingCashFlow: 18000000000
  };

  const testCases = [
    { name: 'Tesla Live Stats Mapping', data: tslaMetrics },
    { name: 'Highly Leveraged/Unprofitable Profile', data: distressedMetrics },
    { name: 'Premium Growth & Value Profile', data: premiumMetrics }
  ];

  for (const tc of testCases) {
    try {
      console.log('\n==================================================');
      console.log(`🧪 Running Test Case: ${tc.name} (${tc.data.ticker})`);
      console.log('==================================================');

      const result = await runFinancialAgent({ financialData: tc.data });

      console.log(`📊 Aggregated Financial Score: ${result.financialScore} / 100`);
      console.log('🔀 Metric Breakdown Points:');
      console.log(`  - Revenue Growth: ${result.breakdown.revenue} / 20`);
      console.log(`  - Debt-to-Equity: ${result.breakdown.debt} / 20`);
      console.log(`  - Profitability : ${result.breakdown.roe} / 20`);
      console.log(`  - Cash Flow     : ${result.breakdown.cashFlow} / 20`);
      console.log(`  - Valuation PE  : ${result.breakdown.valuation} / 20`);

      console.log('\n🟢 Strengths Identified:');
      result.strengths.forEach((s) => console.log(`  + ${s}`));
      if (result.strengths.length === 0) console.log('  (None)');

      console.log('\n🔴 Weaknesses Identified:');
      result.weaknesses.forEach((w) => console.log(`  - ${w}`));
      if (result.weaknesses.length === 0) console.log('  (None)');

      console.log('==================================================');
    } catch (error) {
      console.error(`❌ Evaluation failed for test case "${tc.name}":`, error.message);
    }
  }
}

testFinancialAgent();
