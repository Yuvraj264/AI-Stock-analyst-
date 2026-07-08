import axios from 'axios';

// Axios instance configured for local relative calls resolved by Vite proxy
const api = axios.create({
  baseURL: '',
  headers: {
    'Content-Type': 'application/json'
  }
});

/**
 * Executes an asynchronous API request function with automatic retry logic on transient errors.
 * Uses exponential backoff delays.
 * 
 * @param {Function} requestFn - Function returning a promise of the axios request
 * @param {number} retries - Number of remaining retry attempts
 * @param {number} delay - Base delay duration in milliseconds
 */
const executeRequestWithRetry = async (requestFn, retries = 3, delay = 1000) => {
  try {
    return await requestFn();
  } catch (error) {
    if (retries <= 0) throw error;
    
    const status = error.response?.status;
    // Retry on network/timeout errors, 5xx server errors, or 429 rate limits
    const shouldRetry = !status || status >= 500 || status === 429;
    
    if (!shouldRetry) throw error;

    console.warn(`[API Retry] Request failed. Retrying in ${delay}ms... (${retries} attempts remaining). Error: ${error.message}`);
    await new Promise((resolve) => setTimeout(resolve, delay));
    return executeRequestWithRetry(requestFn, retries - 1, delay * 2);
  }
};

/**
 * Trigger LangGraph stock research analysis.
 * @param {string} companyName - Name of the target company
 */
export const performAnalysis = async (companyName) => {
  return executeRequestWithRetry(() => api.post('/api/analyze', { companyName }).then(res => res.data));
};

/**
 * Fetch reverse chronological runs from the database.
 */
export const getHistory = async () => {
  return executeRequestWithRetry(() => api.get('/api/history').then(res => res.data));
};

/**
 * Delete a specific stock analysis record from the database.
 * @param {string} id - The MongoDB ObjectId of the record
 */
export const deleteHistoryItem = async (id) => {
  return executeRequestWithRetry(() => api.delete(`/api/history/${id}`).then(res => res.data));
};

/**
 * Fetch server connectivity status.
 */
export const getHealth = async () => {
  return executeRequestWithRetry(() => api.get('/api/health').then(res => res.data));
};

export default {
  performAnalysis,
  getHistory,
  deleteHistoryItem,
  getHealth
};
