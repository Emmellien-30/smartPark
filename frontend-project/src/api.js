import axios from 'axios';

const API = axios.create({
    // Your Node.js server address
    baseURL: 'http://localhost:5000/api', 
    // This allows the browser to store and send the Session Cookie
    withCredentials: true 
});

// Define easy-to-use functions for your components
export const login = (credentials) => API.post('/login', credentials);
export const fetchSpareParts = () => API.get('/spareparts');
export const addSparePart = (data) => API.post('/spareparts', data);

// Stock Out Specific (CRUD)
export const getStockOut = () => API.get('/stockout');
export const postStockOut = (data) => API.post('/stockout', data);
export const deleteStockOut = (id) => API.delete(`/stockout/${id}`);
export const updateStockOut = (id, data) => API.put(`/stockout/${id}`, data);

// Reports
export const getDailyReport = () => API.get('/reports/daily-status');

export default API;