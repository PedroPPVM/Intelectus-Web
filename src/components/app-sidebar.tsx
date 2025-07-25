'use client';

import {
  BookLock,
  ChevronUp,
  Monitor,
  PenTool,
  Store,
  User2,
} from 'lucide-react';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { CompanyCombobox } from './companyCombobox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';
import { EditUserModal } from './edit-user-modal';

const items = [
  {
    title: 'Marcas',
    url: '/brands',
    icon: Store,
  },
  {
    title: 'Patentes',
    url: '/patents',
    icon: BookLock,
  },
  {
    title: 'Desenhos Industriais',
    url: '/industrialDesigns',
    icon: PenTool,
  },
  {
    title: 'Programas de Computador',
    url: '/computerPrograms',
    icon: Monitor,
  },
];

export function AppSidebar() {
  const { user, signOut } = useAuth();

  const [isOpenEditUserModal, setIsOpenEditUserModal] =
    useState<boolean>(false);

  return (
    <Sidebar>
      <SidebarContent className="pt-1.5">
        <SidebarGroup>
          <CompanyCombobox />

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
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
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
