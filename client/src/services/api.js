const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

export const fetchApi = async (endpoint, options = {}) => {
  const token = localStorage.getItem('maidaan_token');

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

    let data = null;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    if (!response.ok) {
      const errorMessage = (data && data.message) || (data && data.error) || response.statusText || 'API Request Failed';
      throw new Error(errorMessage);
    }

    return data;
  } catch (error) {
    console.error(`API Error [${endpoint}]:`, error.message);
    throw error;
  }
};
