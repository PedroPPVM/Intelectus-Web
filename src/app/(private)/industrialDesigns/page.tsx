'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Plus, RefreshCw, SearchIcon } from 'lucide-react';
import IndustrialDesignsTable from './components/industrial-designs-table';
import {
  ManageProcessModal,
  ProcessProps,
} from '@/components/manage-process-modal';
import { useCallback, useMemo, useState } from 'react';
import { getSelectedCompany } from '@/utils/get-company-by-local-storage';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createProcess,
  getProcesses,
  updateProcess,
  updateProcessesFromMagazines,
} from '@/services/Processes';
import { toast } from 'sonner';
import { useTableState } from '@/hooks/useTableState';
import { TablePagination } from '@/components/table-pagination';

const IndustrialDesigns = () => {
  const queryClient = useQueryClient();
  const companyByLocalStorage = getSelectedCompany();
  const [isOpenProcessModal, setIsOpenProcessModal] = useState(false);
  const [manageProcessMode, setManageProcessMode] = useState<'create' | 'edit'>(
    'create',
  );
  const [selectedProcess, setSelectedProcess] = useState<
    Process.Entity | undefined
  >(undefined);

  const [search, setSearch] = useState<string>('');

  const {
    data: industrialDesignsResult,
    isFetching: isLoadingIndustrialDesigns,
    refetch: onRefetchIndustrialDesigns,
  } = useQuery({
    queryKey: ['get-industrial-designs'],
    queryFn: async () =>
      await getProcesses({
        companyId: companyByLocalStorage?.id || '',
        processType: 'DESIGN',
      }),
  });

  const industrialDesigns = useMemo(() => {
    if (!industrialDesignsResult) return [];

    return industrialDesignsResult.data;
  }, [industrialDesignsResult]);

  const filteredIndustrialDesigns = useMemo(() => {
    return industrialDesigns.filter((industrialDesign) =>
      industrialDesign.process_number
        .toLowerCase()
        .includes(search.toLowerCase()),
    );
  }, [industrialDesigns, search]);

  const {
    processedData,
    sorting,
    pagination,
    handleSort,
    handlePageChange,
    handleItemsPerPageChange,
  } = useTableState({
    data: filteredIndustrialDesigns,
    initialItemsPerPage: 25,
  });

  const {
    mutateAsync: onCreateIndustrialDesigns,
    isPending: isCreatingProcess,
  } = useMutation({
    mutationKey: ['create-industrial-designs'],
    mutationFn: async (process: ProcessProps) =>
      createProcess({
        companyId: companyByLocalStorage?.id || '',
        body: {
          ...process,
          company_id: companyByLocalStorage?.id || '',
          process_type: 'DESIGN',
        },
      }),
    onSuccess: () => {
      onRefetchIndustrialDesigns();
      queryClient.invalidateQueries({ queryKey: ['alerts', 'unread-count'] });
    },
    onError: (errorMessage: string) => toast.error(errorMessage),
  });

  const {
    mutateAsync: onUpdateIndustrialDesign,
    isPending: isUpdatingProcess,
  } = useMutation({
    mutationKey: ['update-industrial-designs'],
    mutationFn: async (process: ProcessProps) =>
      updateProcess({
        companyId: companyByLocalStorage?.id || '',
        body: {
          ...process,
          company_id: companyByLocalStorage?.id || '',
          process_type: 'DESIGN',
        },
        processId: process.id || '',
      }),
    onSuccess: () => {
      onRefetchIndustrialDesigns();
      queryClient.invalidateQueries({ queryKey: ['alerts', 'unread-count'] });
    },
    onError: (errorMessage: string) => toast.error(errorMessage),
  });

  const {
    mutateAsync: onUpdateFromMagazines,
    isPending: isUpdatingFromMagazines,
  } = useMutation({
    mutationKey: ['update-industrial-designs-from-magazines'],
    mutationFn: async () =>
      updateProcessesFromMagazines({
        companyId: companyByLocalStorage?.id || '',
        processType: 'DESIGN',
      }),
    onSuccess: (response) => {
      onRefetchIndustrialDesigns();
      queryClient.invalidateQueries({ queryKey: ['alerts', 'unread-count'] });
      toast.success(
        `Atualização concluída! ${response.data.updated_processes} de ${response.data.total_processes} processos atualizados.`,
      );
    },
    onError: (errorMessage: string) => toast.error(errorMessage),
  });

  const handleOpenProcessModal = (process: Process.Entity) => {
    setManageProcessMode('edit');
    setIsOpenProcessModal(true);
    setSelectedProcess(process);
  };

  const onSaveItem = useCallback(
    async (process: ProcessProps) => {
      if (manageProcessMode === 'create')
        await onCreateIndustrialDesigns(process);
      else await onUpdateIndustrialDesign(process);

      setIsOpenProcessModal(false);
    },
    [manageProcessMode],
  );

  return (
    <Card className="flex size-full flex-col">
      <CardHeader className="flex flex-wrap items-center justify-between">
        <span className="text-2xl font-bold">Desenhos Industriais</span>

        <div className="flex gap-4">
          <div className="border-input bg-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-9 w-full max-w-sm min-w-[310px] gap-2 rounded-md border px-3 py-2 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-1 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50">
            <SearchIcon className="size-4" />
            <input
              type="text"
              className="w-full border-none outline-none"
              placeholder="Buscar desenho pelo número do processo"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-4">
            <Button
              onClick={() => onUpdateFromMagazines()}
              disabled={isUpdatingFromMagazines}
            >
              <RefreshCw
                className={isUpdatingFromMagazines ? 'animate-spin' : ''}
              />
              {isUpdatingFromMagazines ? 'Atualizando...' : 'Atualizar Todos'}
            </Button>

            <Button
              onClick={() => {
                setManageProcessMode('create');
                setIsOpenProcessModal(true);
                setSelectedProcess(undefined);
              }}
            >
              <Plus /> Criar Desenho Industrial
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="hidden md:block">
          <IndustrialDesignsTable
            industrialDesigns={processedData.data}
            onOpenIndustrialDesignsModal={handleOpenProcessModal}
            sorting={sorting}
            onSort={handleSort}
          />
          <TablePagination
            currentPage={pagination.currentPage}
            totalPages={processedData.totalPages}
            itemsPerPage={pagination.itemsPerPage}
            totalItems={processedData.totalItems}
            onPageChange={handlePageChange}
            onItemsPerPageChange={handleItemsPerPageChange}
          />
        </div>
      </CardContent>

      <ManageProcessModal
        open={isOpenProcessModal}
        onOpenChange={() => setIsOpenProcessModal(false)}
        onSave={onSaveItem}
        mode={manageProcessMode}
        initialData={
          selectedProcess
            ? {
                ...selectedProcess,
                id: selectedProcess.id,
                process_number: selectedProcess.process_number,
                title: selectedProcess.title,
              }
            : undefined
        }
        isLoading={isCreatingProcess || isUpdatingProcess}
      />
    </Card>
  );
};

export default IndustrialDesigns;
