'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import BrandsTable from './components/brands-table';
import { useState } from 'react';
import { ManageProcessModal } from '@/components/manage-process-modal';

export interface Brand {
  id: string;
  process: string;
  name: string;
  depositor: string;
  cnpj: string;
  cpf: string;
  attorney: string;
  depositDate: Date;
  concessionDate: Date;
  validityDate: Date;
}

const BRANDS_MOCKUP: Brand[] = [
  {
    id: '1a2b3c4d',
    process: '1029384',
    name: 'Marca Solar',
    depositor: 'Energia Verde Ltda',
    cnpj: '12.345.678/0001-90',
    cpf: '',
    attorney: 'Dr. Luiz Andrade',
    depositDate: new Date('2022-03-15'),
    concessionDate: new Date('2023-06-20'),
    validityDate: new Date('2033-06-20'),
  },
  {
    id: '2b3c4d5e',
    process: '2938475',
    name: 'TechNova',
    depositor: 'Ana Paula Dias',
    cnpj: '',
    cpf: '123.456.789-10',
    attorney: 'Drª. Carla Moura',
    depositDate: new Date('2021-11-02'),
    concessionDate: new Date('2022-09-10'),
    validityDate: new Date('2032-09-10'),
  },
  {
    id: '3c4d5e6f',
    process: '3847561',
    name: 'BioLeve',
    depositor: 'Laboratório BioVida S/A',
    cnpj: '98.765.432/0001-55',
    cpf: '',
    attorney: 'Dr. Gustavo Leal',
    depositDate: new Date('2020-05-08'),
    concessionDate: new Date('2021-08-18'),
    validityDate: new Date('2031-08-18'),
  },
  {
    id: '4d5e6f7g',
    process: '4839201',
    name: 'Café do Vale',
    depositor: 'Juliano Batista',
    cnpj: '',
    cpf: '987.654.321-00',
    attorney: 'Drª. Milena Rocha',
    depositDate: new Date('2023-01-12'),
    concessionDate: new Date('2024-02-25'),
    validityDate: new Date('2034-02-25'),
  },
  {
    id: '5e6f7g8h',
    process: '5728390',
    name: 'MaxFit',
    depositor: 'MaxFit Suplementos EIRELI',
    cnpj: '56.789.123/0001-22',
    cpf: '',
    attorney: 'Dr. João Pedro Moura',
    depositDate: new Date('2022-07-21'),
    concessionDate: new Date('2023-09-01'),
    validityDate: new Date('2033-09-01'),
  },
  {
    id: '6f7g8h9i',
    process: '6192837',
    name: 'NaturaLimp',
    depositor: 'Maria Clara Silva',
    cnpj: '',
    cpf: '321.654.987-00',
    attorney: 'Drª. Tatiane Lima',
    depositDate: new Date('2021-10-05'),
    concessionDate: new Date('2022-12-12'),
    validityDate: new Date('2032-12-12'),
  },
  {
    id: '7g8h9i0j',
    process: '7092837',
    name: 'EcoPack',
    depositor: 'Eco Embalagens Sustentáveis Ltda',
    cnpj: '33.221.100/0001-66',
    cpf: '',
    attorney: 'Dr. Rafael Cunha',
    depositDate: new Date('2020-04-14'),
    concessionDate: new Date('2021-06-20'),
    validityDate: new Date('2031-06-20'),
  },
  {
    id: '8h9i0j1k',
    process: '8029381',
    name: 'Vita+',
    depositor: 'Farmavida Produtos Naturais',
    cnpj: '77.888.999/0001-44',
    cpf: '',
    attorney: 'Drª. Larissa Moreira',
    depositDate: new Date('2023-03-03'),
    concessionDate: new Date('2024-01-15'),
    validityDate: new Date('2034-01-15'),
  },
  {
    id: '9i0j1k2l',
    process: '9128374',
    name: 'AutoPro',
    depositor: 'José Henrique Ramos',
    cnpj: '',
    cpf: '456.789.123-45',
    attorney: 'Dr. Vítor Nunes',
    depositDate: new Date('2021-06-17'),
    concessionDate: new Date('2022-07-30'),
    validityDate: new Date('2032-07-30'),
  },
  {
    id: '0j1k2l3m',
    process: '1019283',
    name: 'Doceria da Vó',
    depositor: 'Doces & Delícias Ltda',
    cnpj: '11.222.333/0001-77',
    cpf: '',
    attorney: 'Drª. Roberta Luz',
    depositDate: new Date('2019-09-09'),
    concessionDate: new Date('2020-10-15'),
    validityDate: new Date('2030-10-15'),
  },
];

const Brands = () => {
  const [manageBrandMode, setManageBrandMode] = useState<'create' | 'edit'>(
    'create',
  );
  const [isOpenBrandModal, setIsOpenBrandModal] = useState<boolean>(false);
  const [selectedBrand, setSelectedBrand] = useState<Brand | undefined>(
    undefined,
  );

  const handleOpenBrandModal = (brand: Brand) => {
    setManageBrandMode('edit');
    setIsOpenBrandModal(true);
    setSelectedBrand(brand);
  };

  return (
    <Card className="flex size-full flex-col">
      <CardHeader className="flex flex-wrap items-center justify-between">
        <span className="text-2xl font-bold">Marcas</span>

        <div className="flex flex-wrap items-center gap-4">
          <Button
            onClick={() => {
              setManageBrandMode('create');
              setSelectedBrand(undefined);
              setIsOpenBrandModal(true);
            }}
          >
            <Plus /> Criar Marca
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <div className="hidden md:block">
          <BrandsTable
            brands={BRANDS_MOCKUP}
            onOpenBrandModal={handleOpenBrandModal}
          />
        </div>
      </CardContent>

      <ManageProcessModal
        open={isOpenBrandModal}
        onOpenChange={() => setIsOpenBrandModal(false)}
        onSave={() => setIsOpenBrandModal(false)}
        mode={manageBrandMode}
        initialData={
          selectedBrand
            ? {
                ...selectedBrand,
                processNumber: selectedBrand.process,
                title: selectedBrand.name,
              }
            : undefined
        }
      />
    </Card>
  );
};

export default Brands;
