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

const companies = [
  {
    value: 'Empresa 1',
    label: 'Empresa 1',
  },
  {
    value: 'Empresa 2',
    label: 'Empresa 2',
  },
  {
    value: 'Empresa 3',
    label: 'Empresa 3',
  },
  {
    value: 'Empresa 4',
    label: 'Empresa 4',
  },
  {
    value: 'Empresa 5',
    label: 'Empresa 5',
  },
];

export function CompanyCombobox() {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState('');

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
            ? companies.find((framework) => framework.value === value)?.label
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
                    setValue(currentValue === value ? '' : currentValue);
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
