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
import { Patent } from '../page';
import dayjs from 'dayjs';

interface PatentsTableProps {
  patents: Patent[];
}

const PatentsTable = ({ patents }: PatentsTableProps) => {
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
          <DropdownMenuItem className="cursor-pointer">
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
          {patents.map((patent) => (
            <TableRow key={patent.id} className="hover:bg-transparent">
              <TableCell className="font-medium">{patent.process}</TableCell>
              <TableCell>{patent.title}</TableCell>
              <TableCell>{patent.shortName}</TableCell>
              <TableCell>{patent.depositor}</TableCell>
              <TableCell>{patent.cnpj || patent.cpf}</TableCell>
              <TableCell>{patent.attorney}</TableCell>
              <TableCell>
                {dayjs(patent.depositDate).format('DD/MM/YYYY')}
              </TableCell>
              <TableCell>
                {dayjs(patent.concessionDate).format('DD/MM/YYYY')}
              </TableCell>
              <TableCell>
                {dayjs(patent.validityDate).format('DD/MM/YYYY')}
              </TableCell>
              <TableCell className="w-[50px]">{actionsOptions()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default PatentsTable;
