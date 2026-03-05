import axios from 'axios';

// 🔥 HATA BURADAYDI: api/content değil, api/users olmalı.
// Çünkü Backend'de server.js içinde kullanıcıları /api/users rotasına bağladık.
const API_URL = 'http://127.0.0.1:5001/api/users';

const register = async (userData) => {
  // Bu istek artık doğru yere gidecek: http://127.0.0.1:5001/api/users/register
  const response = await axios.post(`${API_URL}/register`, userData);
  
  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data));
  }
  return response.data;
};

const login = async (userData) => {
  // Bu istek artık doğru yere gidecek: http://127.0.0.1:5001/api/users/login
  const response = await axios.post(`${API_URL}/login`, userData);
  
  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data));
  }
  return response.data;
};

const logout = () => {
  localStorage.removeItem('user');
};

const authService = { register, logout, login };

export default authService;