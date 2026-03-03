  import React, { useState, useEffect } from 'react';
  import API from '../api';

  const StockIn = () => {
    const [parts, setParts] = useState([]);
    const [formData, setFormData] = useState({
      part_id: '',
      stockin_quantity: '',
      stockin_date: new Date().toISOString().split('T')[0]
    });

    // Fetch parts so the user can select which one to restock
    useEffect(() => {
      const fetchParts = async () => {
        try {
          const res = await API.get('/spareparts');
          setParts(res.data);
        } catch (err) {
          console.error("Failed to load parts", err);
        }
      };
      fetchParts();
    }, []);

    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        await API.post('/stockin', formData);
        alert("Stock updated successfully!");
        setFormData({ ...formData, part_id: '', stockin_quantity: '' });
      } catch (err) {
        alert("Error updating stock: " + err.message);
      }
    };

    return (
      <div className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-lg border border-gray-100">
        <h2 className="text-2xl font-bold mb-6 text-slate-800">Add Stock (Stock In)</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1 text-left">Select Spare Part</label>
            <select 
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.part_id}
              onChange={(e) => setFormData({...formData, part_id: e.target.value})}
            >
              <option value="">-- Choose a Part --</option>
              {parts.map(part => (
                <option key={part.part_id} value={part.part_id}>
                  {part.name} (Current: {part.quantity})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1 text-left">Quantity to Add</label>
            <input 
              type="number" required min="1"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.stockin_quantity}
              onChange={(e) => setFormData({...formData, stockin_quantity: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1 text-left">Stock In Date</label>
            <input 
              type="date" required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.stockin_date}
              onChange={(e) => setFormData({...formData, stockin_date: e.target.value})}
            />
          </div>

          <button 
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition shadow-lg"
          >
            Update Inventory
          </button>
        </form>
      </div>
    );
  };

  export default StockIn;