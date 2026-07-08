import { graph } from '../graph/analysisGraph.js';
import { Analysis } from '../models/Analysis.js';
import { AppError } from '../utils/AppError.js';

/**
 * Executes a new stock investment analysis by triggering the LangGraph agent network.
 * Stores the final structured document in MongoDB.
 * 
 * POST /api/analysis
 */
export const runAnalysis = async (req, res, next) => {
  const { companyName } = req.body;

  if (!companyName) {
    return next(new AppError('companyName query is required to perform research', 400));
  }

  try {
    console.log(`[Backend API] Starting analysis pipeline for "${companyName}"...`);
    
    // Invoke the compiled LangGraph workflow
    const finalState = await graph.invoke({ companyName });

    // Build model schema parameters matching Analysis.js
    const analysisDoc = {
      companyName: finalState.companyName,
      ticker: finalState.ticker,
      financialScore: finalState.financialScore,
      newsScore: finalState.newsScore,
      riskScore: finalState.riskScore,
      finalScore: finalState.finalScore,
      recommendation: finalState.recommendation,
      confidence: finalState.confidence,
      reasoning: finalState.report, // The compiled markdown report acts as the qualitative reasoning summary
      risks: finalState.risks || []
    };

    // Save output document to database
    const savedAnalysis = await Analysis.create(analysisDoc);

    console.log(`[Backend API] Successfully completed and saved analysis for "${savedAnalysis.ticker}" (ID: ${savedAnalysis._id})`);

    // Return final state along with database ID
    res.status(201).json({
      success: true,
      data: {
        id: savedAnalysis._id,
        ...finalState
      }
    });

  } catch (error) {
    console.error(`[Backend API Error] Analysis pipeline failed: ${error.message}`);
    next(new AppError(`Analysis execution failed: ${error.message}`, 500));
  }
};

/**
 * Retrieves the reverse chronological history of all runs from MongoDB.
 * 
 * GET /api/analysis
 */
export const getAnalysisHistory = async (req, res, next) => {
  try {
    const history = await Analysis.find().sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      data: history
    });
  } catch (error) {
    console.error(`[Backend API Error] Fetching history failed: ${error.message}`);
    next(new AppError(`Fetching analysis history failed: ${error.message}`, 500));
  }
};

export default {
  runAnalysis,
  getAnalysisHistory
};
