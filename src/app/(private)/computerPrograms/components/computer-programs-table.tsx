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
import { useCallback, useState } from 'react';
import { DeleteConfirmModal } from '@/components/delete-confirm-modal';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getSelectedCompany } from '@/utils/get-company-by-local-storage';
import { deleteProcess } from '@/services/Processes/processes';

interface ComputerProgramsTableProps {
  computerPrograms: Process.Entity[];
  onOpenComputerProgramModal: (computerProgram: Process.Entity) => void;
}

const ComputerProgramsTable = ({
  computerPrograms,
  onOpenComputerProgramModal,
}: ComputerProgramsTableProps) => {
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

        queryClient.invalidateQueries({ queryKey: ['get-computer-programs'] });
      },
    });

  const actionsOptions = (computerProgram: Process.Entity) => {
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
            onClick={() => onOpenComputerProgramModal(computerProgram)}
          >
            Editar
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => {
              setIsOpenDeleteConfirmModal(true);
              setProcessIdToDelete(computerProgram.id || '');
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
    <div className={`max-h-full max-w-[calc(100vw-360px)] overflow-auto`}>
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead>N° do Processo</TableHead>
            <TableHead>Título</TableHead>
            <TableHead>Apelido</TableHead>
            <TableHead>Situação</TableHead>
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
          {computerPrograms.map((computerProgram) => (
            <TableRow key={computerProgram.id} className="hover:bg-transparent">
              <TableCell className="font-medium">
                {computerProgram.process_number}
              </TableCell>
              <TableCell>{computerProgram.title}</TableCell>
              <TableCell>{computerProgram.title.slice(0, 3)}</TableCell>
              <TableCell>{computerProgram.situation}</TableCell>
              <TableCell>{computerProgram.depositor}</TableCell>
              <TableCell>
                {computerProgram.cnpj_depositor ||
                  computerProgram.cpf_depositor}
              </TableCell>
              <TableCell>{computerProgram.attorney}</TableCell>
              <TableCell>
                {dayjs(computerProgram.deposit_date).format('DD/MM/YYYY')}
              </TableCell>
              <TableCell>
                {dayjs(computerProgram.concession_date).format('DD/MM/YYYY')}
              </TableCell>
              <TableCell>
                {dayjs(computerProgram.validity_date).format('DD/MM/YYYY')}
              </TableCell>
              <TableCell className="w-[50px]">
                {actionsOptions(computerProgram)}
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

export default ComputerProgramsTable;
