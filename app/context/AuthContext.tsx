'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

type User = {
  id: string;
  name: string;
  role: 'user' | 'admin';
};

type AuthContextType = {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in (from localStorage)
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // This is a mock login - in a real app, you'd call an API
      // For demo purposes, we'll allow any login, but check for admin credentials
      if (email === 'admin@example.com' && password === 'admin123') {
        // 관리자 계정
        const adminUser = { id: '1', name: 'Admin User', role: 'admin' as const };
        setUser(adminUser);
        localStorage.setItem('user', JSON.stringify(adminUser));
        return true;
      } else if (email === 'user@example.com' && password === 'user123') {
        // 테스트 사용자 계정
        const regularUser = { id: '2', name: 'Regular User', role: 'user' as const };
        setUser(regularUser);
        localStorage.setItem('user', JSON.stringify(regularUser));
        return true;
      } else if (email && password) {
        // 아무 계정이나 입력하면 일반 사용자로 로그인
        const userName = email.split('@')[0] || '사용자';
        const newUser = { id: '3', name: userName, role: 'user' as const };
        setUser(newUser);
        localStorage.setItem('user', JSON.stringify(newUser));
        return true;
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
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
