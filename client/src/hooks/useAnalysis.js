import { useState, useCallback } from 'react';
import { performAnalysis, getHistory, deleteHistoryItem } from '../services/api.js';

/**
 * Custom React Hook that coordinates analysis executions, database history records,
 * and component state binding.
 */
export const useAnalysis = () => {
  const [currentAnalysis, setCurrentAnalysis] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Dispatches the stock research query.
   */
  const analyzeStock = useCallback(async (companyName) => {
    setLoading(true);
    setError(null);
    try {
      const response = await performAnalysis(companyName);
      if (response && response.success) {
        const result = response.data;
        setCurrentAnalysis(result);
        
        // Update history cache
        setHistory((prev) => {
          const exists = prev.some((item) => item.ticker === result.ticker);
          if (exists) return prev;
          return [result, ...prev];
        });
        
        return result;
      } else {
        throw new Error(response.message || 'Failed to resolve stock research.');
      }
    } catch (err) {
      console.error('[useAnalysis Hook Error] performAnalysis failed:', err);
      const errMsg = err.response?.data?.message || err.message || 'An operational error occurred.';
      setError(errMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Refreshes history logs from database.
   */
  const fetchHistory = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getHistory();
      if (response && response.success) {
        setHistory(response.data);
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to fetch historical database items.');
      }
    } catch (err) {
      console.error('[useAnalysis Hook Error] getHistory failed:', err);
      const errMsg = err.response?.data?.message || err.message || 'An error occurred loading historical records.';
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Deletes an analysis record by its ID.
   */
  const deleteAnalysisItem = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await deleteHistoryItem(id);
      if (response && response.success) {
        // Remove item from state
        setHistory((prev) => prev.filter((item) => item._id !== id));
        return true;
      } else {
        throw new Error(response.message || 'Failed to delete record.');
      }
    } catch (err) {
      console.error('[useAnalysis Hook Error] deleteAnalysisItem failed:', err);
      const errMsg = err.response?.data?.message || err.message || 'An error occurred deleting the analysis record.';
      setError(errMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    currentAnalysis,
    history,
    loading,
    error,
    analyzeStock,
    fetchHistory,
    deleteAnalysisItem,
    setCurrentAnalysis
  };
};

export default useAnalysis;
