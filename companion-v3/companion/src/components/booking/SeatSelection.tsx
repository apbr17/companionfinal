import { useState, useMemo } from 'react';
import { Monitor } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { generateSeats } from '@/data/mockData';

interface SeatSelectionProps {
  ticketCount: number;
  onSeatsSelect: (seats: string[]) => void;
  selectedSeats: string[];
  onNext: () => void;
  onBack: () => void;
}

export const SeatSelection = ({
  ticketCount,
  onSeatsSelect,
  selectedSeats,
  onNext,
  onBack,
}: SeatSelectionProps) => {
  const seats = useMemo(() => generateSeats(), []);
  const rows = [...new Set(seats.map((s) => s.row))];

  const handleSeatClick = (seatId: string, status: string) => {
    if (status === 'booked') return;

    if (selectedSeats.includes(seatId)) {
      onSeatsSelect(selectedSeats.filter((s) => s !== seatId));
    } else if (selectedSeats.length < ticketCount) {
      onSeatsSelect([...selectedSeats, seatId]);
    }
  };

  const getSeatClass = (seat: { id: string; status: string }) => {
    if (selectedSeats.includes(seat.id)) return 'seat seat-selected';
    if (seat.status === 'booked') return 'seat seat-booked';
    if (seat.status === 'premium') return 'seat seat-premium';
    return 'seat seat-available';
  };

  const totalPrice = selectedSeats.reduce((total, seatId) => {
    const seat = seats.find((s) => s.id === seatId);
    return total + (seat?.price || 0);
  }, 0);

  return (
    <div className="animate-fade-in">
      <h2 className="font-display text-2xl font-bold text-foreground mb-6">
        Select Your Seats
      </h2>

      {/* Screen */}
      <div className="mb-8">
        <div className="relative">
          <div className="h-2 bg-gradient-to-r from-transparent via-primary to-transparent rounded-full mb-2" />
          <div className="flex items-center justify-center gap-2 text-muted-foreground text-sm">
            <Monitor className="w-4 h-4" />
            <span>SCREEN</span>
          </div>
        </div>
      </div>

      {/* Seat Legend */}
      <div className="flex items-center justify-center gap-6 mb-6 flex-wrap">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-t-md bg-seat-available" />
          <span className="text-sm text-muted-foreground">Available (₹250-450)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-t-md bg-seat-premium" />
          <span className="text-sm text-muted-foreground">Premium (₹650)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-t-md bg-seat-selected" />
          <span className="text-sm text-muted-foreground">Selected</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-t-md bg-seat-booked" />
          <span className="text-sm text-muted-foreground">Booked</span>
        </div>
      </div>

      {/* Seat Grid */}
      <div className="bg-muted rounded-2xl p-4 md:p-6 mb-6 overflow-x-auto">
        <div className="min-w-[500px]">
          {rows.map((row) => (
            <div key={row} className="flex items-center gap-2 mb-2">
              <span className="w-6 text-sm font-medium text-muted-foreground">
                {row}
              </span>
              <div className="flex gap-1 flex-1 justify-center">
                {seats
                  .filter((s) => s.row === row)
                  .map((seat, idx) => (
                    <>
                      {idx === 3 && <div className="w-6" />}
                      {idx === 9 && <div className="w-6" />}
                      <button
                        key={seat.id}
                        onClick={() => handleSeatClick(seat.id, seat.status)}
                        className={getSeatClass(seat)}
                        disabled={seat.status === 'booked'}
                        title={`${seat.id} - ₹${seat.price}`}
                      >
                        {seat.number}
                      </button>
                    </>
                  ))}
              </div>
              <span className="w-6 text-sm font-medium text-muted-foreground">
                {row}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Selection Info */}
      <div className="bg-card border border-border rounded-2xl p-4 mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-muted-foreground">
            Selected: {selectedSeats.length} / {ticketCount} seats
          </span>
          <span className="font-semibold text-foreground">
            {selectedSeats.join(', ') || 'None'}
          </span>
        </div>
        <div className="flex items-center justify-between pt-2 border-t border-border">
          <span className="text-muted-foreground">Total</span>
          <span className="text-xl font-bold text-primary">
            ₹{totalPrice.toLocaleString()}
          </span>
        </div>
      </div>

      <div className="flex gap-4">
        <Button variant="outline" size="lg" className="flex-1" onClick={onBack}>
          Back
        </Button>
        <Button
          variant="hero"
          size="lg"
          className="flex-1"
          onClick={onNext}
          disabled={selectedSeats.length !== ticketCount}
        >
          Proceed to Checkout
        </Button>
      </div>
    </div>
  );
};
