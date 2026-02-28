import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';

interface PaymentOptions {
  amountPaise: number;       // INR × 100  e.g. ₹450 → 45000
  eventId: string;
  eventTitle: string;
  seats: string;
  ticketCount: number;
  totalPrice: number;
  onSuccess: (bookingRef: string, paymentId: string) => void;
  onFailure: (msg: string) => void;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

const loadRazorpayScript = (): Promise<boolean> =>
  new Promise((resolve) => {
    if (document.getElementById('razorpay-sdk')) { resolve(true); return; }
    const script = document.createElement('script');
    script.id = 'razorpay-sdk';
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

export const useRazorpay = () => {
  const { user } = useAuth();
  const [processing, setProcessing] = useState(false);
  const apiBase = import.meta.env.VITE_API_BASE || '';

  const startPayment = async (opts: PaymentOptions) => {
    setProcessing(true);

    // 1. Load Razorpay SDK
    const loaded = await loadRazorpayScript();
    if (!loaded) {
      opts.onFailure('Could not load Razorpay. Check your internet connection.');
      setProcessing(false);
      return;
    }

    try {
      // 2. Create order on our backend
      const orderRes = await fetch(`${apiBase}/payment.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create_order',
          user_id: (user as any)?.id ?? 0,
          amount_paise: opts.amountPaise,
        }),
      });
      const orderData = await orderRes.json();

      if (!orderData.success) {
        opts.onFailure(orderData.message || 'Could not create payment order.');
        setProcessing(false);
        return;
      }

      // 3. Open Razorpay checkout
      const rzp = new window.Razorpay({
        key: orderData.key_id,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Companion',
        description: opts.eventTitle,
        order_id: orderData.order_id,
        prefill: {
          name: user ? `${(user as any).firstName} ${(user as any).lastName}` : '',
          email: (user as any)?.email ?? '',
        },
        theme: { color: '#e63946' },
        modal: {
          ondismiss: () => {
            opts.onFailure('Payment cancelled.');
            setProcessing(false);
          },
        },
        handler: async (response: any) => {
          // 4. Verify payment on backend
          try {
            const verifyRes = await fetch(`${apiBase}/payment.php`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                action: 'verify_payment',
                user_id: (user as any)?.id ?? 0,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                event_id: opts.eventId,
                seats: opts.seats,
                ticket_count: opts.ticketCount,
                total_price: opts.totalPrice,
              }),
            });
            const verifyData = await verifyRes.json();
            if (verifyData.success) {
              opts.onSuccess(verifyData.booking_ref, response.razorpay_payment_id);
            } else {
              opts.onFailure(verifyData.message || 'Payment verification failed.');
            }
          } catch {
            opts.onFailure('Could not verify payment with server.');
          } finally {
            setProcessing(false);
          }
        },
      });

      rzp.open();
    } catch {
      opts.onFailure('Something went wrong. Please try again.');
      setProcessing(false);
    }
  };

  return { startPayment, processing };
};
