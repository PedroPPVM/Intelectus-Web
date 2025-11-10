'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Plus, RefreshCw, SearchIcon } from 'lucide-react';
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
  updateProcessesFromMagazines,
} from '@/services/Processes';
import { getSelectedCompany } from '@/utils/get-company-by-local-storage';
import { toast } from 'sonner';
import { useTableState } from '@/hooks/useTableState';
import { TablePagination } from '@/components/table-pagination';

const Brands = () => {
  const companyByLocalStorage = getSelectedCompany();
  const [manageBrandMode, setManageBrandMode] = useState<'create' | 'edit'>(
    'create',
  );
  const [isOpenBrandModal, setIsOpenBrandModal] = useState<boolean>(false);
  const [selectedBrand, setSelectedBrand] = useState<
    Process.Entity | undefined
  >(undefined);

  const [search, setSearch] = useState<string>('');

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

  const filteredBrands = useMemo(() => {
    return brands.filter((brand) => brand.process_number.toLowerCase().includes(search.toLowerCase()));
  }, [brands, search]);

  const {
    processedData,
    sorting,
    pagination,
    handleSort,
    handlePageChange,
    handleItemsPerPageChange,
  } = useTableState({
    data: filteredBrands,
    initialItemsPerPage: 25,
  });

  const { mutateAsync: onCreateBrand, isPending: isCreatingProcess } =
    useMutation({
      mutationKey: ['create-brand'],
      mutationFn: async (process: ProcessProps) =>
        createProcess({
          companyId: companyByLocalStorage?.id || '',
          body: {
            ...process,
            company_id: companyByLocalStorage?.id || '',
            process_type: 'BRAND',
          },
        }),
      onSuccess: () => {
        onRefetchBrands();
        setIsOpenBrandModal(false);
      },
      onError: (errorMessage: string) => toast.error(errorMessage),
    });

  const { mutateAsync: onUpdateBrand, isPending: isUpdatingProcess } =
    useMutation({
      mutationKey: ['update-brand'],
      mutationFn: async (process: ProcessProps) =>
        updateProcess({
          companyId: companyByLocalStorage?.id || '',
          body: {
            ...process,
            company_id: companyByLocalStorage?.id || '',
            process_type: 'BRAND',
          },
          processId: process.id || '',
        }),
      onSuccess: () => {
        onRefetchBrands();
        setIsOpenBrandModal(false);
      },
      onError: (errorMessage: string) => toast.error(errorMessage),
    });

  const { mutateAsync: onUpdateFromMagazines, isPending: isUpdatingFromMagazines } =
    useMutation({
      mutationKey: ['update-brands-from-magazines'],
      mutationFn: async () =>
        updateProcessesFromMagazines({
          companyId: companyByLocalStorage?.id || '',
          processType: 'BRAND',
        }),
      onSuccess: (response) => {
        onRefetchBrands();
        toast.success(
          `Atualização concluída! ${response.data.updated_processes} de ${response.data.total_processes} processos atualizados.`,
        );
      },
      onError: (errorMessage: string) => toast.error(errorMessage),
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
    },
    [manageBrandMode],
  );

  return (
    <Card className="flex size-full flex-col">
      <CardHeader className="flex flex-wrap items-center justify-between">
        <span className="text-2xl font-bold">Marcas</span>

        <div className="flex gap-4">
          <div 
            className="flex gap-2 w-full min-w-[300px] h-9 max-w-sm rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          >
            <SearchIcon className="size-4" />
            <input
              type="text"
              className='w-full border-none outline-none'
              placeholder="Buscar marca pelo número do processo"
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
                setManageBrandMode('create');
                setSelectedBrand(undefined);
                setIsOpenBrandModal(true);
              }}
            >
              <Plus /> Criar Marca
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="hidden md:block">
          <BrandsTable
            brands={processedData.data}
            onOpenBrandModal={handleOpenBrandModal}
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
