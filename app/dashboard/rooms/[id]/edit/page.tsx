'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { updateRoom } from '@/app/actions/rooms';
import { Room } from '@/lib/types';

export default function EditRoomPage({ params }: { params: { id: string } }) {
  const [room, setRoom] = useState<Room | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function loadRoom() {
      const { data, error } = await supabase
        .from('rooms')
        .select('*')
        .eq('id', params.id)
        .single();

      if (error || !data) {
        router.push('/dashboard/rooms');
        return;
      }

      setRoom(data);
      setIsLoading(false);
    }
    loadRoom();
  }, [params.id, router, supabase]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const result = await updateRoom(params.id, formData);

    if (result.error) {
      setError(result.error);
      setIsSubmitting(false);
    } else {
      router.push('/dashboard/rooms');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (!room) return null;

  return (
    <div className="max-w-lg mx-auto">
      <div className="mb-6">
        <Link
          href="/dashboard/rooms"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Rooms
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          Edit Room {room.room_number}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Room Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Room Number <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="room_number"
              required
              defaultValue={room.room_number}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
            />
          </div>

          {/* Room Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Room Type <span className="text-red-500">*</span>
            </label>
            <select
              name="room_type"
              required
              defaultValue={room.room_type}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
            >
              <option value="AC">AC Room</option>
              <option value="NON_AC">Non-AC Room</option>
              <option value="DORMITORY">Dormitory</option>
            </select>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status <span className="text-red-500">*</span>
            </label>
            <select
              name="status"
              required
              defaultValue={room.status}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
            >
              <option value="AVAILABLE">Available</option>
              <option value="OCCUPIED">Occupied</option>
              <option value="MAINTENANCE">Under Maintenance</option>
            </select>
          </div>

          {/* Price per Night */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Price per Night (₹) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="price_per_night"
              required
              min="0"
              step="0.01"
              defaultValue={room.price_per_night}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
            />
          </div>

          {/* Capacity */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Capacity (persons) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="capacity"
              required
              min="1"
              defaultValue={room.capacity}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
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
              disabled={isSubmitting}
              className="flex-1 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </button>
            <Link
              href="/dashboard/rooms"
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
