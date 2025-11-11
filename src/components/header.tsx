'use client';

import { ModeToggle } from './theme-toggle';
import { Separator } from './ui/separator';
import { SidebarTrigger } from './ui/sidebar';
import { Button } from './ui/button';
import { ShieldCheck, User, Bell } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { NotificationsModal } from './notifications-modal';
import { useQuery } from '@tanstack/react-query';
import { getAlertsUnreadCount } from '@/services/Alerts';
import { useMemo, useState } from 'react';

const Header = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const isAdminSession = pathname?.startsWith('/admin');

  const { data: unreadCountResponse } = useQuery({
    queryKey: ['alerts', 'unread-count'],
    queryFn: getAlertsUnreadCount,
    refetchInterval: 30000, // Atualiza a cada 30 segundos
  });

  const unreadCount = useMemo(
    () => unreadCountResponse?.unread_count ?? 0,
    [unreadCountResponse],
  );

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
              className="h-9 gap-2"
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

          {!isAdminSession && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setNotificationsOpen(true)}
              className="relative h-9 w-9 p-0"
            >
              <Bell className="h-4 w-4" />

              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 animate-pulse items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </Button>
          )}

          <ModeToggle />
        </div>
      </div>

      <NotificationsModal
        open={notificationsOpen}
        onOpenChange={setNotificationsOpen}
      />
    </div>
  );
};

export default Header;
