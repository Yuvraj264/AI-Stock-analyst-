import { GoogleGenAI } from '@google/genai';
import { env } from '../config/env.js';
import { AppError } from '../utils/AppError.js';
import { getNewsSentimentPrompt } from '../prompts/newsPrompt.js';
import { getRiskAnalysisPrompt } from '../prompts/riskPrompt.js';

// Initialize the Google GenAI SDK client if the API key is configured
const ai = env.geminiApiKey && env.geminiApiKey !== 'your_gemini_api_key_here'
  ? new GoogleGenAI({ apiKey: env.geminiApiKey })
  : null;

/**
 * Heuristics-based mock sentiment analyzer.
 * Triggers as a fallback if the Gemini API key is missing or fails.
 */
const generateMockSentimentAnalysis = (companyName, articles) => {
  let score = 55; // Neutral midpoint
  const positiveFactors = [];
  const negativeFactors = [];

  const normalizedArticles = articles || [];

  normalizedArticles.forEach((art) => {
    const text = `${art.title} ${art.description}`.toLowerCase();
    if (
      text.includes('rally') ||
      text.includes('unveils') ||
      text.includes('bullish') ||
      text.includes('surpasses') ||
      text.includes('positive') ||
      text.includes('strong') ||
      text.includes('growth') ||
      text.includes('profit') ||
      text.includes('clean energy') ||
      text.includes('partner')
    ) {
      score += 5;
      positiveFactors.push(art.title);
    }
    if (
      text.includes('headwinds') ||
      text.includes('regulatory') ||
      text.includes('negative') ||
      text.includes('burn') ||
      text.includes('decline') ||
      text.includes('weak') ||
      text.includes('debt') ||
      text.includes('pressure')
    ) {
      score -= 5;
      negativeFactors.push(art.title);
    }
  });

  // Bound score in range 10-95
  score = Math.max(10, Math.min(95, score));
  let sentiment = 'Neutral';
  if (score >= 70) sentiment = 'Positive';
  else if (score <= 40) sentiment = 'Negative';

  // Fallback factors
  if (positiveFactors.length === 0) {
    positiveFactors.push(`Solid baseline corporate visibility for ${companyName}.`);
  }
  if (negativeFactors.length === 0) {
    negativeFactors.push('Uncertain macroeconomic environments impacting general market sectors.');
  }

  return {
    sentiment,
    score,
    positiveFactors: positiveFactors.slice(0, 3),
    negativeFactors: negativeFactors.slice(0, 3),
    summary: `Mock News Sentiment Analysis: Established a ${sentiment} market sentiment of ${score}/100 for ${companyName} by scanning keyword headlines.`
  };
};

/**
 * Context-aware mock risk analyzer.
 * Evaluates stock based on financial score and sentiment.
 */
const generateMockRiskAnalysis = (companyName, financialScore, sentiment) => {
  let riskScore = 75; // Default Low-Medium Risk

  if (financialScore < 40 || sentiment === 'Negative') {
    riskScore = 30; // High Risk
  } else if (financialScore < 70 || sentiment === 'Neutral') {
    riskScore = 55; // Medium Risk
  } else {
    riskScore = 85; // Low Risk
  }

  let riskLevel = 'Medium';
  if (riskScore >= 70) riskLevel = 'Low';
  else if (riskScore <= 40) riskLevel = 'High';

  return {
    riskLevel,
    riskScore,
    risks: [
      `Competitive risk: Intense peer execution pressure in the ${companyName} sector.`,
      `Regulatory risk: Global compliance cost updates and trade changes.`,
      `Valuation risk: Stretched valuation thresholds relative to near-term targets.`
    ],
    mitigationFactors: [
      `Low leverage and healthy capital structures.`,
      `High operational cash generation buffers.`,
      `Moated technology integrations and strong consumer pull.`
    ],
    summary: `Mock Risk Analysis: Assessed ${companyName} at a ${riskLevel} Risk level (${riskScore}/100) using quantitative inputs.`
  };
};

/**
 * Reusable utility that executes async functions with exponential backoff retries.
 */
const callWithRetry = async (fn, maxRetries = 3, delayMs = 1000) => {
  let attempts = 0;
  while (attempts < maxRetries) {
    try {
      return await fn();
    } catch (error) {
      attempts++;
      console.warn(`[Gemini Service Retry] Attempt ${attempts}/${maxRetries} failed: ${error.message}`);
      if (attempts >= maxRetries) {
        throw error;
      }
      // Delay using exponential backoff
      await new Promise((resolve) => setTimeout(resolve, delayMs * Math.pow(2, attempts - 1)));
    }
  }
};

