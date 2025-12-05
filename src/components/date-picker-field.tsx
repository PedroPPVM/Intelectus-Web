import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { CalendarIcon, X } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import dayjs from 'dayjs';
import { IMaskInput } from 'react-imask';
import { useState } from 'react';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);

export function DatePickerField({
  value,
  setValue,
  label,
  isOpen,
  setIsOpen,
  error,
}: {
  label: string;
  value: string;
  setValue: (value: string) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  error?: string;
}) {
  const [internalError, setInternalError] = useState<string>('');

  const handleInputChange = (maskedValue: string) => {
    if (maskedValue.length < 10) {
      setInternalError('');
      return;
    }

    if (maskedValue.length === 10) {
      const [day, month, year] = maskedValue.split('/');
      const dateString = `${year}-${month}-${day}`;

      if (dayjs(dateString, 'YYYY-MM-DD', true).isValid()) {
        setValue(dateString);
        setInternalError('');
      } else {
        setInternalError('Data inválida');
      }
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setValue('');
    setInternalError('');
  };

  const displayValue = value ? dayjs(value).format('DD/MM/YYYY') : '';

  return (
    <div>
      <label className="mb-1 block text-sm font-medium">{label}</label>
      <div className="relative">
        <IMaskInput
          mask="00/00/0000"
          value={displayValue}
          onAccept={handleInputChange}
          placeholder="DD/MM/AAAA"
          className="dark:bg-input/30 border-input focus-visible:border-ring focus-visible:ring-ring/50 flex h-9 w-full rounded-md border bg-transparent px-3 py-1 pr-20 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
        />
        <div className="absolute top-1/2 right-1 flex -translate-y-1/2 items-center gap-1">
          {value && (
            <button
              type="button"
              onClick={handleClear}
              className="hover:bg-accent rounded-sm p-1 transition-colors"
            >
              <X className="text-muted-foreground h-4 w-4" />
            </button>
          )}
          <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
              <button
                type="button"
                className="hover:bg-accent rounded-sm p-1 transition-colors"
              >
                <CalendarIcon className="text-muted-foreground h-4 w-4" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                mode="single"
                selected={value ? new Date(value) : undefined}
                onSelect={(date) => {
                  if (date) {
                    const dateString = dayjs(date).format('YYYY-MM-DD');
                    setValue(dateString);
                    setInternalError('');
                  }
                  setIsOpen(false);
                }}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
      {(error || internalError) && (
        <span className="text-xs text-red-500">{error || internalError}</span>
      )}
    </div>
  );
}
