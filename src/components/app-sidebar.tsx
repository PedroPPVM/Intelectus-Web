import {
  BookLock,
  ChevronUp,
  Home,
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
  SidebarGroupLabel,
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

const items = [
  // TODO: Tela de Dashboards virá futuramente
  // {
  //   title: 'Dashboards',
  //   url: '/',
  //   icon: Home,
  // },
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
  const { signOut } = useAuth();

  return (
    <Sidebar>
      <SidebarContent className="pt-1.5">
        <SidebarGroup>
          <CompanyCombobox />

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
                  <User2 /> Username
                  <ChevronUp className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                align="end"
                className="flex w-60 flex-col"
              >
                <DropdownMenuItem className="cursor-pointer">
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
