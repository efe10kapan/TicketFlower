import axios from 'axios';

// Backend portun 5001 olduğu için burayı sabitliyoruz.
// Sadece içerik (film/tiyatro) işlemleri için bu URL kullanılır.
const API_URL = 'http://127.0.0.1:5001/api/content';

// Token'ı otomatik alan yardımcı fonksiyon
const getAuthConfig = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user && user.token) {
    return {
      headers: {
        Authorization: `Bearer ${user.token}`,
        'Content-Type': 'application/json',
      },
    };
  }
  return {};
};

// Yeni İçerik Ekleme (Admin Paneli İçin)
const createContent = async (contentData) => {
  const response = await axios.post(API_URL, contentData, getAuthConfig());
  return response.data;
};

// İçerikleri Listeleme (Dashboard İçin)
const getContents = async (category = '') => {
  const url = category ? `${API_URL}?category=${category}` : API_URL;
  const response = await axios.get(url, getAuthConfig());
  return response.data;
};

const contentService = {
  createContent,
  getContents,
};

export default contentService;