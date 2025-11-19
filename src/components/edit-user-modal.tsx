import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { updateUserById } from '@/services/Users';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export interface UserProps {
  id: string;
  email: string;
  full_name: string;
}

const processSchema = z.object({
  email: z.email('Email inválido.').min(1, 'Insira o email.'),
  full_name: z.string().min(1, 'Insira o nome completo.'),
});

type UserFormSchema = {
  email: string;
  full_name: string;
};

interface EditUserModalProps {
  open: boolean;
  onClose: () => void;
  initialData: UserProps;
}

export function EditUserModal({
  open,
  onClose,
  initialData,
}: EditUserModalProps) {
  const { updateUser } = useAuth();

  const {
    register,
    handleSubmit,
    reset,
    formState: { isDirty, errors },
  } = useForm<UserFormSchema>({
    resolver: zodResolver(processSchema),
    defaultValues: {
      email: initialData?.email ?? '',
      full_name: initialData?.full_name ?? '',
    },
  });

  useEffect(() => {
    if (open) {
      reset({
        email: initialData?.email ?? '',
        full_name: initialData?.full_name ?? '',
      });
    }
  }, [open]);

  const { mutateAsync: onUpdateUser, isPending: isUpdatingUser } = useMutation({
    mutationKey: ['update-user'],
    mutationFn: async (user: UserFormSchema) =>
      updateUserById({
        userId: initialData.id,
        body: { email: user.email, full_name: user.full_name },
      }),
    onSuccess: ({ data }) => {
      updateUser(data.email, data.full_name);

      onClose();
    },
    onError: (errorMessage: string) => toast.error(errorMessage),
  });

  function onSubmit(data: UserFormSchema) {
    onUpdateUser(data);
  }

  return (
    <AlertDialog open={open}>
      <AlertDialogContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <AlertDialogHeader>
            <AlertDialogTitle>Editar Usuário</AlertDialogTitle>
            <AlertDialogDescription>
              Altere os dados para atualizar o usuário
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium">Email</label>
              <Input {...register('email')} />
              {errors.email && (
                <span className="text-xs text-red-500">
                  {errors.email.message}
                </span>
              )}
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">
                Nome Completo
              </label>
              <Input {...register('full_name')} />
              {errors.full_name && (
                <span className="text-xs text-red-500">
                  {errors.full_name.message}
                </span>
              )}
            </div>
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => onClose()}
              disabled={isUpdatingUser}
            >
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              type="submit"
              disabled={isUpdatingUser || !isDirty}
              className="w-[140px]"
            >
              {isUpdatingUser ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                'Salvar Alterações'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
