'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { createRoom } from '@/app/actions/rooms';

export default function NewRoomPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const result = await createRoom(formData);

    if (result.error) {
      setError(result.error);
      setIsSubmitting(false);
    } else {
      router.push('/dashboard/rooms');
    }
  };

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
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Add New Room</h2>

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
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
              placeholder="e.g., 101, A1, D-1"
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
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
            >
              <option value="AC">AC Room</option>
              <option value="NON_AC">Non-AC Room</option>
              <option value="DORMITORY">Dormitory</option>
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
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
              placeholder="e.g., 1500"
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
              defaultValue={2}
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
                'Add Room'
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
