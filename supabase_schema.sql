-- 1. Tablas de Perfiles y Roles
CREATE TYPE user_role AS ENUM ('superadmin', 'organizer', 'vendor', 'customer');

CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  role user_role DEFAULT 'customer' NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Organizaciones (Plazas de Comida / Eventos)
CREATE TABLE organizations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  organizer_id UUID REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Vendedores (Food Trucks / Locales)
CREATE TABLE vendors (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  is_open BOOLEAN DEFAULT true,
  mp_access_token TEXT, -- Token para cobrar
  owner_id UUID REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Menú de Productos
CREATE TABLE menu_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  vendor_id UUID REFERENCES vendors(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  image_url TEXT,
  available BOOLEAN DEFAULT true,
  category TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Pedidos
CREATE TYPE order_status AS ENUM ('pending', 'preparing', 'ready', 'delivered', 'cancelled');

CREATE TABLE orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  vendor_id UUID REFERENCES vendors(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES profiles(id),
  status order_status DEFAULT 'pending' NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  payment_status TEXT DEFAULT 'pending', -- 'pending', 'paid', 'failed'
  order_number SERIAL, -- Número correlativo para retiro
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Detalle de Pedido
CREATE TABLE order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  menu_item_id UUID REFERENCES menu_items(id),
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL
);

-- SEGURIDAD (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Políticas básicas (Ejemplo)
CREATE POLICY "Public profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can edit their own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Solo el SuperAdmin puede crear organizaciones
CREATE POLICY "SuperAdmins can manage organizations" ON organizations 
FOR ALL USING (
  (SELECT role FROM profiles WHERE id = auth.uid()) = 'superadmin'
);

-- El público puede ver organizaciones
CREATE POLICY "Public organizations viewable by everyone" ON organizations FOR SELECT USING (true);

-- Vendedores: Solo el dueño o el organizador de la plaza pueden editar
CREATE POLICY "Vendors viewable by everyone" ON vendors FOR SELECT USING (true);
CREATE POLICY "Vendors manageable by owner or organizer" ON vendors 
FOR ALL USING (
  auth.uid() = owner_id OR 
  auth.uid() = (SELECT organizer_id FROM organizations WHERE id = org_id)
);
-- Políticas para permitir el Setup inicial (Solo para desarrollo)
CREATE POLICY "Enable insert for all users during setup" ON organizations FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable insert for all users during setup" ON vendors FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable insert for all users during setup" ON menu_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all users during setup" ON organizations FOR UPDATE USING (true);
CREATE POLICY "Enable update for all users during setup" ON vendors FOR UPDATE USING (true);
