// Database Types for Hotel Management System

export type RoomType = 'AC' | 'NON_AC' | 'DORMITORY';
export type RoomStatus = 'AVAILABLE' | 'OCCUPIED' | 'MAINTENANCE';
export type BookingStatus = 'CHECKED_IN' | 'CHECKED_OUT' | 'CANCELLED';

export interface Customer {
  id: string;
  full_name: string;
  phone: string | null;
  email: string | null;
  aadhar_number: string | null;
  aadhar_photo_url: string | null;
  address: string | null;
  created_at: string;
  updated_at: string;
}

export interface Room {
  id: string;
  room_number: string;
  room_type: RoomType;
  status: RoomStatus;
  price_per_night: number;
  capacity: number;
  created_at: string;
}

export interface Booking {
  id: string;
  customer_id: string;
  room_id: string;
  check_in_date: string;
  check_out_date: string | null;
  status: BookingStatus;
  total_amount: number | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  // Joined data
  customer?: Customer;
  room?: Room;
}

export interface CustomerFormData {
  full_name: string;
  phone: string;
  email: string;
  aadhar_number: string;
  address: string;
  aadhar_photo?: File | null;
}

export interface RoomFormData {
  room_number: string;
  room_type: RoomType;
  price_per_night: number;
  capacity: number;
}

export interface BookingFormData {
  customer_id: string;
  room_id: string;
  check_in_date: string;
  notes: string;
}
