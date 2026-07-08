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
  const response = await api.post('/api/analysis', { companyName });
  return response.data;
};

/**
 * Fetch reverse chronological runs from the database.
 */
export const getHistory = async () => {
  const response = await api.get('/api/analysis');
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
  getHealth
};
