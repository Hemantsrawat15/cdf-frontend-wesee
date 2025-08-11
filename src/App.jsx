import React, { useState, useEffect } from "react";
import {
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import toast from "react-hot-toast"; // <-- Add this
import Sidebar from "./components/Sidebar";
import Home from "./pages/Home";
import History from "./pages/History";
import Login from "./components/Login";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState("home");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selectedSource, setSelectedSource] = useState("");
  const [selectedSubSource, setSelectedSubSource] = useState("");
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // Show loading spinner on first load
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Responsive sidebar
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setIsCollapsed(true);
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Login handler
  const handleLogin = (userData) => {
    setIsAuthenticated(true);
    toast.success("Login successful!"); // <-- Toast on login
    navigate("/"); // Redirect to home after login
  };

  // Home handlers
  const handleSourceChange = (source) => {
    setSelectedSource(source);
    setSelectedSubSource("");
  };

  const handleFileSelect = (files) => {
    // This will be called from FileUpload
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  // Show loading spinner
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

  // If not authenticated and not on /login, redirect to /login
  if (!isAuthenticated && location.pathname !== "/login") {
    return <Navigate to="/login" replace />;
  }

  // If authenticated and on /login, redirect to home
  if (isAuthenticated && location.pathname === "/login") {
    return <Navigate to="/" replace />;
  }

  return (
    <>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route
          path="/"
          element={
            isAuthenticated ? (
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
                    marginLeft: isMobile ? 0 : isCollapsed ? "64px" : "256px",
                  }}
                >
                  <div className="h-full overflow-y-auto">
                    <div className="p-4 md:p-6 lg:p-8">
                      <div className="max-w-7xl mx-auto">
                        <Home
                          selectedSource={selectedSource}
                          selectedSubSource={selectedSubSource}
                          onSourceChange={handleSourceChange}
                          onSubSourceChange={setSelectedSubSource}
                          onFileSelect={handleFileSelect}
                        />
                      </div>
                    </div>
                  </div>
                </main>
              </div>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/history"
          element={
            isAuthenticated ? (
              <div className="flex h-screen bg-gray-50 relative overflow-hidden">
                <div className="fixed inset-0 bg-gradient-to-br from-blue-50/30 via-purple-50/20 to-indigo-50/30 pointer-events-none"></div>
                <Sidebar
                  activeTab={activeTab}
                  onTabChange={handleTabChange}
                  isCollapsed={isCollapsed}
                  onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
                  onLogout={() => {
                    setIsAuthenticated(false);
                    // Optionally: toast.success("Logged out!");
                    navigate("/login");
                  }}
                />
                <main
                  className="flex-1 relative z-10 transition-all duration-300"
                  style={{
                    marginLeft: isMobile ? 0 : isCollapsed ? "64px" : "256px",
                  }}
                >
                  <div className="h-full overflow-y-auto">
                    <div className="p-4 md:p-6 lg:p-8">
                      <div className="max-w-7xl mx-auto">
                        <History />
                      </div>
                    </div>
                  </div>
                </main>
              </div>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        {/* Catch-all: redirect to home or login */}
        <Route
          path="*"
          element={<Navigate to={isAuthenticated ? "/" : "/login"} replace />}
        />
      </Routes>
    </>
  );
}

export default App;
