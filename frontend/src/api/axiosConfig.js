import axios from 'axios';

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://recruitment-tracker-5xib.onrender.com/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true, // Send cookies/session headers
});

export default api;
