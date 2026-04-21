'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getDeviceId } from '@/utils/deviceId';
import { getProfileDetails } from '@/services/profile';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [deviceId, setDeviceId] = useState('');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const initializeAuth = async () => {
      const storedUser = localStorage.getItem('user');
      const storedToken = localStorage.getItem('token');

      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
      if (storedToken) {
        setToken(storedToken);
      }

      const id = getDeviceId();
      setDeviceId(id);

      if (storedToken) {
        try {
          await getProfileDetails();
        } catch (error) {
          console.error("Token validation failed on load:", error);
        }
      }

      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = (userData, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    setToken(token);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    document.cookie.split(";").forEach((c) => {
      document.cookie = c
        .replace(/^ +/, "")
        .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });

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
