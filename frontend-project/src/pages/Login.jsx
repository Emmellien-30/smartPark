import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api';

const Login = () => {
  const [data, setData] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Logic: API call to verify user in MySQL
      await API.post('/login', data);
      
      localStorage.setItem('isLoggedIn', 'true');
      // Navigate to dashboard and replace history so they can't 'back' into login
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err.response?.data || "Login failed. Check your username and password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[90vh] flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
      
      {/* Container for the form */}
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.05)] border border-gray-100">
        
        {/* Logo & Header */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-600 shadow-lg shadow-blue-200 mb-6">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 00-2 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">SIMS Login</h2>
          <p className="text-slate-400 text-sm mt-2 font-medium">SmartPark Rubavu Branch</p>
        </div>

        {/* Professional Error Message */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-100 text-red-600 text-xs font-bold rounded-2xl flex items-center gap-3 animate-pulse">
            <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="mt-8 space-y-5">
          <div className="group">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Username</label>
            <input 
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-4 outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-slate-700 placeholder:text-slate-300" 
              type="text" 
              placeholder="Enter your username"
              disabled={loading}
              onChange={e => setData({...data, username: e.target.value})} 
              required 
            />
          </div>

          <div className="group">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Password</label>
            <input 
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-4 outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-slate-700 placeholder:text-slate-300" 
              type="password" 
              placeholder="••••••••"
              disabled={loading}
              onChange={e => setData({...data, password: e.target.value})} 
              required 
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className={`w-full py-4 rounded-2xl font-bold text-white shadow-xl transition-all flex items-center justify-center gap-3 ${
              loading 
              ? 'bg-slate-400 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700 hover:shadow-blue-200 active:scale-95'
            }`}
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Authenticating...
              </>
            ) : "Enter System"}
          </button>
        </form>

        <div className="text-center pt-4">
          <p className="text-xs text-slate-400">
            Need access? <Link to="/register" className="text-blue-600 font-bold hover:underline">Register Staff</Link>
          </p>
        </div>
      </div>

      {/* Back to Home Button - Outside the card for a cleaner look */}
      <div className="mt-8">
        <Link to="/" className="text-sm font-semibold text-slate-500 hover:text-blue-600 flex items-center gap-2 transition-colors group">
          <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Website
        </Link>
      </div>
    </div>
  );
};

export default Login;