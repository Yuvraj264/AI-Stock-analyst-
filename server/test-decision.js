import { runDecisionAgent } from './src/agents/decisionAgent.js';

/**
 * Verification test suite for the Decision Agent.
 * Runs score combinations to test PASS, HOLD, and INVEST thresholds.
 */
async function testDecisionAgent() {
  const cases = [
    {
      name: 'High Score - INVEST Action (No boundaries overlap)',
      input: { financialScore: 90, newsScore: 85, riskScore: 80 },
      expectedRec: 'INVEST'
    },
    {
      name: 'Mid Score - HOLD Action (Midpoint of zone)',
      input: { financialScore: 70, newsScore: 70, riskScore: 70 },
      expectedRec: 'HOLD'
    },
    {
      name: 'Low Score - PASS Action',
      input: { financialScore: 30, newsScore: 40, riskScore: 20 },
      expectedRec: 'PASS'
    },
    {
      name: 'Borderline INVEST Boundary (Exactly 80)',
      input: { financialScore: 80, newsScore: 80, riskScore: 80 },
      expectedRec: 'INVEST'
    },
    {
      name: 'Borderline HOLD Boundary (Exactly 60)',
      input: { financialScore: 60, newsScore: 60, riskScore: 60 },
      expectedRec: 'HOLD'
    }
  ];

  console.log('==================================================');
  console.log('🧪 Starting Decision Agent Unit Tests');
  console.log('==================================================');

  for (const tc of cases) {
    try {
      const result = await runDecisionAgent(tc.input);
      const pass = result.recommendation === tc.expectedRec;

      console.log(`\n[Test Case] ${tc.name}`);
      console.log(`  Inputs       : Financial: ${tc.input.financialScore}, News: ${tc.input.newsScore}, Risk: ${tc.input.riskScore}`);
      console.log(`  Calculated   : Score: ${result.finalScore}/100, Rec: ${result.recommendation}, Confidence: ${result.confidence}%`);
      console.log(`  Status       : ${pass ? '✅ PASSED' : '❌ FAILED (Expected: ' + tc.expectedRec + ')'}`);
    } catch (error) {
      console.error(`  ❌ Crashed: ${error.message}`);
    }
  }

  // Verify Validation Errors
  console.log('\n==================================================');
  console.log('🧪 Starting Parameter Validation Tests');
  console.log('==================================================');
  
  const invalidCases = [
    { name: 'Negative Score', input: { financialScore: -10, newsScore: 80, riskScore: 80 } },
    { name: 'Exceeding Score', input: { financialScore: 105, newsScore: 80, riskScore: 80 } },
    { name: 'Non-numeric String', input: { financialScore: 'A+', newsScore: 80, riskScore: 80 } },
    { name: 'Missing Parameter', input: { financialScore: 80, newsScore: 80 } }
  ];

  for (const tc of invalidCases) {
    try {
      await runDecisionAgent(tc.input);
      console.log(`[Test Case] ${tc.name} -> ❌ FAILED (Allowed invalid inputs)`);
    } catch (error) {
      console.log(`[Test Case] ${tc.name} -> ✅ PASSED (Correctly rejected: "${error.message}")`);
    }
  }

  console.log('\n==================================================');
  console.log('🧪 Validation complete.');
  console.log('==================================================');
}

testDecisionAgent();
