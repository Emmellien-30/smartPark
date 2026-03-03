import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // 1. Precise Check: Only show Navbar if logged in
  const isAuthenticated = localStorage.getItem('isLoggedIn') === 'true';

  // 2. Hide Navbar on Public Landing, Login, and Register pages
  // Note: We now allow it on /dashboard and other management routes
  const publicPaths = ['/', '/login', '/register'];
  if (publicPaths.includes(location.pathname) || !isAuthenticated) return null;

  const handleLogout = () => {
    localStorage.clear(); // Clears session and username
    navigate('/'); // Redirect to the new public landing page
  };

  return (
    <nav className="bg-slate-900 text-white shadow-2xl sticky top-0 z-50 border-b border-slate-800">
      <div className="container mx-auto px-6 h-20 flex justify-between items-center">
        
        {/* Company Branding - Points to Dashboard for logged in users */}
        <Link to="/dashboard" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-black text-white">S</div>
          <div className="text-xl font-black tracking-tighter text-blue-400">
            SmartPark <span className="text-white">SIMS</span>
          </div>
        </Link>
        
        {/* Main Navigation Links */}
        <div className="hidden md:flex items-center space-x-6">
          <Link 
            to="/dashboard" 
            className={`text-xs font-black uppercase tracking-widest transition ${location.pathname === '/dashboard' ? 'text-blue-400' : 'text-slate-400 hover:text-white'}`}
          >
            Dashboard
          </Link>
          <Link 
            to="/sparepark" 
            className={`text-xs font-black uppercase tracking-widest transition ${location.pathname === '/sparepark' ? 'text-blue-400' : 'text-slate-400 hover:text-white'}`}
          >
            SparePart
          </Link>
          <Link 
            to="/stockin" 
            className={`text-xs font-black uppercase tracking-widest transition ${location.pathname === '/stockin' ? 'text-blue-400' : 'text-slate-400 hover:text-white'}`}
          >
            Stock In
          </Link>
          <Link 
            to="/stockout" 
            className={`text-xs font-black uppercase tracking-widest transition ${location.pathname === '/stockout' ? 'text-blue-400' : 'text-slate-400 hover:text-white'}`}
          >
            Stock Out
          </Link>
          <Link 
            to="/reports" 
            className={`text-xs font-black uppercase tracking-widest transition ${location.pathname === '/reports' ? 'text-yellow-400' : 'text-slate-400 hover:text-white'}`}
          >
            Reports
          </Link>
        </div>

        {/* Auth Action */}
        <div className="flex items-center gap-4 border-l border-slate-800 pl-6">
          <button 
            onClick={handleLogout} 
            className="bg-rose-600 px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-700 transition shadow-lg shadow-rose-900/20 border border-rose-500/50"
          >
            Logout System
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;