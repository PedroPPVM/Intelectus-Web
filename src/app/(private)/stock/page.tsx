import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import { ActionsDropdown } from './components/select-actions';
import StockTable from './components/stock-table';
import StockCard from './components/stock-card';

const Stock = () => {
  return (
    <Card className="flex size-full flex-col">
      <CardHeader className="flex flex-wrap items-center justify-between">
        <span className="text-2xl font-bold">Estoque</span>

        <div className="flex flex-wrap items-center gap-4">
          <ActionsDropdown />

          <Button>
            <Plus /> Criar novo produto
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <div className="hidden md:block">
          <StockTable />
        </div>

        <div className="flex flex-wrap gap-4 md:hidden">
          {[1, 2, 3].map((stock) => (
            <StockCard key={stock} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default Stock;
