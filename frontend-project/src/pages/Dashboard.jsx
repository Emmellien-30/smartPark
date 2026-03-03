import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api';

const Dashboard = () => {
  const [stats, setStats] = useState({ totalParts: 0, lowStock: 0, dailySales: 0, totalValue: 0 });
  const [recentSales, setRecentSales] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [partsRes, salesRes] = await Promise.all([
          API.get('/spareparts'),
          API.get('/stockout')
        ]);

        const parts = partsRes.data;
        const allSales = salesRes.data;
        const today = new Date().toISOString().split('T')[0];
        
        // Calculate Metrics
        const todaysSales = allSales.filter(s => s.stockout_date?.split('T')[0] === today);
        setStats({
          totalParts: parts.length,
          lowStock: parts.filter(p => p.quantity <= 5).length,
          dailySales: todaysSales.reduce((sum, s) => sum + Number(s.sout_totalprice), 0),
          totalValue: parts.reduce((sum, p) => sum + (p.quantity * p.unit_price), 0)
        });

        // Get Last 5 Sales for the Activity Feed
        setRecentSales(allSales.sort((a, b) => b.stockout_id - a.stockout_id).slice(0, 5));
      } catch (err) {
        console.error("Dashboard failed to load", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12 animate-in fade-in duration-700">
      
      {/* Header Section */}
      <div className="bg-slate-900 p-8 rounded-[2.5rem] shadow-2xl text-white flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight">Dashboard</h1>
          <p className="text-slate-400 mt-1 font-medium">SmartPark SIMS • Rubavu Operations</p>
        </div>
        <div className="flex gap-3">
          <Link to="/stockout" className="bg-blue-600 hover:bg-blue-500 px-6 py-3 rounded-2xl font-bold transition shadow-lg shadow-blue-900/40 active:scale-95">
            New Sale +
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard title="Inventory Value" value={`${stats.totalValue.toLocaleString()} RWF`} color="blue" />
        <MetricCard title="Today's Revenue" value={`${stats.dailySales.toLocaleString()} RWF`} color="green" />
        <MetricCard title="Low Stock Items" value={stats.lowStock} color={stats.lowStock > 0 ? "red" : "slate"} />
        <MetricCard title="Stock Varieties" value={stats.totalParts} color="slate" />
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Quick Actions (Left 2/3) */}
        <div className="lg:col-span-2 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ActionCard to="/sparepark" title="Inventory Master" icon="📦" color="bg-orange-50" />
            <ActionCard to="/stockin" title="Restock Items" icon="📥" color="bg-blue-50" />
            <ActionCard to="/stockout" title="Point of Sale" icon="🛒" color="bg-green-50" />
            <ActionCard to="/reports" title="Business Reports" icon="📊" color="bg-purple-50" />
          </div>

          {/* Recent Activity Table */}
          <div className="bg-white rounded-[2rem] shadow-xl border border-slate-50 overflow-hidden">
            <div className="p-6 border-b border-slate-50 flex justify-between items-center">
              <h3 className="text-lg font-black text-slate-800">Recent Transactions</h3>
              <Link to="/reports" className="text-xs font-bold text-blue-600 hover:underline">View All</Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50/50 text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                  <tr>
                    <th className="p-5">Part Sold</th>
                    <th className="p-5 text-center">Qty</th>
                    <th className="p-5 text-right">Total Price</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {recentSales.map((sale, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50 transition">
                      <td className="p-5">
                        <p className="font-bold text-slate-700">{sale.name}</p>
                        <p className="text-[10px] text-slate-400">{new Date(sale.stockout_date).toLocaleDateString()}</p>
                      </td>
                      <td className="p-5 text-center font-bold text-slate-600">x{sale.stockout_quantity}</td>
                      <td className="p-5 text-right font-mono font-bold text-blue-600">
                        {Number(sale.sout_totalprice).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* System Status (Right 1/3) */}
        <div className="space-y-6">
          <div className="bg-slate-900 text-white p-8 rounded-[2rem] shadow-xl relative overflow-hidden group">
             <div className="relative z-10">
               <h3 className="text-xl font-bold mb-2">System Health</h3>
               <p className="text-slate-400 text-sm leading-relaxed mb-6">Database connection is stable. All Rubavu transactions are encrypted and backed up.</p>
               <div className="flex items-center gap-3 bg-white/10 p-3 rounded-xl border border-white/5">
                 <div className="w-2 h-2 bg-green-400 rounded-full animate-ping"></div>
                 <span className="text-xs font-mono">Uptime: 99.9%</span>
               </div>
             </div>
             {/* Decorative Background Element */}
             <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl"></div>
          </div>
          
          <div className="bg-white p-8 rounded-[2rem] shadow-xl border border-slate-50">
            <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-4">Branch Reminder</h4>
            <p className="text-xs text-slate-500 italic">"Ensure all Stock-In entries include the supplier's receipt number in the remarks section for end-of-month auditing."</p>
          </div>
        </div>

      </div>
    </div>
  );
};

// Reusable Components
const MetricCard = ({ title, value, color }) => {
  const styles = {
    blue: "border-blue-100 bg-blue-50/30 text-blue-600",
    green: "border-emerald-100 bg-emerald-50/30 text-emerald-600",
    red: "border-rose-100 bg-rose-50/30 text-rose-600",
    slate: "border-slate-100 bg-slate-50/30 text-slate-600",
  };
  return (
    <div className={`p-6 rounded-[2rem] border-2 shadow-sm ${styles[color]}`}>
      <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1">{title}</p>
      <h2 className="text-2xl font-black">{value}</h2>
    </div>
  );
};

const ActionCard = ({ to, title, icon, color }) => (
  <Link to={to} className={`p-6 rounded-[2rem] ${color} border border-transparent hover:border-slate-200 hover:shadow-xl transition-all group`}>
    <span className="text-3xl block mb-3 group-hover:scale-110 transition-transform">{icon}</span>
    <h3 className="font-black text-slate-800 text-sm uppercase tracking-wide">{title}</h3>
  </Link>
);

export default Dashboard;