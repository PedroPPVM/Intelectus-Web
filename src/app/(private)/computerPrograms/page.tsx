'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Plus } from 'lucide-react';
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
} from '@/services/Processes/processes';
import { useMutation, useQuery } from '@tanstack/react-query';

const ComputerPrograms = () => {
  const companyByLocalStorage = getSelectedCompany();
  const [isOpenProcessModal, setIsOpenProcessModal] = useState(false);
  const [manageProcessMode, setManageProcessMode] = useState<'create' | 'edit'>(
    'create',
  );
  const [selectedProcess, setSelectedProcess] = useState<
    Process.Entity | undefined
  >(undefined);

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

  const {
    mutateAsync: onCreateComputerPrograms,
    isPending: isCreatingProcess,
  } = useMutation({
    mutationKey: ['create-computer-program'],
    mutationFn: async (process: ProcessProps) =>
      createProcess({
        companyId: companyByLocalStorage?.id || '',
        process: {
          ...process,
          company_id: companyByLocalStorage?.id || '',
          process_type: 'SOFTWARE',
        },
      }),
    onSuccess: () => {
      onRefetchComputerPrograms();
    },
  });

  const { mutateAsync: onUpdateComputerProgram, isPending: isUpdatingProcess } =
    useMutation({
      mutationKey: ['update-computer-program'],
      mutationFn: async (process: ProcessProps) =>
        updateProcess({
          companyId: companyByLocalStorage?.id || '',
          process: {
            ...process,
            company_id: companyByLocalStorage?.id || '',
            process_type: 'SOFTWARE',
          },
          processId: process.id,
        }),
      onSuccess: () => {
        onRefetchComputerPrograms();
      },
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

        <div className="flex flex-wrap items-center gap-4">
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
      </CardHeader>

      <CardContent>
        <div className="hidden md:block">
          <ComputerProgramsTable
            computerPrograms={computerPrograms}
            onOpenComputerProgramModal={handleOpenProcessModal}
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

export default ComputerPrograms;
