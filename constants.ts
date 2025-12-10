import { Product, Transaction, PaymentMethod, Category } from './types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Casque Sans Fil Réduction de Bruit',
    price: 299.99,
    category: Category.ELECTRONICS,
    stock: 12,
    minStock: 5,
    sku: 'AUD-001',
    imageUrl: 'https://picsum.photos/200/200?random=1'
  },
  {
    id: '2',
    name: 'Montre Connectée Série 5',
    price: 399.50,
    category: Category.ELECTRONICS,
    stock: 8,
    minStock: 3,
    sku: 'WBL-002',
    imageUrl: 'https://picsum.photos/200/200?random=2'
  },
  {
    id: '3',
    name: 'Chargeur Rapide USB-C',
    price: 29.99,
    category: Category.ACCESSORIES,
    stock: 45,
    minStock: 10,
    sku: 'ACC-003',
    imageUrl: 'https://picsum.photos/200/200?random=3'
  },
  {
    id: '4',
    name: 'Housse Ordinateur 13"',
    price: 45.00,
    category: Category.ACCESSORIES,
    stock: 20,
    minStock: 5,
    sku: 'ACC-004',
    imageUrl: 'https://picsum.photos/200/200?random=4'
  },
  {
    id: '5',
    name: 'Installation Protection Écran',
    price: 15.00,
    category: Category.SERVICES,
    stock: 999, // Service
    minStock: 0,
    sku: 'SVC-005',
    imageUrl: 'https://picsum.photos/200/200?random=5'
  },
  {
    id: '6',
    name: 'Barre Énergétique',
    price: 2.50,
    category: Category.SNACKS,
    stock: 3, // Low stock example
    minStock: 10,
    sku: 'SNK-006',
    imageUrl: 'https://picsum.photos/200/200?random=6'
  }
];

// Generate some past transactions
const generateHistoricalTransactions = (): Transaction[] => {
  const transactions: Transaction[] = [];
  const methods = [PaymentMethod.CASH, PaymentMethod.CARD, PaymentMethod.MOBILE];
  
  for (let i = 0; i < 20; i++) {
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 7)); // Past 7 days
    date.setHours(9 + Math.floor(Math.random() * 10), Math.floor(Math.random() * 60));

    transactions.push({
      id: `TRX-HIST-${i}`,
      items: [
        { product: INITIAL_PRODUCTS[i % INITIAL_PRODUCTS.length], quantity: 1 + Math.floor(Math.random() * 2) }
      ],
      totalAmount: INITIAL_PRODUCTS[i % INITIAL_PRODUCTS.length].price * (1 + Math.floor(Math.random() * 2)),
      paymentMethod: methods[Math.floor(Math.random() * methods.length)],
      timestamp: date.toISOString(),
      cashierId: 'EMP-001'
    });
  }
  return transactions.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};

export const INITIAL_TRANSACTIONS = generateHistoricalTransactions();