import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import IndustrialDesignsTable from './components/industrial-designs-table';

export interface IndustrialDesign {
  id: string;
  process: number;
  title: string;
  shortName: string;
  depositor: string;
  cnpj: string;
  cpf: string;
  attorney: string;
  depositDate: Date;
  concessionDate: Date;
  validityDate: Date;
}

const INDUSTRIAL_DESIGNS_MOCKUP: IndustrialDesign[] = [
  {
    id: 'a1x2b3c4',
    process: 2002001,
    title: 'Design de Embalagem para Perfume em Formato Espiral',
    shortName: 'Embalagem Espiral',
    depositor: 'Essencial Cosméticos Ltda',
    cnpj: '11.111.111/0001-11',
    cpf: '',
    attorney: 'Dr. Lucas Alencar',
    depositDate: new Date('2021-01-05'),
    concessionDate: new Date('2021-11-12'),
    validityDate: new Date('2031-11-12'),
  },
  {
    id: 'b2y3c4d5',
    process: 2002002,
    title: 'Design de Cadeira Ergonômica com Encosto Modular',
    shortName: 'Cadeira Modular',
    depositor: 'Mobilar Móveis Planejados',
    cnpj: '22.222.222/0001-22',
    cpf: '',
    attorney: 'Drª. Carla Menezes',
    depositDate: new Date('2022-04-10'),
    concessionDate: new Date('2023-02-14'),
    validityDate: new Date('2033-02-14'),
  },
  {
    id: 'c3z4d5e6',
    process: 2002003,
    title: 'Design de Garrafa Térmica com Tampa Retrátil',
    shortName: 'ThermoRetrátil',
    depositor: 'Isoterm Brasil',
    cnpj: '33.333.333/0001-33',
    cpf: '',
    attorney: 'Dr. Renato Souza',
    depositDate: new Date('2020-08-15'),
    concessionDate: new Date('2021-03-01'),
    validityDate: new Date('2031-03-01'),
  },
  {
    id: 'd4a5e6f7',
    process: 2002004,
    title: 'Design de Fone de Ouvido com Iluminação LED Integrada',
    shortName: 'Fone LED',
    depositor: 'ÁudioWave Tecnologia',
    cnpj: '44.444.444/0001-44',
    cpf: '',
    attorney: 'Drª. Lívia Borges',
    depositDate: new Date('2021-09-22'),
    concessionDate: new Date('2022-07-10'),
    validityDate: new Date('2032-07-10'),
  },
  {
    id: 'e5b6f7g8',
    process: 2002005,
    title: 'Design de Embalagem para Bombons em Formato de Flor',
    shortName: 'Flor de Bombom',
    depositor: 'Delícias da Terra Ltda',
    cnpj: '55.555.555/0001-55',
    cpf: '',
    attorney: 'Dr. Paulo Viana',
    depositDate: new Date('2023-01-03'),
    concessionDate: new Date('2023-11-18'),
    validityDate: new Date('2033-11-18'),
  },
  {
    id: 'f6c7g8h9',
    process: 2002006,
    title: 'Design de Relógio de Pulso com Visor Flutuante',
    shortName: 'Relógio Flutuante',
    depositor: 'TempoFino Relógios',
    cnpj: '66.666.666/0001-66',
    cpf: '',
    attorney: 'Drª. Amanda Freitas',
    depositDate: new Date('2022-05-20'),
    concessionDate: new Date('2023-04-22'),
    validityDate: new Date('2033-04-22'),
  },
  {
    id: 'g7d8h9i0',
    process: 2002007,
    title: 'Design de Armário com Sistema de Abertura Oculta',
    shortName: 'Armário Oculto',
    depositor: 'Inova Marcenaria',
    cnpj: '77.777.777/0001-77',
    cpf: '',
    attorney: 'Dr. Henrique Costa',
    depositDate: new Date('2021-06-12'),
    concessionDate: new Date('2022-03-30'),
    validityDate: new Date('2032-03-30'),
  },
  {
    id: 'h8e9i0j1',
    process: 2002008,
    title: 'Design de Luminária com Ajuste Magnético de Altura',
    shortName: 'LuzMag',
    depositor: 'Clara Design de Iluminação',
    cnpj: '88.888.888/0001-88',
    cpf: '',
    attorney: 'Drª. Fernanda Lima',
    depositDate: new Date('2020-03-18'),
    concessionDate: new Date('2021-01-12'),
    validityDate: new Date('2031-01-12'),
  },
  {
    id: 'i9f0j1k2',
    process: 2002009,
    title: 'Design de Copo Dobrável com Sistema de Trava',
    shortName: 'Copo Dobrável',
    depositor: 'EcoMove Produtos Sustentáveis',
    cnpj: '99.999.999/0001-99',
    cpf: '',
    attorney: 'Dr. Bruno Neves',
    depositDate: new Date('2022-11-09'),
    concessionDate: new Date('2023-09-01'),
    validityDate: new Date('2033-09-01'),
  },
  {
    id: 'j0g1k2l3',
    process: 2002010,
    title: 'Design de Embalagem de Sabonete com Textura Natural',
    shortName: 'Sabonete Raiz',
    depositor: 'Luciana Meireles',
    cnpj: '',
    cpf: '123.987.654-00',
    attorney: 'Drª. Camila Torres',
    depositDate: new Date('2023-02-27'),
    concessionDate: new Date('2024-01-05'),
    validityDate: new Date('2034-01-05'),
  },
];

const IndustrialDesigns = () => {
  return (
    <Card className="flex size-full flex-col">
      <CardHeader className="flex flex-wrap items-center justify-between">
        <span className="text-2xl font-bold">Desenhos Industriais</span>

        <div className="flex flex-wrap items-center gap-4">
          <Button>
            <Plus /> Criar Desenho Industrial
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <div className="hidden md:block">
          <IndustrialDesignsTable
            industrialDesigns={INDUSTRIAL_DESIGNS_MOCKUP}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default IndustrialDesigns;
