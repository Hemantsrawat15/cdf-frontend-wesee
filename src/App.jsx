import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import History from './pages/History';

function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selectedSource, setSelectedSource] = useState('');
  const [selectedSubSource, setSelectedSubSource] = useState('');
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Check for mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setIsCollapsed(true);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Loading state
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleSourceChange = (source) => {
    setSelectedSource(source);
    setSelectedSubSource('');
  };

  const handleFileSelect = (files) => {
    console.log('Selected files:', files);
    // Handle file selection logic here
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-purple-800">
        <div className="text-center text-white">
          <div className="w-20 h-20 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-6"></div>
          <div className="text-2xl font-bold mb-2">CDF</div>
          <div className="text-sm opacity-80">Loading application...</div>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="flex h-screen bg-gray-50 relative overflow-hidden">
        {/* Background gradient overlay */}
        <div className="fixed inset-0 bg-gradient-to-br from-blue-50/30 via-purple-50/20 to-indigo-50/30 pointer-events-none"></div>

        <Sidebar
          activeTab={activeTab}
          onTabChange={handleTabChange}
          isCollapsed={isCollapsed}
          onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
        />

        <main
          className="flex-1 relative z-10 transition-all duration-300"
          style={{
            marginLeft: isMobile ? 0 : isCollapsed ? '64px' : '256px',
          }}
        >
          <div className="h-full overflow-y-auto">
            <div className="p-4 md:p-6 lg:p-8">
              <div className="max-w-7xl mx-auto">
                <Routes>
                  <Route
                    path="/"
                    element={
                      <Home
                        selectedSource={selectedSource}
                        selectedSubSource={selectedSubSource}
                        onSourceChange={handleSourceChange}
                        onSubSourceChange={setSelectedSubSource}
                        onFileSelect={handleFileSelect}
                      />
                    }
                  />
                  <Route path="/history" element={<History />} />
                </Routes>
              </div>
            </div>
          </div>
        </main>
      </div>
    </Router>
  );
}

export default App;
