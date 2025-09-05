-- Supabase Database Schema for Landing Page System
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create creators table
CREATE TABLE IF NOT EXISTS creators (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    name VARCHAR(255) NOT NULL,
    business_name VARCHAR(255),
    avatar_url TEXT,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'suspended')),
    clubzila_creator_id VARCHAR(50) NOT NULL,
    clubzila_auth_id VARCHAR(50) NOT NULL,
    subscription_amount DECIMAL(10,2) DEFAULT 500.00,
    currency VARCHAR(3) DEFAULT 'TZS',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login_at TIMESTAMP WITH TIME ZONE
);

-- Create landing_pages table
CREATE TABLE IF NOT EXISTS landing_pages (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    creator_id UUID REFERENCES creators(id) ON DELETE CASCADE,
    page_id VARCHAR(255) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    template VARCHAR(50) NOT NULL CHECK (template IN ('minimal', 'modern', 'creative', 'professional')),
    custom_domain VARCHAR(255),
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    creator_id_display VARCHAR(100) NOT NULL,
    success_redirect_url TEXT NOT NULL,
    failure_redirect_url TEXT NOT NULL,
    views INTEGER DEFAULT 0,
    subscriptions INTEGER DEFAULT 0,
    conversion_rate DECIMAL(5,2) DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    landing_page_id UUID REFERENCES landing_pages(id) ON DELETE CASCADE,
    creator_id UUID REFERENCES creators(id) ON DELETE CASCADE,
    user_phone_number VARCHAR(20) NOT NULL,
    user_name VARCHAR(255),
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'TZS',
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'cancelled')),
    clubzila_transaction_id VARCHAR(255),
    clubzila_payment_status VARCHAR(50),
    success_redirect_url TEXT NOT NULL,
    redirect_completed BOOLEAN DEFAULT FALSE,
    redirect_timestamp TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create creator_analytics table
CREATE TABLE IF NOT EXISTS creator_analytics (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    creator_id UUID REFERENCES creators(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    total_views INTEGER DEFAULT 0,
    total_subscriptions INTEGER DEFAULT 0,
    total_revenue DECIMAL(12,2) DEFAULT 0.00,
    landing_pages_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(creator_id, date)
);

-- Create admin_users table
CREATE TABLE IF NOT EXISTS admin_users (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login_at TIMESTAMP WITH TIME ZONE
);

-- Create system_settings table
CREATE TABLE IF NOT EXISTS system_settings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    key VARCHAR(100) UNIQUE NOT NULL,
    value TEXT NOT NULL,
    description TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_by UUID REFERENCES admin_users(id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_landing_pages_page_id ON landing_pages(page_id);
CREATE INDEX IF NOT EXISTS idx_landing_pages_creator_id ON landing_pages(creator_id);
CREATE INDEX IF NOT EXISTS idx_landing_pages_status ON landing_pages(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_landing_page_id ON subscriptions(landing_page_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_creator_id ON subscriptions(creator_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_phone ON subscriptions(user_phone_number);
CREATE INDEX IF NOT EXISTS idx_creators_clubzila_id ON creators(clubzila_creator_id);
CREATE INDEX IF NOT EXISTS idx_creator_analytics_creator_date ON creator_analytics(creator_id, date);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_creators_updated_at BEFORE UPDATE ON creators
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_landing_pages_updated_at BEFORE UPDATE ON landing_pages
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_creator_analytics_updated_at BEFORE UPDATE ON creator_analytics
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create RLS (Row Level Security) policies
ALTER TABLE creators ENABLE ROW LEVEL SECURITY;
ALTER TABLE landing_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE creator_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;

-- Allow public read access to published landing pages
CREATE POLICY "Allow public read access to published landing pages" ON landing_pages
    FOR SELECT USING (status = 'published');

-- Allow public insert access to subscriptions
CREATE POLICY "Allow public insert access to subscriptions" ON subscriptions
    FOR INSERT WITH CHECK (true);

-- Allow public update access to subscriptions (for status updates)
CREATE POLICY "Allow public update access to subscriptions" ON subscriptions
    FOR UPDATE USING (true);

-- Allow public read access to subscriptions (for status checks)
CREATE POLICY "Allow public read access to subscriptions" ON subscriptions
    FOR SELECT USING (true);

-- Insert some default system settings
INSERT INTO system_settings (key, value, description) VALUES
    ('default_subscription_amount', '500', 'Default subscription amount in TZS'),
    ('default_currency', 'TZS', 'Default currency for subscriptions'),
    ('max_landing_pages_per_creator', '10', 'Maximum landing pages per creator'),
    ('app_version', '1.0.0', 'Current application version')
ON CONFLICT (key) DO NOTHING;

-- Insert a default admin user (password: admin123 - change this!)
INSERT INTO admin_users (email, password_hash, role) VALUES
    ('admin@clubzila.com', '$2a$10$rQZ8K9vX8K9vX8K9vX8K9e', 'super_admin')
ON CONFLICT (email) DO NOTHING;

-- Insert a sample creator for testing
INSERT INTO creators (email, phone_number, name, business_name, clubzila_creator_id, clubzila_auth_id, status) VALUES
    ('creator@example.com', '+255123456789', 'Sample Creator', 'Sample Business', '1821', '107', 'active')
ON CONFLICT (email) DO NOTHING;
