import { graph } from '../graph/analysisGraph.js';
import {
  saveAnalysis,
  getAllAnalyses,
  getAnalysisById,
  deleteAnalysis as deleteAnalysisFromService
} from '../services/analysisService.js';
import { AppError } from '../utils/AppError.js';

/**
 * Executes a new stock investment analysis by triggering the LangGraph agent network.
 * Delegates database persistence to the Analysis Service.
 * 
 * POST /api/analyze
 */
export const runAnalysis = async (req, res, next) => {
  const { companyName } = req.body;

  try {
    console.log(`[Analysis Controller] Received request to analyze: "${companyName}"`);
    console.log(`[Analysis Controller] Invoking LangGraph workflow for "${companyName}"...`);
    
    // Invoke the compiled LangGraph workflow
    const finalState = await graph.invoke({ companyName });
    
    console.log(`[Analysis Controller] Workflow completed. Saving analysis results for ticker: "${finalState.ticker}"...`);

    // Save outputs using analysisService
    const savedAnalysis = await saveAnalysis(finalState);

    console.log(`[Analysis Controller] Successfully saved analysis (ID: ${savedAnalysis._id}) for "${savedAnalysis.companyName}" (${savedAnalysis.ticker})`);

    // Return final saved analysis document merged with live transient data
    res.status(201).json({
      success: true,
      data: {
        ...savedAnalysis.toObject(),
        financialData: finalState.financialData,
        breakdown: finalState.breakdown
      }
    });

  } catch (error) {
    console.error(`[Analysis Controller Error] Analysis pipeline failed for "${companyName}": ${error.message}`);
    next(error instanceof AppError ? error : new AppError(`Analysis execution failed: ${error.message}`, 500));
  }
};

/**
 * Retrieves the reverse chronological history of all runs via the Analysis Service.
 * 
 * GET /api/history
 */
export const getAnalysisHistory = async (req, res, next) => {
  try {
    console.log('[Analysis Controller] Fetching all analysis history records...');
    const history = await getAllAnalyses();
    console.log(`[Analysis Controller] Successfully fetched ${history.length} analysis records`);
    
    res.status(200).json({
      success: true,
      data: history
    });
  } catch (error) {
    console.error(`[Analysis Controller Error] Fetching history failed: ${error.message}`);
    next(error instanceof AppError ? error : new AppError(`Fetching analysis history failed: ${error.message}`, 500));
  }
};

/**
 * Retrieves a single analysis document by its database Object ID.
 * 
 * GET /api/history/:id
 */
export const getAnalysisDetail = async (req, res, next) => {
  const { id } = req.params;
  try {
    console.log(`[Analysis Controller] Fetching analysis record with ID: "${id}"...`);
    const analysis = await getAnalysisById(id);
    console.log(`[Analysis Controller] Successfully fetched analysis record: "${analysis.companyName}" (${analysis.ticker})`);

    res.status(200).json({
      success: true,
      data: analysis
    });
  } catch (error) {
    console.error(`[Analysis Controller Error] Fetching record ID "${id}" failed: ${error.message}`);
    next(error instanceof AppError ? error : new AppError(`Fetching analysis record failed: ${error.message}`, 500));
  }
};

/**
 * Deletes a single analysis record by its database Object ID.
 * 
 * DELETE /api/history/:id
 */
export const deleteAnalysisRecord = async (req, res, next) => {
  const { id } = req.params;
  try {
    console.log(`[Analysis Controller] Request received to delete record with ID: "${id}"...`);
    const deletedRecord = await deleteAnalysisFromService(id);
    console.log(`[Analysis Controller] Successfully deleted record ID: "${id}" for "${deletedRecord.companyName}" (${deletedRecord.ticker})`);

    res.status(200).json({
      success: true,
      data: {
        id: deletedRecord._id,
        ticker: deletedRecord.ticker,
        companyName: deletedRecord.companyName,
        message: 'Analysis record deleted successfully'
      }
    });
  } catch (error) {
    console.error(`[Analysis Controller Error] Deletion of record ID "${id}" failed: ${error.message}`);
    next(error instanceof AppError ? error : new AppError(`Deleting analysis record failed: ${error.message}`, 500));
  }
};

export default {
  runAnalysis,
  getAnalysisHistory,
  getAnalysisDetail,
  deleteAnalysisRecord
};
