import { runNewsAgent } from './src/agents/newsAgent.js';

/**
 * Verification test script.
 * Simulates news feeds and dispatches them to the news agent,
 * testing validation schemas and fallback loops.
 */
async function testNewsAgent() {
  const mockArticles = [
    {
      title: "Apple Inc. Unveils Next-Gen AI Solutions at Annual Conference",
      description: "Apple Inc. announced a suite of new AI capabilities, positioning itself as a dominant force in enterprise automation. Analysts respond with positive upgrades.",
      publishedAt: new Date().toISOString(),
      source: 'TechCrunch'
    },
    {
      title: "Why Analysts Are Bullish on Apple Stock Growth",
      description: "Market strategists highlight Apple's strong balance sheet, high return on equity, and expanding profit margins as indicators of future stability.",
      publishedAt: new Date(Date.now() - 3 * 3600000).toISOString(),
      source: 'Bloomberg'
    },
    {
      title: "Regulatory Headwinds Facing Apple and the Broader Industry",
      description: "Global regulators are examining Apple's market positioning. Industry experts debate the potential operational and margin impacts of new policy constraints.",
      publishedAt: new Date(Date.now() - 12 * 3600000).toISOString(),
      source: 'Reuters'
    }
  ];

  try {
    console.log('==================================================');
    console.log('🚀 Starting News Agent integration test...');
    console.log('==================================================');
    
    // Execute news agent workflow
    const result = await runNewsAgent({
      companyName: 'Apple Inc.',
      newsData: mockArticles
    });

    console.log('\n==================================================');
    console.log('✅ Workflow execution successful!');
    console.log('==================================================');
    console.log(`Aggregated Sentiment : ${result.sentiment}`);
    console.log(`Sentiment Score      : ${result.newsScore} / 100`);
    console.log(`Qualitative Summary  : ${result.summary}`);
    
    console.log('\n🟢 Positive Drivers Extracted:');
    result.positiveFactors.forEach((f) => console.log(`  + ${f}`));
    
    console.log('\n🔴 Negative Pressures Extracted:');
    result.negativeFactors.forEach((f) => console.log(`  - ${f}`));
    console.log('==================================================');

  } catch (error) {
    console.error('\n❌ News Agent Test Failed!');
    console.error('Details:', error.message);
    if (error.stack) console.error(error.stack);
    console.log('==================================================');
  }
}

testNewsAgent();
