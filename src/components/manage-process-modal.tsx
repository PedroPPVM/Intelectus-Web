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
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { DatePickerField } from './date-picker-field';
import dayjs from 'dayjs';

interface Process {
  processNumber: string;
  title: string;
  depositor: string;
  cnpj: string;
  cpf: string;
  attorney: string;
  depositDate: Date;
  concessionDate: Date;
  validityDate: Date;
}

const processSchema = z.object({
  processNumber: z.string().min(1, 'Informe um número de processo válido.'),
  title: z.string().min(1, 'Informe o nome da marca.'),
  depositor: z.string().min(1, 'Informe o depositante.'),
  cnpj: z.string().optional(),
  cpf: z.string().optional(),
  attorney: z.string().min(1, 'Informe o procurador.'),
  depositDate: z.string().min(1, 'Informe a data do depósito.'),
  concessionDate: z.string().min(1, 'Informe a data da concessão.'),
  validityDate: z.string().min(1, 'Informe a vigência.'),
});

type ProcessFormSchema = {
  processNumber: string;
  title: string;
  depositor: string;
  cnpj?: string;
  cpf?: string;
  attorney: string;
  depositDate: string;
  concessionDate: string;
  validityDate: string;
};

interface ManageProcessModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: Process;
  onSave: (data: Process) => void;
  mode?: 'create' | 'edit';
}

export function ManageProcessModal({
  open,
  onOpenChange,
  initialData,
  onSave,
  mode = 'create',
}: ManageProcessModalProps) {
  const [depositDateOpen, setDepositDateOpen] = useState(false);
  const [concessionDateOpen, setConcessionDateOpen] = useState(false);
  const [validityDateOpen, setValidityDateOpen] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
    watch,
  } = useForm<ProcessFormSchema>({
    resolver: zodResolver(processSchema),
    defaultValues: {
      processNumber: initialData?.processNumber ?? '',
      title: initialData?.title ?? '',
      depositor: initialData?.depositor ?? '',
      cnpj: initialData?.cnpj ?? '',
      cpf: initialData?.cpf ?? '',
      attorney: initialData?.attorney ?? '',
      depositDate: initialData?.depositDate
        ? dayjs(initialData.depositDate).format('YYYY-MM-DD')
        : '',
      concessionDate: initialData?.concessionDate
        ? dayjs(initialData.concessionDate).format('YYYY-MM-DD')
        : '',
      validityDate: initialData?.validityDate
        ? dayjs(initialData.validityDate).format('YYYY-MM-DD')
        : '',
    },
  });

  useEffect(() => {
    if (open) {
      reset({
        processNumber: initialData?.processNumber ?? '',
        title: initialData?.title ?? '',
        depositor: initialData?.depositor ?? '',
        cnpj: initialData?.cnpj ?? '',
        cpf: initialData?.cpf ?? '',
        attorney: initialData?.attorney ?? '',
        depositDate: initialData?.depositDate
          ? dayjs(initialData.depositDate).format('YYYY-MM-DD')
          : '',
        concessionDate: initialData?.concessionDate
          ? dayjs(initialData.concessionDate).format('YYYY-MM-DD')
          : '',
        validityDate: initialData?.validityDate
          ? dayjs(initialData.validityDate).format('YYYY-MM-DD')
          : '',
      });
    }
  }, [open]);

  function onSubmit(data: ProcessFormSchema) {
    onSave({
      processNumber: data.processNumber,
      title: data.title,
      depositor: data.depositor,
      cnpj: data.cnpj || '',
      cpf: data.cpf || '',
      attorney: data.attorney,
      depositDate: new Date(data.depositDate),
      concessionDate: new Date(data.concessionDate),
      validityDate: new Date(data.validityDate),
    });
    onOpenChange(false);
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
              <Input type="number" {...register('processNumber')} />
              {errors.processNumber && (
                <span className="text-xs text-red-500">
                  {errors.processNumber.message}
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
            <div>
              <label className="mb-1 block text-sm font-medium">CNPJ</label>
              <Input {...register('cnpj')} />
              {errors.cnpj && (
                <span className="text-xs text-red-500">
                  {errors.cnpj.message}
                </span>
              )}
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">CPF</label>
              <Input {...register('cpf')} />
              {errors.cpf && (
                <span className="text-xs text-red-500">
                  {errors.cpf.message}
                </span>
              )}
            </div>
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
              value={watch('depositDate')}
              setValue={(value) => setValue('depositDate', value)}
              label="Data do Depósito"
              isOpen={depositDateOpen}
              setIsOpen={setDepositDateOpen}
              error={errors.depositDate?.message}
            />
            <DatePickerField
              value={watch('concessionDate')}
              setValue={(value) => setValue('concessionDate', value)}
              label="Data da Concessão"
              isOpen={concessionDateOpen}
              setIsOpen={setConcessionDateOpen}
              error={errors.concessionDate?.message}
            />
            <DatePickerField
              value={watch('validityDate')}
              setValue={(value) => setValue('validityDate', value)}
              label="Vigência"
              isOpen={validityDateOpen}
              setIsOpen={setValidityDateOpen}
              error={errors.validityDate?.message}
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
