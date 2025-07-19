import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import dayjs from 'dayjs';

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
  return (
    <div>
      <label className="mb-1 block text-sm font-medium">{label}</label>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-start text-left font-normal"
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {value ? dayjs(value).format('DD/MM/YYYY') : ''}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={value ? new Date(value) : undefined}
            onSelect={(date) => {
              if (date) {
                const dateString = dayjs(date).format('YYYY-MM-DD');
                setValue(dateString);
              }
              setIsOpen(false);
            }}
          />
        </PopoverContent>
      </Popover>
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
}
