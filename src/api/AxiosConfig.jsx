// src/api/axiosConfig.jsx
import axios from 'axios';

const apiInstance = axios.create({
    baseURL: '/api',  // This should match the proxy target in vite.config.js
});

// Instance for other specific API calls
const dnsInstance = axios.create({
    baseURL: '/dns',  // Matches the '/other-api' proxy target
});


export {apiInstance, dnsInstance};
