'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useQuery } from '@tanstack/react-query';
import { getCompanies } from '@/services/Companies';
import { Loader2 } from 'lucide-react';

export interface UserFormData {
  id?: string;
  email: string;
  full_name: string;
  password?: string;
  is_active: boolean;
  is_superuser: boolean;
  company_ids: string[];
}

const userCreateSchema = z.object({
  email: z.string().email('Informe um e-mail válido.'),
  full_name: z.string().min(1, 'Informe o nome completo.'),
  password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres.'),
  is_active: z.boolean(),
  is_superuser: z.boolean(),
  company_ids: z.array(z.string()),
});

const userEditSchema = z.object({
  email: z.email('Informe um e-mail válido.'),
  full_name: z.string().min(1, 'Informe o nome completo.'),
  password: z.string().optional(),
  is_active: z.boolean(),
  is_superuser: z.boolean(),
  company_ids: z.array(z.string()),
});

type UserFormSchema = {
  id?: string;
  email: string;
  full_name: string;
  password?: string;
  is_active: boolean;
  is_superuser: boolean;
  company_ids: string[];
};

interface ManageUserModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: User.Entity;
  onSave: (data: UserFormData) => void;
  mode?: 'create' | 'edit';
  isLoading?: boolean;
}

export function ManageUserModal({
  open,
  onOpenChange,
  initialData,
  onSave,
  mode = 'create',
  isLoading = false,
}: ManageUserModalProps) {
  const [selectedCompanyIds, setSelectedCompanyIds] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const {
    control,
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<UserFormSchema>({
    resolver: zodResolver(mode === 'create' ? userCreateSchema : userEditSchema),
    defaultValues: {
      id: initialData?.id ?? '',
      email: initialData?.email ?? '',
      full_name: initialData?.full_name ?? '',
      password: '',
      is_active: initialData?.is_active ?? true,
      is_superuser: initialData?.is_superuser ?? false,
      company_ids: initialData?.company_ids ?? [],
    },
  });

  const { data: companiesResult, isLoading: isLoadingCompanies } = useQuery({
    queryKey: ['get-companies-for-user'],
    queryFn: async () => await getCompanies(),
    enabled: open,
  });

  const companies = companiesResult?.data || [];

  useEffect(() => {
    if (open) {
      reset({
        id: initialData?.id ?? '',
        email: initialData?.email ?? '',
        full_name: initialData?.full_name ?? '',
        password: '',
        is_active: initialData?.is_active ?? true,
        is_superuser: initialData?.is_superuser ?? false,
        company_ids: initialData?.company_ids ?? [],
      });
      setSelectedCompanyIds(initialData?.company_ids ?? []);
    }
  }, [open, initialData, reset]);

  const handleToggleCompany = (companyId: string) => {
    setSelectedCompanyIds((prev) => {
      const newIds = prev.includes(companyId)
        ? prev.filter((id) => id !== companyId)
        : [...prev, companyId];
      setValue('company_ids', newIds);
      return newIds;
    });
  };

  function onSubmit(data: UserFormSchema) {
    onSave({
      id: initialData?.id,
      email: data.email,
      full_name: data.full_name,
      password: data.password === '' ? undefined : data.password,
      is_active: data.is_active,
      is_superuser: data.is_superuser,
      company_ids: selectedCompanyIds,
    });
  }

  const filteredCompanies = companies.filter((company) =>
    company.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-hidden flex flex-col max-w-2xl">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 flex flex-col flex-1 overflow-hidden">
          <DialogHeader>
            <DialogTitle>
              {mode === 'edit' ? 'Editar Usuário' : 'Criar Usuário'}
            </DialogTitle>
            <DialogDescription>
              {mode === 'edit'
                ? 'Edite os dados do usuário.'
                : 'Preencha os dados para criar um novo usuário.'}
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className="mb-1 block text-sm font-medium">
                  Nome Completo
                </label>
                <Input {...register('full_name')} placeholder="Ex: João Silva" />
                {errors.full_name && (
                  <span className="text-xs text-red-500">
                    {errors.full_name.message}
                  </span>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="mb-1 block text-sm font-medium">E-mail</label>
                <Input
                  {...register('email')}
                  type="email"
                  placeholder="usuario@exemplo.com"
                />
                {errors.email && (
                  <span className="text-xs text-red-500">
                    {errors.email.message}
                  </span>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="mb-1 block text-sm font-medium">
                  Senha {mode === 'edit' && '(deixe em branco para manter a atual)'}
                </label>
                <Input
                  {...register('password')}
                  type="password"
                  placeholder={mode === 'edit' ? 'Opcional' : 'Mínimo 6 caracteres'}
                />
                {errors.password && (
                  <span className="text-xs text-red-500">
                    {errors.password.message}
                  </span>
                )}
              </div>

              <Controller
                control={control}
                name="is_active"
                render={({ field }) => (
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="is_active"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                    <Label htmlFor="is_active" className="cursor-pointer">
                      Usuário Ativo
                    </Label>
                  </div>
                )}
              />

              <Controller
                control={control}
                name="is_superuser"
                render={({ field }) => (
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="is_superuser"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                    <Label htmlFor="is_superuser" className="cursor-pointer">
                      Superusuário
                    </Label>
                  </div>
                )}
              />
            </div>

            <div className="border-t pt-4">
              <label className="mb-2 block text-sm font-medium">
                Empresas Vinculadas
              </label>
              <div className="mb-2">
                <Input
                  placeholder="Buscar empresas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {isLoadingCompanies ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <div className="max-h-48 overflow-y-auto space-y-2 border rounded-md p-3">
                  {filteredCompanies.length === 0 ? (
                    <p className="text-center text-muted-foreground text-sm py-4">
                      Nenhuma empresa encontrada.
                    </p>
                  ) : (
                    filteredCompanies.map((company) => (
                      <div
                        key={company.id}
                        className="flex items-center space-x-3 p-2 rounded-md hover:bg-muted/50 transition-colors"
                      >
                        <Checkbox
                          id={company.id}
                          checked={selectedCompanyIds.includes(company.id)}
                          onCheckedChange={() => handleToggleCompany(company.id)}
                        />
                        <label
                          htmlFor={company.id}
                          className="flex-1 cursor-pointer text-sm"
                        >
                          <div className="font-medium">{company.name}</div>
                          <div className="text-muted-foreground text-xs">
                            {company.document}
                          </div>
                        </label>
                      </div>
                    ))
                  )}
                </div>
              )}

              <div className="text-xs text-muted-foreground mt-2">
                {selectedCompanyIds.length} empresa(s) selecionada(s)
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button type="submit" isLoading={isLoading}>
              {mode === 'edit' ? 'Salvar Alterações' : 'Criar Usuário'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

