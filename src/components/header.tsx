'use client';

import { ModeToggle } from './theme-toggle';
import { Separator } from './ui/separator';
import { SidebarTrigger } from './ui/sidebar';
import { Button } from './ui/button';
import { ShieldCheck, User } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

const Header = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();

  const isAdminSession = pathname?.startsWith('/admin');

  const handleSessionToggle = () => {
    if (isAdminSession) {
      router.push('/brands');
    } else {
      router.push('/admin/companies');
    }
  };

  return (
    <div className="border-b">
      <div className="flex h-16 w-full items-center gap-6 px-6">
        <SidebarTrigger />

        <span>Intelectus</span>

        <Separator orientation="vertical" className="h-6" />

        <div className="flex w-full items-center justify-end gap-4">
          {user?.is_superuser && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleSessionToggle}
              className="gap-2 h-9"
            >
              {isAdminSession ? (
                <>
                  <User className="h-4 w-4" />
                  Sessão Usuário
                </>
              ) : (
                <>
                  <ShieldCheck className="h-4 w-4" />
                  Sessão Admin
                </>
              )}
            </Button>
          )}
          <ModeToggle />
        </div>
      </div>
    </div>
  );
};

export default Header;
