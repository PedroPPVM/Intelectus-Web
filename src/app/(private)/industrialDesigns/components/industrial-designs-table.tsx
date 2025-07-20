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
import { IndustrialDesign } from '../page';
import dayjs from 'dayjs';
import { DeleteConfirmModal } from '@/components/delete-confirm-modal';
import { useState } from 'react';

interface IndustrialDesignsTableProps {
  industrialDesigns: IndustrialDesign[];
  onOpenIndustrialDesignsModal: (industrialDesign: IndustrialDesign) => void;
}

const IndustrialDesignsTable = ({
  industrialDesigns,
  onOpenIndustrialDesignsModal,
}: IndustrialDesignsTableProps) => {
  const [isOpenDeleteConfirmModal, setIsOpenDeleteConfirmModal] =
    useState<boolean>(false);

  const actionsOptions = (industrialDesign: IndustrialDesign) => {
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
            className="cursor-pointer"
            onClick={() => onOpenIndustrialDesignsModal(industrialDesign)}
          >
            Editar
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => setIsOpenDeleteConfirmModal(true)}
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
            <TableHead>Título</TableHead>
            <TableHead>Apelido</TableHead>
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
          {industrialDesigns.map((industrialDesign) => (
            <TableRow
              key={industrialDesign.id}
              className="hover:bg-transparent"
            >
              <TableCell className="font-medium">
                {industrialDesign.process}
              </TableCell>
              <TableCell>{industrialDesign.title}</TableCell>
              <TableCell>{industrialDesign.shortName}</TableCell>
              <TableCell>{industrialDesign.depositor}</TableCell>
              <TableCell>
                {industrialDesign.cnpj || industrialDesign.cpf}
              </TableCell>
              <TableCell>{industrialDesign.attorney}</TableCell>
              <TableCell>
                {dayjs(industrialDesign.depositDate).format('DD/MM/YYYY')}
              </TableCell>
              <TableCell>
                {dayjs(industrialDesign.concessionDate).format('DD/MM/YYYY')}
              </TableCell>
              <TableCell>
                {dayjs(industrialDesign.validityDate).format('DD/MM/YYYY')}
              </TableCell>
              <TableCell className="w-[50px]">
                {actionsOptions(industrialDesign)}
              </TableCell>
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

export default IndustrialDesignsTable;
