import { runResearchAgent } from './src/agents/researchAgent.js';

/**
 * Verification runner script.
 * Executes the Research Agent workflow for a sample company and outputs
 * structured JSON fragments for validation.
 */
async function testResearchAgent() {
  try {
    console.log('==================================================');
    console.log('🚀 Starting Research Agent integration test...');
    console.log('==================================================');

    const result = await runResearchAgent({ companyName: 'Tesla' });

    console.log('\n==================================================');
    console.log('✅ Workflow execution successful!');
    console.log('==================================================');
    console.log(`Company Resolved : ${result.companyName}`);
    console.log(`Ticker Symbol    : ${result.ticker}`);
    console.log(`Sector           : ${result.profile.sector}`);
    console.log(`Industry         : ${result.profile.industry}`);
    console.log(`Summary Length   : ${result.profile.summary.length} characters`);
    console.log(`Summary Snippet  : ${result.profile.summary.substring(0, 120)}...`);
    
    console.log('\n📈 Key Financial Metrics:');
    console.log(JSON.stringify(result.financialData.metrics, null, 2));

    console.log(`\n📊 Historical Price Data:`);
    console.log(`Total Days Returned: ${result.financialData.historical.length}`);
    if (result.financialData.historical.length > 0) {
      console.log('Earliest Record Sample:', result.financialData.historical[0]);
      console.log('Latest Record Sample  :', result.financialData.historical[result.financialData.historical.length - 1]);
    }

    console.log(`\n📰 News Feed Data:`);
    console.log(`Total Articles Normalized: ${result.newsData.length}`);
    if (result.newsData.length > 0) {
      console.log('First Article Sample:');
      console.log(JSON.stringify(result.newsData[0], null, 2));
    }
    
    console.log('\n🎉 Verification test successfully completed!');
    console.log('==================================================');
  } catch (error) {
    console.error('\n❌ Integration Test Failed!');
    console.error('Error Details:', error.message);
    if (error.stack) console.error(error.stack);
    console.log('==================================================');
  }
}

testResearchAgent();
