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
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { IMaskInput } from 'react-imask';

export interface CompanyFormData {
  id?: string;
  name: string;
  document: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  country: string;
  user_ids?: string[];
}

const companySchema = z.object({
  name: z.string().min(1, 'Informe o nome da empresa.'),
  document: z.string().min(11, 'Informe um documento válido.'),
  email: z.string().email('Informe um e-mail válido.'),
  phone: z.string().min(10, 'Informe um telefone válido.'),
  address: z.string().min(1, 'Informe o endereço.'),
  city: z.string().min(1, 'Informe a cidade.'),
  state: z.string().min(2, 'Informe o estado.'),
  zip_code: z.string().min(8, 'Informe um CEP válido.'),
  country: z.string().min(1, 'Informe o país.'),
});

type CompanyFormSchema = {
  id?: string;
  name: string;
  document: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  country: string;
};

interface ManageCompanyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: Company.Entity;
  onSave: (data: CompanyFormData) => void;
  mode?: 'create' | 'edit';
  isLoading?: boolean;
}

export function ManageCompanyModal({
  open,
  onOpenChange,
  initialData,
  onSave,
  mode = 'create',
  isLoading = false,
}: ManageCompanyModalProps) {
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CompanyFormSchema>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      id: initialData?.id ?? '',
      name: initialData?.name ?? '',
      document: initialData?.document ?? '',
      email: initialData?.email ?? '',
      phone: initialData?.phone ?? '',
      address: initialData?.address ?? '',
      city: initialData?.city ?? '',
      state: initialData?.state ?? '',
      zip_code: initialData?.zip_code ?? '',
      country: initialData?.country ?? 'Brasil',
    },
  });

  useEffect(() => {
    if (open) {
      reset({
        id: initialData?.id ?? '',
        name: initialData?.name ?? '',
        document: initialData?.document ?? '',
        email: initialData?.email ?? '',
        phone: initialData?.phone ?? '',
        address: initialData?.address ?? '',
        city: initialData?.city ?? '',
        state: initialData?.state ?? '',
        zip_code: initialData?.zip_code ?? '',
        country: initialData?.country ?? 'Brasil',
      });
    }
  }, [open, initialData, reset]);

  function onSubmit(data: CompanyFormSchema) {
    onSave({
      id: initialData?.id,
      name: data.name,
      document: data.document,
      email: data.email,
      phone: data.phone,
      address: data.address,
      city: data.city,
      state: data.state,
      zip_code: data.zip_code,
      country: data.country,
      user_ids: initialData?.user_ids || [],
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <DialogHeader>
            <DialogTitle>
              {mode === 'edit' ? 'Editar Empresa' : 'Criar Empresa'}
            </DialogTitle>
            <DialogDescription>
              {mode === 'edit'
                ? 'Edite os dados da empresa.'
                : 'Preencha os dados para criar uma nova empresa.'}
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="mb-1 block text-sm font-medium">
                Nome da Empresa
              </label>
              <Input {...register('name')} placeholder="Ex: Empresa LTDA" />
              {errors.name && (
                <span className="text-xs text-red-500">
                  {errors.name.message}
                </span>
              )}
            </div>

            <Controller
              control={control}
              name="document"
              render={({ field }) => (
                <div className="flex flex-col">
                  <label className="mb-1 block text-sm font-medium">
                    CNPJ/CPF
                  </label>

                  <IMaskInput
                    mask={[
                      { mask: '000.000.000-00', maxLength: 11 },
                      { mask: '00.000.000/0000-00' },
                    ]}
                    value={field.value}
                    onAccept={(value: string) => field.onChange(value)}
                    unmask
                    placeholder="00.000.000/0000-00"
                    className="dark:bg-input/30 border-input focus-visible:border-ring focus-visible:ring-ring/50 flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                  />

                  {errors.document && (
                    <span className="text-xs text-red-500">
                      {errors.document.message}
                    </span>
                  )}
                </div>
              )}
            />

            <div>
              <label className="mb-1 block text-sm font-medium">E-mail</label>
              <Input
                {...register('email')}
                type="email"
                placeholder="empresa@exemplo.com"
              />
              {errors.email && (
                <span className="text-xs text-red-500">
                  {errors.email.message}
                </span>
              )}
            </div>

            <Controller
              control={control}
              name="phone"
              render={({ field }) => (
                <div className="flex flex-col">
                  <label className="mb-1 block text-sm font-medium">
                    Telefone
                  </label>

                  <IMaskInput
                    mask={[
                      { mask: '(00) 0000-0000', maxLength: 10 },
                      { mask: '(00) 00000-0000' },
                    ]}
                    value={field.value}
                    onAccept={(value: string) => field.onChange(value)}
                    unmask
                    placeholder="(00) 00000-0000"
                    className="dark:bg-input/30 border-input focus-visible:border-ring focus-visible:ring-ring/50 flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                  />

                  {errors.phone && (
                    <span className="text-xs text-red-500">
                      {errors.phone.message}
                    </span>
                  )}
                </div>
              )}
            />

            <Controller
              control={control}
              name="zip_code"
              render={({ field }) => (
                <div className="flex flex-col">
                  <label className="mb-1 block text-sm font-medium">CEP</label>

                  <IMaskInput
                    mask="00000-000"
                    value={field.value}
                    onAccept={(value: string) => field.onChange(value)}
                    unmask
                    placeholder="00000-000"
                    className="dark:bg-input/30 border-input focus-visible:border-ring focus-visible:ring-ring/50 flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                  />

                  {errors.zip_code && (
                    <span className="text-xs text-red-500">
                      {errors.zip_code.message}
                    </span>
                  )}
                </div>
              )}
            />

            <div className="md:col-span-2">
              <label className="mb-1 block text-sm font-medium">
                Endereço
              </label>
              <Input
                {...register('address')}
                placeholder="Rua, número, bairro"
              />
              {errors.address && (
                <span className="text-xs text-red-500">
                  {errors.address.message}
                </span>
              )}
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Cidade</label>
              <Input {...register('city')} placeholder="Ex: São Paulo" />
              {errors.city && (
                <span className="text-xs text-red-500">
                  {errors.city.message}
                </span>
              )}
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Estado</label>
              <Input {...register('state')} placeholder="Ex: SP" maxLength={2} />
              {errors.state && (
                <span className="text-xs text-red-500">
                  {errors.state.message}
                </span>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="mb-1 block text-sm font-medium">País</label>
              <Input {...register('country')} placeholder="Ex: Brasil" />
              {errors.country && (
                <span className="text-xs text-red-500">
                  {errors.country.message}
                </span>
              )}
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
              {mode === 'edit' ? 'Salvar Alterações' : 'Criar Empresa'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

