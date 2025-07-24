'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import IndustrialDesignsTable from './components/industrial-designs-table';
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
} from '@/services/Processes';
import { toast } from 'sonner';

const IndustrialDesigns = () => {
  const companyByLocalStorage = getSelectedCompany();
  const [isOpenProcessModal, setIsOpenProcessModal] = useState(false);
  const [manageProcessMode, setManageProcessMode] = useState<'create' | 'edit'>(
    'create',
  );
  const [selectedProcess, setSelectedProcess] = useState<
    Process.Entity | undefined
  >(undefined);

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

        <div className="flex flex-wrap items-center gap-4">
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
      </CardHeader>

      <CardContent>
        <div className="hidden md:block">
          <IndustrialDesignsTable
            industrialDesigns={industrialDesigns}
            onOpenIndustrialDesignsModal={handleOpenProcessModal}
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

export default IndustrialDesigns;
