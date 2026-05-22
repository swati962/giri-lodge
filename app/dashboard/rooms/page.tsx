import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { Room } from '@/lib/types';
import DeleteRoomButton from './DeleteRoomButton';

const roomTypeLabels = {
  AC: 'AC Room',
  NON_AC: 'Non-AC Room',
  DORMITORY: 'Dormitory',
};

const statusColors = {
  AVAILABLE: 'bg-green-100 text-green-700',
  OCCUPIED: 'bg-red-100 text-red-700',
  MAINTENANCE: 'bg-yellow-100 text-yellow-700',
};

export default async function RoomsPage() {
  const supabase = createClient();
  const { data: rooms } = await supabase
    .from('rooms')
    .select('*')
    .order('room_number', { ascending: true });

  // Group rooms by type
  const acRooms = rooms?.filter((r) => r.room_type === 'AC') || [];
  const nonAcRooms = rooms?.filter((r) => r.room_type === 'NON_AC') || [];
  const dormitory = rooms?.filter((r) => r.room_type === 'DORMITORY') || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex gap-4">
          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
            AC: {acRooms.length}
          </span>
          <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
            Non-AC: {nonAcRooms.length}
          </span>
          <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
            Dormitory: {dormitory.length}
          </span>
        </div>
        <Link
          href="/dashboard/rooms/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
        >
          <Plus className="w-5 h-5" />
          Add Room
        </Link>
      </div>

      {/* Rooms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {rooms && rooms.length > 0 ? (
          rooms.map((room: Room) => (
            <div
              key={room.id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    Room {room.room_number}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {roomTypeLabels[room.room_type]}
                  </p>
                </div>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    statusColors[room.status]
                  }`}
                >
                  {room.status === 'AVAILABLE'
                    ? 'Available'
                    : room.status === 'OCCUPIED'
                    ? 'Occupied'
                    : 'Maintenance'}
                </span>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Price/Night</span>
                  <span className="font-medium text-gray-900">
                    ₹{room.price_per_night}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Capacity</span>
                  <span className="font-medium text-gray-900">
                    {room.capacity} {room.capacity === 1 ? 'person' : 'persons'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                <Link
                  href={`/dashboard/rooms/${room.id}/edit`}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition"
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </Link>
                <DeleteRoomButton roomId={room.id} />
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12 text-gray-500">
            No rooms yet. Add your first room!
          </div>
        )}
      </div>
    </div>
  );
}
