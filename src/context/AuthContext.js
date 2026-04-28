'use client';
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { getDeviceId } from '@/utils/deviceId';
import { getProfileDetails } from '@/services/profile';

const AuthContext = createContext();

function normaliseProfile(raw) {
  if (!raw) return null;
  return raw?.data?.[0] ?? raw?.data ?? raw?.payload?.data?.[0] ?? raw?.payload ?? raw;
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [deviceId, setDeviceId] = useState('');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchAndSetProfile = useCallback(async () => {
    try {
      const res = await getProfileDetails();
      const profile = normaliseProfile(res);
      if (profile) {
        setUser(profile);
        localStorage.setItem('user', JSON.stringify(profile));
      }
      return profile;
    } catch (error) {
      console.error('Failed to fetch profile:', error);
      return null;
    }
  }, []);

  useEffect(() => {
    const initializeAuth = async () => {
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

      if (storedToken) {
        await fetchAndSetProfile();
      }

      setLoading(false);
    };

    initializeAuth();
  }, [fetchAndSetProfile]);

  const login = async (userData, authToken) => {
    localStorage.setItem('token', authToken);
    setToken(authToken);
    if (userData) {
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
          Cookies.set('token', token, { expires: 7 });
    setUser(userData);
    setToken(token);
    }
    await fetchAndSetProfile();
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    Cookies.remove('token');
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
    <AuthContext.Provider value={{ user, token, deviceId, loading, login, logout, setUser, fetchAndSetProfile }}>
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
