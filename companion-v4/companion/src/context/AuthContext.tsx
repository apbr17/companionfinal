import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  firstName: string;
  lastName: string;
  email: string;
  aadhaar: string;
}

interface AuthContextType {
  user: User | null;
  login: (user: User & { rememberMe?: boolean }) => void;
  logout: () => void;
  isLoggedIn: boolean;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    // Restore from storage on load
    const stored = localStorage.getItem('companion_user') || sessionStorage.getItem('companion_user');
    return stored ? JSON.parse(stored) : null;
  });

  const login = ({ rememberMe, ...userData }: User & { rememberMe?: boolean }) => {
    setUser(userData);
    const storage = rememberMe ? localStorage : sessionStorage;
    storage.setItem('companion_user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('companion_user');
    sessionStorage.removeItem('companion_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoggedIn: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
