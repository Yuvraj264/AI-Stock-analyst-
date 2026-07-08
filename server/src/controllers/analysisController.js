import { graph } from '../graph/analysisGraph.js';
import { saveAnalysis, getAllAnalyses } from '../services/analysisService.js';
import { AppError } from '../utils/AppError.js';

/**
 * Executes a new stock investment analysis by triggering the LangGraph agent network.
 * Delegates database persistence to the Analysis Service.
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

    // Save outputs using analysisService
    const savedAnalysis = await saveAnalysis(finalState);

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
 * Retrieves the reverse chronological history of all runs via the Analysis Service.
 * 
 * GET /api/analysis
 */
export const getAnalysisHistory = async (req, res, next) => {
  try {
    const history = await getAllAnalyses();
    
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
