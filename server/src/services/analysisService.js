import { Analysis } from '../models/Analysis.js';
import { AppError } from '../utils/AppError.js';

/**
 * Persists a completed multi-agent analysis report into MongoDB.
 * 
 * @param {Object} data - Input properties from the LangGraph final state
 * @returns {Promise<Object>} The stored Mongoose document
 */
export const saveAnalysis = async (data) => {
  if (!data || !data.companyName || !data.ticker) {
    throw new AppError('Invalid analysis data. "companyName" and "ticker" are required to persist.', 400);
  }

  try {
    console.log(`[Analysis Service] Persisting stock report to database for: "${data.ticker}"...`);

    // Map properties explicitly
    const doc = {
      companyName: data.companyName,
      ticker: data.ticker,
      financialScore: data.financialScore,
      newsScore: data.newsScore,
      riskScore: data.riskScore,
      finalScore: data.finalScore,
      recommendation: data.recommendation,
      confidence: data.confidence,
      reasoning: data.report || data.reasoning, // Use "report" markdown text or fallback to "reasoning"
      risks: data.risks || [],
      createdAt: data.createdAt || new Date()
    };

    const savedDoc = await Analysis.create(doc);
    console.log(`[Analysis Service] Successfully persisted document (ID: ${savedDoc._id})`);
    return savedDoc;
  } catch (error) {
    console.error(`[Analysis Service Error] saveAnalysis failed: ${error.message}`);
    throw new AppError(`Database persistence failed: ${error.message}`, 500);
  }
};

/**
 * Finds a single analysis document by its database Object ID.
 * 
 * @param {string} id - The MongoDB Object ID
 * @returns {Promise<Object>} The resolved document
 */
export const getAnalysisById = async (id) => {
  if (!id) {
    throw new AppError('Analysis ID is required to fetch record', 400);
  }

  try {
    console.log(`[Analysis Service] Querying database for record ID: "${id}"...`);
    const record = await Analysis.findById(id);

    if (!record) {
      throw new AppError(`No stock analysis record found with ID: "${id}"`, 404);
    }

    return record;
  } catch (error) {
    console.error(`[Analysis Service Error] getAnalysisById failed: ${error.message}`);
    if (error instanceof AppError) throw error;
    throw new AppError(`Database query failed: ${error.message}`, 500);
  }
};

/**
 * Retrieves all analyses sorted by creation date in reverse chronological order.
 * 
 * @returns {Promise<Array>} List of Mongoose documents
 */
export const getAllAnalyses = async () => {
  try {
    console.log('[Analysis Service] Retrieving all analysis logs from database...');
    const records = await Analysis.find().sort({ createdAt: -1 });
    return records;
  } catch (error) {
    console.error(`[Analysis Service Error] getAllAnalyses failed: ${error.message}`);
    throw new AppError(`Database query failed: ${error.message}`, 500);
  }
};

/**
 * Deletes a single analysis record by its database Object ID.
 * 
 * @param {string} id - The MongoDB Object ID
 * @returns {Promise<Object>} Deleted document
 */
export const deleteAnalysis = async (id) => {
  if (!id) {
    throw new AppError('Analysis ID is required to execute deletion', 400);
  }

  try {
    console.log(`[Analysis Service] Deleting database record ID: "${id}"...`);
    const deletedRecord = await Analysis.findByIdAndDelete(id);

    if (!deletedRecord) {
      throw new AppError(`No analysis record found with ID: "${id}" to delete.`, 404);
    }

    console.log(`[Analysis Service] Successfully deleted record (ID: ${id})`);
    return deletedRecord;
  } catch (error) {
    console.error(`[Analysis Service Error] deleteAnalysis failed: ${error.message}`);
    if (error instanceof AppError) throw error;
    throw new AppError(`Database deletion failed: ${error.message}`, 500);
  }
};

export default {
  saveAnalysis,
  getAnalysisById,
  getAllAnalyses,
  deleteAnalysis
};
