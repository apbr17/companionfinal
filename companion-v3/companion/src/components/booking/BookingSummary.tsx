import { Calendar, Clock, MapPin, Ticket, User, CreditCard, Check, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Event, Companion } from '@/data/mockData';
import { useState } from 'react';
import { useRazorpay } from '@/hooks/use-razorpay';
import { useAuth } from '@/context/AuthContext';

interface BookingSummaryProps {
  event: Event;
  ticketCount: number;
  selectedSeats: string[];
  companion: Companion | null;
  companionEnabled: boolean;
  totalPrice: number;
  onBack: () => void;
  onConfirm: () => void;
}

export const BookingSummary = ({
  event,
  ticketCount,
  selectedSeats,
  companion,
  companionEnabled,
  totalPrice,
  onBack,
  onConfirm,
}: BookingSummaryProps) => {
  const { isLoggedIn } = useAuth();
  const { startPayment, processing } = useRazorpay();
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [bookingRef, setBookingRef] = useState('');
  const [paymentId, setPaymentId] = useState('');

  const convenience = Math.round(totalPrice * 0.05);
  const grandTotal = totalPrice + convenience;
  const grandTotalPaise = grandTotal * 100;

  const handlePay = () => {
    setPaymentError(null);
    startPayment({
      amountPaise: grandTotalPaise,
      eventId: event.id,
      eventTitle: event.title,
      seats: selectedSeats.join(', '),
      ticketCount,
      totalPrice: grandTotal,
      onSuccess: (ref, pid) => {
        setBookingRef(ref);
        setPaymentId(pid);
        setConfirmed(true);
        onConfirm();
      },
      onFailure: (msg) => setPaymentError(msg),
    });
  };

  // ── Confirmed state ────────────────────────────────────────
  if (confirmed) {
    return (
      <div className="animate-scale-in text-center py-12">
        <div className="w-20 h-20 gradient-hero rounded-full flex items-center justify-center mx-auto mb-6">
          <Check className="w-10 h-10 text-primary-foreground" />
        </div>
        <h2 className="font-display text-3xl font-bold text-foreground mb-4">Booking Confirmed!</h2>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
          Your tickets have been booked and payment received. A confirmation email will be sent shortly.
        </p>
        <div className="bg-muted rounded-2xl p-6 max-w-md mx-auto mb-8 text-left space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Booking Ref</span>
            <span className="font-mono font-semibold text-foreground">{bookingRef}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Payment ID</span>
            <span className="font-mono text-sm text-foreground truncate max-w-[160px]">{paymentId}</span>
          </div>
          {selectedSeats.length > 0 && (
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Seats</span>
              <span className="font-semibold text-foreground">{selectedSeats.join(', ')}</span>
            </div>
          )}
          <div className="flex items-center justify-between pt-3 border-t border-border">
            <span className="text-muted-foreground">Amount Paid</span>
            <span className="font-bold text-primary">₹{grandTotal.toLocaleString()}</span>
          </div>
        </div>
        <Button variant="hero" size="lg" onClick={() => window.location.reload()}>
          Browse More Events
        </Button>
      </div>
    );
  }

  // ── Summary + Pay ──────────────────────────────────────────
  return (
    <div className="animate-fade-in">
      <h2 className="font-display text-2xl font-bold text-foreground mb-6">Booking Summary</h2>

      {/* Event card */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden mb-6">
        <div className="flex gap-4 p-4">
          <img src={event.image} alt={event.title} className="w-24 h-32 rounded-lg object-cover" />
          <div className="flex-1">
            <h3 className="font-display text-lg font-semibold text-foreground mb-2">{event.title}</h3>
            <div className="space-y-1 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-primary" />
                {new Date(event.date).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" />
                {event.time}
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                {event.venue}, {event.city}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Ticket details */}
      <div className="bg-muted rounded-2xl p-4 mb-6">
        <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
          <Ticket className="w-5 h-5 text-primary" /> Ticket Details
        </h4>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Number of Tickets</span>
            <span className="font-medium text-foreground">{ticketCount}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Seats</span>
            <span className="font-medium text-foreground">{selectedSeats.join(', ') || '—'}</span>
          </div>
        </div>
      </div>

      {/* Companion */}
      {companionEnabled && companion && (
        <div className="bg-muted rounded-2xl p-4 mb-6">
          <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <User className="w-5 h-5 text-primary" /> Your Companion
          </h4>
          <div className="flex items-center gap-4">
            <img src={companion.avatar} alt={companion.name} className="w-12 h-12 rounded-full object-cover" />
            <div>
              <p className="font-medium text-foreground">{companion.name}</p>
              <p className="text-sm text-muted-foreground">{companion.age} yrs • {companion.interests.slice(0, 2).join(', ')}</p>
            </div>
          </div>
        </div>
      )}

      {/* Price breakdown */}
      <div className="bg-card border border-border rounded-2xl p-4 mb-6">
        <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-primary" /> Price Breakdown
        </h4>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Ticket Price</span>
            <span className="text-foreground">₹{totalPrice.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Convenience Fee (5%)</span>
            <span className="text-foreground">₹{convenience.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between pt-3 border-t border-border">
            <span className="font-semibold text-foreground">Total</span>
            <span className="text-xl font-bold text-primary">₹{grandTotal.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Guest warning */}
      {!isLoggedIn && (
        <div className="flex items-start gap-3 bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 mb-6">
          <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-amber-600 dark:text-amber-400">
            <a href="/signin" className="font-semibold underline">Sign in</a> to save your booking history and get a booking reference.
          </p>
        </div>
      )}

      {/* Payment error */}
      {paymentError && (
        <div className="flex items-start gap-3 bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-6">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-500">{paymentError}</p>
        </div>
      )}

      <div className="flex gap-4">
        <Button variant="outline" size="lg" className="flex-1" onClick={onBack}>
          Back
        </Button>
        <Button
          variant="hero"
          size="lg"
          className="flex-1 gap-2"
          onClick={handlePay}
          disabled={processing}
        >
          {processing ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Processing…
            </>
          ) : (
            <>
              <CreditCard className="w-4 h-4" />
              Pay ₹{grandTotal.toLocaleString()}
            </>
          )}
        </Button>
      </div>

      <p className="text-xs text-muted-foreground text-center mt-4">
        Secured by Razorpay • UPI, Cards, NetBanking, Wallets accepted
      </p>
    </div>
  );
};
