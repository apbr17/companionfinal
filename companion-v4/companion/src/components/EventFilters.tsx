import { Calendar, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { useState } from 'react';

interface EventFiltersProps {
  selectedDate: Date | undefined;
  onDateChange: (date: Date | undefined) => void;
  selectedLanguage: string;
  onLanguageChange: (language: string) => void;
}

const languages = ['All', 'English', 'Hindi', 'Telugu', 'Tamil', 'Kannada', 'Malayalam'];

export const EventFilters = ({
  selectedDate,
  onDateChange,
  selectedLanguage,
  onLanguageChange,
}: EventFiltersProps) => {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  return (
    <div className="container mx-auto px-4 py-4">
      <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide pb-2">
        {/* Date Filter */}
        <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
          <PopoverTrigger asChild>
            <button
              className={`filter-chip flex items-center gap-2 ${
                selectedDate ? 'active' : ''
              }`}
            >
              <Calendar className="w-4 h-4" />
              {selectedDate
                ? selectedDate.toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                  })
                : 'Any Date'}
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <CalendarComponent
              mode="single"
              selected={selectedDate}
              onSelect={(date) => {
                onDateChange(date);
                setIsCalendarOpen(false);
              }}
              disabled={(date) => date < new Date()}
              initialFocus
              className="pointer-events-auto"
            />
          </PopoverContent>
        </Popover>

        {/* Language Filters */}
        {languages.map((lang) => (
          <button
            key={lang}
            onClick={() => onLanguageChange(lang)}
            className={`filter-chip ${selectedLanguage === lang ? 'active' : ''}`}
          >
            {lang}
          </button>
        ))}

        {/* Clear Filters */}
        {(selectedDate || selectedLanguage !== 'All') && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              onDateChange(undefined);
              onLanguageChange('All');
            }}
            className="text-primary hover:text-primary/80"
          >
            Clear Filters
          </Button>
        )}
      </div>
    </div>
  );
};
