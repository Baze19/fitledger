-- FitLedger OS — Production PostgreSQL Schema for Supabase
-- Multi-Tenant Commercial Gym Operating System & Anti-Theft SaaS

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Gyms (Tenants)
CREATE TABLE IF NOT EXISTS gyms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    location TEXT NOT NULL DEFAULT 'Lagos, Nigeria',
    owner_name TEXT NOT NULL,
    owner_phone TEXT,
    owner_email TEXT,
    subscription_tier TEXT NOT NULL DEFAULT 'Pro (₦35,000/mo)',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Staff Members & Front-Desk Cashiers
CREATE TABLE IF NOT EXISTS staff (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    gym_id UUID NOT NULL REFERENCES gyms(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'Front-Desk',
    pin_code TEXT NOT NULL,
    phone TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Gym Members
CREATE TABLE IF NOT EXISTS members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    gym_id UUID NOT NULL REFERENCES gyms(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    plan_type TEXT NOT NULL DEFAULT 'Monthly All-Access (₦30,000)',
    pass_code TEXT UNIQUE NOT NULL,
    status TEXT NOT NULL DEFAULT 'Active', -- 'Active', 'Expiring Soon', 'Expired'
    expiry_date DATE NOT NULL,
    avatar_url TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Attendance / QR Check-In Logs
CREATE TABLE IF NOT EXISTS attendance_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    gym_id UUID NOT NULL REFERENCES gyms(id) ON DELETE CASCADE,
    member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
    staff_pin TEXT NOT NULL,
    check_in_time TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    status TEXT NOT NULL DEFAULT 'Valid Entry'
);

-- 6. Pro-Shop Inventory Items
CREATE TABLE IF NOT EXISTS inventory_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    gym_id UUID NOT NULL REFERENCES gyms(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'Drinks', -- 'Drinks', 'Supplements', 'Services'
    wholesale_cost NUMERIC(10, 2) NOT NULL DEFAULT 0,
    retail_price NUMERIC(10, 2) NOT NULL DEFAULT 0,
    stock_quantity INTEGER NOT NULL DEFAULT 0,
    reorder_level INTEGER NOT NULL DEFAULT 10,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. POS Retail Transactions (Audited Anti-Theft Log)
CREATE TABLE IF NOT EXISTS pos_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    gym_id UUID NOT NULL REFERENCES gyms(id) ON DELETE CASCADE,
    item_id UUID REFERENCES inventory_items(id) ON DELETE SET NULL,
    item_name TEXT NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    amount_paid NUMERIC(10, 2) NOT NULL,
    cashier_pin TEXT NOT NULL,
    payment_method TEXT NOT NULL DEFAULT 'Cash', -- 'Cash', 'Transfer', 'POS Card'
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. Personal Trainers & Commission Ledger
CREATE TABLE IF NOT EXISTS trainers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    gym_id UUID NOT NULL REFERENCES gyms(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    phone TEXT,
    specialty TEXT DEFAULT 'Strength & Conditioning',
    commission_split NUMERIC(4, 2) NOT NULL DEFAULT 0.60, -- 60% PT / 40% Gym
    total_sessions INTEGER NOT NULL DEFAULT 0,
    unpaid_balance NUMERIC(10, 2) NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. Real-Time Indexing for High Performance
CREATE INDEX IF NOT EXISTS idx_members_gym ON members(gym_id);
CREATE INDEX IF NOT EXISTS idx_members_pass_code ON members(pass_code);
CREATE INDEX IF NOT EXISTS idx_attendance_gym_date ON attendance_logs(gym_id, check_in_time);
CREATE INDEX IF NOT EXISTS idx_pos_gym_date ON pos_transactions(gym_id, created_at);
CREATE INDEX IF NOT EXISTS idx_inventory_gym ON inventory_items(gym_id);

-- 10. Initial Seed Data (FitZone Lekki Pilot Gym)
DO $$
DECLARE
    lekki_gym_id UUID;
    eva_id UUID;
    monster_id UUID;
    towel_id UUID;
BEGIN
    -- Check if pilot gym already exists
    IF NOT EXISTS (SELECT 1 FROM gyms WHERE slug = 'fitzone-lekki') THEN
        INSERT INTO gyms (name, slug, location, owner_name, owner_phone, subscription_tier)
        VALUES ('FitZone Elite Fitness', 'fitzone-lekki', 'Admiralty Way, Lekki Phase 1, Lagos', 'Chidi Okafor', '08031234567', 'Enterprise (₦60,000/mo)')
        RETURNING id INTO lekki_gym_id;

        -- Staff PINs
        INSERT INTO staff (gym_id, full_name, role, pin_code, phone) VALUES
        (lekki_gym_id, 'Blessing Adeyemi', 'Head Receptionist', '2045', '08021112222'),
        (lekki_gym_id, 'Tunde Bakare', 'Evening Cashier', '8812', '08033334444');

        -- Sample Members
        INSERT INTO members (gym_id, full_name, phone, plan_type, pass_code, status, expiry_date, avatar_url) VALUES
        (lekki_gym_id, 'Folake Adeleke', '08023456789', 'Monthly All-Access (₦30,000)', '124253', 'Active', CURRENT_DATE + INTERVAL '18 days', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'),
        (lekki_gym_id, 'Emeka Nwosu', '08139876543', 'Quarterly VIP (₦75,000)', '892144', 'Active', CURRENT_DATE + INTERVAL '64 days', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'),
        (lekki_gym_id, 'Zainab Bello', '09087654321', 'Annual Gold (₦280,000)', '445901', 'Active', CURRENT_DATE + INTERVAL '290 days', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150');

        -- Pro-Shop Stock
        INSERT INTO inventory_items (gym_id, name, category, wholesale_cost, retail_price, stock_quantity, reorder_level) VALUES
        (lekki_gym_id, 'Eva Water (75cl)', 'Drinks', 180.00, 300.00, 48, 15),
        (lekki_gym_id, 'Monster Energy Can', 'Drinks', 950.00, 1500.00, 24, 8),
        (lekki_gym_id, 'Daily Workout Pass', 'Services', 0.00, 2500.00, 999, 50),
        (lekki_gym_id, 'Whey Protein Scoop', 'Supplements', 2200.00, 3500.00, 18, 5),
        (lekki_gym_id, 'Sweat Towel Rental', 'Services', 300.00, 1000.00, 15, 5);

        -- Trainers
        INSERT INTO trainers (gym_id, name, phone, specialty, commission_split, total_sessions, unpaid_balance) VALUES
        (lekki_gym_id, 'Coach Segun', '08055556666', 'Heavy Strength & Conditioning', 0.60, 28, 42000.00),
        (lekki_gym_id, 'Coach Amina', '08077778888', 'HIIT & Female Weight Loss', 0.60, 34, 51000.00);
    END IF;
END $$;
