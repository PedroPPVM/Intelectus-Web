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
import { useCallback, useMemo, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteProcess, scrapeStatusByProcess } from '@/services/Processes';
import { getSelectedCompany } from '@/utils/get-company-by-local-storage';
import { toast } from 'sonner';
import { useSidebar } from '@/components/ui/sidebar';
import { SortableTableHeader } from '@/components/sortable-table-header';

interface BrandsTableProps {
  brands: Process.Entity[];
  onOpenBrandModal: (brand: Process.Entity) => void;
  sorting: {
    column: keyof Process.Entity | null;
    direction: 'asc' | 'desc' | null;
  };
  onSort: (column: keyof Process.Entity) => void;
}

const BrandsTable = ({
  brands,
  onOpenBrandModal,
  sorting,
  onSort,
}: BrandsTableProps) => {
  const { open } = useSidebar();

  const maxTableWidth = useMemo(() => {
    return open ? 'max-w-[calc(100vw-354px)]' : 'max-w-full';
  }, [open]);

  const companyByLocalStorage = getSelectedCompany();
  const queryClient = useQueryClient();

  const [isOpenDeleteConfirmModal, setIsOpenDeleteConfirmModal] =
    useState<boolean>(false);
  const [processIdToDelete, setProcessIdToDelete] = useState<string | null>(
    null,
  );

  const { mutateAsync: onScrapeStatus } = useMutation({
    mutationKey: ['scrape-status-by-process'],
    mutationFn: async (processId: string) =>
      scrapeStatusByProcess({
        processId: processId,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['get-brands'] });
      queryClient.invalidateQueries({ queryKey: ['alerts', 'unread-count'] });
    },
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

        queryClient.invalidateQueries({ queryKey: ['get-brands'] });
        queryClient.invalidateQueries({ queryKey: ['alerts', 'unread-count'] });
      },
      onError: (errorMessage: string) => toast.error(errorMessage),
    });

  const handleScrapeStatus = async (processId: string) => {
    toast.promise(onScrapeStatus(processId), {
      loading: 'Atualizando processo...',
      success: (response) => {
        const data = response.data;
        if (data.response === 'Nenhuma atualização necessária.') {
          return data.response;
        } else if (data.response === 'Processo não encontrado na revista.') {
          throw new Error(data.response);
        }
        return data.response;
      },
      error: (err) => err.message || 'Erro ao atualizar processo',
    });
  };

  const actionsOptions = (brand: Process.Entity) => {
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
            onClick={() => onOpenBrandModal(brand)}
            className="cursor-pointer"
          >
            Editar
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => handleScrapeStatus(brand.id || '')}
            className="cursor-pointer"
          >
            Atualizar
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              setIsOpenDeleteConfirmModal(true);
              setProcessIdToDelete(brand.id || '');
            }}
            className="cursor-pointer"
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
            <SortableTableHeader
              column="process_number"
              label="N° do Processo"
              sorting={sorting}
              onSort={onSort}
            />
            <SortableTableHeader
              column="title"
              label="Marca"
              sorting={sorting}
              onSort={onSort}
            />
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
          {brands.length === 0 && (
            <TableRow>
              <TableCell colSpan={9} className="py-4 text-center">
                Nenhuma marca encontrada
              </TableCell>
            </TableRow>
          )}

          {brands.map((brand) => (
            <TableRow key={brand.id} className="hover:bg-muted/30">
              <TableCell className="border-r py-4 font-medium">
                {brand.process_number}
              </TableCell>
              <TableCell className="border-r py-4">{brand.title}</TableCell>
              <TableCell className="border-r py-4">{brand.status}</TableCell>
              <TableCell className="border-r py-4">{brand.depositor}</TableCell>
              <TableCell className="border-r py-4">
                {brand.cnpj_depositor || brand.cpf_depositor}
              </TableCell>
              <TableCell className="border-r py-4">{brand.attorney}</TableCell>
              <TableCell className="border-r py-4">
                {dayjs(brand.deposit_date).format('DD/MM/YYYY')}
              </TableCell>
              <TableCell className="border-r py-4">
                {dayjs(brand.concession_date).format('DD/MM/YYYY')}
              </TableCell>
              <TableCell className="border-r py-4">
                {dayjs(brand.validity_date).format('DD/MM/YYYY')}
              </TableCell>
              <TableCell className="w-[50px] py-4">
                {actionsOptions(brand)}
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

export default BrandsTable;
