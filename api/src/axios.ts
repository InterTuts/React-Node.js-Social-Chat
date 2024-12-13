// Installed Utils
import axios from 'axios';

// Create axios instance
const instance = axios.create({
  baseURL: 'http://localhost:5000/',
});

// Export Axios instance
export default instance;
