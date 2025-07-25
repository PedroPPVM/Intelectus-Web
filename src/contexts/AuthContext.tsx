'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getMe, login } from '@/services/AuthService';
import { getCompanies } from '@/services/Companies';
import { toast } from 'sonner';

interface AuthContextType {
  user: User.Entity | null;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => void;
  updateUser: (email: string | null, full_name: string | null) => void;
  isLoading: boolean;
}

const AuthContext = createContext({} as AuthContextType);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User.Entity | null>(null);
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

  const updateUser = (email: string | null, full_name: string | null) => {
    if (user) {
      const userUpdated = {
        ...user,
        email: email || user?.email,
        full_name: full_name || user?.full_name,
      };

      setUser(userUpdated);
      localStorage.setItem('user', JSON.stringify(userUpdated));
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
    <AuthContext.Provider
      value={{ user, signIn, signOut, isLoading, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
