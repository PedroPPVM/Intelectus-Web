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
import { FileSearch2, MoreHorizontal } from 'lucide-react';
import dayjs from 'dayjs';
import { DeleteConfirmModal } from '@/components/delete-confirm-modal';
import { useCallback, useMemo, useState } from 'react';
import { getSelectedCompany } from '@/utils/get-company-by-local-storage';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteProcess, scrapeStatusByProcess } from '@/services/Processes';
import { ScrapeConfirmModal } from '@/components/scrape-confirm-modal';
import { toast } from 'sonner';
import { useSidebar } from '@/components/ui/sidebar';

interface PatentsTableProps {
  patents: Process.Entity[];
  onOpenPatentsModal: (patent: Process.Entity) => void;
}

const PatentsTable = ({ patents, onOpenPatentsModal }: PatentsTableProps) => {
  const { open } = useSidebar();

  const maxTableWidth = useMemo(() => {
    return open ? 'max-w-[calc(100vw-354px)]' : 'max-w-full';
  }, [open]);

  const companyByLocalStorage = getSelectedCompany();
  const queryClient = useQueryClient();

  const [isOpenScrapeConfirmModal, setIsOpenScrapeConfirmModal] =
    useState<boolean>(false);
  const [processIdToScrape, setProcessIdToScrape] = useState<string | null>(
    null,
  );

  const [isOpenDeleteConfirmModal, setIsOpenDeleteConfirmModal] =
    useState<boolean>(false);
  const [processIdToDelete, setProcessIdToDelete] = useState<string | null>(
    null,
  );

  const { mutateAsync: onScrapeStatus, isPending: isScrappingStatus } =
    useMutation({
      mutationKey: ['scrape-status-by-process'],
      mutationFn: async (processId: string) =>
        scrapeStatusByProcess({
          processId: processId,
        }),
      onSuccess: ({ data }) => {
        setIsOpenScrapeConfirmModal(false);
        setProcessIdToScrape(null);

        queryClient.invalidateQueries({ queryKey: ['get-patents'] });

        if (data.response === 'Nenhuma atualização necessária.')
          toast.info(data.response);
        else if (data.response === 'Processo não encontrado na revista.')
          toast.error(data.response);
        else toast.success(data.response);
      },
      onError: (errorMessage: string) => toast.error(errorMessage),
    });

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
      onError: (errorMessage: string) => toast.error(errorMessage),
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
    <div
      className={`flex max-h-[calc(100vh-224px)] overflow-auto ${maxTableWidth}`}
    >
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-[50px]"></TableHead>
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
          {patents.map((patent) => (
            <TableRow key={patent.id} className="hover:bg-transparent">
              <TableCell>
                <button
                  type="button"
                  className="hover:bg-muted cursor-pointer rounded-full p-2 transition-all"
                  onClick={() => {
                    setProcessIdToScrape(patent?.id || '');
                    setIsOpenScrapeConfirmModal(true);
                  }}
                >
                  <FileSearch2 />
                </button>
              </TableCell>
              <TableCell className="font-medium">
                {patent.process_number}
              </TableCell>
              <TableCell>{patent.title}</TableCell>
              <TableCell>{patent.title.slice(0, 3)}</TableCell>
              <TableCell>{patent.status}</TableCell>
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

      <ScrapeConfirmModal
        open={isOpenScrapeConfirmModal}
        isLoading={isScrappingStatus}
        onClose={() => setIsOpenScrapeConfirmModal(false)}
        onConfirm={() => onScrapeStatus(processIdToScrape || '')}
      />

      <DeleteConfirmModal
        open={isOpenDeleteConfirmModal}
        onOpenChange={() => setIsOpenDeleteConfirmModal(false)}
        onConfirm={handleDeleteProcess}
      />
    </div>
  );
};

export default PatentsTable;
