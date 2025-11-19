'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Plus, RefreshCw, SearchIcon } from 'lucide-react';
import ComputerProgramsTable from './components/computer-programs-table';
import {
  ManageProcessModal,
  ProcessProps,
} from '@/components/manage-process-modal';
import { useCallback, useMemo, useState } from 'react';
import { getSelectedCompany } from '@/utils/get-company-by-local-storage';
import {
  createProcess,
  getProcesses,
  updateProcess,
  updateProcessesFromMagazines,
} from '@/services/Processes';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useTableState } from '@/hooks/useTableState';
import { TablePagination } from '@/components/table-pagination';

const ComputerPrograms = () => {
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
    data: computerProgramsResult,
    isFetching: isLoadingComputerPrograms,
    refetch: onRefetchComputerPrograms,
  } = useQuery({
    queryKey: ['get-computer-programs'],
    queryFn: async () =>
      await getProcesses({
        companyId: companyByLocalStorage?.id || '',
        processType: 'SOFTWARE',
      }),
  });

  const computerPrograms = useMemo(() => {
    if (!computerProgramsResult) return [];

    return computerProgramsResult.data;
  }, [computerProgramsResult]);

  const filteredComputerPrograms = useMemo(() => {
    return computerPrograms.filter((computerProgram) =>
      computerProgram.process_number
        .toLowerCase()
        .includes(search.toLowerCase()),
    );
  }, [computerPrograms, search]);

  const {
    processedData,
    sorting,
    pagination,
    handleSort,
    handlePageChange,
    handleItemsPerPageChange,
  } = useTableState({
    data: filteredComputerPrograms,
    initialItemsPerPage: 25,
  });

  const {
    mutateAsync: onCreateComputerPrograms,
    isPending: isCreatingProcess,
  } = useMutation({
    mutationKey: ['create-computer-program'],
    mutationFn: async (process: ProcessProps) =>
      createProcess({
        companyId: companyByLocalStorage?.id || '',
        body: {
          ...process,
          company_id: companyByLocalStorage?.id || '',
          process_type: 'SOFTWARE',
        },
      }),
    onSuccess: () => {
      onRefetchComputerPrograms();
      queryClient.invalidateQueries({ queryKey: ['alerts', 'unread-count'] });
    },
    onError: (errorMessage: string) => toast.error(errorMessage),
  });

  const { mutateAsync: onUpdateComputerProgram, isPending: isUpdatingProcess } =
    useMutation({
      mutationKey: ['update-computer-program'],
      mutationFn: async (process: ProcessProps) =>
        updateProcess({
          companyId: companyByLocalStorage?.id || '',
          body: {
            ...process,
            company_id: companyByLocalStorage?.id || '',
            process_type: 'SOFTWARE',
          },
          processId: process.id || '',
        }),
      onSuccess: () => {
        onRefetchComputerPrograms();
        queryClient.invalidateQueries({ queryKey: ['alerts', 'unread-count'] });
      },
      onError: (errorMessage: string) => toast.error(errorMessage),
    });

  const {
    mutateAsync: onUpdateFromMagazines,
    isPending: isUpdatingFromMagazines,
  } = useMutation({
    mutationKey: ['update-computer-programs-from-magazines'],
    mutationFn: async () =>
      await updateProcessesFromMagazines({
        companyId: companyByLocalStorage?.id || '',
        processType: 'SOFTWARE',
      }),
    onSuccess: (response) => {
      onRefetchComputerPrograms();
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
        await onCreateComputerPrograms(process);
      else await onUpdateComputerProgram(process);

      setIsOpenProcessModal(false);
    },
    [manageProcessMode],
  );

  return (
    <Card className="flex size-full flex-col">
      <CardHeader className="flex flex-wrap items-center justify-between">
        <span className="text-2xl font-bold">Programas de Computador</span>

        <div className="flex gap-4">
          <div className="border-input bg-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-9 w-full max-w-sm min-w-[320px] gap-2 rounded-md border px-3 py-2 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-1 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50">
            <SearchIcon className="size-4" />
            <input
              type="text"
              className="w-full border-none outline-none"
              placeholder="Buscar programa pelo número do processo"
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
              <Plus /> Criar Programa de Computador
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="hidden md:block">
          <ComputerProgramsTable
            computerPrograms={processedData.data}
            onOpenComputerProgramModal={handleOpenProcessModal}
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

export default ComputerPrograms;
