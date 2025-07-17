import { BookLock, Home, Monitor, PenTool, Store } from 'lucide-react';

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { CompanyCombobox } from './companyCombobox';

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
    url: '/brands',
    icon: Monitor,
  },
];

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Intelectus</SidebarGroupLabel>
          <div className="flex pb-2 md:hidden">
            <CompanyCombobox />
          </div>

          <SidebarGroupContent>
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
    </Sidebar>
  );
}
