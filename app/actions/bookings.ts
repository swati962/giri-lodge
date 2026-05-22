'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function createBooking(formData: FormData) {
  const supabase = createClient();

  const customer_id = formData.get('customer_id') as string;
  const room_id = formData.get('room_id') as string;
  const check_in_date = formData.get('check_in_date') as string;
  const notes = formData.get('notes') as string;

  // Check if room is available
  const { data: room } = await supabase
    .from('rooms')
    .select('status')
    .eq('id', room_id)
    .single();

  if (!room || room.status !== 'AVAILABLE') {
    return { error: 'Room is not available' };
  }

  // Create booking
  const { data: booking, error: bookingError } = await supabase
    .from('bookings')
    .insert({
      customer_id,
      room_id,
      check_in_date,
      notes: notes || null,
      status: 'CHECKED_IN',
    })
    .select()
    .single();

  if (bookingError) {
    return { error: bookingError.message };
  }

  // Update room status to occupied
  await supabase
    .from('rooms')
    .update({ status: 'OCCUPIED' })
    .eq('id', room_id);

  revalidatePath('/dashboard');
  revalidatePath('/dashboard/bookings');
  revalidatePath('/dashboard/rooms');
  return { data: booking };
}

export async function checkOutBooking(id: string, totalAmount: number) {
  const supabase = createClient();

  // Get booking to find room
  const { data: booking } = await supabase
    .from('bookings')
    .select('room_id')
    .eq('id', id)
    .single();

  if (!booking) {
    return { error: 'Booking not found' };
  }

  // Update booking
  const { error: bookingError } = await supabase
    .from('bookings')
    .update({
      status: 'CHECKED_OUT',
      check_out_date: new Date().toISOString(),
      total_amount: totalAmount,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id);

  if (bookingError) {
    return { error: bookingError.message };
  }

  // Update room status to available
  await supabase
    .from('rooms')
    .update({ status: 'AVAILABLE' })
    .eq('id', booking.room_id);

  revalidatePath('/dashboard');
  revalidatePath('/dashboard/bookings');
  revalidatePath('/dashboard/rooms');
  return { success: true };
}

export async function cancelBooking(id: string) {
  const supabase = createClient();

  // Get booking to find room
  const { data: booking } = await supabase
    .from('bookings')
    .select('room_id, status')
    .eq('id', id)
    .single();

  if (!booking) {
    return { error: 'Booking not found' };
  }

  // Update booking
  const { error: bookingError } = await supabase
    .from('bookings')
    .update({
      status: 'CANCELLED',
      updated_at: new Date().toISOString(),
    })
    .eq('id', id);

  if (bookingError) {
    return { error: bookingError.message };
  }

  // If was checked in, make room available again
  if (booking.status === 'CHECKED_IN') {
    await supabase
      .from('rooms')
      .update({ status: 'AVAILABLE' })
      .eq('id', booking.room_id);
  }

  revalidatePath('/dashboard');
  revalidatePath('/dashboard/bookings');
  revalidatePath('/dashboard/rooms');
  return { success: true };
}
