import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state from localStorage on load
  useEffect(() => {
    const storedToken = localStorage.getItem('cloudtask_token');
    const storedUser = localStorage.getItem('cloudtask_user');

    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem('cloudtask_token');
        localStorage.removeItem('cloudtask_user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const data = await authService.login(email, password);
    const userInfo = {
      id: data.id,
      name: data.name,
      email: data.email,
    };
    localStorage.setItem('cloudtask_token', data.token);
    localStorage.setItem('cloudtask_user', JSON.stringify(userInfo));
    setToken(data.token);
    setUser(userInfo);
    return data;
  };

  const register = async (name, email, password) => {
    const data = await authService.register(name, email, password);
    const userInfo = {
      id: data.id,
      name: data.name,
      email: data.email,
    };
    localStorage.setItem('cloudtask_token', data.token);
    localStorage.setItem('cloudtask_user', JSON.stringify(userInfo));
    setToken(data.token);
    setUser(userInfo);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('cloudtask_token');
    localStorage.removeItem('cloudtask_user');
    setToken(null);
    setUser(null);
  };

  const refreshProfile = async () => {
    try {
      const profile = await authService.getProfile();
      const updatedUser = {
        id: profile.id,
        name: profile.name,
        email: profile.email,
        totalTasks: profile.totalTasks,
        createdAt: profile.createdAt,
      };
      localStorage.setItem('cloudtask_user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      return profile;
    } catch (err) {
      console.error('Failed to refresh profile', err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        loading,
        login,
        register,
        logout,
        refreshProfile,
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
