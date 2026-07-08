import { graph } from './src/graph/analysisGraph.js';

/**
 * Integration test runner for the LangGraph Workflow.
 * Invokes the entire graph starting from a raw company name string,
 * executes all nodes (including parallel steps), and outputs
 * the aggregated state and markdown report.
 */
async function testGraphExecution() {
  try {
    console.log('==================================================');
    console.log('🚀 Invoking LangGraph Workflow for "Tesla"...');
    console.log('==================================================');

    // Run the compiled StateGraph
    const finalState = await graph.invoke({
      companyName: 'Tesla'
    });

    console.log('\n==================================================');
    console.log('✅ Workflow Execution Successful!');
    console.log('==================================================');
    console.log(`Resolved Company : ${finalState.companyName}`);
    console.log(`Resolved Ticker  : ${finalState.ticker}`);
    console.log(`Financial Score  : ${finalState.financialScore} / 100`);
    console.log(`News Score       : ${finalState.newsScore} / 100`);
    console.log(`Risk Score       : ${finalState.riskScore} / 100`);
    console.log(`Aggregated Risk  : ${finalState.riskLevel}`);
    console.log(`Weighted Score   : ${finalState.finalScore} / 100`);
    console.log(`Recommendation   : ${finalState.recommendation}`);
    console.log(`Confidence Index : ${finalState.confidence}`);
    console.log(`Keys in State    : ${Object.keys(finalState).join(', ')}`);

    console.log('\n==================================================');
    console.log('📝 FINAL EXECUTIVE SUMMARY REPORT:');
    console.log('==================================================');
    console.log(finalState.report);
    console.log('==================================================');

  } catch (error) {
    console.error('\n❌ Workflow Execution Failed!');
    console.error('Error Details:', error.message);
    if (error.stack) console.error(error.stack);
    console.log('==================================================');
  }
}

testGraphExecution();
