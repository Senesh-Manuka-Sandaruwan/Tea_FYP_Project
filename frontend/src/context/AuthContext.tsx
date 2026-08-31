'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  email: string;
  credits: number;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  isAuthModalOpen: boolean;
  setAuthModalOpen: (open: boolean) => void;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  buyCredits: (packageAmount: 100 | 1000 | 10000) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://127.0.0.1:5000';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthModalOpen, setAuthModalOpen] = useState(false);

  // Initialize Auth state from localStorage
  useEffect(() => {
    const savedToken = localStorage.getItem('auth_token');
    const savedUser = localStorage.getItem('auth_user');

    if (savedToken && savedUser) {
      setToken(savedToken);
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('auth_user');
      }
    }
    setLoading(false);
  }, []);

  // Fetch updated user profile (credits) whenever the token is set or refreshed
  useEffect(() => {
    if (token) {
      fetchUserProfile(token);
    } else {
      setUser(null);
      localStorage.removeItem('auth_user');
    }
  }, [token]);

  const fetchUserProfile = async (authToken: string) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/user/profile`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        const updatedUser = { email: data.email, credits: data.credits };
        setUser(updatedUser);
        localStorage.setItem('auth_user', JSON.stringify(updatedUser));
      } else if (response.status === 401) {
        // Token expired or invalid
        handleSessionExpired();
      }
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
    }
  };

  const handleSessionExpired = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        return { success: false, error: data.error || 'Authentication failed' };
      }

      localStorage.setItem('auth_token', data.token);
      localStorage.setItem('auth_user', JSON.stringify(data.user));
      setToken(data.token);
      setUser(data.user);
      setAuthModalOpen(false);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message || 'Server connection failed' };
    }
  };

  const register = async (email: string, password: string) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        return { success: false, error: data.error || 'Registration failed' };
      }

      localStorage.setItem('auth_token', data.token);
      localStorage.setItem('auth_user', JSON.stringify(data.user));
      setToken(data.token);
      setUser(data.user);
      setAuthModalOpen(false);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message || 'Server connection failed' };
    }
  };

  const logout = async () => {
    if (token) {
      try {
        await fetch(`${BACKEND_URL}/api/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
      } catch (error) {
        console.error('Logout error on server:', error);
      }
    }
    handleSessionExpired();
  };

  const refreshUser = async () => {
    if (token) {
      await fetchUserProfile(token);
    }
  };

  const buyCredits = async (packageAmount: 100 | 1000 | 10000) => {
    if (!token) {
      setAuthModalOpen(true);
      return { success: false, error: 'You must be signed in to purchase credits.' };
    }

    try {
      const response = await fetch(`${BACKEND_URL}/api/user/add-credits`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ credits: packageAmount }),
      });

      const data = await response.json();

      if (!response.ok) {
        return { success: false, error: data.error || 'Failed to activate package' };
      }

      if (user) {
        const updatedUser = { ...user, credits: data.credits };
        setUser(updatedUser);
        localStorage.setItem('auth_user', JSON.stringify(updatedUser));
      }
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message || 'Server connection failed' };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthModalOpen,
        setAuthModalOpen,
        login,
        register,
        logout,
        refreshUser,
        buyCredits,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
