import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api';

const Register = () => {
  const [data, setData] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [strength, setStrength] = useState({ score: 0, label: 'Too Weak', color: 'bg-gray-200' });
  const navigate = useNavigate();

  // Real-time password strength check
  useEffect(() => {
    const pw = data.password;
    let score = 0;
    if (pw.length >= 8) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[!@#$%^&*]/.test(pw)) score++;

    const levels = [
      { label: 'Too Weak', color: 'bg-red-400', width: '25%' },
      { label: 'Weak', color: 'bg-orange-400', width: '50%' },
      { label: 'Medium', color: 'bg-yellow-400', width: '75%' },
      { label: 'Strong', color: 'bg-green-500', width: '100%' }
    ];
    
    setStrength(score === 0 ? { label: 'Too Weak', color: 'bg-gray-200', width: '0%' } : levels[score - 1]);
  }, [data.password]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (strength.label !== 'Strong') {
      setError("Please follow the security requirements for a Strong password.");
      return;
    }

    setLoading(true);
    setError('');
    try {
      await API.post('/register', data);
      alert("Registration Successful! Please login.");
      navigate('/login');
    } catch (err) {
      setError(err.response?.data || "Registration failed. Username might be taken.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex flex-col justify-center py-12 px-4">
      <div className="max-w-md w-full mx-auto bg-white p-10 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-slate-100">
        
        <div className="text-center mb-8">
          <h2 className="text-3xl font-black text-slate-900">Create Account</h2>
          <p className="text-slate-400 text-sm mt-2">Join the SmartPark Rubavu Team</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-700 text-xs rounded-xl border border-red-100 animate-pulse">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Username</label>
            <input 
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 transition-all" 
              type="text" 
              placeholder="Full Name or Staff ID"
              onChange={e => setData({...data, username: e.target.value})} 
              required 
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Password</label>
            <input 
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 transition-all" 
              type="password" 
              placeholder="••••••••"
              onChange={e => setData({...data, password: e.target.value})} 
              required 
            />
            
            {/* Password Strength Meter */}
            <div className="mt-3 px-1">
              <div className="flex justify-between items-center mb-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Security Level:</span>
                <span className={`text-[10px] font-bold uppercase ${strength.label === 'Strong' ? 'text-green-500' : 'text-slate-400'}`}>
                  {strength.label}
                </span>
              </div>
              <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-500 ${strength.color}`} 
                  style={{ width: strength.width }}
                ></div>
              </div>
              <ul className="mt-3 grid grid-cols-2 gap-x-2 gap-y-1 text-[9px] text-slate-400 font-medium">
                <li className={data.password.length >= 8 ? 'text-green-600' : ''}>✓ 8+ Characters</li>
                <li className={/[A-Z]/.test(data.password) ? 'text-green-600' : ''}>✓ Uppercase Letter</li>
                <li className={/[0-9]/.test(data.password) ? 'text-green-600' : ''}>✓ One Number</li>
                <li className={/[!@#$%^&*]/.test(data.password) ? 'text-green-600' : ''}>✓ Special Symbol</li>
              </ul>
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className={`w-full py-4 rounded-2xl font-bold text-white shadow-lg transition-all flex items-center justify-center gap-2 ${
              loading ? 'bg-slate-400' : 'bg-slate-900 hover:bg-black active:scale-95'
            }`}
          >
            {loading ? "Creating Account..." : "Register Staff Member"}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-50 text-center">
          <p className="text-xs text-slate-400">
            Already have an account? <Link to="/login" className="text-blue-600 font-bold hover:underline">Sign In here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;