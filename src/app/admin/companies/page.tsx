'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
  createCompany,
  getCompanies,
  updateCompany,
} from '@/services/Companies';
import { toast } from 'sonner';
import CompaniesTable from './components/companies-table';
import {
  ManageCompanyModal,
  CompanyFormData,
} from './components/manage-company-modal';
import { useTableState } from '@/hooks/useTableState';
import { TablePagination } from '@/components/table-pagination';

const AdminCompanies = () => {
  const [manageCompanyMode, setManageCompanyMode] = useState<'create' | 'edit'>(
    'create',
  );
  const [isOpenCompanyModal, setIsOpenCompanyModal] = useState<boolean>(false);
  const [selectedCompany, setSelectedCompany] = useState<
    Company.Entity | undefined
  >(undefined);

  const {
    data: companiesResult,
    isFetching: isLoadingCompanies,
    refetch: onRefetchCompanies,
  } = useQuery({
    queryKey: ['get-companies'],
    queryFn: async () => await getCompanies(),
  });

  const companies = useMemo(() => {
    if (!companiesResult) return [];

    return companiesResult.data;
  }, [companiesResult]);

  const {
    processedData,
    sorting,
    pagination,
    handleSort,
    handlePageChange,
    handleItemsPerPageChange,
  } = useTableState({
    data: companies,
    initialItemsPerPage: 25,
  });

  const { mutateAsync: onCreateCompany, isPending: isCreatingCompany } =
    useMutation({
      mutationKey: ['create-company'],
      mutationFn: async (company: CompanyFormData) =>
        createCompany({
          name: company.name,
          document: company.document,
          email: company.email,
          phone: company.phone,
          address: company.address,
          city: company.city,
          state: company.state,
          zip_code: company.zip_code,
          country: company.country,
          user_ids: company.user_ids || [],
        }),
      onSuccess: () => {
        onRefetchCompanies();
        setIsOpenCompanyModal(false);
        toast.success('Empresa criada com sucesso!');
      },
      onError: (errorMessage: string) => toast.error(errorMessage),
    });

  const { mutateAsync: onUpdateCompany, isPending: isUpdatingCompany } =
    useMutation({
      mutationKey: ['update-company'],
      mutationFn: async (company: CompanyFormData) =>
        updateCompany({
          companyId: company.id || '',
          body: {
            name: company.name,
            document: company.document,
            email: company.email,
            phone: company.phone,
            address: company.address,
            city: company.city,
            state: company.state,
            zip_code: company.zip_code,
            country: company.country,
            user_ids: company.user_ids || [],
          },
        }),
      onSuccess: () => {
        onRefetchCompanies();
        setIsOpenCompanyModal(false);
        toast.success('Empresa atualizada com sucesso!');
      },
      onError: (errorMessage: string) => toast.error(errorMessage),
    });

  const handleOpenCompanyModal = (company: Company.Entity) => {
    setManageCompanyMode('edit');
    setIsOpenCompanyModal(true);
    setSelectedCompany(company);
  };

  const onSaveItem = useCallback(
    async (company: CompanyFormData) => {
      if (manageCompanyMode === 'create') await onCreateCompany(company);
      else await onUpdateCompany(company);
    },
    [manageCompanyMode, onCreateCompany, onUpdateCompany],
  );

  return (
    <Card className="flex size-full flex-col">
      <CardHeader className="flex flex-wrap items-center justify-between">
        <span className="text-2xl font-bold">Empresas</span>

        <div className="flex flex-wrap items-center gap-4">
          <Button
            onClick={() => {
              setManageCompanyMode('create');
              setSelectedCompany(undefined);
              setIsOpenCompanyModal(true);
            }}
          >
            <Plus /> Criar Empresa
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <div className="hidden md:block">
          <CompaniesTable
            companies={processedData.data}
            onOpenCompanyModal={handleOpenCompanyModal}
            onRefetchCompanies={onRefetchCompanies}
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

      <ManageCompanyModal
        open={isOpenCompanyModal}
        onOpenChange={() => setIsOpenCompanyModal(false)}
        onSave={onSaveItem}
        mode={manageCompanyMode}
        initialData={selectedCompany}
        isLoading={isCreatingCompany || isUpdatingCompany}
      />
    </Card>
  );
};

export default AdminCompanies;

