'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut, XCircle, Loader2 } from 'lucide-react';
import { checkOutBooking, cancelBooking } from '@/app/actions/bookings';

export default function BookingActions({
  bookingId,
  estimatedTotal,
}: {
  bookingId: string;
  estimatedTotal: number;
}) {
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [totalAmount, setTotalAmount] = useState(estimatedTotal);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleCheckout = async () => {
    setIsCheckingOut(true);
    setError('');
    const result = await checkOutBooking(bookingId, totalAmount);

    if (result.error) {
      setError(result.error);
      setIsCheckingOut(false);
    } else {
      router.refresh();
    }
  };

  const handleCancel = async () => {
    if (!confirm('Are you sure you want to cancel this booking?')) return;

    setIsCancelling(true);
    setError('');
    const result = await cancelBooking(bookingId);

    if (result.error) {
      setError(result.error);
      setIsCancelling(false);
    } else {
      router.refresh();
    }
  };

  if (showCheckout) {
    return (
      <div className="space-y-2">
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <div className="flex items-center gap-2 justify-end">
        <input
          type="number"
          value={totalAmount}
          onChange={(e) => setTotalAmount(parseFloat(e.target.value) || 0)}
          className="w-24 px-2 py-1 border border-gray-300 rounded text-sm"
          placeholder="Amount"
        />
        <button
          onClick={handleCheckout}
          disabled={isCheckingOut}
          className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 disabled:opacity-50"
        >
          {isCheckingOut ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Confirm'}
        </button>
        <button
          onClick={() => setShowCheckout(false)}
          className="px-3 py-1 bg-gray-200 text-gray-700 rounded text-sm hover:bg-gray-300"
        >
          Cancel
        </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {error && <p className="text-red-600 text-sm">{error}</p>}
      <div className="flex items-center gap-2 justify-end">
      <button
        onClick={() => setShowCheckout(true)}
        className="inline-flex items-center gap-1 px-3 py-1.5 bg-green-100 text-green-700 rounded-lg text-sm hover:bg-green-200 transition"
      >
        <LogOut className="w-4 h-4" />
        Check-Out
      </button>
      <button
        onClick={handleCancel}
        disabled={isCancelling}
        className="inline-flex items-center gap-1 px-3 py-1.5 bg-red-100 text-red-700 rounded-lg text-sm hover:bg-red-200 transition disabled:opacity-50"
      >
        {isCancelling ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <XCircle className="w-4 h-4" />
        )}
        Cancel
      </button>
      </div>
    </div>
  );
}