/**
 * Analyzes company news feeds and returns market sentiment scores using Gemini.
 * @param {string} companyName - Name of the target company (e.g. "Apple Inc.")
 * @param {Array} articles - List of news articles to evaluate
 * @returns {Promise<Object>} Formatted sentiment response payload
 */
export const analyzeNews = async (companyName, articles) => {
  if (!companyName) {
    throw new AppError('companyName is required to perform news analysis', 400);
  }

  // 1. Trigger Mock Fallback if API key is not configured or client was not instantiated
  if (!ai) {
    console.log(`[Gemini Service] API key unconfigured. Deploying heuristics analyzer for "${companyName}"...`);
    return generateMockSentimentAnalysis(companyName, articles);
  }

  const prompt = getNewsSentimentPrompt(companyName, articles);

  try {
    // 2. Define strict response schema for Gemini API structured output
    const responseSchema = {
      type: 'OBJECT',
      properties: {
        sentiment: {
          type: 'STRING',
          enum: ['Positive', 'Neutral', 'Negative']
        },
        score: {
          type: 'INTEGER'
        },
        positiveFactors: {
          type: 'ARRAY',
          items: { type: 'STRING' }
        },
        negativeFactors: {
          type: 'ARRAY',
          items: { type: 'STRING' }
        },
        summary: {
          type: 'STRING'
        }
      },
      required: ['sentiment', 'score', 'positiveFactors', 'negativeFactors', 'summary']
    };

    console.log(`[Gemini Service] Dispatching sentiment evaluation request for "${companyName}" using ${env.geminiModel}...`);

    // Execute generation with retry wrapper
    const result = await callWithRetry(() =>
      ai.models.generateContent({
        model: env.geminiModel,
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: responseSchema
        }
      })
    );

    const responseText = result.text;
    if (!responseText) {
      throw new Error('Received an empty text block from Google GenAI endpoint.');
    }

    return JSON.parse(responseText);

  } catch (error) {
    console.error(`[Gemini Service Error] API request crashed: ${error.message}. Falling back to mock sentiment heuristics...`);
    return generateMockSentimentAnalysis(companyName, articles);
  }
};

export const analyzeRisk = async ({
  companyName,
  financialData,
  financialScore,
  newsSummary,
  sentiment
}) => {
  if (!companyName) {
    throw new AppError('companyName is required to perform risk analysis', 400);
  }

  // Fallback to mock risk analysis if Gemini is not configured
  if (!ai) {
    console.log(`[Gemini Service] API key unconfigured. Deploying mock risk heuristics for "${companyName}"...`);
    return generateMockRiskAnalysis(companyName, financialScore, sentiment);
  }

  const prompt = getRiskAnalysisPrompt({
    companyName,
    financialData,
    financialScore,
    newsSummary,
    sentiment
  });

  try {
    const responseSchema = {
      type: 'OBJECT',
      properties: {
        riskLevel: {
          type: 'STRING',
          enum: ['Low', 'Medium', 'High']
        },
        riskScore: {
          type: 'INTEGER'
        },
        risks: {
          type: 'ARRAY',
          items: { type: 'STRING' }
        },
        mitigationFactors: {
          type: 'ARRAY',
          items: { type: 'STRING' }
        },
        summary: {
          type: 'STRING'
        }
      },
      required: ['riskLevel', 'riskScore', 'risks', 'mitigationFactors', 'summary']
    };

    console.log(`[Gemini Service] Dispatching risk evaluation request for "${companyName}" using ${env.geminiModel}...`);

    const result = await callWithRetry(() =>
      ai.models.generateContent({
        model: env.geminiModel,
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: responseSchema
        }
      })
    );

    const responseText = result.text;
    if (!responseText) {
      throw new Error('Received an empty text block from Google GenAI endpoint during risk check.');
    }

    return JSON.parse(responseText);

  } catch (error) {
    console.error(`[Gemini Service Error] Risk API request crashed: ${error.message}. Falling back to mock risk heuristics...`);
    return generateMockRiskAnalysis(companyName, financialScore, sentiment);
  }
};

/**
 * Placeholder for compiling final research analyst reports.
 */
export const generateReport = async (ticker, analysisData) => {
  console.log(`[Gemini Service] Placeholder generateReport called for: "${ticker}"`);
  return { success: true, message: 'Report generator module activated (Placeholder).' };
};

export default {
  analyzeNews,
  analyzeRisk,
  generateReport
};
