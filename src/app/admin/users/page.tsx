'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { getUsers, updateUserById } from '@/services/Users';
import { createUser } from '@/services/AuthService';
import { toast } from 'sonner';
import UsersTable from './components/users-table';
import {
  ManageUserModal,
  UserFormData,
} from './components/manage-user-modal';
import { useTableState } from '@/hooks/useTableState';
import { TablePagination } from '@/components/table-pagination';

const AdminUsers = () => {
  const [manageUserMode, setManageUserMode] = useState<'create' | 'edit'>(
    'create',
  );
  const [isOpenUserModal, setIsOpenUserModal] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<User.Entity | undefined>(
    undefined,
  );

  const {
    data: usersResult,
    isFetching: isLoadingUsers,
    refetch: onRefetchUsers,
  } = useQuery({
    queryKey: ['get-users-admin'],
    queryFn: async () => await getUsers(),
  });

  const users = useMemo(() => {
    if (!usersResult) return [];

    return usersResult.data;
  }, [usersResult]);

  const {
    processedData,
    sorting,
    pagination,
    handleSort,
    handlePageChange,
    handleItemsPerPageChange,
  } = useTableState({
    data: users,
    initialItemsPerPage: 25,
  });

  const { mutateAsync: onCreateUser, isPending: isCreatingUser } = useMutation({
    mutationKey: ['create-user'],
    mutationFn: async (user: UserFormData) =>
      createUser({
        email: user.email,
        full_name: user.full_name,
        password: user.password!,
        is_superuser: user.is_superuser,
        company_ids: user.company_ids || [],
      }),
    onSuccess: () => {
      onRefetchUsers();
      setIsOpenUserModal(false);
      toast.success('Usuário criado com sucesso!');
    },
    onError: (errorMessage: string) => toast.error(errorMessage),
  });

  const { mutateAsync: onUpdateUser, isPending: isUpdatingUser } = useMutation({
    mutationKey: ['update-user'],
    mutationFn: async (user: UserFormData) =>
      updateUserById({
        userId: user.id || '',
        body: {
          email: user.email,
          full_name: user.full_name,
          password: user.password,
          is_active: user.is_active,
          is_superuser: user.is_superuser,
          company_ids: user.company_ids || [],
        },
      }),
    onSuccess: () => {
      onRefetchUsers();
      setIsOpenUserModal(false);
      toast.success('Usuário atualizado com sucesso!');
    },
    onError: (errorMessage: string) => toast.error(errorMessage),
  });

  const handleOpenUserModal = (user: User.Entity) => {
    setManageUserMode('edit');
    setIsOpenUserModal(true);
    setSelectedUser(user);
  };

  const onSaveItem = useCallback(
    async (user: UserFormData) => {
      if (manageUserMode === 'create') await onCreateUser(user);
      else await onUpdateUser(user);
    },
    [manageUserMode, onCreateUser, onUpdateUser],
  );

  return (
    <Card className="flex size-full flex-col">
      <CardHeader className="flex flex-wrap items-center justify-between">
        <span className="text-2xl font-bold">Usuários</span>

        <div className="flex flex-wrap items-center gap-4">
          <Button
            onClick={() => {
              setManageUserMode('create');
              setSelectedUser(undefined);
              setIsOpenUserModal(true);
            }}
          >
            <Plus /> Criar Usuário
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <div className="hidden md:block">
          <UsersTable
            users={processedData.data}
            onOpenUserModal={handleOpenUserModal}
            onRefetchUsers={onRefetchUsers}
            sorting={sorting}
            onSort={handleSort}
          />
          <TablePagination
            currentPage={pagination.currentPage}
            totalPages={processedData.totalPages}
            itemsPerPage={pagination.itemsPerPage}
            totalItems={processedData.totalItems}
            onPageChange={handlePageChange}
            onItemsPerPageChange={handleItemsPerPageChange}
          />
        </div>
      </CardContent>

      <ManageUserModal
        open={isOpenUserModal}
        onOpenChange={() => setIsOpenUserModal(false)}
        onSave={onSaveItem}
        mode={manageUserMode}
        initialData={selectedUser}
        isLoading={isCreatingUser || isUpdatingUser}
      />
    </Card>
  );
};

export default AdminUsers;

