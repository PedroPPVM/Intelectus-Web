'use client';

import { Building2, ChevronUp, User2, Users } from 'lucide-react';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';
import { EditUserModal } from './edit-user-modal';
import { usePathname } from 'next/navigation';

const adminItems = [
  {
    title: 'Empresas',
    url: '/admin/companies',
    icon: Building2,
  },
  {
    title: 'Usuários',
    url: '/admin/users',
    icon: Users,
  },
];

export function AdminSidebar() {
  const { user, signOut } = useAuth();
  const pathName = usePathname();

  const [isOpenEditUserModal, setIsOpenEditUserModal] =
    useState<boolean>(false);

  return (
    <Sidebar>
      <SidebarContent className="pt-1.5">
        <SidebarGroup>
          <SidebarGroupLabel className="px-4 py-2 text-xs font-semibold text-sidebar-foreground/70">
            Administração
          </SidebarGroupLabel>

          <EditUserModal
            open={isOpenEditUserModal}
            onClose={() => setIsOpenEditUserModal(false)}
            initialData={
              user
                ? { id: user.id, email: user.email, full_name: user.full_name }
                : { id: '', email: '', full_name: '' }
            }
          />

          <SidebarGroupContent className="pt-2">
            <SidebarMenu>
              {adminItems.map((item) => (
                <SidebarMenuItem
                  key={item.title}
                  className={
                    pathName === item.url
                      ? 'border-r-sidebar-ring border-r-2'
                      : ''
                  }
                >
                  <SidebarMenuButton
                    asChild
                    className={pathName === item.url ? 'bg-sidebar-accent' : ''}
                  >
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild className="cursor-pointer">
                <SidebarMenuButton>
                  <User2 /> {user?.full_name}
                  <ChevronUp className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                align="end"
                className="flex w-60 flex-col"
              >
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => setIsOpenEditUserModal(true)}
                >
                  <span>Editar Perfil</span>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="cursor-pointer">
                  <a href={'/sign-in'} onClick={() => signOut()}>
                    <span>Sair</span>
                  </a>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

