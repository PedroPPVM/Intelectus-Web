'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { getUsers } from '@/services/Users';
import { updateCompany } from '@/services/Companies';
import { toast } from 'sonner';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';

interface LinkUsersModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  company: Company.Entity;
  onSuccess: () => void;
}

export function LinkUsersModal({
  open,
  onOpenChange,
  company,
  onSuccess,
}: LinkUsersModalProps) {
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const { data: usersResult, isLoading: isLoadingUsers } = useQuery({
    queryKey: ['get-users'],
    queryFn: async () => await getUsers(),
    enabled: open,
  });

  const users = usersResult?.data || [];

  useEffect(() => {
    if (open && company) {
      setSelectedUserIds(company.user_ids || []);
    }
  }, [open, company]);

  const { mutateAsync: onUpdateCompany, isPending: isUpdatingCompany } =
    useMutation({
      mutationKey: ['update-company-users'],
      mutationFn: async (userIds: string[]) =>
        updateCompany({
          companyId: company.id,
          body: {
            name: company.name,
            document: company.document,
            email: company.email,
            phone: company.phone,
            address: company.address,
            city: company.city,
            state: company.state,
            zip_code: company.zip_code,
            country: company.country,
            user_ids: userIds,
          },
        }),
      onSuccess: () => {
        toast.success('Usuários vinculados com sucesso!');
        onSuccess();
        onOpenChange(false);
      },
      onError: (errorMessage: string) => toast.error(errorMessage),
    });

  const handleToggleUser = (userId: string) => {
    setSelectedUserIds((prev) => {
      if (prev.includes(userId)) {
        return prev.filter((id) => id !== userId);
      } else {
        return [...prev, userId];
      }
    });
  };

  const handleSubmit = () => {
    onUpdateCompany(selectedUserIds);
  };

  const filteredUsers = users.filter(
    (user) =>
      user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Vincular Usuários</DialogTitle>
          <DialogDescription>
            Selecione os usuários que terão acesso à empresa{' '}
            <strong>{company.name}</strong>.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 flex-1 overflow-hidden flex flex-col">
          <div>
            <Input
              placeholder="Buscar usuários por nome ou e-mail..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {isLoadingUsers ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto space-y-2 border rounded-md p-4">
              {filteredUsers.length === 0 ? (
                <p className="text-center text-muted-foreground py-4">
                  Nenhum usuário encontrado.
                </p>
              ) : (
                filteredUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center space-x-3 p-3 rounded-md hover:bg-muted/50 transition-colors"
                  >
                    <Checkbox
                      id={user.id}
                      checked={selectedUserIds.includes(user.id)}
                      onCheckedChange={() => handleToggleUser(user.id)}
                    />
                    <label
                      htmlFor={user.id}
                      className="flex-1 cursor-pointer text-sm"
                    >
                      <div className="font-medium">{user.full_name}</div>
                      <div className="text-muted-foreground text-xs">
                        {user.email}
                      </div>
                    </label>
                    {user.is_superuser && (
                      <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                        Superusuário
                      </span>
                    )}
                  </div>
                ))
              )}
            </div>
          )}

          <div className="text-sm text-muted-foreground">
            {selectedUserIds.length} usuário(s) selecionado(s)
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isUpdatingCompany}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={isUpdatingCompany || isLoadingUsers}
          >
            {isUpdatingCompany ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Salvando...
              </>
            ) : (
              'Salvar'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

