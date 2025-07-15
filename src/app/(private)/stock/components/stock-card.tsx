import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const StockCard = () => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Nome</CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col">
        <span>Disponível</span>
        <span>Separado para Envio</span>
        <span>Em trânsito</span>
        <span>Em Uso</span>
        <span>Categoria</span>
      </CardContent>
    </Card>
  );
};

export default StockCard;
