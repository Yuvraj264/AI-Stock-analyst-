/**
 * Generates the system prompt for compiling a professional investment research report.
 * 
 * @param {Object} input - Input data fields
 * @param {string} input.companyName - Name of the company analyzed
 * @param {number} input.financialScore - Score from Financial Agent (0-100)
 * @param {number} input.newsScore - Score from News Agent (0-100)
 * @param {number} input.riskScore - Score from Risk Agent (0-100)
 * @param {string} input.recommendation - Final investment recommendation (e.g. BUY)
 * @param {number} input.confidence - Final recommendation confidence level (0.0 - 1.0)
 * @param {Array<string>} input.strengths - Financial strengths identified
 * @param {Array<string>} input.weaknesses - Financial weaknesses identified
 * @param {Array<string>} input.positiveFactors - Positive market drivers
 * @param {Array<string>} input.negativeFactors - Negative market pressures
 * @param {Array<string>} input.risks - Identified risk dimensions
 * @returns {string} The fully compiled prompt string.
 */
export const getReportPrompt = ({
  companyName,
  financialScore,
  newsScore,
  riskScore,
  recommendation,
  confidence,
  strengths,
  weaknesses,
  positiveFactors,
  negativeFactors,
  risks
}) => {
  const serializeList = (list) => {
    if (!list || list.length === 0) return 'None identified.';
    return list.map((item) => `- ${item}`).join('\n');
  };

  return `You are a Senior Wall Street Equity Research Analyst and Investment Committee Chair.

Your goal is to compile a highly professional, comprehensive Investment Research Report for the company "${companyName}".

---

INPUT METRIC ANALYSIS & FACTORS:
1. Basic Context:
   - Target Company Name : ${companyName}
   - Calculated Action   : ${recommendation}
   - Analytical Confidence: ${(confidence * 100).toFixed(0)}%

2. Core Sub-Node Scores:
   - Financial Score     : ${financialScore} / 100
   - News Sentiment Score: ${newsScore} / 100
   - Risk Safety Score   : ${riskScore} / 100

3. Financial Analysis:
   - Key Strengths:
${serializeList(strengths)}
   - Key Weaknesses:
${serializeList(weaknesses)}

4. News Sentiment Drivers:
   - Positive Sentiment Factors:
${serializeList(positiveFactors)}
   - Negative Sentiment Factors:
${serializeList(negativeFactors)}

5. Risk Diagnostics:
   - Identified Risk Dimensions:
${serializeList(risks)}

---

REPORT COMPILATION GUIDELINES:
1. Structure: Your final report must contain exactly the following five sections in standard Markdown layout:
   - **Executive Summary**: Sum up the company's status, final rating score, and analytical confidence.
   - **Financial Analysis**: Detail the company's financial scores, analyzing the balance sheet strengths and weaknesses.
   - **News Analysis**: Detail public sentiment, news coverage volume, and sentiment-driving headlines.
   - **Risk Analysis**: List key operational risks and how they impact investment safety ratings.
   - **Final Recommendation**: Summarize the final action and justification.
2. Tone: Highly professional, objective, concise, and analytical. Avoid hype, colloquialisms, or flowery adjectives.
3. Strict Truthfulness / Zero Hallucinations: Use ONLY the provided data, scores, strengths, weaknesses, sentiment factors, and risks. Do NOT create or assume any additional figures, financials, dates, products, or historical facts that are not explicitly provided in the inputs above.
4. Format: You must output a JSON object containing the markdown report string under the key "report". Do not include extra commentary outside of this JSON payload.

---

REQUIRED OUTPUT SCHEMA:
Your output must be JSON format only, matching this structure exactly:
{
  "report": "string containing full report formatted in markdown"
}
`;
};

export default getReportPrompt;
