'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { MoreHorizontal, CheckCircle, XCircle, Shield, User, Building } from 'lucide-react';
import dayjs from 'dayjs';
import { DeleteConfirmModal } from '@/components/delete-confirm-modal';
import { useCallback, useMemo, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { deleteUserById } from '@/services/Users';
import { toast } from 'sonner';
import { useSidebar } from '@/components/ui/sidebar';
import { SortableTableHeader } from '@/components/sortable-table-header';

interface UsersTableProps {
  users: User.Entity[];
  onOpenUserModal: (user: User.Entity) => void;
  onRefetchUsers: () => void;
  sorting: {
    column: keyof User.Entity | null;
    direction: 'asc' | 'desc' | null;
  };
  onSort: (column: keyof User.Entity) => void;
}

const UsersTable = ({
  users,
  onOpenUserModal,
  onRefetchUsers,
  sorting,
  onSort,
}: UsersTableProps) => {
  const { open } = useSidebar();

  const maxTableWidth = useMemo(() => {
    return open ? 'max-w-[calc(100vw-354px)]' : 'max-w-full';
  }, [open]);

  const [isOpenDeleteConfirmModal, setIsOpenDeleteConfirmModal] =
    useState<boolean>(false);
  const [userIdToDelete, setUserIdToDelete] = useState<string | null>(null);

  const { mutateAsync: onDeleteUser, isPending: isDeletingUser } = useMutation({
    mutationKey: ['delete-user'],
    mutationFn: async (userId: string) =>
      deleteUserById({
        userId: userId,
      }),
    onSuccess: () => {
      setUserIdToDelete(null);
      setIsOpenDeleteConfirmModal(false);
      onRefetchUsers();
      toast.success('Usuário excluído com sucesso!');
    },
    onError: (errorMessage: string) => toast.error(errorMessage),
  });

  const actionsOptions = (user: User.Entity) => {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={() => onOpenUserModal(user)}
            className="cursor-pointer"
          >
            Editar
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              setIsOpenDeleteConfirmModal(true);
              setUserIdToDelete(user.id || '');
            }}
            className="cursor-pointer text-red-600"
          >
            Excluir
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  const handleDeleteUser = useCallback(() => {
    if (userIdToDelete) onDeleteUser(userIdToDelete);
  }, [userIdToDelete, onDeleteUser]);

  return (
    <>
      <div
        className={`flex max-h-[calc(100vh-284px)] overflow-auto rounded-lg border ${maxTableWidth}`}
      >
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <SortableTableHeader
                column="full_name"
                label="Nome"
                sorting={sorting}
                onSort={onSort}
              />
              <SortableTableHeader
                column="email"
                label="Email"
                sorting={sorting}
                onSort={onSort}
              />
              <SortableTableHeader
                column="is_active"
                label="Status"
                sorting={sorting}
                onSort={onSort}
              />
              <SortableTableHeader
                column="is_superuser"
                label="Tipo"
                sorting={sorting}
                onSort={onSort}
              />
              <TableHead className="border-r font-semibold">Empresas Vinculadas</TableHead>
              <SortableTableHeader
                column="created_at"
                label="Data de Criação"
                sorting={sorting}
                onSort={onSort}
              />
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id} className="hover:bg-muted/30">
                <TableCell className="border-r font-medium py-4">{user.full_name}</TableCell>
                <TableCell className="border-r py-4">{user.email}</TableCell>
                <TableCell className="border-r py-4">
                  <div className="flex items-center gap-2">
                    {user.is_active ? (
                      <>
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-green-500 font-medium">Ativo</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="h-4 w-4 text-red-500" />
                        <span className="text-red-500 font-medium">Inativo</span>
                      </>
                    )}
                  </div>
                </TableCell>
                <TableCell className="border-r py-4">
                  {user.is_superuser ? (
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-primary" />
                      <span className="text-primary font-medium">Super Usuário</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Padrão</span>
                    </div>
                  )}
                </TableCell>
                <TableCell className="border-r py-4">
                  <div className="flex items-center gap-2">
                    {user.company_ids?.length > 0 ? (
                      <>
                        <Building className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{user.company_ids?.length || 0}</span>
                      </>
                    ) : (
                      <>
                        <Building className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground text-sm">Nenhuma</span>
                      </>
                    )}
                  </div>
                </TableCell>
                <TableCell className="border-r py-4">
                  {dayjs(user.created_at).format('DD/MM/YYYY')}
                </TableCell>
                <TableCell className="w-[50px] py-4">
                  {actionsOptions(user)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <DeleteConfirmModal
        open={isOpenDeleteConfirmModal}
        onOpenChange={() => setIsOpenDeleteConfirmModal(false)}
        onConfirm={handleDeleteUser}
      />
    </>
  );
};

export default UsersTable;

