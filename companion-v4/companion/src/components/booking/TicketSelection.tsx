import { Minus, Plus, Users, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Event } from '@/data/mockData';

interface TicketSelectionProps {
  event: Event;
  ticketCount: number;
  onTicketCountChange: (count: number) => void;
  attendanceType: 'alone' | 'group';
  onAttendanceTypeChange: (type: 'alone' | 'group') => void;
  onNext: () => void;
}

export const TicketSelection = ({
  event,
  ticketCount,
  onTicketCountChange,
  attendanceType,
  onAttendanceTypeChange,
  onNext,
}: TicketSelectionProps) => {
  return (
    <div className="animate-fade-in">
      <h2 className="font-display text-2xl font-bold text-foreground mb-6">
        Select Your Tickets
      </h2>

      {/* Ticket Counter */}
      <div className="bg-muted rounded-2xl p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-foreground">Number of Tickets</h3>
            <p className="text-sm text-muted-foreground">₹{event.price} per ticket</p>
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => onTicketCountChange(Math.max(1, ticketCount - 1))}
              disabled={ticketCount <= 1}
            >
              <Minus className="w-4 h-4" />
            </Button>
            <span className="text-2xl font-bold text-foreground w-8 text-center">
              {ticketCount}
            </span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => onTicketCountChange(Math.min(10, ticketCount + 1))}
              disabled={ticketCount >= 10}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <span className="text-muted-foreground">Subtotal</span>
          <span className="text-xl font-bold text-foreground">
            ₹{(event.price * ticketCount).toLocaleString()}
          </span>
        </div>
      </div>

      {/* Attendance Type */}
      <div className="mb-8">
        <h3 className="font-semibold text-foreground mb-4">How are you attending?</h3>
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => onAttendanceTypeChange('alone')}
            className={`p-6 rounded-2xl border-2 transition-all duration-300 text-left ${
              attendanceType === 'alone'
                ? 'border-primary bg-primary/5'
                : 'border-border hover:border-primary/30'
            }`}
          >
            <User className={`w-8 h-8 mb-3 ${
              attendanceType === 'alone' ? 'text-primary' : 'text-muted-foreground'
            }`} />
            <h4 className="font-semibold text-foreground mb-1">Going Alone</h4>
            <p className="text-sm text-muted-foreground">
              Find a companion to join you
            </p>
          </button>
          <button
            onClick={() => onAttendanceTypeChange('group')}
            className={`p-6 rounded-2xl border-2 transition-all duration-300 text-left ${
              attendanceType === 'group'
                ? 'border-primary bg-primary/5'
                : 'border-border hover:border-primary/30'
            }`}
          >
            <Users className={`w-8 h-8 mb-3 ${
              attendanceType === 'group' ? 'text-primary' : 'text-muted-foreground'
            }`} />
            <h4 className="font-semibold text-foreground mb-1">Going With Group</h4>
            <p className="text-sm text-muted-foreground">
              Already have companions
            </p>
          </button>
        </div>
      </div>

      <Button variant="hero" size="lg" className="w-full" onClick={onNext}>
        Continue
      </Button>
    </div>
  );
};
