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
import { MoreHorizontal } from 'lucide-react';
import { Brand } from '../page';
import dayjs from 'dayjs';
import { DeleteConfirmModal } from '@/components/delete-confirm-modal';
import { useState } from 'react';

interface BrandsTableProps {
  brands: Brand[];
}

const BrandsTable = ({ brands }: BrandsTableProps) => {
  const [isOpenDeleteConfirmModal, setIsOpenDeleteConfirmModal] =
    useState<boolean>(false);

  const actionsOptions = () => {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem className="cursor-pointer">Editar</DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setIsOpenDeleteConfirmModal(true)}
            className="cursor-pointer"
          >
            Excluir
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  return (
    <div className="max-h-full overflow-auto">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead>N° do Processo</TableHead>
            <TableHead>Marca</TableHead>
            <TableHead>Depositante</TableHead>
            <TableHead>CNPJ/CPF</TableHead>
            <TableHead>Procurador</TableHead>
            <TableHead>Data do Depósito</TableHead>
            <TableHead>Data da Concessão</TableHead>
            <TableHead>Vigência</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {brands.map((brand) => (
            <TableRow key={brand.id} className="hover:bg-transparent">
              <TableCell className="font-medium">{brand.process}</TableCell>
              <TableCell>{brand.name}</TableCell>
              <TableCell>{brand.depositor}</TableCell>
              <TableCell>{brand.cnpj || brand.cpf}</TableCell>
              <TableCell>{brand.attorney}</TableCell>
              <TableCell>
                {dayjs(brand.depositDate).format('DD/MM/YYYY')}
              </TableCell>
              <TableCell>
                {dayjs(brand.concessionDate).format('DD/MM/YYYY')}
              </TableCell>
              <TableCell>
                {dayjs(brand.validityDate).format('DD/MM/YYYY')}
              </TableCell>
              <TableCell className="w-[50px]">{actionsOptions()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <DeleteConfirmModal
        open={isOpenDeleteConfirmModal}
        onOpenChange={() => setIsOpenDeleteConfirmModal(false)}
        onConfirm={() => setIsOpenDeleteConfirmModal(false)}
      />
    </div>
  );
};

export default BrandsTable;
