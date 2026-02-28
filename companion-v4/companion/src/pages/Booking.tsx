import { useState, useMemo } from 'react';
import { ArrowLeft, X } from 'lucide-react';
import { Event, Companion, generateSeats } from '@/data/mockData';
import { BookingSteps } from '@/components/booking/BookingSteps';
import { TicketSelection } from '@/components/booking/TicketSelection';
import { CompanionFinder } from '@/components/booking/CompanionFinder';
import { SeatSelection } from '@/components/booking/SeatSelection';
import { BookingSummary } from '@/components/booking/BookingSummary';

interface BookingProps {
  event: Event;
  onClose: () => void;
}

export const Booking = ({ event, onClose }: BookingProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [ticketCount, setTicketCount] = useState(1);
  const [attendanceType, setAttendanceType] = useState<'alone' | 'group'>('group');
  const [companionEnabled, setCompanionEnabled] = useState(false);
  const [selectedCompanion, setSelectedCompanion] = useState<Companion | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);

  const isMovie = event.category === 'movies';
  const showCompanionStep = attendanceType === 'alone';

  const seats = useMemo(() => generateSeats(), []);

  const totalPrice = selectedSeats.reduce((total, seatId) => {
    const seat = seats.find((s) => s.id === seatId);
    return total + (seat?.price || event.price);
  }, 0) || event.price * ticketCount;

  const getStepNumber = () => {
    if (!showCompanionStep && !isMovie) {
      // No companion, no seats: Tickets -> Checkout
      return currentStep === 1 ? 1 : 2;
    }
    if (!showCompanionStep && isMovie) {
      // No companion, with seats: Tickets -> Seats -> Checkout
      return currentStep;
    }
    if (showCompanionStep && !isMovie) {
      // With companion, no seats: Tickets -> Companion -> Checkout
      return currentStep;
    }
    // With companion, with seats: Tickets -> Companion -> Seats -> Checkout
    return currentStep;
  };

  const handleNext = () => {
    if (currentStep === 1) {
      if (showCompanionStep) {
        setCurrentStep(2);
      } else if (isMovie) {
        setCurrentStep(2);
      } else {
        setCurrentStep(2);
      }
    } else if (currentStep === 2) {
      if (showCompanionStep && isMovie) {
        setCurrentStep(3);
      } else {
        setCurrentStep(showCompanionStep || isMovie ? 3 : 2);
      }
    } else if (currentStep === 3) {
      setCurrentStep(4);
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(1, prev - 1));
  };

  const handleConfirm = () => {
    // Booking confirmed - handled in BookingSummary component
  };

  const renderStep = () => {
    if (currentStep === 1) {
      return (
        <TicketSelection
          event={event}
          ticketCount={ticketCount}
          onTicketCountChange={setTicketCount}
          attendanceType={attendanceType}
          onAttendanceTypeChange={setAttendanceType}
          onNext={handleNext}
        />
      );
    }

    if (showCompanionStep && currentStep === 2) {
      return (
        <CompanionFinder
          enabled={companionEnabled}
          onEnabledChange={setCompanionEnabled}
          selectedCompanion={selectedCompanion}
          onCompanionSelect={setSelectedCompanion}
          onNext={handleNext}
          onBack={handleBack}
        />
      );
    }

    if (isMovie && ((showCompanionStep && currentStep === 3) || (!showCompanionStep && currentStep === 2))) {
      return (
        <SeatSelection
          ticketCount={ticketCount}
          selectedSeats={selectedSeats}
          onSeatsSelect={setSelectedSeats}
          onNext={handleNext}
          onBack={handleBack}
        />
      );
    }

    // Checkout step
    return (
      <BookingSummary
        event={event}
        ticketCount={ticketCount}
        selectedSeats={selectedSeats.length > 0 ? selectedSeats : [`General x${ticketCount}`]}
        companion={selectedCompanion}
        companionEnabled={companionEnabled}
        totalPrice={totalPrice}
        onBack={handleBack}
        onConfirm={handleConfirm}
      />
    );
  };

  const getTotalSteps = () => {
    let steps = 2; // Tickets + Checkout
    if (showCompanionStep) steps++;
    if (isMovie) steps++;
    return steps;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full hover:bg-muted flex items-center justify-center transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="font-semibold text-foreground line-clamp-1">
                {event.title}
              </h1>
              <p className="text-sm text-muted-foreground">
                {new Date(event.date).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                })} • {event.time}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full hover:bg-muted flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <BookingSteps
          currentStep={currentStep}
          showCompanionStep={showCompanionStep}
          isMovie={isMovie}
        />
        {renderStep()}
      </main>
    </div>
  );
};

export default Booking;
