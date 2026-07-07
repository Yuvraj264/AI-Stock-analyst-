import { runRiskAgent } from './src/agents/riskAgent.js';

/**
 * Verification test script.
 * Simulates different financial scores and sentiments to check
 * risk categorization boundaries and fallback loops.
 */
async function testRiskAgent() {
  const cases = [
    {
      name: 'Low Risk Target Scenario',
      input: {
        companyName: 'Tesla Inc.',
        financialData: {
          metrics: {
            ticker: "TSLA",
            currentPrice: 419.77,
            peRatio: 381.6,
            debtToEquity: 18.7,
            revenueGrowth: 0.158,
            roe: 0.049
          }
        },
        financialScore: 85,
        newsSummary: 'Tesla shares rise on strong deliveries and clean energy procurement projects.',
        sentiment: 'Positive'
      }
    },
    {
      name: 'High Risk Distressed Scenario',
      input: {
        companyName: 'Distressed Tech Inc.',
        financialData: {
          metrics: {
            ticker: "DISTRESSED",
            currentPrice: 5.50,
            peRatio: -12.4,
            debtToEquity: 250.0,
            revenueGrowth: -0.05,
            roe: -0.15
          }
        },
        financialScore: 25,
        newsSummary: 'Revenue decline concerns, regulatory fines, and rising interest burdens weigh on Distressed Tech.',
        sentiment: 'Negative'
      }
    }
  ];

  for (const tc of cases) {
    try {
      console.log('\n==================================================');
      console.log(`🧪 Running Test Case: ${tc.name}`);
      console.log('==================================================');

      const result = await runRiskAgent(tc.input);

      console.log(`Aggregated Risk Level : ${result.riskLevel}`);
      console.log(`Aggregated Risk Score : ${result.riskScore} / 100`);
      console.log(`Qualitative Summary    : ${result.summary}`);

      console.log('\n🔴 Risk Factors Identified:');
      result.risks.forEach((r) => console.log(`  - ${r}`));

      console.log('\n🟢 Mitigation Factors:');
      result.mitigationFactors.forEach((m) => console.log(`  + ${m}`));
      console.log('==================================================');
    } catch (error) {
      console.error(`❌ Risk Agent evaluation failed for case "${tc.name}":`, error.message);
    }
  }
}

testRiskAgent();
