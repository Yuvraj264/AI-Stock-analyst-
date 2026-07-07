/**
 * Generates the system prompt for analyzing market sentiment of news articles.
 * 
 * @param {string} companyName - Name of the target company (e.g., "Tesla Inc.")
 * @param {Array<Object>} articles - List of news articles containing title, description, publishedAt, and source.
 * @returns {string} The formatted prompt string.
 */
export const getNewsSentimentPrompt = (companyName, articles) => {
  const serializedArticles = JSON.stringify(articles, null, 2);

  return `You are a Senior AI Investment Analyst specializing in financial market sentiment analysis.

Your task is to analyze recent news articles for the company "${companyName}" and determine the overall market sentiment.

Here is the list of recent news articles:
${serializedArticles}

---

INSTRUCTIONS:
1. Carefully analyze the articles' headlines, descriptions, and sources to determine the overall market sentiment towards ${companyName}.
2. Categorize the overall sentiment as exactly one of: "Positive", "Neutral", or "Negative".
3. Assign a numeric sentiment score between 0 and 100 based on the following scale:
   - "Positive" sentiment: 70 - 100
   - "Neutral" sentiment: 40 - 70 (exclusive of 40 and 70 limits if clear sentiment is present)
   - "Negative" sentiment: 0 - 40
4. List the key positive factors (e.g., strong revenue growth, positive product announcements, executive expansions) driving public confidence.
5. List the key negative factors (e.g., product delays, competitive pressures, negative macro factors, regulatory investigations) hindering confidence.
6. Provide a concise, professional summary explaining your logic.

---

OUTPUT FORMAT:
You must respond in valid JSON format ONLY. Do not include any markdown styling (like \`\`\`json blocks), extra text, or preamble. Your entire response must parse as valid JSON matching this schema:
{
  "sentiment": "Positive" | "Neutral" | "Negative",
  "score": number,
  "positiveFactors": string[],
  "negativeFactors": string[],
  "summary": string
}
`;
};

export default getNewsSentimentPrompt;
