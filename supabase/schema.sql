
CREATE TABLE sweet_cash_orders (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_name text,
  quantity int,
  zip_code text,
  delivery_option text,
  customer_name text,
  customer_phone text,
  partner_id uuid,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE sweet_cash_partners (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text,
  email text,
  phone text,
  zip_code text,
  serve_safe_uploaded boolean,
  is_verified boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE partner_earnings (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  partner_id uuid,
  ytd_earnings numeric,
  sales_tax_collected numeric,
  orders_completed int,
  last_updated timestamptz DEFAULT now()
);
