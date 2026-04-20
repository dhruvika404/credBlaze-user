'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { getDeviceId } from '@/utils/deviceId';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [deviceId, setDeviceId] = useState('');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token') || Cookies.get('token');

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    if (storedToken) {
      setToken(storedToken);
      if (!localStorage.getItem('token')) localStorage.setItem('token', storedToken);
      if (!Cookies.get('token')) Cookies.set('token', storedToken, { expires: 7 });
    }

    const id = getDeviceId();
    setDeviceId(id);
    setLoading(false);
  }, []);

  const login = (userData, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    Cookies.set('token', token, { expires: 7 });
    setUser(userData);
    setToken(token);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    Cookies.remove('token');
    setUser(null);
    setToken(null);
    router.push('/');
  };

  return (
    <AuthContext.Provider value={{ user, token, deviceId, loading, login, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
