'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import BrandsTable from './components/brands-table';
import { useCallback, useMemo, useState } from 'react';
import {
  ManageProcessModal,
  ProcessProps,
} from '@/components/manage-process-modal';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
  createProcess,
  getProcesses,
  updateProcess,
} from '@/services/Processes/processes';
import { getSelectedCompany } from '@/utils/get-company-by-local-storage';

const Brands = () => {
  const companyByLocalStorage = getSelectedCompany();
  const [manageBrandMode, setManageBrandMode] = useState<'create' | 'edit'>(
    'create',
  );
  const [isOpenBrandModal, setIsOpenBrandModal] = useState<boolean>(false);
  const [selectedBrand, setSelectedBrand] = useState<
    Process.Entity | undefined
  >(undefined);

  const {
    data: brandsResult,
    isFetching: isLoadingBrands,
    refetch: onRefetchBrands,
  } = useQuery({
    queryKey: ['get-brands'],
    queryFn: async () =>
      await getProcesses({
        companyId: companyByLocalStorage?.id || '',
        processType: 'BRAND',
      }),
  });

  const brands = useMemo(() => {
    if (!brandsResult) return [];

    return brandsResult.data;
  }, [brandsResult]);

  const { mutateAsync: onCreateBrand, isPending: isCreatingProcess } =
    useMutation({
      mutationKey: ['create-brand'],
      mutationFn: async (process: ProcessProps) =>
        createProcess({
          companyId: companyByLocalStorage?.id || '',
          process: {
            ...process,
            company_id: companyByLocalStorage?.id || '',
            process_type: 'BRAND',
          },
        }),
      onSuccess: () => {
        onRefetchBrands();
      },
    });

  const { mutateAsync: onUpdateBrand, isPending: isUpdatingProcess } =
    useMutation({
      mutationKey: ['update-brand'],
      mutationFn: async (process: ProcessProps) =>
        updateProcess({
          companyId: companyByLocalStorage?.id || '',
          process: {
            ...process,
            company_id: companyByLocalStorage?.id || '',
            process_type: 'BRAND',
          },
          processId: process.id,
        }),
      onSuccess: () => {
        onRefetchBrands();
      },
    });

  const handleOpenBrandModal = (brand: Process.Entity) => {
    setManageBrandMode('edit');
    setIsOpenBrandModal(true);
    setSelectedBrand(brand);
  };

  const onSaveItem = useCallback(
    async (process: ProcessProps) => {
      if (manageBrandMode === 'create') await onCreateBrand(process);
      else await onUpdateBrand(process);

      setIsOpenBrandModal(false);
    },
    [manageBrandMode],
  );

  return (
    <Card className="flex size-full flex-col">
      <CardHeader className="flex flex-wrap items-center justify-between">
        <span className="text-2xl font-bold">Marcas</span>

        <div className="flex flex-wrap items-center gap-4">
          <Button
            onClick={() => {
              setManageBrandMode('create');
              setSelectedBrand(undefined);
              setIsOpenBrandModal(true);
            }}
          >
            <Plus /> Criar Marca
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <div className="hidden md:block">
          <BrandsTable
            brands={brands}
            onOpenBrandModal={handleOpenBrandModal}
          />
        </div>
      </CardContent>

      <ManageProcessModal
        open={isOpenBrandModal}
        onOpenChange={() => setIsOpenBrandModal(false)}
        onSave={onSaveItem}
        mode={manageBrandMode}
        initialData={
          selectedBrand
            ? {
                ...selectedBrand,
                id: selectedBrand.id,
                process_number: selectedBrand.process_number,
                title: selectedBrand.title,
              }
            : undefined
        }
      />
    </Card>
  );
};

export default Brands;
