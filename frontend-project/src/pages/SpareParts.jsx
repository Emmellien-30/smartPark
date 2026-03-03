import React, { useState } from 'react';
import API from '../api';

const SpareParts = () => {
  const [form, setForm] = useState({ name: '', category: '', quantity: '', unit_price: '' });

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await API.post('/spareparts', form);
      alert("Spare part recorded successfully!");
      setForm({ name: '', category: '', quantity: '', unit_price: '' });
    } catch (err) { alert("Failed to add part."); }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md mt-10">
      <h2 className="text-2xl font-bold mb-6 text-slate-800 border-b pb-2">Record Purchased Spare Parts</h2>
      <form onSubmit={handleAdd} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <input type="text" placeholder="Part Name" className="border p-2 rounded" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
          <input type="text" placeholder="Category" className="border p-2 rounded" value={form.category} onChange={e => setForm({...form, category: e.target.value})} required />
          <input type="number" placeholder="Quantity" className="border p-2 rounded" value={form.quantity} onChange={e => setForm({...form, quantity: e.target.value})} required />
          <input type="number" placeholder="Unit Price (RWF)" className="border p-2 rounded" value={form.unit_price} onChange={e => setForm({...form, unit_price: e.target.value})} required />
        </div>
        <div className="p-3 bg-blue-50 text-blue-700 rounded font-bold">
          Total Price: {form.quantity * form.unit_price || 0} RWF
        </div>
        <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700">Save Part to Stock</button>
      </form>
    </div>
  );
};
export default SpareParts;