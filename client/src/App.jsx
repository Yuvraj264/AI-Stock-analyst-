import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar.jsx';
import Home from './pages/Home.jsx';
import Dashboard from './pages/Dashboard.jsx';
import History from './pages/History.jsx';
import Compare from './pages/Compare.jsx';
import Watchlist from './pages/Watchlist.jsx';
import Settings from './pages/Settings.jsx';
import { ToastProvider } from './components/Toast.jsx';

const INITIAL_WATCHLIST = [
  {
    id: 'w1',
    companyName: 'NVIDIA Corporation',
    ticker: 'NVDA',
    recommendation: 'INVEST',
    consensusScore: 88,
    confidence: 0.90,
    lastUpdated: '2026-07-17T12:00:00.000Z'
  },
  {
    id: 'w2',
    companyName: 'Microsoft Corporation',
    ticker: 'MSFT',
    recommendation: 'INVEST',
    consensusScore: 82,
    confidence: 0.85,
    lastUpdated: '2026-07-16T15:30:00.000Z'
  },
  {
    id: 'w3',
    companyName: 'Tesla, Inc.',
    ticker: 'TSLA',
    recommendation: 'HOLD',
    consensusScore: 55,
    confidence: 0.70,
    lastUpdated: '2026-07-15T09:15:00.000Z'
  },
  {
    id: 'w4',
    companyName: 'Apple Inc.',
    ticker: 'AAPL',
    recommendation: 'INVEST',
    consensusScore: 80,
    confidence: 0.88,
    lastUpdated: '2026-07-17T10:45:00.000Z'
  },
  {
    id: 'w5',
    companyName: 'Intel Corporation',
    ticker: 'INTC',
    recommendation: 'PASS',
    consensusScore: 35,
    confidence: 0.75,
    lastUpdated: '2026-07-14T08:00:00.000Z'
  }
];

/**
 * Main Application Orchestrator.
 * Wraps routes with a persistent sidebar layout and Toast notifications context.
 */
function App() {
  // Watchlist state shared across the application
  const [watchlist, setWatchlist] = useState(() => {
    const saved = localStorage.getItem('watchlist_items');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse watchlist items from localStorage', e);
      }
    }
    return INITIAL_WATCHLIST;
  });

  // Sync state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('watchlist_items', JSON.stringify(watchlist));
  }, [watchlist]);

  return (
    <ToastProvider>
      <Router>
        <div className="min-h-screen flex flex-col md:flex-row bg-[#0F1115] text-[#FFFFFF] font-sans antialiased">
          {/* Persistent Left Sidebar */}
          <Sidebar watchlistCount={watchlist.length} />
          
          {/* Main Routing Content Area */}
          <div className="flex-1 min-w-0 min-h-screen overflow-y-auto">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route 
                path="/dashboard" 
                element={<Dashboard watchlist={watchlist} setWatchlist={setWatchlist} />} 
              />
              <Route path="/history" element={<History />} />
              <Route path="/compare" element={<Compare />} />
              <Route 
                path="/watchlist" 
                element={<Watchlist watchlist={watchlist} setWatchlist={setWatchlist} />} 
              />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </div>
        </div>
      </Router>
    </ToastProvider>
  );
}

export default App;
