import { StateGraph, START, END } from '@langchain/langgraph';
import { AnalysisState } from './state.js';
import { runResearchAgent } from '../agents/researchAgent.js';
import { runFinancialAgent } from '../agents/financialAgent.js';
import { runNewsAgent } from '../agents/newsAgent.js';
import { runRiskAgent } from '../agents/riskAgent.js';
import { calculateFinancialScore } from '../services/scoringService.js';
import { analyzeNews } from '../services/geminiService.js';
import { AppError } from '../utils/AppError.js';

/**
 * 1. Research Agent Node
 * Resolves ticker profile and downloads raw metrics and news files.
 */
const researchNode = async (state) => {
  try {
    console.log(`[Graph Node: Research] Starting search for "${state.companyName}"...`);
    const research = await runResearchAgent({ companyName: state.companyName });
    
    return {
      companyName: research.companyName, // Normalized name
      ticker: research.ticker,
      financialData: research.financialData,
      newsData: research.newsData
    };
  } catch (error) {
    console.error('[Graph Node Error] Research Node failed:', error.message);
    throw new AppError(`Research step failed: ${error.message}`, 500);
  }
};

/**
 * 2. Financial Agent Node (Concurrently runs)
 * Scores financial strength and identifies strengths and weaknesses.
 */
const financialNode = async (state) => {
  try {
    console.log(`[Graph Node: Financial] Evaluating metrics for "${state.ticker}"...`);
    const result = await runFinancialAgent({ financialData: state.financialData });
    
    return {
      financialScore: result.financialScore,
      strengths: result.strengths,
      weaknesses: result.weaknesses
    };
  } catch (error) {
    console.error('[Graph Node Error] Financial Node failed:', error.message);
    throw new AppError(`Financial scoring step failed: ${error.message}`, 500);
  }
};

/**
 * 3. News Agent Node (Concurrently runs)
 * Evaluates market sentiment and returns highlights.
 */
const newsNode = async (state) => {
  try {
    console.log(`[Graph Node: News] Analyzing headlines for "${state.companyName}"...`);
    const result = await runNewsAgent({
      companyName: state.companyName,
      newsData: state.newsData
    });
    
    return {
      newsScore: result.newsScore,
      sentiment: result.sentiment,
      newsSummary: result.summary,
      positiveFactors: result.positiveFactors,
      negativeFactors: result.negativeFactors
    };
  } catch (error) {
    console.error('[Graph Node Error] News Node failed:', error.message);
    throw new AppError(`News sentiment step failed: ${error.message}`, 500);
  }
};

/**
 * 4. Risk Agent Node (Concurrently runs)
 * Identifies risks and mitigations.
 * *Note: Computes dependencies (financialScore, newsAnalysis) on-the-fly to support parallel execution.
 */
const riskNode = async (state) => {
  try {
    console.log(`[Graph Node: Risk] Assessing risk profile for "${state.companyName}"...`);
    
    // Concurrently calculate dependencies on-the-fly for parallel graph step
    const { financialScore } = calculateFinancialScore(state.financialData);
    const newsAnalysis = await analyzeNews(state.companyName, state.newsData);

    const result = await runRiskAgent({
      companyName: state.companyName,
      financialData: state.financialData,
      financialScore,
      newsSummary: newsAnalysis.summary,
      sentiment: newsAnalysis.sentiment
    });

    return {
      riskScore: result.riskScore,
      riskLevel: result.riskLevel,
      risks: result.risks,
      mitigationFactors: result.mitigationFactors
    };
  } catch (error) {
    console.error('[Graph Node Error] Risk Node failed:', error.message);
    throw new AppError(`Risk assessment step failed: ${error.message}`, 500);
  }
};

/**
 * 5. Decision Agent Node
 * Merges scores, computes risk-adjusted recommendations, and confidence margins.
 */
const decisionNode = async (state) => {
  try {
    console.log(`[Graph Node: Decision] Formulating recommendation for "${state.ticker}"...`);

    // Weighted final score: 50% Financials, 25% News, 25% Risk
    const finalScore = Math.round(
      (state.financialScore * 0.5) +
      (state.newsScore * 0.25) +
      (state.riskScore * 0.25)
    );

    // Rule-based risk-adjusted recommendation table
    let recommendation = 'HOLD';
    if (finalScore >= 80) {
      recommendation = state.riskLevel === 'High' ? 'BUY' : 'STRONG_BUY';
    } else if (finalScore >= 65) {
      recommendation = state.riskLevel === 'High' ? 'HOLD' : 'BUY';
    } else if (finalScore >= 45) {
      recommendation = 'HOLD';
    } else if (finalScore >= 30) {
      recommendation = 'SELL';
    } else {
      recommendation = 'STRONG_SELL';
    }

    // Confidence index matches score convergence and checks risk levels
    const scoreVariance = Math.abs(state.financialScore - state.newsScore);
    const riskDeduction = state.riskLevel === 'High' ? 0.15 : 0;
    const confidence = parseFloat(
      Math.max(0.5, 1.0 - (scoreVariance / 200) - riskDeduction).toFixed(2)
    );

    return {
      finalScore,
      recommendation,
      confidence
    };
  } catch (error) {
    console.error('[Graph Node Error] Decision Node failed:', error.message);
    throw new AppError(`Decision step failed: ${error.message}`, 500);
  }
};

