import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

export type UserRole = 'Admin' | 'Artist' | 'Collector' | 'Gallery' | 'Curator' | 'Partner' | 'Consultant' | 'Guest';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  walletId: string;
  createdAt: string;
  avatar?: string;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, role: UserRole) => Promise<void>;
  register: (email: string, password: string, name: string, role: UserRole) => Promise<void>;
  logout: () => void;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('authUser');
    return stored ? JSON.parse(stored) : null;
  });
  const [token, setToken] = useState<string | null>(localStorage.getItem('authToken'));
  const [isLoading, setIsLoading] = useState(false);

  const login = useCallback(async (email: string, password: string, role: UserRole) => {
    setIsLoading(true);
    try {
      try {
        const response = await fetch('http://localhost:8080/api/v1/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password, role }),
          signal: AbortSignal.timeout(5000),
        });
        const data = await response.json();
        setToken(data.token);
        localStorage.setItem('authToken', data.token);
        setUser({
          id: data.user_id,
          email,
          name: email.split('@')[0],
          role,
          walletId: data.wallet_id || '',
          createdAt: new Date().toISOString(),
        });
      } catch (backendError) {
        console.warn('Backend unavailable, using mock data:', backendError);
        // Mock login - use local data
        const mockToken = 'mock_token_' + Date.now();
        setToken(mockToken);
        localStorage.setItem('authToken', mockToken);
        setUser({
          id: 'user_' + Date.now(),
          email,
          name: email.split('@')[0],
          role,
          walletId: 'wallet_' + Date.now(),
          createdAt: new Date().toISOString(),
        });
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (email: string, password: string, name: string, role: UserRole) => {
    setIsLoading(true);
    try {
      try {
        const response = await fetch('http://localhost:8080/api/v1/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password, name, role }),
          signal: AbortSignal.timeout(5000),
        });
        const data = await response.json();
        setToken(data.token);
        localStorage.setItem('authToken', data.token);
        setUser({
          id: data.user_id,
          email,
          name,
          role,
          walletId: data.wallet_id || '',
          createdAt: new Date().toISOString(),
        });
      } catch (backendError) {
        console.warn('Backend unavailable, using mock data:', backendError);
        // Mock register - use local data
        const mockToken = 'mock_token_' + Date.now();
        setToken(mockToken);
        localStorage.setItem('authToken', mockToken);
        setUser({
          id: 'user_' + Date.now(),
          email,
          name,
          role,
          walletId: 'wallet_' + Date.now(),
          createdAt: new Date().toISOString(),
        });
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('authToken');
  }, []);

  const updateUser = useCallback((updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem('authUser', JSON.stringify(updatedUser));
  }, []);

  // Persist user to localStorage when it changes
  React.useEffect(() => {
    if (user) {
      localStorage.setItem('authUser', JSON.stringify(user));
    }
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated: !!user, isLoading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
