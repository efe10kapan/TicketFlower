import axios from 'axios';

const API_URL = '/api/content';

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

const createContent = async (contentData) => {
  const response = await axios.post(API_URL, contentData, getAuthConfig());
  return response.data;
};

const getContents = async (type = '') => {
  const url = type ? `${API_URL}?type=${type}` : API_URL;
  const response = await axios.get(url, getAuthConfig());
  return response.data;
};

const contentService = {
  createContent,
  getContents,
};

export default contentService;