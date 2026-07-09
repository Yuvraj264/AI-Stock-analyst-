import { StateGraph, START, END } from '@langchain/langgraph';
import { AnalysisState } from './state.js';
import { runResearchAgent } from '../agents/researchAgent.js';
import { runFinancialAgent } from '../agents/financialAgent.js';
import { runNewsAgent } from '../agents/newsAgent.js';
import { runRiskAgent } from '../agents/riskAgent.js';
import { runReportAgent } from '../agents/reportAgent.js';
import { runDecisionAgent } from '../agents/decisionAgent.js';
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
      breakdown: result.breakdown,
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

const decisionNode = async (state) => {
  try {
    console.log(`[Graph Node: Decision] Formulating recommendation using Decision Agent for "${state.ticker}"...`);

    const result = await runDecisionAgent({
      financialScore: state.financialScore,
      newsScore: state.newsScore,
      riskScore: state.riskScore
    });

    return {
      finalScore: result.finalScore,
      recommendation: result.recommendation,
      confidence: result.confidence / 100 // Map 0-100 back to 0.0 - 1.0 schema constraint range
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
    console.log(`[Graph Node: Report] Compiling investment report using Report Agent for "${state.ticker}"...`);

    const result = await runReportAgent({
      companyName: state.companyName,
      financialScore: state.financialScore,
      newsScore: state.newsScore,
      riskScore: state.riskScore,
      recommendation: state.recommendation,
      confidence: state.confidence,
      strengths: state.strengths || [],
      weaknesses: state.weaknesses || [],
      positiveFactors: state.positiveFactors || [],
      negativeFactors: state.negativeFactors || [],
      risks: state.risks || []
    });

    return {
      report: result.report
    };
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
