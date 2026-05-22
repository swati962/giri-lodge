'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function createCustomer(formData: FormData) {
  try {
    console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
    
    const supabase = createClient();
    
    const full_name = formData.get('full_name') as string;
    const phone = formData.get('phone') as string;
    const email = formData.get('email') as string;
    const aadhar_number = formData.get('aadhar_number') as string;
    const address = formData.get('address') as string;
    const aadhar_photo = formData.get('aadhar_photo') as File | null;

    console.log('Creating customer:', full_name);

    let aadhar_photo_url: string | null = null;

    // Skip photo upload for now to test basic insert
    /*
    if (aadhar_photo && aadhar_photo.size > 0) {
      const fileExt = aadhar_photo.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('aadhar-photos')
        .upload(fileName, aadhar_photo);

      if (uploadError) {
        return { error: 'Failed to upload Aadhar photo: ' + uploadError.message };
      }

      const { data: { publicUrl } } = supabase.storage
        .from('aadhar-photos')
        .getPublicUrl(fileName);
      
      aadhar_photo_url = publicUrl;
    }
    */

    console.log('Inserting into database...');
    
    const { data, error } = await supabase
      .from('customers')
      .insert({
        full_name,
        phone: phone || null,
        email: email || null,
        aadhar_number: aadhar_number || null,
        aadhar_photo_url,
        address: address || null,
      })
      .select()
      .single();

    console.log('Insert result:', { data, error });

    if (error) {
      return { error: error.message };
    }

    revalidatePath('/dashboard/customers');
    return { data };
  } catch (err: any) {
    console.error('Server action error:', err);
    return { error: 'Server error: ' + (err.message || 'Unknown error') };
  }
}

export async function updateCustomer(id: string, formData: FormData) {
  const supabase = createClient();
  
  const full_name = formData.get('full_name') as string;
  const phone = formData.get('phone') as string;
  const email = formData.get('email') as string;
  const aadhar_number = formData.get('aadhar_number') as string;
  const address = formData.get('address') as string;
  const aadhar_photo = formData.get('aadhar_photo') as File | null;
  const existing_photo_url = formData.get('existing_photo_url') as string;

  let aadhar_photo_url: string | null = existing_photo_url || null;

  // Upload new Aadhar photo if provided
  if (aadhar_photo && aadhar_photo.size > 0) {
    const fileExt = aadhar_photo.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('aadhar-photos')
      .upload(fileName, aadhar_photo);

    if (uploadError) {
      return { error: 'Failed to upload Aadhar photo: ' + uploadError.message };
    }

    const { data: { publicUrl } } = supabase.storage
      .from('aadhar-photos')
      .getPublicUrl(fileName);
    
    aadhar_photo_url = publicUrl;
  }

  const { data, error } = await supabase
    .from('customers')
    .update({
      full_name,
      phone: phone || null,
      email: email || null,
      aadhar_number: aadhar_number || null,
      aadhar_photo_url,
      address: address || null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/dashboard/customers');
  revalidatePath(`/dashboard/customers/${id}`);
  return { data };
}

export async function deleteCustomer(id: string) {
  const supabase = createClient();

  // Check if customer has active bookings
  const { data: bookings } = await supabase
    .from('bookings')
    .select('id')
    .eq('customer_id', id)
    .eq('status', 'CHECKED_IN')
    .limit(1);

  if (bookings && bookings.length > 0) {
    return { error: 'Cannot delete customer with active bookings' };
  }

  const { error } = await supabase.from('customers').delete().eq('id', id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/dashboard/customers');
  return { success: true };
}

export async function searchCustomers(query: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('customers')
    .select('*')
    .or(`full_name.ilike.%${query}%,phone.ilike.%${query}%,aadhar_number.ilike.%${query}%`)
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) {
    return { error: error.message };
  }

  return { data };
}
