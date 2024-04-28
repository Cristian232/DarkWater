// src/api/axiosConfig.jsx
import axios from 'axios';

const instance = axios.create({
    baseURL: '/api',  // This should match the proxy target in vite.config.js
});

export default instance;
