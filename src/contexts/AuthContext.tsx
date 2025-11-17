'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getMe, login } from '@/services/AuthService';
import { getCompanies } from '@/services/Companies';
import { toast } from 'sonner';
import { setCookie, removeCookie, getCookie } from '@/utils/cookies';

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
    const storedUser = getCookie('user');
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

      setCookie('token', token, 7); // 7 dias
    }

    const userResult = await getMe();

    if (userResult?.data) {
      const user = userResult.data;

      setCookie('user', JSON.stringify(user), 7); // 7 dias
      setUser(user);
    }

    const companiesResult = await getCompanies();

    if (companiesResult?.data && companiesResult?.data.length > 0) {
      const firstCompany = companiesResult.data[0];

      setCookie('company', JSON.stringify(firstCompany), 7); // 7 dias
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
      setCookie('user', JSON.stringify(userUpdated), 7); // 7 dias
    }
  };

  const signOut = () => {
    removeCookie('token');
    removeCookie('user');
    removeCookie('company');
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
