
export interface Vendor {
  id: string;
  name: string;
  description: string;
  image: string;
  rating: number;
  waitTime: string;
  category: string;
  isOpen: boolean;
}

export interface MenuItem {
  id: string;
  vendorId?: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  popular?: boolean;
}

export interface CartItem extends MenuItem {
  quantity: number;
}

export enum OrderStatus {
  PREPARING = 'prep',
  READY = 'ready',
  EXPIRED = 'expired'
}

export interface Order {
  id: string;
  vendorName: string;
  items: CartItem[];
  total: number;
  status: OrderStatus;
  timestamp: string;
  paymentMethod: 'app' | 'cash';
}
