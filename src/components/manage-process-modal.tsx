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
import { DatePickerField } from './date-picker-field';
import dayjs from 'dayjs';
import { IMaskInput } from 'react-imask';

export interface ProcessProps {
  id?: string;
  process_number: string;
  title: string;
  status: string;
  depositor: string;
  cnpj_depositor: string;
  cpf_depositor: string;
  attorney: string;
  deposit_date: Date;
  concession_date: Date;
  validity_date: Date;
}

const processSchema = z
  .object({
    process_number: z.string().min(5, 'Informe um número de processo com no mínimo 5 caracteres.').trim(),
    title: z.string().min(1, 'Informe o nome da marca.').trim(),
    status: z.string().min(1, 'Informe o status da marca.').trim(),
    depositor: z.string().min(1, 'Informe o depositante.').trim(),
    cnpj_depositor: z
      .string()
      .optional()
      .refine((val) => !val || val.length >= 14, {
        message: 'CNPJ Inválido.',
      }),
    cpf_depositor: z
      .string()
      .optional()
      .refine((val) => !val || val.length >= 11, {
        message: 'CPF Inválido.',
      }),
    attorney: z.string().min(1, 'Informe o procurador.').trim(),
    deposit_date: z.string().min(1, 'Informe a data do depósito.'),
    concession_date: z.string().min(1, 'Informe a data da concessão.'),
    validity_date: z.string().min(1, 'Informe a vigência.'),
  })
  .refine((data) => data.cpf_depositor || data.cnpj_depositor, {
    message: 'CNPJ ou CPF deve ser preenchido.',
    path: ['cnpj_depositor'],
  });

type ProcessFormSchema = {
  id?: string;
  process_number: string;
  title: string;
  status: string;
  depositor: string;
  cnpj_depositor?: string;
  cpf_depositor?: string;
  attorney: string;
  deposit_date: string;
  concession_date: string;
  validity_date: string;
};

interface ManageProcessModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: ProcessProps;
  onSave: (data: ProcessProps) => void;
  mode?: 'create' | 'edit';
}

