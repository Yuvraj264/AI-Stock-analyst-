import { Annotation } from '@langchain/langgraph';

/**
 * Helper to define State Annotation fields with the default override (last-write-wins) behavior.
 */
const overrideField = () => Annotation({
  reducer: (left, right) => (right !== undefined ? right : left),
  default: () => undefined
});

/**
 * Helper to define array fields with default empty array instantiation.
 */
const arrayField = () => Annotation({
  reducer: (left, right) => (right !== undefined ? right : left),
  default: () => []
});

/**
 * LangGraph State Annotation schema.
 * Represents the shared state tracking memory during the multi-agent execution pipeline.
 */
export const AnalysisState = Annotation.Root({
  // Core Identifiers
  companyName: overrideField(),
  ticker: overrideField(),

  // Crawled/Scraped Data Buffers
  financialData: overrideField(),
  newsData: arrayField(),

  // Quantitative Health/Sentiment Scores
  financialScore: overrideField(),
  newsScore: overrideField(),
  riskScore: overrideField(),

  // Qualitative Classifications
  sentiment: overrideField(),
  riskLevel: overrideField(),

  // Qualitative Analysis Lists
  positiveFactors: arrayField(),
  negativeFactors: arrayField(),
  strengths: arrayField(),
  weaknesses: arrayField(),
  risks: arrayField(),

  // Final Synthesis & Reporting
  recommendation: overrideField(),
  finalScore: overrideField(),
  confidence: overrideField(),
  report: overrideField()
});

export default AnalysisState;
