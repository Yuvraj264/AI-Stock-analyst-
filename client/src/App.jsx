import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar.jsx';
import Home from './pages/Home.jsx';
import Dashboard from './pages/Dashboard.jsx';
import History from './pages/History.jsx';
import Compare from './pages/Compare.jsx';
import Watchlist from './pages/Watchlist.jsx';
import { ToastProvider } from './components/Toast.jsx';

/**
 * Main Application Orchestrator.
 * Wraps routes with a persistent sidebar layout and Toast notifications context.
 */
function App() {
  return (
    <ToastProvider>
      <Router>
        <div className="min-h-screen flex flex-col md:flex-row bg-[#0F1115] text-[#FFFFFF] font-sans antialiased">
          {/* Persistent Left Sidebar */}
          <Sidebar />
          
          {/* Main Routing Content Area */}
          <div className="flex-1 min-w-0 min-h-screen overflow-y-auto">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/history" element={<History />} />
              <Route path="/compare" element={<Compare />} />
              <Route path="/watchlist" element={<Watchlist />} />
            </Routes>
          </div>
        </div>
      </Router>
    </ToastProvider>
  );
}

export default App;
