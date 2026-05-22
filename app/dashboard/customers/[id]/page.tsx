import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Edit, Phone, Mail, CreditCard, MapPin, Calendar } from 'lucide-react';

export default async function CustomerDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createClient();
  const { data: customer, error } = await supabase
    .from('customers')
    .select('*')
    .eq('id', params.id)
    .single();

  if (error || !customer) {
    notFound();
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <Link
          href="/dashboard/customers"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Customers
        </Link>
        <Link
          href={`/dashboard/customers/${params.id}/edit`}
          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
        >
          <Edit className="w-4 h-4" />
          Edit
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-8">
          <h1 className="text-2xl font-bold text-white">{customer.full_name}</h1>
          <p className="text-indigo-100 mt-1">Customer Details</p>
        </div>

        {/* Details */}
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Phone */}
            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Phone className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Phone Number</p>
                <p className="font-medium text-gray-900">
                  {customer.phone || 'Not provided'}
                </p>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-start gap-3">
              <div className="p-2 bg-green-50 rounded-lg">
                <Mail className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium text-gray-900">
                  {customer.email || 'Not provided'}
                </p>
              </div>
            </div>

            {/* Aadhar Number */}
            <div className="flex items-start gap-3">
              <div className="p-2 bg-orange-50 rounded-lg">
                <CreditCard className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Aadhar Number</p>
                <p className="font-medium text-gray-900 font-mono">
                  {customer.aadhar_number || 'Not provided'}
                </p>
              </div>
            </div>

            {/* Created Date */}
            <div className="flex items-start gap-3">
              <div className="p-2 bg-purple-50 rounded-lg">
                <Calendar className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Registered On</p>
                <p className="font-medium text-gray-900">
                  {new Date(customer.created_at).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </p>
              </div>
            </div>
          </div>

          {/* Address */}
          <div className="flex items-start gap-3">
            <div className="p-2 bg-red-50 rounded-lg">
              <MapPin className="w-5 h-5 text-red-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-500">Address</p>
              <p className="font-medium text-gray-900">
                {customer.address || 'Not provided'}
              </p>
            </div>
          </div>

          {/* Aadhar Photo */}
          <div>
            <p className="text-sm text-gray-500 mb-3">Aadhar Card Photo</p>
            {customer.aadhar_photo_url ? (
              <div className="border border-gray-200 rounded-lg overflow-hidden inline-block">
                <img
                  src={customer.aadhar_photo_url}
                  alt="Aadhar Card"
                  className="max-w-full max-h-64 object-contain"
                />
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center text-gray-400">
                No photo uploaded
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
