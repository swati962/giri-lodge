-- Hotel Management System - Supabase Database Schema
-- Run this SQL in your Supabase SQL Editor to create all tables

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Customers table
CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  email VARCHAR(255),
  aadhar_number VARCHAR(12),
  aadhar_photo_url TEXT,
  address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for search
CREATE INDEX idx_customers_name ON customers(full_name);
CREATE INDEX idx_customers_phone ON customers(phone);
CREATE INDEX idx_customers_aadhar ON customers(aadhar_number);

-- Rooms table
CREATE TABLE rooms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  room_number VARCHAR(20) UNIQUE NOT NULL,
  room_type VARCHAR(20) NOT NULL CHECK (room_type IN ('AC', 'NON_AC', 'DORMITORY')),
  status VARCHAR(20) NOT NULL DEFAULT 'AVAILABLE' CHECK (status IN ('AVAILABLE', 'OCCUPIED', 'MAINTENANCE')),
  price_per_night DECIMAL(10, 2) NOT NULL,
  capacity INTEGER NOT NULL DEFAULT 2,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for room lookup
CREATE INDEX idx_rooms_status ON rooms(status);
CREATE INDEX idx_rooms_type ON rooms(room_type);

-- Bookings table
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE RESTRICT,
  room_id UUID NOT NULL REFERENCES rooms(id) ON DELETE RESTRICT,
  check_in_date DATE NOT NULL,
  check_out_date DATE,
  status VARCHAR(20) NOT NULL DEFAULT 'CHECKED_IN' CHECK (status IN ('CHECKED_IN', 'CHECKED_OUT', 'CANCELLED')),
  total_amount DECIMAL(10, 2),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for bookings
CREATE INDEX idx_bookings_customer ON bookings(customer_id);
CREATE INDEX idx_bookings_room ON bookings(room_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_dates ON bookings(check_in_date, check_out_date);

-- Enable Row Level Security (RLS)
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- RLS Policies (allow authenticated users full access)
CREATE POLICY "Allow authenticated access to customers" ON customers
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow authenticated access to rooms" ON rooms
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow authenticated access to bookings" ON bookings
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Insert sample rooms (optional - uncomment to add sample data)
/*
INSERT INTO rooms (room_number, room_type, price_per_night, capacity) VALUES
  ('101', 'AC', 1500, 2),
  ('102', 'AC', 1500, 2),
  ('103', 'AC', 1800, 3),
  ('201', 'NON_AC', 800, 2),
  ('202', 'NON_AC', 800, 2),
  ('203', 'NON_AC', 1000, 3),
  ('D1', 'DORMITORY', 300, 6),
  ('D2', 'DORMITORY', 300, 6);
*/
