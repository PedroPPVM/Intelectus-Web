'use client';

import * as React from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useQuery } from '@tanstack/react-query';
import { getCompanies } from '@/services/Companies';
import { getSelectedCompany } from '@/utils/get-company-by-local-storage';

export function CompanyCombobox() {
  const companyByLocalStorage = getSelectedCompany();
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState(companyByLocalStorage?.id || []);

  const { data: companiesResult, isFetching: isLoadingCompanies } = useQuery({
    queryKey: ['get-companies'],
    queryFn: async () => await getCompanies(),
  });

  const companies = React.useMemo(() => {
    if (!companiesResult) return [];

    setValue(companyByLocalStorage?.id || '');

    return companiesResult.data.map((company) => ({
      value: company.id,
      label: company.name,
    }));
  }, [companiesResult, localStorage.getItem('companies')]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {value
            ? companies.find((company) => company.value === value)?.label
            : 'Selecione uma Empresa'}

          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[239px] p-0">
        <Command>
          <CommandInput placeholder="Pesquisar Empresa" />
          <CommandList>
            <CommandEmpty>Nenhuma Empresa encontrada.</CommandEmpty>

            <CommandGroup>
              {companies.map((company) => (
                <CommandItem
                  key={company.value}
                  value={company.value}
                  onSelect={(currentValue) => {
                    setValue(currentValue);
                    setOpen(false);
                  }}
                  className="cursor-pointer"
                >
                  {company.label}
                  <Check
                    className={cn(
                      'ml-auto',
                      value === company.value ? 'opacity-100' : 'opacity-0',
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
