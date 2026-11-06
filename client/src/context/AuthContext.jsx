import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authApi } from '../services/api';
import { useToast } from './ToastContext';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  const loadUser = useCallback(async () => {
    try {
      const res = await authApi.getMe();
      if (res.success && res.user) {
        setUser(res.user);
      }
    } catch {
      setUser(null);
      localStorage.removeItem('skillswap_token');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('skillswap_token');
    if (token) {
      loadUser();
    } else {
      setLoading(false);
    }
  }, [loadUser]);

  const login = async (email, password) => {
    try {
      const data = await authApi.login({ email, password });
      if (data.token) {
        localStorage.setItem('skillswap_token', data.token);
      }
      setUser(data.user);
      showToast('success', `Welcome back, ${data.user.name}!`);
      return { success: true };
    } catch (error) {
      showToast('error', error.message);
      return { success: false, message: error.message };
    }
  };

  const register = async (userData) => {
    try {
      const data = await authApi.register(userData);
      if (data.token) {
        localStorage.setItem('skillswap_token', data.token);
      }
      setUser(data.user);
      showToast('success', 'Account created! Welcome to SkillSwap.');
      return { success: true };
    } catch (error) {
      showToast('error', error.message);
      return { success: false, message: error.message };
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch {
      // Ignore network errors on logout
    } finally {
      localStorage.removeItem('skillswap_token');
      setUser(null);
      showToast('info', 'Logged out successfully.');
    }
  };

  const refreshUser = async () => {
    await loadUser();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        refreshUser,
        setUser
      }}
    >
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
