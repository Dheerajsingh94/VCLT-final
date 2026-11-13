import React, { createContext, useContext, useState, useEffect } from 'react';
import { getCurrentUser, logoutUser } from '../api/auth';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('vclt_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => localStorage.getItem('vclt_token') || null);
  const [loading, setLoading] = useState(true);

  // Sync / verify user session on mount
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('vclt_token');
      if (storedToken) {
        try {
          const data = await getCurrentUser();
          if (data && data.user) {
            setUser(data.user);
            localStorage.setItem('vclt_user', JSON.stringify(data.user));
          }
        } catch (err) {
          console.warn('Session verification failed:', err.message);
          // Only clear if 401 unauthorized
          if (err.response && err.response.status === 401) {
            logout();
          }
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = (newToken, newUser) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem('vclt_token', newToken);
    localStorage.setItem('vclt_user', JSON.stringify(newUser));
  };

  const logout = async () => {
    try {
      await logoutUser();
    } catch (e) {
      console.warn('Logout API error:', e.message);
    }
    setToken(null);
    setUser(null);
    localStorage.removeItem('vclt_token');
    localStorage.removeItem('vclt_user');
  };

  const updateLocalUser = (updatedFields) => {
    setUser((prev) => {
      const next = { ...prev, ...updatedFields };
      localStorage.setItem('vclt_user', JSON.stringify(next));
      return next;
    });
  };

  const refreshUser = async () => {
    try {
      const data = await getCurrentUser();
      if (data && data.user) {
        setUser(data.user);
        localStorage.setItem('vclt_user', JSON.stringify(data.user));
      }
    } catch (err) {
      console.warn('Failed to refresh user:', err.message);
    }
  };

  const isAuthenticated = !!token && !!user;
  const isAdmin = user && (user.role === 'admin' || user.email === 'admin@gmail.com');

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated,
        isAdmin,
        login,
        logout,
        updateLocalUser,
        refreshUser,
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
