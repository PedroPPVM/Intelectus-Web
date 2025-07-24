'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getMe, login } from '@/services/authService/auth';
import { getCompanies } from '@/services/Companies/companies';
import { toast } from 'sonner';

interface User {
  company_ids: string[];
  created_at: Date;
  email: string;
  full_name: string;
  id: string;
  is_active: boolean;
  is_superuser: boolean;
}

interface AuthContextType {
  user: User | null;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => void;
  isLoading: boolean;
}

const AuthContext = createContext({} as AuthContextType);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
    toast.error('teste');
  }, []);

  const signIn = async (email: string, password: string) => {
    const signInResult = await login({ email, password });

    if (signInResult?.data) {
      const token = signInResult.data.access_token;

      localStorage.setItem('token', token);
    }

    const userResult = await getMe();

    if (userResult?.data) {
      const user = userResult.data;

      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);
    }

    const companiesResult = await getCompanies();

    if (companiesResult?.data && companiesResult?.data.length > 0) {
      const firstCompany = companiesResult.data[0];

      localStorage.setItem('company', JSON.stringify(firstCompany));
      router.push('/brands');
    }
  };

  const signOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('company');
    setUser(null);
    router.push('/sign-in');
  };

  return (
    <AuthContext.Provider value={{ user, signIn, signOut, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
