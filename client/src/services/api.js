import axios from 'axios';

// Axios instance configured for local relative calls resolved by Vite proxy
const api = axios.create({
  baseURL: '',
  headers: {
    'Content-Type': 'application/json'
  }
});

/**
 * Trigger LangGraph stock research analysis.
 * @param {string} companyName - Name of the target company
 */
export const performAnalysis = async (companyName) => {
  const response = await api.post('/api/analyze', { companyName });
  return response.data;
};

/**
 * Fetch reverse chronological runs from the database.
 */
export const getHistory = async () => {
  const response = await api.get('/api/history');
  return response.data;
};

/**
 * Delete a specific stock analysis record from the database.
 * @param {string} id - The MongoDB ObjectId of the record
 */
export const deleteHistoryItem = async (id) => {
  const response = await api.delete(`/api/history/${id}`);
  return response.data;
};

/**
 * Fetch server connectivity status.
 */
export const getHealth = async () => {
  const response = await api.get('/api/health');
  return response.data;
};

export default {
  performAnalysis,
  getHistory,
  deleteHistoryItem,
  getHealth
};
