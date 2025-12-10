export enum Tab {
  DASHBOARD = 'DASHBOARD',
  POS = 'POS',
  INVENTORY = 'INVENTORY',
  FINANCE = 'FINANCE'
}

export enum PaymentMethod {
  CASH = 'Espèces',
  CARD = 'Carte',
  MOBILE = 'Mobile',
  CREDIT = 'Crédit Magasin'
}

export enum Category {
  ELECTRONICS = 'Électronique',
  ACCESSORIES = 'Accessoires',
  SERVICES = 'Services',
  SNACKS = 'Snacks'
}

export interface Product {
  id: string;
  name: string;
  price: number;
  category: Category;
  stock: number;
  minStock: number;
  sku: string;
  imageUrl?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Transaction {
  id: string;
  items: CartItem[];
  totalAmount: number;
  paymentMethod: PaymentMethod;
  timestamp: string;
  cashierId: string;
}

export interface SalesDataPoint {
  name: string;
  sales: number;
  inventory?: number;
}