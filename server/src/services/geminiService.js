import { GoogleGenAI } from '@google/genai';
import { env } from '../config/env.js';
import { AppError } from '../utils/AppError.js';
import { getNewsSentimentPrompt } from '../prompts/newsPrompt.js';

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

/**
 * Placeholder for future risk analyses (e.g. SEC reports evaluation).
 */
export const analyzeRisk = async (ticker, financialData) => {
  console.log(`[Gemini Service] Placeholder analyzeRisk called for: "${ticker}"`);
  return { success: true, message: 'Risk analysis module activated (Placeholder).' };
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
