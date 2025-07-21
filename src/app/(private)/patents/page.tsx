'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Plus } from 'lucide-react';
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
} from '@/services/Processes/processes';

const Patents = () => {
  const companyByLocalStorage = getSelectedCompany();
  const [isOpenProcessModal, setIsOpenProcessModal] = useState(false);
  const [manageProcessMode, setManageProcessMode] = useState<'create' | 'edit'>(
    'create',
  );
  const [selectedProcess, setSelectedProcess] = useState<
    Process.Entity | undefined
  >(undefined);

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

  const { mutateAsync: onCreatePatent, isPending: isCreatingProcess } =
    useMutation({
      mutationKey: ['create-patent'],
      mutationFn: async (process: ProcessProps) =>
        createProcess({
          companyId: companyByLocalStorage?.id || '',
          process: {
            ...process,
            company_id: companyByLocalStorage?.id || '',
            process_type: 'PATENT',
          },
        }),
      onSuccess: () => {
        onRefetchPatents();
      },
    });

  const { mutateAsync: onUpdatePatent, isPending: isUpdatingProcess } =
    useMutation({
      mutationKey: ['update-patent'],
      mutationFn: async (process: ProcessProps) =>
        updateProcess({
          companyId: companyByLocalStorage?.id || '',
          process: {
            ...process,
            company_id: companyByLocalStorage?.id || '',
            process_type: 'PATENT',
          },
          processId: process.id,
        }),
      onSuccess: () => {
        onRefetchPatents();
      },
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

        <div className="flex flex-wrap items-center gap-4">
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
      </CardHeader>

      <CardContent>
        <div className="hidden md:block">
          <PatentsTable
            patents={patents}
            onOpenPatentsModal={handleOpenProcessModal}
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
