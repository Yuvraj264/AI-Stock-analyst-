import { env } from '../config/env.js';
import { AppError } from '../utils/AppError.js';

/**
 * Generates high-quality mock news articles for a company.
 * Used as a fallback when the NewsAPI key is not configured or fails.
 */
const generateMockNews = (companyName) => {
  return [
    {
      title: `${companyName} Unveils Next-Gen AI Solutions at Annual Conference`,
      description: `${companyName} announced a suite of new AI capabilities, positioning itself as a dominant force in enterprise automation. Analysts respond with positive upgrades.`,
      publishedAt: new Date().toISOString(),
      source: 'TechCrunch'
    },
    {
      title: `Why Analysts Are Bullish on ${companyName} Stock Growth`,
      description: `Market strategists highlight ${companyName}'s strong balance sheet, high return on equity, and expanding profit margins as indicators of future stability.`,
      publishedAt: new Date(Date.now() - 3 * 3600000).toISOString(), // 3 hours ago
      source: 'Bloomberg'
    },
    {
      title: `Regulatory Headwinds Facing ${companyName} and the Broader Industry`,
      description: `Global regulators are examining ${companyName}'s market positioning. Industry experts debate the potential operational and margin impacts of new policy constraints.`,
      publishedAt: new Date(Date.now() - 12 * 3600000).toISOString(), // 12 hours ago
      source: 'Reuters'
    },
    {
      title: `${companyName} Surpasses Wall Street Revenue Expectations`,
      description: `${companyName} reported quarterly revenues exceeding estimate expectations, fueled by enterprise demand and robust cloud infrastructure growth.`,
      publishedAt: new Date(Date.now() - 24 * 3600000).toISOString(), // 1 day ago
      source: 'The Wall Street Journal'
    },
    {
      title: `How ${companyName} is Re-evaluating Global Supply Chain Logistics`,
      description: `In response to international shipping shifts, ${companyName} is shifting its manufacturing focus and expanding partnerships with local infrastructure hubs.`,
      publishedAt: new Date(Date.now() - 36 * 3600000).toISOString(),
      source: 'Financial Times'
    },
    {
      title: `Is ${companyName} Stock Fairly Valued Relative to Sector Peers?`,
      description: `A comparative financial ratios evaluation of ${companyName}'s PE ratio and quick metrics against its nearest technology competitors.`,
      publishedAt: new Date(Date.now() - 48 * 3600000).toISOString(),
      source: 'Forbes'
    },
    {
      title: `Inside ${companyName}'s Capital Allocation & Share Buyback Strategy`,
      description: `${companyName} disclosed details regarding its capital deployment strategy, highlighting steady dividend payouts and scheduled treasury stock buybacks.`,
      publishedAt: new Date(Date.now() - 60 * 3600000).toISOString(),
      source: 'MarketWatch'
    },
    {
      title: `Key Technical Breakouts Identified in ${companyName} Chart`,
      description: `Stock traders map support and resistance thresholds on ${companyName}'s daily price chart, indicating potential consolidation before a breakouts trend.`,
      publishedAt: new Date(Date.now() - 72 * 3600000).toISOString(),
      source: "Investor's Business Daily"
    },
    {
      title: `${companyName} Partners with Leading Clean Energy Providers`,
      description: `Aiming for carbon-neutral operations by 2030, ${companyName} signed green energy procurement agreements to power its data centers.`,
      publishedAt: new Date(Date.now() - 96 * 3600000).toISOString(),
      source: 'CNBC'
    },
    {
      title: `Talent Shifts: ${companyName} Appoints New Chief Technology Officer`,
      description: `${companyName} announced an executive restructure, bringing in an industry veteran to lead its advanced AI initiatives.`,
      publishedAt: new Date(Date.now() - 120 * 3600000).toISOString(),
      source: 'VentureBeat'
    }
  ];
};

/**
 * Fetches the latest 10 news articles for a specific company name.
 * Normalizes results into a structured format. Falls back to mock data if the API key is unconfigured.
 * @param {string} companyName - Target company name (e.g., "Apple")
 * @returns {Promise<Array>} List of normalized news articles.
 */
export const getCompanyNews = async (companyName) => {
  if (!companyName) {
    throw new AppError('Company name is required to fetch news', 400);
  }

  // Fallback if NewsAPI key is not configured
  if (!env.newsApiKey || env.newsApiKey === 'your_news_api_key_here') {
    console.log(`[News Service] No NewsAPI key configured. Generating mock news articles for "${companyName}"...`);
    return generateMockNews(companyName);
  }

  try {
    console.log(`[News Service] Fetching news articles for "${companyName}" from NewsAPI...`);
    const params = new URLSearchParams({
      q: companyName,
      language: 'en',
      sortBy: 'publishedAt',
      pageSize: '10',
      apiKey: env.newsApiKey
    });

    const response = await fetch(`https://newsapi.org/v2/everything?${params.toString()}`);

    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({}));
      console.warn(`[News Service Warning] NewsAPI returned error status: ${response.status}. Reason: ${errorBody.message || 'unknown'}. Falling back to mock articles...`);
      return generateMockNews(companyName);
    }

    const data = await response.json();

    if (!data.articles || data.articles.length === 0) {
      console.warn(`[News Service Warning] No news articles found for "${companyName}". Falling back to mock articles...`);
      return generateMockNews(companyName);
    }

    // Normalize output format
    return data.articles.slice(0, 10).map((article) => ({
      title: article.title || 'Untitled Article',
      description: article.description || 'No description available.',
      publishedAt: article.publishedAt || new Date().toISOString(),
      source: article.source?.name || 'Unknown Source'
    }));
  } catch (error) {
    console.error(`[News Service Error] Fetch failed for "${companyName}":`, error.message, '. Falling back to mock articles...');
    return generateMockNews(companyName);
  }
};
