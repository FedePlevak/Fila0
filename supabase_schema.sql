-- 1. ENUMS & TYPES
CREATE TYPE user_role AS ENUM ('superadmin', 'plaza_admin', 'foodtruck_manager', 'foodtruck_operator', 'customer');
CREATE TYPE plaza_status AS ENUM ('draft', 'active', 'paused', 'closed');
CREATE TYPE relation_status AS ENUM ('requested', 'invited', 'active', 'suspended', 'ended', 'reactivated');
CREATE TYPE order_status AS ENUM ('created', 'paid', 'in_progress', 'ready', 'delivered', 'expired_not_picked_up', 'cancelled_unpaid');
CREATE TYPE payment_method AS ENUM ('online', 'counter');

-- 2. PROFILES (Usuarios)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  email TEXT,
  role user_role DEFAULT 'customer' NOT NULL,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. PLAZAS (Eventos / Organizaciones)
CREATE TABLE plazas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  logo_url TEXT,
  cover_url TEXT,
  status plaza_status DEFAULT 'draft' NOT NULL,
  owner_id UUID REFERENCES profiles(id), -- Admin de la plaza
  active_from TIMESTAMP WITH TIME ZONE,
  active_to TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. FOOD TRUCKS (Entidad Global)
CREATE TABLE food_trucks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL, -- Para URL propia si hiciera falta
  description TEXT,
  logo_url TEXT,
  owner_id UUID REFERENCES profiles(id), -- FoodTruckManager
  mp_access_token TEXT, -- Token MercadoPago Global (o sobrescribible por plaza)
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. RELACIÓN PLAZA <-> FOOD TRUCK
CREATE TABLE food_truck_plazas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  plaza_id UUID REFERENCES plazas(id) ON DELETE CASCADE,
  food_truck_id UUID REFERENCES food_trucks(id) ON DELETE CASCADE,
  status relation_status DEFAULT 'requested' NOT NULL,
  assigned_operator_ids UUID[], -- Array de IDs de perfiles operadores asignados a esta plaza
  config JSONB DEFAULT '{}', -- Config específica (horarios, overrides)
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(plaza_id, food_truck_id)
);

-- 6. PRODUCTOS (Menú) - Viven en el FoodTruck (Global) pero se pueden activar/desactivar
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  food_truck_id UUID REFERENCES food_trucks(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  image_url TEXT,
  is_base_product BOOLEAN DEFAULT true, -- Si es false, podría ser un "extra" suelto
  base_ingredients TEXT[], -- Ingredientes base que se pueden quitar
  available BOOLEAN DEFAULT true,
  category TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. GRUPOS DE MODIFICADORES (Ej: "Salsas", "Bebidas", "Tipo de Pan")
CREATE TABLE modifier_groups (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  food_truck_id UUID REFERENCES food_trucks(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  min_selection INTEGER DEFAULT 0,
  max_selection INTEGER DEFAULT 1, -- 1 = Radio button, >1 = Checkbox
  required BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. OPCIONES DE MODIFICADOR (Ej: "Mayonesa", "Coca Cola")
CREATE TABLE modifiers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  group_id UUID REFERENCES modifier_groups(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  price_extra DECIMAL(10,2) DEFAULT 0,
  available BOOLEAN DEFAULT true 
);

-- Relación Producto -> Grupos de Modificadores (Muchos a Muchos)
CREATE TABLE product_modifier_links (
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  group_id UUID REFERENCES modifier_groups(id) ON DELETE CASCADE,
  sort_order INTEGER DEFAULT 0,
  PRIMARY KEY (product_id, group_id)
);

-- 9. PEDIDOS (Lives in FoodTruckPlaza context)
CREATE TABLE orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  food_truck_plaza_id UUID REFERENCES food_truck_plazas(id) ON DELETE SET NULL, -- Si se borra la relación, queda el histórico
  customer_id UUID REFERENCES profiles(id), -- Puede ser nulo si es anónimo/invitado? Mejor siempre linkeado o device_id
  guest_info JSONB, -- { "name": "Juan", "phone": "..." } si no hay login
  status order_status DEFAULT 'created' NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  payment_method payment_method DEFAULT 'online',
  payment_id TEXT, -- ID externo de MP
  pickup_code TEXT NOT NULL, -- 4-6 dígitos
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  paid_at TIMESTAMP WITH TIME ZONE,
  ready_at TIMESTAMP WITH TIME ZONE,
  delivered_at TIMESTAMP WITH TIME ZONE,
  cancelled_at TIMESTAMP WITH TIME ZONE,
  snapshot JSONB NOT NULL -- Copia completa de los items, precios y nombres al momento de la compra
);

-- 10. AUDIT LOGS
CREATE TABLE audit_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  actor_id UUID REFERENCES profiles(id),
  action TEXT NOT NULL, -- manual_override, close_plaza, etc
  entity_type TEXT NOT NULL, -- order, plaza, relation
  entity_id UUID,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- SEGURIDAD (RLS) - Simplicada para MVP inicial, ajustar luego con políticas finas

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE plazas ENABLE ROW LEVEL SECURITY;
ALTER TABLE food_trucks ENABLE ROW LEVEL SECURITY;
ALTER TABLE food_truck_plazas ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Políticas permisivas para desarrollo rápido (luego restringir)
CREATE POLICY "Public profiles view" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users edit own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Public read plazas" ON plazas FOR SELECT USING (true);
CREATE POLICY "Admin manage plazas" ON plazas FOR ALL USING (
  (SELECT role FROM profiles WHERE id = auth.uid()) IN ('superadmin', 'plaza_admin')
);

CREATE POLICY "Public read trucks" ON food_trucks FOR SELECT USING (true);
CREATE POLICY "Managers manage trucks" ON food_trucks FOR ALL USING (
  owner_id = auth.uid() OR (SELECT role FROM profiles WHERE id = auth.uid()) = 'superadmin'
);

CREATE POLICY "Public read products" ON products FOR SELECT USING (true);
CREATE POLICY "Managers manage products" ON products FOR ALL USING (
  (SELECT owner_id FROM food_trucks WHERE id = food_truck_id) = auth.uid()
);

CREATE POLICY "Orders readable by involved parties" ON orders FOR SELECT USING (
  auth.uid() = customer_id OR 
  EXISTS (
    SELECT 1 FROM food_truck_plazas ftp
    JOIN food_trucks ft ON ft.id = ftp.food_truck_id
    WHERE ftp.id = orders.food_truck_plaza_id AND (ft.owner_id = auth.uid() OR ARRAY[auth.uid()] <@ ftp.assigned_operator_ids)
  )
);

CREATE POLICY "Customer create orders" ON orders FOR INSERT WITH CHECK (auth.uid() = customer_id);

-- TODO: Agregar más políticas específicas para cada rol y estado
