import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode';
import api from '../services/api';

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (token: string) => void;
  logout: () => void;
}

interface User {
  username: string;
  sub: number;
  roles: string[];
  permissions: string[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedUser: User = jwtDecode(token);
        setUser(decodedUser);
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      } catch (error) {
        console.error('Failed to decode token:', error);
        localStorage.removeItem('token');
      }
    }
  }, []);

  const login = (token: string) => {
    try {
      const decodedUser: User = jwtDecode(token);
      localStorage.setItem('token', token);
      setUser(decodedUser);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } catch (error) {
      console.error('Failed to decode token on login:', error);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    delete api.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated: !!user, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 