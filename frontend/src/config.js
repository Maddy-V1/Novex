export const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:7001/api';

export const axiosConfig = (token) => ({
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  }
}); 