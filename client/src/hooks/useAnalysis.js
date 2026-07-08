import { useState, useCallback } from 'react';
import { performAnalysis, getHistory } from '../services/api.js';

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

  return {
    currentAnalysis,
    history,
    loading,
    error,
    analyzeStock,
    fetchHistory,
    setCurrentAnalysis
  };
};

export default useAnalysis;
