-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Orders table
CREATE TABLE sweet_cash_orders (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_name text NOT NULL,
    quantity integer NOT NULL,
    zip_code text NOT NULL,
    delivery_option text NOT NULL,
    customer_name text NOT NULL,
    customer_phone text NOT NULL,
    partner_id uuid REFERENCES sweet_cash_partners(id),
    created_at timestamptz DEFAULT now()
);

-- Partners table
CREATE TABLE sweet_cash_partners (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    name text NOT NULL,
    email text NOT NULL UNIQUE,
    phone text NOT NULL,
    zip_code text NOT NULL,
    serve_safe_uploaded boolean DEFAULT false,
    is_verified boolean DEFAULT false,
    created_at timestamptz DEFAULT now()
);

-- Partner earnings table
CREATE TABLE partner_earnings (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    partner_id uuid REFERENCES sweet_cash_partners(id),
    ytd_earnings numeric DEFAULT 0,
    sales_tax_collected numeric DEFAULT 0,
    orders_completed integer DEFAULT 0,
    last_updated timestamptz DEFAULT now()
);

-- Partner affiliate codes table
CREATE TABLE partner_affiliate_codes (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    partner_id uuid REFERENCES sweet_cash_partners(id),
    product_name text NOT NULL,
    affiliate_code text NOT NULL UNIQUE,
    created_at timestamptz DEFAULT now()
);

-- Create indexes for better query performance
CREATE INDEX idx_orders_partner_id ON sweet_cash_orders(partner_id);
CREATE INDEX idx_partners_zip_code ON sweet_cash_partners(zip_code);
CREATE INDEX idx_partners_is_verified ON sweet_cash_partners(is_verified);
CREATE INDEX idx_earnings_partner_id ON partner_earnings(partner_id);
CREATE INDEX idx_affiliate_codes_partner_id ON partner_affiliate_codes(partner_id);
CREATE INDEX idx_affiliate_codes_code ON partner_affiliate_codes(affiliate_code);
