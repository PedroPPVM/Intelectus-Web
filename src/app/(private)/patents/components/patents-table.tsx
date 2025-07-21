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
import { MoreHorizontal } from 'lucide-react';
import dayjs from 'dayjs';
import { DeleteConfirmModal } from '@/components/delete-confirm-modal';
import { useCallback, useState } from 'react';
import { getSelectedCompany } from '@/utils/get-company-by-local-storage';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteProcess } from '@/services/Processes/processes';

interface PatentsTableProps {
  patents: Process.Entity[];
  onOpenPatentsModal: (patent: Process.Entity) => void;
}

const PatentsTable = ({ patents, onOpenPatentsModal }: PatentsTableProps) => {
  const companyByLocalStorage = getSelectedCompany();
  const queryClient = useQueryClient();

  const [isOpenDeleteConfirmModal, setIsOpenDeleteConfirmModal] =
    useState<boolean>(false);
  const [processIdToDelete, setProcessIdToDelete] = useState<string | null>(
    null,
  );

  const { mutateAsync: onDeleteProcess, isPending: isDeletingProcess } =
    useMutation({
      mutationKey: ['delete-process'],
      mutationFn: async (processId: string) =>
        deleteProcess({
          companyId: companyByLocalStorage?.id || '',
          processId: processId,
        }),
      onSuccess: () => {
        setProcessIdToDelete(null);

        queryClient.invalidateQueries({ queryKey: ['get-patents'] });
      },
    });

  const actionsOptions = (patent: Process.Entity) => {
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
            className="cursor-pointer"
            onClick={() => onOpenPatentsModal(patent)}
          >
            Editar
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => {
              setIsOpenDeleteConfirmModal(true);
              setProcessIdToDelete(patent.id || '');
            }}
          >
            Excluir
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  const handleDeleteProcess = useCallback(() => {
    if (processIdToDelete) onDeleteProcess(processIdToDelete);

    setIsOpenDeleteConfirmModal(false);
  }, [processIdToDelete]);

  return (
    <div className="max-h-full overflow-auto">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead>N° do Processo</TableHead>
            <TableHead>Título</TableHead>
            <TableHead>Apelido</TableHead>
            <TableHead>Depositante</TableHead>
            <TableHead>CNPJ/CPF</TableHead>
            <TableHead>Procurador</TableHead>
            <TableHead>Data do Depósito</TableHead>
            <TableHead>Data da Concessão</TableHead>
            <TableHead>Vigência</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {patents.map((patent) => (
            <TableRow key={patent.id} className="hover:bg-transparent">
              <TableCell className="font-medium">
                {patent.process_number}
              </TableCell>
              <TableCell>{patent.title}</TableCell>
              <TableCell>{patent.title.slice(0, 3)}</TableCell>
              <TableCell>{patent.depositor}</TableCell>
              <TableCell>
                {patent.cnpj_depositor || patent.cpf_depositor}
              </TableCell>
              <TableCell>{patent.attorney}</TableCell>
              <TableCell>
                {dayjs(patent.deposit_date).format('DD/MM/YYYY')}
              </TableCell>
              <TableCell>
                {dayjs(patent.concession_date).format('DD/MM/YYYY')}
              </TableCell>
              <TableCell>
                {dayjs(patent.validity_date).format('DD/MM/YYYY')}
              </TableCell>
              <TableCell className="w-[50px]">
                {actionsOptions(patent)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <DeleteConfirmModal
        open={isOpenDeleteConfirmModal}
        onOpenChange={() => setIsOpenDeleteConfirmModal(false)}
        onConfirm={handleDeleteProcess}
      />
    </div>
  );
};

export default PatentsTable;
