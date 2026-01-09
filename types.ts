export type UserRole = 'superadmin' | 'plaza_admin' | 'foodtruck_manager' | 'foodtruck_operator' | 'customer';
export type PlazaStatus = 'draft' | 'active' | 'paused' | 'closed';
export type RelationStatus = 'requested' | 'invited' | 'active' | 'suspended' | 'ended' | 'reactivated';
export type OrderStatus = 'created' | 'paid' | 'in_progress' | 'ready' | 'delivered' | 'expired_not_picked_up' | 'cancelled_unpaid';
export type PaymentMethod = 'online' | 'counter';

export interface Profile {
  id: string;
  full_name: string | null;
  email: string | null;
  role: UserRole;
  phone?: string;
}

export interface Plaza {
  id: string;
  name: string;
  slug: string;
  description?: string;
  logo_url?: string;
  cover_url?: string;
  status: PlazaStatus;
  owner_id: string;
  active_from?: string;
  active_to?: string;
}

export interface FoodTruck {
  id: string;
  name: string;
  slug: string;
  description?: string;
  logo_url?: string;
  owner_id: string;
  mp_access_token?: string;
}

export interface FoodTruckPlaza {
  id: string;
  plaza_id: string;
  food_truck_id: string;
  status: RelationStatus;
  assigned_operator_ids?: string[];
  config?: any; // Horarios, timeouts específicos
  // Joins
  plaza?: Plaza;
  food_truck?: FoodTruck;
}

export interface Modifier {
  id: string;
  group_id: string;
  name: string;
  price_extra: number;
  available: boolean;
}

export interface ModifierGroup {
  id: string;
  food_truck_id: string;
  name: string;
  min_selection: number;
  max_selection: number;
  required: boolean;
  modifiers?: Modifier[];
}

export interface Product {
  id: string;
  food_truck_id: string;
  name: string;
  description?: string;
  price: number;
  image_url?: string;
  is_base_product: boolean;
  base_ingredients?: string[];
  available: boolean;
  category?: string;
  // Relaciones
  modifier_groups?: ModifierGroup[];
}

// Estructura del snapshot guardado en la orden
export interface OrderItemSnapshot {
  product_id: string;
  name: string;
  unit_price: number;
  quantity: number;
  removed_ingredients?: string[];
  selected_modifiers?: {
    group_name: string;
    option_name: string;
    price_extra: number;
  }[];
  subtotal: number;
}

export interface Order {
  id: string;
  food_truck_plaza_id: string;
  customer_id?: string;
  guest_info?: { name: string; phone?: string };
  status: OrderStatus;
  total: number;
  payment_method: PaymentMethod;
  payment_id?: string;
  pickup_code: string;
  created_at: string;
  paid_at?: string;
  ready_at?: string;
  delivered_at?: string;
  snapshot: {
    items: OrderItemSnapshot[];
  };
}

// Helper para el carrito local
export interface CartItem {
  product: Product;
  quantity: number;
  removed_ingredients: string[];
  selected_modifiers: Record<string, Modifier[]>; // GroupID -> Modifiers
  uuid: string; // ID único temporal para distinguir items iguales con distintos extras
}
