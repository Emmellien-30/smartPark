import React, { useEffect, useState } from 'react';
import API from '../api';

const Reports = () => {
  const [data, setData] = useState([]);
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('inventory');
  
  // New States for Filtering
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchReports();
  }, [selectedDate]); // Refetch when date changes

  const fetchReports = async () => {
    setLoading(true);
    try {
      const [statusRes, salesRes] = await Promise.all([
        API.get('/reports/daily-status'),
        API.get('/stockout')
      ]);
      setData(statusRes.data);
      
      // Filter sales based on the Selected Date
      const filteredSales = salesRes.data.filter(s => 
        s.stockout_date.split('T')[0] === selectedDate
      );
      setSalesData(filteredSales);
    } catch (err) {
      console.error("Report fetch failed", err);
    } finally {
      setLoading(false);
    }
  };

  // Filter the Inventory list based on Search Term
  const filteredInventory = data.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalRevenue = salesData.reduce((sum, item) => sum + Number(item.sout_totalprice), 0);

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-6">
      
      {/* Header & Main Controls */}
      <div className="bg-slate-900 p-8 rounded-3xl shadow-2xl text-white">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-3xl font-black tracking-tight">SmartPark Analytics</h1>
            <p className="text-slate-400 text-sm mt-1">Inventory & Sales History for Rubavu Branch</p>
          </div>
          
          <div className="flex flex-wrap gap-3 w-full md:w-auto">
            <div className="flex flex-col">
              <label className="text-[10px] uppercase font-bold text-slate-500 mb-1 ml-1">Select Report Date</label>
              <input 
                type="date" 
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-slate-800 border border-slate-700 p-2 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button onClick={() => window.print()} className="bg-blue-600 self-end px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-blue-500 transition shadow-lg">
              Print Report
            </button>
          </div>
        </div>
      </div>

      {/* Stat Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-gray-400 text-[10px] font-bold uppercase">Revenue ({selectedDate})</p>
          <h3 className="text-xl font-black text-blue-600">{totalRevenue.toLocaleString()} RWF</h3>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-gray-400 text-[10px] font-bold uppercase">Items Sold</p>
          <h3 className="text-xl font-black text-slate-800">{salesData.length} Trans.</h3>
        </div>
        <div className="lg:col-span-2 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center">
            <input 
              type="text"
              placeholder="Search part name..."
              className="w-full bg-gray-50 p-2 rounded-lg text-sm border-none outline-none focus:ring-1 focus:ring-blue-300"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="flex bg-gray-200 p-1 rounded-xl w-fit">
        <button onClick={() => setView('inventory')} className={`px-6 py-2 rounded-lg text-xs font-bold transition ${view === 'inventory' ? 'bg-white shadow text-blue-600' : 'text-gray-500'}`}>Current Stock Levels</button>
        <button onClick={() => setView('sales')} className={`px-6 py-2 rounded-lg text-xs font-bold transition ${view === 'sales' ? 'bg-white shadow text-blue-600' : 'text-gray-500'}`}>Sales on {selectedDate}</button>
      </div>

      {/* Responsive Table Container */}
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          {view === 'inventory' ? (
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b">
                <tr>
                  <th className="p-5 text-xs font-bold text-gray-400 uppercase">Part Name</th>
                  <th className="p-5 text-xs font-bold text-gray-400 uppercase text-center">Opening</th>
                  <th className="p-5 text-xs font-bold text-gray-400 uppercase text-center">Out</th>
                  <th className="p-5 text-xs font-bold text-gray-400 uppercase text-right">Available Now</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredInventory.map((item, idx) => (
                  <tr key={idx} className="hover:bg-blue-50/40 transition">
                    <td className="p-5 font-bold text-slate-700">{item.name}</td>
                    <td className="p-5 text-center text-gray-400">{item.stored_quantity}</td>
                    <td className="p-5 text-center text-red-400 font-medium">-{item.stock_out}</td>
                    <td className="p-5 text-right">
                      <span className={`px-3 py-1 rounded-lg text-[10px] font-bold ${item.remaining_quantity > 5 ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                        {item.remaining_quantity} In Store
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b">
                <tr>
                  <th className="p-5 text-xs font-bold text-gray-400 uppercase">Part</th>
                  <th className="p-5 text-xs font-bold text-gray-400 uppercase text-center">Qty</th>
                  <th className="p-5 text-xs font-bold text-gray-400 uppercase text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {salesData.length > 0 ? salesData.map((sale, idx) => (
                  <tr key={idx} className="hover:bg-blue-50/40 transition">
                    <td className="p-5 font-bold text-slate-700">{sale.name}</td>
                    <td className="p-5 text-center text-gray-600">{sale.stockout_quantity}</td>
                    <td className="p-5 text-right font-mono font-bold text-blue-600">
                      {Number(sale.sout_totalprice).toLocaleString()}
                    </td>
                  </tr>
                ) ) : (
                  <tr><td colSpan="3" className="p-20 text-center text-gray-400 italic">No sales recorded for this date.</td></tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reports;