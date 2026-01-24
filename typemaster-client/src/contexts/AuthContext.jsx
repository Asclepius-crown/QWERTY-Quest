import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on app load
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/me`, {
        credentials: 'include'
      });
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        setIsLoggedIn(true);
      } else {
        console.log('Auth check failed:', response.status);
        setIsLoggedIn(false);
        setUser(null);
      }
    } catch (error) {
      setIsLoggedIn(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password, mfaToken = '') => {
    try {
      const body = { email, password };
      if (mfaToken) body.mfaToken = mfaToken;
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(body)
      });
      if (response.ok) {
        const data = await response.json();
        if (data.needMfa) {
          return { needMfa: true, user: data.user };
        }
        setUser(data.user);
        setIsLoggedIn(true);
        return { success: true };
      } else {
        const errorData = await response.json();
        return { success: false, error: errorData.msg || 'Login failed' };
      }
    } catch (error) {
      return { success: false, error: 'Network error' };
    }
  };

  const signup = async (username, email, password) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ username, email, password })
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        setIsLoggedIn(true);
        return { success: true };
      } else {
        const errorData = await response.json();
        return { success: false, error: errorData.errors ? errorData.errors.map(e => e.msg).join(', ') : errorData.msg || 'Signup failed' };
      }
    } catch (error) {
      return { success: false, error: 'Network error' };
    }
  };

  const logout = async () => {
    try {
      await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include'
      });
    } catch (error) {
      // Ignore logout errors
    }
    setIsLoggedIn(false);
    setUser(null);
  };

  const updateAvatar = async (avatar) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/user/avatar`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ avatar })
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        return { success: true };
      } else {
        const errorData = await response.json();
        return { success: false, error: errorData.error || 'Avatar update failed' };
      }
    } catch (error) {
      return { success: false, error: 'Network error' };
    }
  };

  return (
    <AuthContext.Provider value={{
      isLoggedIn,
      user,
      loading,
      login,
      signup,
      logout,
      updateAvatar,
      checkAuthStatus
    }}>
      {children}
    </AuthContext.Provider>
  );
};