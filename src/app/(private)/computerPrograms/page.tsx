'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import ComputerProgramsTable from './components/computer-programs-table';
import { ManageProcessModal } from '@/components/manage-process-modal';
import { useState } from 'react';

export interface ComputerProgram {
  id: string;
  process: string;
  title: string;
  shortTitle: string;
  depositor: string;
  cnpj: string;
  cpf: string;
  attorney: string;
  depositDate: Date;
  concessionDate: Date;
  validityDate: Date;
}

const COMPUTER_PROGRAMS_MOCKUP: ComputerProgram[] = [
  {
    id: 'p1a2b3c4',
    process: '3100001',
    title:
      'Sistema de Gerenciamento de Clínicas Médicas com Prontuário Eletrônico',
    shortTitle: 'ClinMed',
    depositor: 'HealthSoft Soluções em Saúde',
    cnpj: '01.234.567/0001-89',
    cpf: '',
    attorney: 'Dr. Marcelo Torres',
    depositDate: new Date('2022-03-10'),
    concessionDate: new Date('2022-10-15'),
    validityDate: new Date('2042-10-15'),
  },
  {
    id: 'p2b3c4d5',
    process: '3100002',
    title: 'Aplicativo de Controle de Finanças Pessoais com IA',
    shortTitle: 'FinSmart',
    depositor: 'Fintech Brasil Tecnologia Ltda',
    cnpj: '02.345.678/0001-90',
    cpf: '',
    attorney: 'Drª. Ana Bezerra',
    depositDate: new Date('2021-07-01'),
    concessionDate: new Date('2022-01-20'),
    validityDate: new Date('2042-01-20'),
  },
  {
    id: 'p3c4d5e6',
    process: '3100003',
    title: 'Plataforma de Ensino Adaptativo com Algoritmo de Reforço',
    shortTitle: 'EduAdapt',
    depositor: 'Inova Educação Ltda',
    cnpj: '03.456.789/0001-01',
    cpf: '',
    attorney: 'Dr. Leandro Cunha',
    depositDate: new Date('2020-12-12'),
    concessionDate: new Date('2021-06-05'),
    validityDate: new Date('2041-06-05'),
  },
  {
    id: 'p4d5e6f7',
    process: '3100004',
    title: 'Sistema de Rastreamento de Frotas com Otimização de Rotas',
    shortTitle: 'FleetTrack',
    depositor: 'LogiTech Soluções Logísticas',
    cnpj: '04.567.890/0001-12',
    cpf: '',
    attorney: 'Drª. Marina Souza',
    depositDate: new Date('2021-05-15'),
    concessionDate: new Date('2021-12-01'),
    validityDate: new Date('2041-12-01'),
  },
  {
    id: 'p5e6f7g8',
    process: '3100005',
    title: 'Software para Gestão de Condomínios com Aplicativo Integrado',
    shortTitle: 'CondoManager',
    depositor: 'SíndicoTech Sistemas',
    cnpj: '05.678.901/0001-23',
    cpf: '',
    attorney: 'Dr. Rafael Lima',
    depositDate: new Date('2022-08-08'),
    concessionDate: new Date('2023-03-03'),
    validityDate: new Date('2043-03-03'),
  },
  {
    id: 'p6f7g8h9',
    process: '3100006',
    title:
      'Plataforma de Atendimento Virtual com Processamento de Linguagem Natural',
    shortTitle: 'SmartBot',
    depositor: 'NeoAtendimento Digital',
    cnpj: '06.789.012/0001-34',
    cpf: '',
    attorney: 'Drª. Roberta Andrade',
    depositDate: new Date('2021-04-02'),
    concessionDate: new Date('2021-10-20'),
    validityDate: new Date('2041-10-20'),
  },
  {
    id: 'p7g8h9i0',
    process: '3100007',
    title: 'Aplicativo de Monitoramento de Saúde Mental com Diário Emocional',
    shortTitle: 'MindTrack',
    depositor: 'VivaBem Digital Ltda',
    cnpj: '07.890.123/0001-45',
    cpf: '',
    attorney: 'Dr. Gustavo Xavier',
    depositDate: new Date('2023-01-05'),
    concessionDate: new Date('2023-06-15'),
    validityDate: new Date('2043-06-15'),
  },
  {
    id: 'p8h9i0j1',
    process: '3100008',
    title: 'Sistema de Automação Residencial com Assistente de Voz Local',
    shortTitle: 'HomeVoice',
    depositor: 'Casa Inteligente S/A',
    cnpj: '08.901.234/0001-56',
    cpf: '',
    attorney: 'Drª. Lígia Ferreira',
    depositDate: new Date('2020-09-17'),
    concessionDate: new Date('2021-02-28'),
    validityDate: new Date('2041-02-28'),
  },
  {
    id: 'p9i0j1k2',
    process: '3100009',
    title: 'Plataforma Web para Gestão de Cursos Online e Certificação',
    shortTitle: 'CertEdu',
    depositor: 'Plataforma Saber Ltda',
    cnpj: '09.012.345/0001-67',
    cpf: '',
    attorney: 'Dr. Eduardo Teles',
    depositDate: new Date('2022-10-22'),
    concessionDate: new Date('2023-04-09'),
    validityDate: new Date('2043-04-09'),
  },
  {
    id: 'p0j1k2l3',
    process: '3100010',
    title: 'Aplicativo de Previsão de Demanda para Pequenos Negócios',
    shortTitle: 'PreviVenda',
    depositor: 'Larissa Almeida',
    cnpj: '',
    cpf: '456.789.123-00',
    attorney: 'Drª. Fabiana Reis',
    depositDate: new Date('2023-03-11'),
    concessionDate: new Date('2023-11-01'),
    validityDate: new Date('2043-11-01'),
  },
];

const ComputerPrograms = () => {
  const [isOpenProcessModal, setIsOpenProcessModal] = useState(false);
  const [manageProcessMode, setManageProcessMode] = useState<'create' | 'edit'>(
    'create',
  );
  const [selectedProcess, setSelectedProcess] = useState<
    ComputerProgram | undefined
  >(undefined);

  const handleOpenProcessModal = (process: ComputerProgram) => {
    setManageProcessMode('edit');
    setIsOpenProcessModal(true);
    setSelectedProcess(process);
  };

  return (
    <Card className="flex size-full flex-col">
      <CardHeader className="flex flex-wrap items-center justify-between">
        <span className="text-2xl font-bold">Programas de Computador</span>

        <div className="flex flex-wrap items-center gap-4">
          <Button
            onClick={() => {
              setManageProcessMode('create');
              setIsOpenProcessModal(true);
              setSelectedProcess(undefined);
            }}
          >
            <Plus /> Criar Programa de Computador
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <div className="hidden md:block">
          <ComputerProgramsTable
            computerPrograms={COMPUTER_PROGRAMS_MOCKUP}
            onOpenComputerProgramModal={handleOpenProcessModal}
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

export default ComputerPrograms;
