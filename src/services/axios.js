import axios from 'axios';

const api = axios.create({
  baseURL: 'https://server-ah2j.onrender.com/api',
  withCredentials: true
});

export default api;