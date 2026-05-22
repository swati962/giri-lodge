'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Loader2, Search } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { createBooking } from '@/app/actions/bookings';
import { Customer, Room } from '@/lib/types';

export default function NewBookingPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [customerSearch, setCustomerSearch] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function loadData() {
      const [customersResult, roomsResult] = await Promise.all([
        supabase.from('customers').select('*').order('full_name'),
        supabase.from('rooms').select('*').eq('status', 'AVAILABLE').order('room_number'),
      ]);

      setCustomers(customersResult.data || []);
      setRooms(roomsResult.data || []);
      setIsLoading(false);
    }
    loadData();
  }, [supabase]);

  const filteredCustomers = customers.filter(
    (c) =>
      c.full_name.toLowerCase().includes(customerSearch.toLowerCase()) ||
      c.phone?.includes(customerSearch) ||
      c.aadhar_number?.includes(customerSearch)
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedCustomer || !selectedRoom) {
      setError('Please select a customer and room');
      return;
    }

    setIsSubmitting(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    formData.set('customer_id', selectedCustomer.id);
    formData.set('room_id', selectedRoom.id);

    const result = await createBooking(formData);

    if (result.error) {
      setError(result.error);
      setIsSubmitting(false);
    } else {
      router.push('/dashboard/bookings');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <Link
          href="/dashboard/bookings"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Bookings
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">New Booking (Check-In)</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Customer Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Customer <span className="text-red-500">*</span>
            </label>
            <div className="relative mb-2">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, phone, or Aadhar..."
                value={customerSearch}
                onChange={(e) => setCustomerSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
              />
            </div>
            {selectedCustomer ? (
              <div className="p-3 bg-indigo-50 rounded-lg flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">{selectedCustomer.full_name}</p>
                  <p className="text-sm text-gray-500">
                    {selectedCustomer.phone || 'No phone'} • {selectedCustomer.aadhar_number || 'No Aadhar'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedCustomer(null)}
                  className="text-indigo-600 hover:text-indigo-700 text-sm"
                >
                  Change
                </button>
              </div>
            ) : (
              <div className="max-h-48 overflow-y-auto border border-gray-200 rounded-lg">
                {filteredCustomers.length > 0 ? (
                  filteredCustomers.map((customer) => (
                    <button
                      key={customer.id}
                      type="button"
                      onClick={() => {
                        setSelectedCustomer(customer);
                        setCustomerSearch('');
                      }}
                      className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-0"
                    >
                      <p className="font-medium text-gray-900">{customer.full_name}</p>
                      <p className="text-sm text-gray-500">
                        {customer.phone || 'No phone'} • {customer.aadhar_number || 'No Aadhar'}
                      </p>
                    </button>
                  ))
                ) : (
                  <div className="px-4 py-6 text-center text-gray-500">
                    No customers found.{' '}
                    <Link href="/dashboard/customers/new" className="text-indigo-600 hover:underline">
                      Add one
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Room Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Room <span className="text-red-500">*</span>
            </label>
            {rooms.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {rooms.map((room) => (
                  <button
                    key={room.id}
                    type="button"
                    onClick={() => setSelectedRoom(room)}
                    className={`p-4 rounded-lg border-2 text-left transition ${
                      selectedRoom?.id === room.id
                        ? 'border-indigo-500 bg-indigo-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <p className="font-bold text-gray-900">Room {room.room_number}</p>
                    <p className="text-sm text-gray-500">
                      {room.room_type === 'AC'
                        ? 'AC'
                        : room.room_type === 'NON_AC'
                        ? 'Non-AC'
                        : 'Dormitory'}
                    </p>
                    <p className="text-sm font-medium text-indigo-600 mt-1">
                      ₹{room.price_per_night}/night
                    </p>
                  </button>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center text-gray-500 border border-gray-200 rounded-lg">
                No rooms available.{' '}
                <Link href="/dashboard/rooms" className="text-indigo-600 hover:underline">
                  Manage rooms
                </Link>
              </div>
            )}
          </div>

          {/* Check-in Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Check-In Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="check_in_date"
              required
              defaultValue={new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes (optional)
            </label>
            <textarea
              name="notes"
              rows={2}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none"
              placeholder="Any special requirements or notes..."
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={isSubmitting || !selectedCustomer || !selectedRoom}
              className="flex-1 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  Processing...
                </>
              ) : (
                'Check-In Guest'
              )}
            </button>
            <Link
              href="/dashboard/bookings"
              className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
