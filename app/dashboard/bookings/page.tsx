import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { Plus, LogOut, XCircle } from 'lucide-react';
import BookingActions from './BookingActions';

const statusColors = {
  CHECKED_IN: 'bg-green-100 text-green-700',
  CHECKED_OUT: 'bg-blue-100 text-blue-700',
  CANCELLED: 'bg-red-100 text-red-700',
};

const statusLabels = {
  CHECKED_IN: 'Checked In',
  CHECKED_OUT: 'Checked Out',
  CANCELLED: 'Cancelled',
};

export default async function BookingsPage() {
  const supabase = createClient();

  const { data: bookings } = await supabase
    .from('bookings')
    .select(`
      *,
      customer:customers(id, full_name, phone),
      room:rooms(id, room_number, room_type, price_per_night)
    `)
    .order('created_at', { ascending: false });

  const activeBookings = bookings?.filter((b) => b.status === 'CHECKED_IN') || [];
  const pastBookings = bookings?.filter((b) => b.status !== 'CHECKED_IN') || [];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex gap-4">
          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
            Active: {activeBookings.length}
          </span>
          <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
            Total: {bookings?.length || 0}
          </span>
        </div>
        <Link
          href="/dashboard/bookings/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
        >
          <Plus className="w-5 h-5" />
          New Booking
        </Link>
      </div>

      {/* Active Bookings */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Active Bookings</h2>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                    Guest
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                    Room
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                    Check-In
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                    Days
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                    Est. Total
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {activeBookings.length > 0 ? (
                  activeBookings.map((booking: any) => {
                    const checkIn = new Date(booking.check_in_date);
                    const today = new Date();
                    const days = Math.max(1, Math.ceil((today.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24)));
                    const estimatedTotal = days * (booking.room?.price_per_night || 0);

                    return (
                      <tr key={booking.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="font-medium text-gray-900">
                            {booking.customer?.full_name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {booking.customer?.phone || 'No phone'}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-medium text-gray-900">
                            Room {booking.room?.room_number}
                          </div>
                          <div className="text-sm text-gray-500">
                            {booking.room?.room_type === 'AC'
                              ? 'AC'
                              : booking.room?.room_type === 'NON_AC'
                              ? 'Non-AC'
                              : 'Dormitory'}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-600">
                          {checkIn.toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                          })}
                        </td>
                        <td className="px-6 py-4 text-gray-600">{days}</td>
                        <td className="px-6 py-4 font-medium text-gray-900">
                          ₹{estimatedTotal}
                        </td>
                        <td className="px-6 py-4">
                          <BookingActions
                            bookingId={booking.id}
                            estimatedTotal={estimatedTotal}
                          />
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                      No active bookings
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Past Bookings */}
      {pastBookings.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Past Bookings</h2>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                      Guest
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                      Room
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                      Check-In
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                      Check-Out
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                      Total
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {pastBookings.map((booking: any) => (
                    <tr key={booking.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">
                          {booking.customer?.full_name}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        Room {booking.room?.room_number}
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {new Date(booking.check_in_date).toLocaleDateString('en-IN')}
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {booking.check_out_date
                          ? new Date(booking.check_out_date).toLocaleDateString('en-IN')
                          : '-'}
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-900">
                        {booking.total_amount ? `₹${booking.total_amount}` : '-'}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            statusColors[booking.status as keyof typeof statusColors]
                          }`}
                        >
                          {statusLabels[booking.status as keyof typeof statusLabels]}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
