import React, { createContext, useState, useEffect, useContext } from 'react';
import { fetchApi } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('maidaan_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      if (token) {
        try {
          const userData = await fetchApi('/auth/me');
          setUser(userData);
        } catch (error) {
          console.error('Failed to load user session:', error.message);
          localStorage.removeItem('maidaan_token');
          localStorage.removeItem('maidaan_user');
          setToken(null);
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    };

    loadUser();
  }, [token]);

  const login = async (email, password) => {
    const data = await fetchApi('/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: (email || '').trim().toLowerCase(),
        password
      })
    });

    localStorage.setItem('maidaan_token', data.token);
    localStorage.setItem('maidaan_user', JSON.stringify({
      id: data.id,
      fullName: data.fullName || data.name,
      email: data.email,
      role: data.role
    }));
    setToken(data.token);
    setUser({
      id: data.id,
      fullName: data.fullName || data.name,
      name: data.fullName || data.name,
      email: data.email,
      role: data.role
    });
    return data;
  };

  const register = async (userData) => {
    const payload = {
      ...userData,
      email: (userData.email || '').trim().toLowerCase(),
      fullName: (userData.fullName || userData.name || '').trim()
    };

    const data = await fetchApi('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload)
    });

    localStorage.setItem('maidaan_token', data.token);
    localStorage.setItem('maidaan_user', JSON.stringify({
      id: data.id,
      fullName: data.fullName || data.name,
      email: data.email,
      role: data.role
    }));
    setToken(data.token);
    setUser({
      id: data.id,
      fullName: data.fullName || data.name,
      name: data.fullName || data.name,
      email: data.email,
      role: data.role
    });
    return data;
  };

  const logout = () => {
    localStorage.removeItem('maidaan_token');
    localStorage.removeItem('maidaan_user');
    setToken(null);
    setUser(null);
  };

  const updateUser = (updatedData) => {
    setUser(prev => ({ ...prev, ...updatedData }));
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      loading,
      isLoggedIn: !!user,
      isAdmin: user?.role === 'ADMIN',
      login,
      register,
      logout,
      updateUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
