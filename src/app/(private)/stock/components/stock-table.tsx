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
        <DropdownMenuItem className="cursor-pointer">Excluir</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const StockTable = () => {
  return (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <TableHead>Nome</TableHead>
          <TableHead>Disponível</TableHead>
          <TableHead>Separado para Envio</TableHead>
          <TableHead>Em Trânsito</TableHead>
          <TableHead>Em Uso</TableHead>
          <TableHead>Categoria</TableHead>
          <TableHead className="w-[50px]"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow className="hover:bg-transparent">
          <TableCell className="font-medium">INV001</TableCell>
          <TableCell>Paid</TableCell>
          <TableCell>Credit Card</TableCell>
          <TableCell>$250.00</TableCell>
          <TableCell>$250.00</TableCell>
          <TableCell>$250.00</TableCell>
          <TableCell className="w-[50px]">{actionsOptions()}</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
};

export default StockTable;
