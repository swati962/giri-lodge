import { createClient } from '@/lib/supabase/server';
import { Users, DoorOpen, CalendarCheck, IndianRupee } from 'lucide-react';
import Link from 'next/link';

export default async function DashboardPage() {
  const supabase = createClient();

  // Fetch counts
  const [customersResult, roomsResult, bookingsResult] = await Promise.all([
    supabase.from('customers').select('id', { count: 'exact', head: true }),
    supabase.from('rooms').select('id, status', { count: 'exact' }),
    supabase.from('bookings').select('id, status', { count: 'exact' }),
  ]);

  const totalCustomers = customersResult.count || 0;
  const rooms = roomsResult.data || [];
  const totalRooms = rooms.length;
  const availableRooms = rooms.filter((r) => r.status === 'AVAILABLE').length;
  const bookings = bookingsResult.data || [];
  const activeBookings = bookings.filter((b) => b.status === 'CHECKED_IN').length;

  const stats = [
    {
      label: 'Total Customers',
      value: totalCustomers,
      icon: Users,
      color: 'bg-blue-500',
      href: '/dashboard/customers',
    },
    {
      label: 'Available Rooms',
      value: `${availableRooms}/${totalRooms}`,
      icon: DoorOpen,
      color: 'bg-green-500',
      href: '/dashboard/rooms',
    },
    {
      label: 'Active Bookings',
      value: activeBookings,
      icon: CalendarCheck,
      color: 'bg-orange-500',
      href: '/dashboard/bookings',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link
              key={stat.label}
              href={stat.href}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">
                    {stat.value}
                  </p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            href="/dashboard/customers/new"
            className="flex items-center gap-3 p-4 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition"
          >
            <Users className="w-5 h-5" />
            <span className="font-medium">Add Customer</span>
          </Link>
          <Link
            href="/dashboard/rooms/new"
            className="flex items-center gap-3 p-4 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition"
          >
            <DoorOpen className="w-5 h-5" />
            <span className="font-medium">Add Room</span>
          </Link>
          <Link
            href="/dashboard/bookings/new"
            className="flex items-center gap-3 p-4 bg-orange-50 text-orange-600 rounded-lg hover:bg-orange-100 transition"
          >
            <CalendarCheck className="w-5 h-5" />
            <span className="font-medium">New Booking</span>
          </Link>
          <Link
            href="/dashboard/bookings"
            className="flex items-center gap-3 p-4 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition"
          >
            <IndianRupee className="w-5 h-5" />
            <span className="font-medium">Check-Out</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