export function ManageProcessModal({
  open,
  onOpenChange,
  initialData,
  onSave,
  mode = 'create',
}: ManageProcessModalProps) {
  const [deposit_dateOpen, setDepositDateOpen] = useState(false);
  const [concession_dateOpen, setConcessionDateOpen] = useState(false);
  const [validity_dateOpen, setValidityDateOpen] = useState(false);

  const {
    control,
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
    watch,
  } = useForm<ProcessFormSchema>({
    resolver: zodResolver(processSchema),
    defaultValues: {
      id: initialData?.id ?? '',
      process_number: initialData?.process_number ?? '',
      title: initialData?.title ?? '',
      status: initialData?.status ?? '',
      depositor: initialData?.depositor ?? '',
      cnpj_depositor: initialData?.cnpj_depositor ?? '',
      cpf_depositor: initialData?.cpf_depositor ?? '',
      attorney: initialData?.attorney ?? '',
      deposit_date: initialData?.deposit_date
        ? dayjs(initialData.deposit_date).format('YYYY-MM-DD')
        : '',
      concession_date: initialData?.concession_date
        ? dayjs(initialData.concession_date).format('YYYY-MM-DD')
        : '',
      validity_date: initialData?.validity_date
        ? dayjs(initialData.validity_date).format('YYYY-MM-DD')
        : '',
    },
  });

  useEffect(() => {
    if (open) {
      reset({
        id: initialData?.id ?? '',
        process_number: initialData?.process_number ?? '',
        title: initialData?.title ?? '',
        status: initialData?.status ?? '',
        depositor: initialData?.depositor ?? '',
        cnpj_depositor: initialData?.cnpj_depositor ?? '',
        cpf_depositor: initialData?.cpf_depositor ?? '',
        attorney: initialData?.attorney ?? '',
        deposit_date: initialData?.deposit_date
          ? dayjs(initialData.deposit_date).format('YYYY-MM-DD')
          : '',
        concession_date: initialData?.concession_date
          ? dayjs(initialData.concession_date).format('YYYY-MM-DD')
          : '',
        validity_date: initialData?.validity_date
          ? dayjs(initialData.validity_date).format('YYYY-MM-DD')
          : '',
      });
    }
  }, [open]);

  function onSubmit(data: ProcessFormSchema) {
    onSave({
      id: watch('id'),
      process_number: data.process_number,
      title: data.title,
      status: data.status,
      depositor: data.depositor,
      cnpj_depositor: data.cnpj_depositor || '',
      cpf_depositor: data.cpf_depositor || '',
      attorney: data.attorney,
      deposit_date: new Date(data.deposit_date),
      concession_date: new Date(data.concession_date),
      validity_date: new Date(data.validity_date),
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <DialogHeader>
            <DialogTitle>
              {mode === 'edit' ? 'Editar Processo' : 'Criar Processo'}
            </DialogTitle>
            <DialogDescription>
              {mode === 'edit'
                ? 'Edite os dados do processo.'
                : 'Preencha os dados para criar um novo processo.'}
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium">
                N° do Processo
              </label>
              <Input {...register('process_number')} />
              {errors.process_number && (
                <span className="text-xs text-red-500">
                  {errors.process_number.message}
                </span>
              )}
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Título</label>
              <Input {...register('title')} />
              {errors.title && (
                <span className="text-xs text-red-500">
                  {errors.title.message}
                </span>
              )}
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Situação</label>
              <Input {...register('status')} />
              {errors.status && (
                <span className="text-xs text-red-500">
                  {errors.status.message}
                </span>
              )}
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">
                Depositante
              </label>
              <Input {...register('depositor')} />
              {errors.depositor && (
                <span className="text-xs text-red-500">
                  {errors.depositor.message}
                </span>
              )}
            </div>
            <Controller
              control={control}
              name="cnpj_depositor"
              render={({ field }) => (
                <div className="flex flex-col">
                  <span>CNPJ</span>

                  <IMaskInput
                    mask="00.000.000/0000-00"
                    value={field.value}
                    onAccept={(value: string) => field.onChange(value)}
                    unmask
                    className="dark:bg-input/30 border-input focus-visible:border-ring focus-visible:ring-ring/50 flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                  />

                  {errors.cnpj_depositor && (
                    <span className="text-xs text-red-500">
                      {errors.cnpj_depositor.message}
                    </span>
                  )}
                </div>
              )}
            />
            <Controller
              control={control}
              name="cpf_depositor"
              render={({ field }) => (
                <div className="flex flex-col">
                  <span>CPF</span>

                  <IMaskInput
                    mask="000.000.000-00"
                    value={field.value}
                    onAccept={(value: string) => field.onChange(value)}
                    unmask
                    className="dark:bg-input/30 border-input focus-visible:border-ring focus-visible:ring-ring/50 flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                  />

                  {errors.cpf_depositor && (
                    <span className="text-xs text-red-500">
                      {errors.cpf_depositor.message}
                    </span>
                  )}
                </div>
              )}
            />
            <div>
              <label className="mb-1 block text-sm font-medium">
                Procurador
              </label>
              <Input {...register('attorney')} />
              {errors.attorney && (
                <span className="text-xs text-red-500">
                  {errors.attorney.message}
                </span>
              )}
            </div>
            <DatePickerField
              value={watch('deposit_date')}
              setValue={(value) => setValue('deposit_date', value)}
              label="Data do Depósito"
              isOpen={deposit_dateOpen}
              setIsOpen={setDepositDateOpen}
              error={errors.deposit_date?.message}
            />
            <DatePickerField
              value={watch('concession_date')}
              setValue={(value) => setValue('concession_date', value)}
              label="Data da Concessão"
              isOpen={concession_dateOpen}
              setIsOpen={setConcessionDateOpen}
              error={errors.concession_date?.message}
            />
            <DatePickerField
              value={watch('validity_date')}
              setValue={(value) => setValue('validity_date', value)}
              label="Vigência"
              isOpen={validity_dateOpen}
              setIsOpen={setValidityDateOpen}
              error={errors.validity_date?.message}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit">
              {mode === 'edit' ? 'Salvar Alterações' : 'Criar Processo'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
