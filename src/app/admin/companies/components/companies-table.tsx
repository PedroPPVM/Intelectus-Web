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
import { MoreHorizontal, Users } from 'lucide-react';
import dayjs from 'dayjs';
import { DeleteConfirmModal } from '@/components/delete-confirm-modal';
import { useCallback, useMemo, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { deleteCompany } from '@/services/Companies';
import { toast } from 'sonner';
import { useSidebar } from '@/components/ui/sidebar';
import { LinkUsersModal } from './link-users-modal';
import { SortableTableHeader } from '@/components/sortable-table-header';

interface CompaniesTableProps {
  companies: Company.Entity[];
  onOpenCompanyModal: (company: Company.Entity) => void;
  onRefetchCompanies: () => void;
  sorting: {
    column: keyof Company.Entity | null;
    direction: 'asc' | 'desc' | null;
  };
  onSort: (column: keyof Company.Entity) => void;
}

const CompaniesTable = ({
  companies,
  onOpenCompanyModal,
  onRefetchCompanies,
  sorting,
  onSort,
}: CompaniesTableProps) => {
  const { open } = useSidebar();

  const maxTableWidth = useMemo(() => {
    return open ? 'max-w-[calc(100vw-354px)]' : 'max-w-full';
  }, [open]);

  const [isOpenDeleteConfirmModal, setIsOpenDeleteConfirmModal] =
    useState<boolean>(false);
  const [companyIdToDelete, setCompanyIdToDelete] = useState<string | null>(
    null,
  );

  const [isOpenLinkUsersModal, setIsOpenLinkUsersModal] =
    useState<boolean>(false);
  const [selectedCompanyForLink, setSelectedCompanyForLink] = useState<
    Company.Entity | null
  >(null);

  const { mutateAsync: onDeleteCompany, isPending: isDeletingCompany } =
    useMutation({
      mutationKey: ['delete-company'],
      mutationFn: async (companyId: string) =>
        deleteCompany({
          companyId: companyId,
        }),
      onSuccess: () => {
        setCompanyIdToDelete(null);
        setIsOpenDeleteConfirmModal(false);
        onRefetchCompanies();
        toast.success('Empresa excluída com sucesso!');
      },
      onError: (errorMessage: string) => toast.error(errorMessage),
    });

  const actionsOptions = (company: Company.Entity) => {
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
            onClick={() => onOpenCompanyModal(company)}
            className="cursor-pointer"
          >
            Editar
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              setSelectedCompanyForLink(company);
              setIsOpenLinkUsersModal(true);
            }}
            className="cursor-pointer"
          >
            <Users className="mr-2 h-4 w-4" />
            Vincular Usuários
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              setIsOpenDeleteConfirmModal(true);
              setCompanyIdToDelete(company.id || '');
            }}
            className="cursor-pointer text-red-600"
          >
            Excluir
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  const handleDeleteCompany = useCallback(() => {
    if (companyIdToDelete) onDeleteCompany(companyIdToDelete);
  }, [companyIdToDelete, onDeleteCompany]);

  return (
    <>
      <div
        className={`flex max-h-[calc(100vh-284px)] overflow-auto rounded-lg border ${maxTableWidth}`}
      >
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <SortableTableHeader
                column="name"
                label="Nome"
                sorting={sorting}
                onSort={onSort}
              />
              <SortableTableHeader
                column="document"
                label="CNPJ/CPF"
                sorting={sorting}
                onSort={onSort}
              />
              <SortableTableHeader
                column="email"
                label="Email"
                sorting={sorting}
                onSort={onSort}
              />
              <TableHead className="border-r font-semibold">Telefone</TableHead>
              <SortableTableHeader
                column="city"
                label="Cidade"
                sorting={sorting}
                onSort={onSort}
              />
              <SortableTableHeader
                column="state"
                label="Estado"
                sorting={sorting}
                onSort={onSort}
              />
              <TableHead className="border-r font-semibold">Usuários Vinculados</TableHead>
              <SortableTableHeader
                column="created_at"
                label="Data de Criação"
                sorting={sorting}
                onSort={onSort}
              />
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {companies.map((company) => (
              <TableRow key={company.id} className="hover:bg-muted/30">
                <TableCell className="border-r font-medium py-4">{company.name}</TableCell>
                <TableCell className="border-r py-4">{company.document}</TableCell>
                <TableCell className="border-r py-4">{company.email}</TableCell>
                <TableCell className="border-r py-4">{company.phone}</TableCell>
                <TableCell className="border-r py-4">{company.city}</TableCell>
                <TableCell className="border-r py-4">{company.state}</TableCell>
                <TableCell className="border-r py-4 text-center font-medium">{company.user_ids?.length || 0}</TableCell>
                <TableCell className="border-r py-4">
                  {dayjs(company.created_at).format('DD/MM/YYYY')}
                </TableCell>
                <TableCell className="w-[50px] py-4">
                  {actionsOptions(company)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <DeleteConfirmModal
        open={isOpenDeleteConfirmModal}
        onOpenChange={() => setIsOpenDeleteConfirmModal(false)}
        onConfirm={handleDeleteCompany}
      />

      {selectedCompanyForLink && (
        <LinkUsersModal
          open={isOpenLinkUsersModal}
          onOpenChange={() => {
            setIsOpenLinkUsersModal(false);
            setSelectedCompanyForLink(null);
          }}
          company={selectedCompanyForLink}
          onSuccess={onRefetchCompanies}
        />
      )}
    </>
  );
};

export default CompaniesTable;

