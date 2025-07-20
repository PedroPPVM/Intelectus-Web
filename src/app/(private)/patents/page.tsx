'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import PatentsTable from './components/patents-table';
import { ManageProcessModal } from '@/components/manage-process-modal';
import { useState } from 'react';

export interface Patent {
  id: string;
  process: string;
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

const PATENTS_MOCKUP: Patent[] = [
  {
    id: 'a1b2c3d4',
    process: '1001001',
    title: 'Sistema de Recarga Solar para Veículos Elétricos',
    shortName: 'Recarga Solar',
    depositor: 'Energix Soluções Sustentáveis',
    cnpj: '12.345.678/0001-90',
    cpf: '',
    attorney: 'Dr. Luiz Carvalho',
    depositDate: new Date('2022-01-10'),
    concessionDate: new Date('2023-03-15'),
    validityDate: new Date('2042-03-15'),
  },
  {
    id: 'b2c3d4e5',
    process: '1001002',
    title: 'Dispositivo Inteligente de Monitoramento Cardíaco',
    shortName: 'CardioSmart',
    depositor: 'HealthTech Brasil Ltda',
    cnpj: '98.765.432/0001-12',
    cpf: '',
    attorney: 'Drª. Amanda Lopes',
    depositDate: new Date('2021-06-18'),
    concessionDate: new Date('2022-08-22'),
    validityDate: new Date('2042-08-22'),
  },
  {
    id: 'c3d4e5f6',
    process: '1001003',
    title: 'Método de Filtragem Avançada de Microplásticos',
    shortName: 'FiltroMP',
    depositor: 'Água Pura Indústria e Comércio',
    cnpj: '34.567.890/0001-45',
    cpf: '',
    attorney: 'Dr. Rodrigo Barreto',
    depositDate: new Date('2020-04-30'),
    concessionDate: new Date('2021-11-05'),
    validityDate: new Date('2041-11-05'),
  },
  {
    id: 'd4e5f6g7',
    process: '1001004',
    title: 'Sistema Automatizado de Irrigação com Inteligência Artificial',
    shortName: 'IrrigaIA',
    depositor: 'AgroSmart Inovações',
    cnpj: '11.222.333/0001-55',
    cpf: '',
    attorney: 'Drª. Helena Vaz',
    depositDate: new Date('2022-09-12'),
    concessionDate: new Date('2024-02-01'),
    validityDate: new Date('2044-02-01'),
  },
  {
    id: 'e5f6g7h8',
    process: '1001005',
    title: 'Composto Bioativo para Tratamento de Diabetes Tipo 2',
    shortName: 'DiabeFit',
    depositor: 'Laboratório Vida Nova',
    cnpj: '66.777.888/0001-11',
    cpf: '',
    attorney: 'Dr. Marcos Henrique',
    depositDate: new Date('2021-02-14'),
    concessionDate: new Date('2022-07-20'),
    validityDate: new Date('2042-07-20'),
  },
  {
    id: 'f6g7h8i9',
    process: '1001006',
    title: 'Dispositivo de Segurança para Motocicletas com Rastreamento',
    shortName: 'MotoTrack',
    depositor: 'Segurança Total Ltda',
    cnpj: '55.666.777/0001-88',
    cpf: '',
    attorney: 'Dr. Rafael Tavares',
    depositDate: new Date('2023-01-25'),
    concessionDate: new Date('2024-05-10'),
    validityDate: new Date('2044-05-10'),
  },
  {
    id: 'g7h8i9j0',
    process: '1001007',
    title: 'Sistema de Aproveitamento de Água da Chuva em Residências',
    shortName: 'AquaReuse',
    depositor: 'João Alberto Rocha',
    cnpj: '',
    cpf: '123.456.789-00',
    attorney: 'Drª. Silvia Ramos',
    depositDate: new Date('2020-11-08'),
    concessionDate: new Date('2022-01-30'),
    validityDate: new Date('2042-01-30'),
  },
  {
    id: 'h8i9j0k1',
    process: '1001008',
    title: 'Aplicativo para Gestão de Consumo Energético em Tempo Real',
    shortName: 'EnergyView',
    depositor: 'GreenTech App Solutions',
    cnpj: '88.999.000/0001-33',
    cpf: '',
    attorney: 'Dr. Eduardo Lima',
    depositDate: new Date('2021-08-16'),
    concessionDate: new Date('2023-01-11'),
    validityDate: new Date('2043-01-11'),
  },
  {
    id: 'i9j0k1l2',
    process: '1001009',
    title: 'Sistema de Realidade Aumentada para Ensino Técnico',
    shortName: 'EduAR',
    depositor: 'Inovação e Ensino Ltda',
    cnpj: '22.333.444/0001-99',
    cpf: '',
    attorney: 'Drª. Fernanda Peixoto',
    depositDate: new Date('2022-03-05'),
    concessionDate: new Date('2023-09-30'),
    validityDate: new Date('2043-09-30'),
  },
  {
    id: 'j0k1l2m3',
    process: '1001010',
    title: 'Equipamento de Geração de Energia Cinética em Academias',
    shortName: 'KinePower',
    depositor: 'Carlos Henrique Silva',
    cnpj: '',
    cpf: '987.654.321-99',
    attorney: 'Dr. Tiago Moura',
    depositDate: new Date('2021-12-01'),
    concessionDate: new Date('2023-04-20'),
    validityDate: new Date('2043-04-20'),
  },
];

const Patents = () => {
  const [isOpenProcessModal, setIsOpenProcessModal] = useState(false);
  const [manageProcessMode, setManageProcessMode] = useState<'create' | 'edit'>(
    'create',
  );
  const [selectedProcess, setSelectedProcess] = useState<Patent | undefined>(
    undefined,
  );

  const handleOpenProcessModal = (process: Patent) => {
    setManageProcessMode('edit');
    setIsOpenProcessModal(true);
    setSelectedProcess(process);
  };

  return (
    <Card className="flex size-full flex-col">
      <CardHeader className="flex flex-wrap items-center justify-between">
        <span className="text-2xl font-bold">Patentes</span>

        <div className="flex flex-wrap items-center gap-4">
          <Button
            onClick={() => {
              setManageProcessMode('create');
              setIsOpenProcessModal(true);
              setSelectedProcess(undefined);
            }}
          >
            <Plus /> Criar Patente
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <div className="hidden md:block">
          <PatentsTable
            patents={PATENTS_MOCKUP}
            onOpenPatentsModal={handleOpenProcessModal}
          />
        </div>
      </CardContent>

      <ManageProcessModal
        open={isOpenProcessModal}
        onOpenChange={() => setIsOpenProcessModal(false)}
        onSave={() => setIsOpenProcessModal(false)}
        mode={manageProcessMode}
        initialData={
          selectedProcess
            ? {
                ...selectedProcess,
                processNumber: selectedProcess.process,
              }
            : undefined
        }
      />
    </Card>
  );
};

export default Patents;
