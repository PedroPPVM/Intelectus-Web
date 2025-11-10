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
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteProcess, scrapeStatusByProcess } from '@/services/Processes';
import { getSelectedCompany } from '@/utils/get-company-by-local-storage';
import { ScrapeConfirmModal } from '@/components/scrape-confirm-modal';
import { toast } from 'sonner';
import { useSidebar } from '@/components/ui/sidebar';
import { SortableTableHeader } from '@/components/sortable-table-header';

interface IndustrialDesignsTableProps {
  industrialDesigns: Process.Entity[];
  onOpenIndustrialDesignsModal: (industrialDesign: Process.Entity) => void;
  sorting: {
    column: keyof Process.Entity | null;
    direction: 'asc' | 'desc' | null;
  };
  onSort: (column: keyof Process.Entity) => void;
}

const IndustrialDesignsTable = ({
  industrialDesigns,
  onOpenIndustrialDesignsModal,
  sorting,
  onSort,
}: IndustrialDesignsTableProps) => {
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

        queryClient.invalidateQueries({ queryKey: ['get-industrial-designs'] });

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

        queryClient.invalidateQueries({ queryKey: ['get-industrial-designs'] });
      },
      onError: (errorMessage: string) => toast.error(errorMessage),
    });

  const actionsOptions = (industrialDesign: Process.Entity) => {
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
            onClick={() => onOpenIndustrialDesignsModal(industrialDesign)}
          >
            Editar
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => {
              setIsOpenDeleteConfirmModal(true);
              setProcessIdToDelete(industrialDesign.id || '');
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
      className={`flex max-h-[calc(100vh-284px)] overflow-auto rounded-lg border ${maxTableWidth}`}
    >
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50 hover:bg-muted/50">
            <TableHead className="w-[50px] border-r"></TableHead>
            <SortableTableHeader
              column="process_number"
              label="N° do Processo"
              sorting={sorting}
              onSort={onSort}
            />
            <SortableTableHeader
              column="title"
              label="Título"
              sorting={sorting}
              onSort={onSort}
            />
            <TableHead className="border-r font-semibold">Apelido</TableHead>
            <SortableTableHeader
              column="status"
              label="Situação"
              sorting={sorting}
              onSort={onSort}
            />
            <SortableTableHeader
              column="depositor"
              label="Depositante"
              sorting={sorting}
              onSort={onSort}
            />
            <TableHead className="border-r font-semibold">CNPJ/CPF</TableHead>
            <TableHead className="border-r font-semibold">Procurador</TableHead>
            <SortableTableHeader
              column="deposit_date"
              label="Data do Depósito"
              sorting={sorting}
              onSort={onSort}
            />
            <SortableTableHeader
              column="concession_date"
              label="Data da Concessão"
              sorting={sorting}
              onSort={onSort}
            />
            <SortableTableHeader
              column="validity_date"
              label="Vigência"
              sorting={sorting}
              onSort={onSort}
            />
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {industrialDesigns.length === 0 && (
            <TableRow>
              <TableCell colSpan={10} className="text-center py-4">
                Nenhuma desenho industrial encontrado.
              </TableCell>
            </TableRow>
          )}
          
          {industrialDesigns.map((industrialDesign) => (
            <TableRow
              key={industrialDesign.id}
              className="hover:bg-muted/30"
            >
              <TableCell className="border-r py-4">
                <button
                  type="button"
                  className="hover:bg-muted cursor-pointer rounded-full p-2 transition-all"
                  onClick={() => {
                    setProcessIdToScrape(industrialDesign?.id || '');
                    setIsOpenScrapeConfirmModal(true);
                  }}
                >
                  <FileSearch2 />
                </button>
              </TableCell>
              <TableCell className="border-r font-medium py-4">
                {industrialDesign.process_number}
              </TableCell>
              <TableCell className="border-r py-4">{industrialDesign.title}</TableCell>
              <TableCell className="border-r py-4">{industrialDesign.title.slice(0, 3)}</TableCell>
              <TableCell className="border-r py-4">{industrialDesign.status}</TableCell>
              <TableCell className="border-r py-4">{industrialDesign.depositor}</TableCell>
              <TableCell className="border-r py-4">
                {industrialDesign.cnpj_depositor ||
                  industrialDesign.cpf_depositor}
              </TableCell>
              <TableCell className="border-r py-4">{industrialDesign.attorney}</TableCell>
              <TableCell className="border-r py-4">
                {dayjs(industrialDesign.deposit_date).format('DD/MM/YYYY')}
              </TableCell>
              <TableCell className="border-r py-4">
                {dayjs(industrialDesign.concession_date).format('DD/MM/YYYY')}
              </TableCell>
              <TableCell className="border-r py-4">
                {dayjs(industrialDesign.validity_date).format('DD/MM/YYYY')}
              </TableCell>
              <TableCell className="w-[50px] py-4">
                {actionsOptions(industrialDesign)}
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

export default IndustrialDesignsTable;
