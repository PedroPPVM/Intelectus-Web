'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Plus, RefreshCw, SearchIcon } from 'lucide-react';
import PatentsTable from './components/patents-table';
import {
  ManageProcessModal,
  ProcessProps,
} from '@/components/manage-process-modal';
import { useCallback, useMemo, useState } from 'react';
import { getSelectedCompany } from '@/utils/get-company-by-local-storage';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
  createProcess,
  getProcesses,
  updateProcess,
  updateProcessesFromMagazines,
} from '@/services/Processes';
import { toast } from 'sonner';
import { useTableState } from '@/hooks/useTableState';
import { TablePagination } from '@/components/table-pagination';

const Patents = () => {
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
    data: patentsResult,
    isFetching: isLoadingPatents,
    refetch: onRefetchPatents,
  } = useQuery({
    queryKey: ['get-patents'],
    queryFn: async () =>
      await getProcesses({
        companyId: companyByLocalStorage?.id || '',
        processType: 'PATENT',
      }),
  });

  const patents = useMemo(() => {
    if (!patentsResult) return [];

    return patentsResult.data;
  }, [patentsResult]);

  const filteredPatents = useMemo(() => {
    return patents.filter((patent) => patent.process_number.toLowerCase().includes(search.toLowerCase()));
  }, [patents, search]);

  const {
    processedData,
    sorting,
    pagination,
    handleSort,
    handlePageChange,
    handleItemsPerPageChange,
  } = useTableState({
    data: filteredPatents,
    initialItemsPerPage: 25,
  });

  const { mutateAsync: onCreatePatent, isPending: isCreatingProcess } =
    useMutation({
      mutationKey: ['create-patent'],
      mutationFn: async (process: ProcessProps) =>
        createProcess({
          companyId: companyByLocalStorage?.id || '',
          body: {
            ...process,
            company_id: companyByLocalStorage?.id || '',
            process_type: 'PATENT',
          },
        }),
      onSuccess: () => {
        onRefetchPatents();
      },
      onError: (errorMessage: string) => toast.error(errorMessage),
    });

  const { mutateAsync: onUpdatePatent, isPending: isUpdatingProcess } =
    useMutation({
      mutationKey: ['update-patent'],
      mutationFn: async (process: ProcessProps) =>
        updateProcess({
          companyId: companyByLocalStorage?.id || '',
          body: {
            ...process,
            company_id: companyByLocalStorage?.id || '',
            process_type: 'PATENT',
          },
          processId: process.id || '',
        }),
      onSuccess: () => {
        onRefetchPatents();
      },
      onError: (errorMessage: string) => toast.error(errorMessage),
    });

  const { mutateAsync: onUpdateFromMagazines, isPending: isUpdatingFromMagazines } =
    useMutation({
      mutationKey: ['update-patents-from-magazines'],
      mutationFn: async () =>
        updateProcessesFromMagazines({
          companyId: companyByLocalStorage?.id || '',
          processType: 'PATENT',
        }),
      onSuccess: (response) => {
        onRefetchPatents();
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
      if (manageProcessMode === 'create') await onCreatePatent(process);
      else await onUpdatePatent(process);

      setIsOpenProcessModal(false);
    },
    [manageProcessMode],
  );

  return (
    <Card className="flex size-full flex-col">
      <CardHeader className="flex flex-wrap items-center justify-between">
        <span className="text-2xl font-bold">Patentes</span>

        <div className="flex gap-4">
          <div 
            className="flex gap-2 w-full min-w-[310px] h-9 max-w-sm rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          >
            <SearchIcon className="size-4" />
            <input
              type="text"
              className='w-full border-none outline-none'
              placeholder="Buscar patente pelo número do processo"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-4">
            <Button
              onClick={() => onUpdateFromMagazines()}
              disabled={isUpdatingFromMagazines}
            >
              <RefreshCw className={isUpdatingFromMagazines ? 'animate-spin' : ''} />
              {isUpdatingFromMagazines ? 'Atualizando...' : 'Atualizar Todas'}
            </Button>
            <Button
              onClick={() => {
                setManageProcessMode('create');
                setIsOpenProcessModal(true);
                setSelectedProcess(undefined);
              }}
            >
              <Plus /> Criar Patente
            </Button>
          </div>
        </div>
        
      </CardHeader>

      <CardContent>
        <div className="hidden md:block">
          <PatentsTable
            patents={processedData.data}
            onOpenPatentsModal={handleOpenProcessModal}
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
      />
    </Card>
  );
};

export default Patents;
