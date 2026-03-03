import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';

// Lazy loading for high-performance
const Home = React.lazy(() => import('./pages/Home')); // Public Landing Page
const Dashboard = React.lazy(() => import('./pages/Dashboard')); // Private Management Hub
const Login = React.lazy(() => import('./pages/Login'));
const Register = React.lazy(() => import('./pages/Register'));
const SpareParts = React.lazy(() => import('./pages/SpareParts'));
const StockIn = React.lazy(() => import('./pages/StockIn'));
const StockOut = React.lazy(() => import('./pages/StockOut'));
const Reports = React.lazy(() => import('./pages/Reports'));


// 1. Guard: Protects management routes from non-logged-in users
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('isLoggedIn') === 'true';
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// 2. Loading Spinner
const PageLoader = () => (
  <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-4">
    <div className="w-12 h-12 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
    <p className="text-slate-400 text-xs font-black uppercase tracking-widest">Loading SmartPark SIMS...</p>
  </div>
);

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans antialiased flex flex-col">
        
        {/* Navbar handles its own visibility based on the path */}
        <Navbar />

        <main className="flex-grow">
          <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* --- Public Landing Page --- */}
              <Route path="/" element={<Home />} />
              
              {/* --- Auth Routes --- */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* --- Private Management Hub --- */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />

              <Route path="/sparepark" element={
                <ProtectedRoute>
                  <SpareParts />
                </ProtectedRoute>
              } />

              <Route path="/stockin" element={
                <ProtectedRoute>
                  <StockIn />
                </ProtectedRoute>
              } />

              <Route path="/stockout" element={
                <ProtectedRoute>
                  <StockOut />
                </ProtectedRoute>
              } />

              <Route path="/reports" element={
                <ProtectedRoute>
                  <Reports />
                </ProtectedRoute>
              } />

              {/* Redirect any unknown path to Home */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </main>

        {/* Branding Footer with Guillaume Credit */}
        <footer className="py-10 bg-white border-t border-slate-200/60">
          <div className="container mx-auto px-4 text-center">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-4">
              SmartPark SIMS Rubavu &copy; {new Date().getFullYear()}
            </p>
            <p className="text-slate-500 text-[11px] font-bold">
              Developed and Maintained by <span className="text-blue-600">Guillaume</span>
            </p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;