/**
 * 6. Report Agent Node
 * Combines all outputs into a structured markdown report.
 */
const reportNode = async (state) => {
  try {
    console.log(`[Graph Node: Report] Generating markdown research report for "${state.ticker}"...`);

    const metrics = state.financialData?.metrics || {};
    const strengths = state.strengths || [];
    const weaknesses = state.weaknesses || [];
    const positiveFactors = state.positiveFactors || [];
    const negativeFactors = state.negativeFactors || [];
    const risks = state.risks || [];
    const mitigationFactors = state.mitigationFactors || [];

    const report = `# Investment Research Report: ${state.companyName} (${state.ticker})

## Executive Summary
* **Investment Action**: **${state.recommendation}**
* **Overall Rating Score**: **${state.finalScore} / 100**
* **Confidence Score**: **${(state.confidence * 100).toFixed(0)}%**

---

## 1. Financial Health Analysis
* **Score**: **${state.financialScore} / 100**
* **Key Pricing & Financial Statistics**:
  - Current Price: $${(metrics.currentPrice || 0).toLocaleString()}
  - Market Capitalization: $${((metrics.marketCap || 0) / 1e9).toFixed(2)}B
  - Trailing P/E Ratio: ${metrics.peRatio || 'N/A'}
  - Revenue Growth (YoY): ${((metrics.revenueGrowth || 0) * 100).toFixed(2)}%
  - Return on Equity (ROE): ${((metrics.roe || 0) * 100).toFixed(2)}%
  - Debt-to-Equity: ${metrics.debtToEquity || 'N/A'}

### 🟢 Strengths
${strengths.map((s) => `* ${s}`).join('\n') || '* No core financial strengths identified.'}

### 🔴 Weaknesses
${weaknesses.map((w) => `* ${w}`).join('\n') || '* No critical financial weaknesses identified.'}

---

## 2. Market Sentiment Analysis
* **Score**: **${state.newsScore} / 100**
* **Aggregated Sentiment Outlook**: **${state.sentiment}**
* **Sentiment Heuristic Summary**:
  _${state.newsSummary || 'No news summary compiled.'}_

### Positive Market Drivers:
${positiveFactors.map((f) => `* ${f}`).join('\n') || '* No positive factors noted.'}

### Negative Market Pressures:
${negativeFactors.map((f) => `* ${f}`).join('\n') || '* No negative factors noted.'}

---

## 3. Risk & Mitigation Diagnostics
* **Score**: **${state.riskScore} / 100**
* **Aggregated Risk Level**: **${state.riskLevel}**

### Identified Risk Dimensions:
${risks.map((r) => `* ${r}`).join('\n') || '* No major risk dimensions flagged.'}

### Compensating Mitigation Factors:
${mitigationFactors.map((m) => `* ${m}`).join('\n') || '* No compensating factors listed.'}

---
_Disclaimer: This report is dynamically formulated by a quantitative rules-based agent system and is intended for informational research purposes only._
`;

    return { report };
  } catch (error) {
    console.error('[Graph Node Error] Report Node failed:', error.message);
    throw new AppError(`Report compilation step failed: ${error.message}`, 500);
  }
};

// ==================================================
// GRAPH CONSTRUCTION & COMPILATION
// ==================================================

const workflow = new StateGraph(AnalysisState)
  // Register Nodes
  .addNode('researchNode', researchNode)
  .addNode('financialNode', financialNode)
  .addNode('newsNode', newsNode)
  .addNode('riskNode', riskNode)
  .addNode('decisionNode', decisionNode)
  .addNode('reportNode', reportNode)

  // Configure Edges
  .addEdge(START, 'researchNode')

  // Fan-out to parallel analysis nodes
  .addEdge('researchNode', 'financialNode')
  .addEdge('researchNode', 'newsNode')
  .addEdge('researchNode', 'riskNode')

  // Fan-in from parallel nodes to decision coordinator
  .addEdge('financialNode', 'decisionNode')
  .addEdge('newsNode', 'decisionNode')
  .addEdge('riskNode', 'decisionNode')

  // Sequentially run Decision and Report compiler
  .addEdge('decisionNode', 'reportNode')
  .addEdge('reportNode', END);

// Compile the executable StateGraph
export const graph = workflow.compile();

export default graph;
