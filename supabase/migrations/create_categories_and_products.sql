
-- Create tables for categories and products
CREATE TABLE IF NOT EXISTS public.categories (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  icon TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.products (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  original_price DECIMAL(10, 2),
  discounted BOOLEAN DEFAULT FALSE,
  image TEXT,
  in_stock BOOLEAN DEFAULT TRUE,
  stock_quantity INTEGER DEFAULT 0,
  category TEXT NOT NULL REFERENCES public.categories(name) ON UPDATE CASCADE,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add initial categories data
INSERT INTO public.categories (name)
VALUES 
  ('All Products'),
  ('Electronics'),
  ('Groceries'),
  ('Clothing')
ON CONFLICT (name) DO NOTHING;

-- Add initial product data
INSERT INTO public.products (
  name, price, original_price, discounted, image, in_stock, stock_quantity, category, description
)
VALUES
  ('Product A', 10.99, 15.99, TRUE, '/placeholder.svg', TRUE, 15, 'Electronics', 'High-quality electronic product with excellent performance and durability.'),
  ('Product B', 15.99, NULL, FALSE, '/placeholder.svg', TRUE, 8, 'Electronics', 'Premium electronic device with advanced features.'),
  ('Product C', 5.99, NULL, FALSE, '/placeholder.svg', FALSE, 0, 'Groceries', 'Fresh grocery item with high nutritional value.'),
  ('Product D', 20.99, NULL, FALSE, '/placeholder.svg', TRUE, 3, 'Clothing', 'Comfortable and stylish clothing item made with premium materials.'),
  ('Product E', 8.99, 12.99, TRUE, '/placeholder.svg', TRUE, 7, 'Groceries', 'Special grocery item currently on discount with excellent quality.')
ON CONFLICT (id) DO NOTHING;

-- Add RLS policies
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Allow public read access for categories and products
CREATE POLICY "Allow public read access for categories" 
  ON public.categories FOR SELECT 
  USING (true);

CREATE POLICY "Allow public read access for products" 
  ON public.products FOR SELECT 
  USING (true);

-- Allow authenticated users with correct permissions to modify data
CREATE POLICY "Allow users with edit_inventory permission to insert/update/delete categories" 
  ON public.categories FOR ALL 
  USING (
    (SELECT has_permission(auth.uid(), 'edit_inventory'::permission_type))
  );

CREATE POLICY "Allow users with edit_inventory permission to insert/update/delete products" 
  ON public.products FOR ALL 
  USING (
    (SELECT has_permission(auth.uid(), 'edit_inventory'::permission_type))
  );
