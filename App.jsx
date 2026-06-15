import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import io from 'socket.io-client';
import { Shield, LayoutDashboard, Upload, User, LogOut, ShieldCheck, Lock, Activity, Bell } from 'lucide-react';
import AIChatbot from './components/AIChatbot';

// Core Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import Dashboard from './pages/Dashboard';
import UploadCenter from './pages/UploadCenter';
import DetectionResult from './pages/DetectionResult';
import AdminDashboard from './pages/AdminDashboard';
import ProfilePage from './pages/ProfilePage';

// Protected Route Wrapper
const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { isAuthenticated, user, isLoading } = useAuthStore();

  if (isLoading) {
    return (
      <div className="flex-grow flex items-center justify-center bg-cyber-bg">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-t-cyber-cyan border-cyber-border animate-spin"></div>
          <p className="text-xs text-cyber-cyan font-mono">LOADING CYBER SEC CHANNELS...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && user?.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

// Global Layout
const AppLayout = ({ socketAlert }) => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const location = useLocation();
  const isLanding = location.pathname === '/';

  return (
    <div className="min-h-screen flex flex-col bg-cyber-bg text-gray-200">
      {/* Top Banner Warning if active websocket alert */}
      {socketAlert && (
        <div className="bg-cyber-rose/20 border-b border-cyber-rose/40 text-cyber-rose py-2 px-4 text-xs font-mono flex items-center justify-center gap-2 relative z-50">
          <Bell size={14} className="animate-bounce" />
          <span>{socketAlert}</span>
        </div>
      )}

      {/* Cyber Header Navbar */}
      <header className="border-b border-cyber-border bg-black/40 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <Shield className="text-cyber-cyan group-hover:rotate-12 transition duration-300" size={24} />
            <span className="font-extrabold tracking-wider text-white text-lg">TRUTHLENS<span className="text-cyber-cyan">.AI</span></span>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link to="/" className={`hover:text-cyber-cyan transition ${location.pathname === '/' ? 'text-cyber-cyan' : 'text-gray-400'}`}>Landing</Link>
            {isAuthenticated && (
              <>
                <Link to="/dashboard" className={`hover:text-cyber-cyan flex items-center gap-1.5 transition ${location.pathname === '/dashboard' ? 'text-cyber-cyan' : 'text-gray-400'}`}>
                  <LayoutDashboard size={14} /> Dashboard
                </Link>
                <Link to="/upload" className={`hover:text-cyber-cyan flex items-center gap-1.5 transition ${location.pathname === '/upload' ? 'text-cyber-cyan' : 'text-gray-400'}`}>
                  <Upload size={14} /> Scanner
                </Link>
                {user?.role === 'admin' && (
                  <Link to="/admin" className={`hover:text-cyber-rose flex items-center gap-1.5 transition ${location.pathname === '/admin' ? 'text-cyber-rose' : 'text-gray-400'}`}>
                    <Lock size={14} /> Admin
                  </Link>
                )}
              </>
            )}
          </nav>

          <div className="flex items-center gap-4">
            {/* System Status Indicator */}
            <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-950 border border-cyber-border text-[10px] font-mono text-cyber-emerald">
              <Activity size={10} className="animate-pulse" />
              <span>SECURE PROTOCOL ACTIVE</span>
            </div>

            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <Link to="/profile" className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-cyber-border hover:border-cyber-cyan/30 bg-zinc-950 text-xs transition">
                  <User size={12} className="text-cyber-cyan" />
                  <span className="font-medium text-white">{user?.username}</span>
                </Link>
                <button onClick={logout} className="p-2 rounded-xl border border-cyber-border hover:bg-cyber-rose/10 hover:text-cyber-rose transition text-gray-400">
                  <LogOut size={14} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="text-xs font-semibold px-4 py-2 hover:text-white text-gray-400 transition">Login</Link>
                <Link to="/signup" className="text-xs px-4 py-2 rounded-xl cyber-btn-cyan">Get Started</Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Pages Wrapper */}
      <main className="flex-grow flex flex-col">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={!isAuthenticated ? <LoginPage /> : <Navigate to="/dashboard" />} />
          <Route path="/signup" element={!isAuthenticated ? <SignupPage /> : <Navigate to="/dashboard" />} />
          
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/upload" element={
            <ProtectedRoute>
              <UploadCenter />
            </ProtectedRoute>
          } />
          
          <Route path="/result/:historyId" element={
            <ProtectedRoute>
              <DetectionResult />
            </ProtectedRoute>
          } />
          
          <Route path="/admin" element={
            <ProtectedRoute requireAdmin={true}>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/profile" element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          } />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Footer */}
      <footer className="border-t border-cyber-border bg-black/60 py-6 text-xs text-center text-gray-500 font-mono">
        <p>© 2026 TruthLens AI Platform. All rights reserved. Forensic Assessment Protocol.</p>
      </footer>

      {/* Persistent AI chatbot */}
      <AIChatbot />
    </div>
  );
};

const App = () => {
  const initializeAuth = useAuthStore(state => state.initialize);
  const [socketAlert, setSocketAlert] = useState(null);

  useEffect(() => {
    initializeAuth();

    // Listen for WebSocket system-wide notifications
    const socket = io('/');
    socket.on('system_notification', (data) => {
      setSocketAlert(`${data.title}: ${data.message}`);
      // Clear alert after 8 seconds
      setTimeout(() => {
        setSocketAlert(null);
      }, 8000);
    });

    return () => {
      socket.disconnect();
    };
  }, [initializeAuth]);

  return (
    <Router>
      <AppLayout socketAlert={socketAlert} />
    </Router>
  );
};

export default App;
