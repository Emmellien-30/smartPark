import React, { useState, useEffect } from 'react';
import API from '../api';

const StockOut = () => {
  const [parts, setParts] = useState([]);
  const [sales, setSales] = useState([]);
  const [form, setForm] = useState({ part_id: '', sout_quantity: '', sout_unitprice: '', stockout_date: '' });
  const [editingId, setEditingId] = useState(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [pRes, sRes] = await Promise.all([API.get('/spareparts'), API.get('/stockout')]);
      setParts(pRes.data);
      
      // Sorting: Newest Record at the Top based on ID
      const sortedSales = sRes.data.sort((a, b) => b.sout_id - a.sout_id);
      setSales(sortedSales);
    } catch (err) {
      console.error("Error fetching data", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 1. Validation for New Records (Prevent selling more than available)
    if (!editingId) {
        const selectedPart = parts.find(p => p.part_id === parseInt(form.part_id));
        if (selectedPart && parseInt(form.sout_quantity) > selectedPart.quantity) {
          alert(`🚨 Error: Only ${selectedPart.quantity} units left in stock!`);
          return;
        }
    }

    try {
      if (editingId) {
        // Update existing record
        await API.put(`/stockout/${editingId}`, form);
        setEditingId(null);
      } else {
        // Create new record
        await API.post('/stockout', form);
      }
      
      // Reset form and refresh
      setForm({ part_id: '', sout_quantity: '', sout_unitprice: '', stockout_date: '' });
      fetchData(); 
      alert("Operation successful!");
    } catch (err) {
      // Catches the "Out of Range" or "Insufficient Stock" error from Backend
      alert("Error: " + (err.response?.data || err.message));
    }
  };

  /**
   * APPLIED: Populate the form with existing data to edit
   */
  const handleEdit = (sale) => {
    setEditingId(sale.sout_id);
    setForm({
      part_id: sale.part_id,
      // Supporting both database naming conventions
      sout_quantity: sale.stockout_quantity || sale.sout_quantity, 
      sout_unitprice: sale.sout_unitprice,
      // Date must be YYYY-MM-DD for the HTML5 input field
      stockout_date: sale.stockout_date ? sale.stockout_date.split('T')[0] : ''
    });
    // Scroll to top so the user sees the populated form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this record? This will return stock to the inventory.")) {
      try {
        await API.delete(`/stockout/${id}`);
        fetchData();
      } catch (err) {
        alert("Delete failed: " + (err.response?.data || err.message));
      }
    }
  };

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentSales = sales.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sales.length / itemsPerPage);

  return (
    <div className="max-w-7xl mx-auto p-4 lg:p-6 space-y-6">
      
      {/* Header */}
      <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-lg flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Stock Out Management</h1>
          <p className="text-slate-400 text-sm">Managing Stock-Out Transactions - SmartPark Rubavu</p>
        </div>
        <div className="bg-blue-600 px-4 py-2 rounded-lg font-mono text-sm hidden md:block">
          Total Records: {sales.length}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* LEFT: Sticky Form Section */}
        <div className="lg:w-1/3">
          <div className="bg-white p-6 rounded-2xl shadow-xl border-t-4 border-blue-600 sticky top-24">
            <h2 className="text-lg font-bold mb-6 text-slate-800">
              {editingId ? "📝 Edit Transaction" : "🛒 Record New Sale"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase">Spare Part</label>
                <select 
                  className="w-full mt-1 border p-3 rounded-xl bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none transition" 
                  value={form.part_id}
                  onChange={e => setForm({...form, part_id: e.target.value})}
                  required
                >
                  <option value="">Select Part...</option>
                  {parts.map(p => (
                    <option key={p.part_id} value={p.part_id}>
                      {p.name} ({p.quantity} available)
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase">Quantity</label>
                  <input 
                    type="number" className="w-full mt-1 border p-3 rounded-xl bg-gray-50 outline-none focus:ring-2 focus:ring-blue-500" 
                    value={form.sout_quantity}
                    onChange={e => setForm({...form, sout_quantity: e.target.value})} required 
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase">Unit Price</label>
                  <input 
                    type="number" className="w-full mt-1 border p-3 rounded-xl bg-gray-50 outline-none focus:ring-2 focus:ring-blue-500" 
                    value={form.sout_unitprice}
                    onChange={e => setForm({...form, sout_unitprice: e.target.value})} required 
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-400 uppercase">Sale Date</label>
                <input 
                  type="date" className="w-full mt-1 border p-3 rounded-xl bg-gray-50 outline-none focus:ring-2 focus:ring-blue-500" 
                  value={form.stockout_date}
                  onChange={e => setForm({...form, stockout_date: e.target.value})} required 
                />
              </div>

              <button 
                type="submit" 
                className={`w-full py-4 rounded-xl font-bold text-white transition shadow-lg ${editingId ? 'bg-orange-500 hover:bg-orange-600' : 'bg-blue-600 hover:bg-blue-700'}`}
              >
                {editingId ? "Update Transaction" : "Confirm Stock Out"}
              </button>
              
              {editingId && (
                <button 
                  type="button"
                  onClick={() => {setEditingId(null); setForm({part_id:'', sout_quantity:'', sout_unitprice:'', stockout_date:''})}}
                  className="w-full mt-2 text-sm text-gray-400 hover:text-red-500 underline transition"
                >
                  Cancel Edit
                </button>
              )}
            </form>
          </div>
        </div>

        {/* RIGHT: List Section */}
        <div className="lg:w-2/3">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b">
                  <tr>
                    <th className="p-4 text-xs font-bold text-gray-500 uppercase">Part & Date</th>
                    <th className="p-4 text-xs font-bold text-gray-500 uppercase text-center">Qty</th>
                    <th className="p-4 text-xs font-bold text-gray-500 uppercase text-right">Total (RWF)</th>
                    <th className="p-4 text-xs font-bold text-gray-500 uppercase text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {currentSales.length > 0 ? currentSales.map((sale, index) => (
                    <tr key={sale.sout_id} className={`hover:bg-blue-50/50 transition ${index === 0 && currentPage === 1 ? 'bg-blue-50/30' : ''}`}>
                      <td className="p-4">
                        <div className="font-bold text-slate-800">{sale.name}</div>
                        <div className="text-[10px] text-gray-400 font-mono">
                          {sale.stockout_date ? new Date(sale.stockout_date).toLocaleDateString() : 'N/A'}
                        </div>
                      </td>
                      <td className="p-4 text-center text-slate-600">
                        {sale.stockout_quantity || sale.sout_quantity}
                      </td>
                      <td className="p-4 text-right font-mono font-bold text-blue-600">
                        {Number(sale.sout_totalprice).toLocaleString()}
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex justify-center gap-3">
                          <button 
                            onClick={() => handleEdit(sale)} 
                            className="text-blue-600 font-bold hover:underline text-xs"
                          >
                            Edit
                          </button>
                          <button 
                            onClick={() => handleDelete(sale.sout_id)} 
                            className="text-red-500 font-bold hover:underline text-xs"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="4" className="p-10 text-center text-gray-400 italic">No transactions found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="p-4 bg-gray-50 border-t flex justify-between items-center">
              <span className="text-xs text-gray-400">
                Page {currentPage} of {totalPages || 1}
              </span>
              <div className="flex gap-2">
                <button 
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => prev - 1)}
                  className="px-3 py-1 bg-white border rounded shadow-sm text-xs disabled:opacity-50"
                >Prev</button>
                <button 
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage(prev => prev + 1)}
                  className="px-3 py-1 bg-white border rounded shadow-sm text-xs disabled:opacity-50"
                >Next</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockOut;