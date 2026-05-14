export type UserRole = 'USER' | 'ADMIN';

export interface User {
  id: string;
  name: string;
  email: string;
  dob?: string;
  role: UserRole;
  profile_picture?: string;
  preferred_language?: string;
}

export interface AuthResponse {
  data: {
    access_token: string;
    id: string;
  };
}

export interface Address {
  id: string;
  longitude: number;
  latitude: number;
  country: string;
  state: string;
  city: string;
  zip_code: string;
  address: string;
  address_line_1: string;
  address_line_2?: string;
  tag: string;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  quantity: number;
  images: string[];
}

export interface CartItem extends Product {
  cartQuantity: number;
}

export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';

export interface OrderItem {
  product_id: string;
  quantity: number;
}

export interface Order {
  id: string;
  user_id: string;
  items: OrderItem[];
  status: OrderStatus;
  total_amount: number;
  created_at: string;
}

export interface Payment {
  id: string;
  order_id: string;
  amount: number;
  currency: string;
  status: string;
  description: string;
}
