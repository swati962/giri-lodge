'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { RoomType, RoomStatus } from '@/lib/types';

export async function createRoom(formData: FormData) {
  const supabase = createClient();

  const room_number = formData.get('room_number') as string;
  const room_type = formData.get('room_type') as RoomType;
  const price_per_night = parseFloat(formData.get('price_per_night') as string);
  const capacity = parseInt(formData.get('capacity') as string);

  // Check if room number already exists
  const { data: existing } = await supabase
    .from('rooms')
    .select('id')
    .eq('room_number', room_number)
    .single();

  if (existing) {
    return { error: 'Room number already exists' };
  }

  const { data, error } = await supabase
    .from('rooms')
    .insert({
      room_number,
      room_type,
      price_per_night,
      capacity,
      status: 'AVAILABLE' as RoomStatus,
    })
    .select()
    .single();

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/dashboard/rooms');
  return { data };
}

export async function updateRoom(id: string, formData: FormData) {
  const supabase = createClient();

  const room_number = formData.get('room_number') as string;
  const room_type = formData.get('room_type') as RoomType;
  const price_per_night = parseFloat(formData.get('price_per_night') as string);
  const capacity = parseInt(formData.get('capacity') as string);
  const status = formData.get('status') as RoomStatus;

  // Check if room number already exists (excluding this room)
  const { data: existing } = await supabase
    .from('rooms')
    .select('id')
    .eq('room_number', room_number)
    .neq('id', id)
    .single();

  if (existing) {
    return { error: 'Room number already exists' };
  }

  const { data, error } = await supabase
    .from('rooms')
    .update({
      room_number,
      room_type,
      price_per_night,
      capacity,
      status,
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/dashboard/rooms');
  revalidatePath(`/dashboard/rooms/${id}`);
  return { data };
}

export async function deleteRoom(id: string) {
  const supabase = createClient();

  // Check if room has active bookings
  const { data: bookings } = await supabase
    .from('bookings')
    .select('id')
    .eq('room_id', id)
    .eq('status', 'CHECKED_IN')
    .limit(1);

  if (bookings && bookings.length > 0) {
    return { error: 'Cannot delete room with active booking' };
  }

  const { error } = await supabase.from('rooms').delete().eq('id', id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/dashboard/rooms');
  return { success: true };
}

export async function updateRoomStatus(id: string, status: RoomStatus) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('rooms')
    .update({ status })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/dashboard/rooms');
  return { data };
}
