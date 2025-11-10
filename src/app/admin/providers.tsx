'use client';

import { ThemeProvider } from '@/components/theme-provider';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AdminSidebar } from '@/components/admin-sidebar';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { Toaster } from '@/components/ui/sonner';
import Header from '@/components/header';
import { useRouter } from 'next/navigation';

function AdminContent({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user?.is_superuser) {
      router.push('/brands');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    );
  }

  if (!user?.is_superuser) {
    return null;
  }

  return (
    <SidebarProvider>
      <AdminSidebar />
      <div className="flex min-h-screen w-full flex-col antialiased">
        <Header />
        <div className="flex flex-1 flex-col gap-4 p-6">{children}</div>
        <Toaster richColors />
      </div>
    </SidebarProvider>
  );
}

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <AuthProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <QueryClientProvider client={queryClient}>
          <AdminContent>{children}</AdminContent>
        </QueryClientProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

