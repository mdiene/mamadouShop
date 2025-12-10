import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { POS } from './components/POS';
import { Inventory } from './components/Inventory';
import { Finance } from './components/Finance';
import { Dashboard } from './components/Dashboard';
import { Product, Transaction, Tab, CartItem, PaymentMethod } from './types';
import { INITIAL_PRODUCTS, INITIAL_TRANSACTIONS } from './constants';
import { AlertCircle } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.DASHBOARD);
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isRegisterOpen, setIsRegisterOpen] = useState(true); // Simplified for demo
  const [shiftStartTime, setShiftStartTime] = useState<Date>(new Date());

  // Cart Management
  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const updateCartQuantity = (productId: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.product.id === productId) {
        const newQty = Math.max(0, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const clearCart = () => setCart([]);

  // Checkout Logic
  const handleCheckout = (method: PaymentMethod) => {
    if (cart.length === 0) return;

    const totalAmount = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    
    // Create Transaction
    const newTransaction: Transaction = {
      id: `TRX-${Date.now()}`,
      items: [...cart],
      totalAmount,
      paymentMethod: method,
      timestamp: new Date().toISOString(),
      cashierId: 'EMP-001'
    };

    // Update Inventory
    const updatedProducts = products.map(p => {
      const cartItem = cart.find(c => c.product.id === p.id);
      if (cartItem) {
        return { ...p, stock: Math.max(0, p.stock - cartItem.quantity) };
      }
      return p;
    });

    setTransactions(prev => [newTransaction, ...prev]);
    setProducts(updatedProducts);
    setCart([]);
    
    // In a real app, we'd show a success toast here
    console.log("Transaction completed:", newTransaction);
  };

  // Check for low stock alerts
  const lowStockItems = products.filter(p => p.stock <= p.minStock);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        {/* Top Bar / Header */}
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              {activeTab === Tab.DASHBOARD && 'Tableau de bord de Direction'}
              {activeTab === Tab.POS && 'Point de Vente (Caisse)'}
              {activeTab === Tab.INVENTORY && 'Gestion des Stocks'}
              {activeTab === Tab.FINANCE && 'Contrôle Financier'}
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Magasin: <span className="font-semibold text-orange-600">SHOP CONNECT</span> | Caisse: #01 | Utilisateur: Sarah J.
            </p>
          </div>

          <div className="flex items-center space-x-4">
             {lowStockItems.length > 0 && (
                <div className="flex items-center bg-red-100 text-red-700 px-4 py-2 rounded-full text-sm font-bold animate-pulse shadow-sm">
                  <AlertCircle className="w-4 h-4 mr-2" />
                  {lowStockItems.length} Alerte(s) Stock
                </div>
             )}
            <div className={`h-3 w-3 rounded-full ${isRegisterOpen ? 'bg-green-500 ring-4 ring-green-100' : 'bg-red-500 ring-4 ring-red-100'}`}></div>
            <span className="text-sm font-semibold text-slate-600">
              {isRegisterOpen ? 'Caisse Ouverte' : 'Caisse Fermée'}
            </span>
          </div>
        </header>

        {/* Dynamic Content */}
        <div className="h-[calc(100%-80px)]">
          {activeTab === Tab.DASHBOARD && (
            <Dashboard 
              transactions={transactions} 
              products={products} 
              setActiveTab={setActiveTab}
            />
          )}
          {activeTab === Tab.POS && (
            <POS 
              products={products} 
              cart={cart}
              addToCart={addToCart}
              removeFromCart={removeFromCart}
              updateCartQuantity={updateCartQuantity}
              clearCart={clearCart}
              onCheckout={handleCheckout}
            />
          )}
          {activeTab === Tab.INVENTORY && (
            <Inventory 
              products={products} 
              setProducts={setProducts} 
            />
          )}
          {activeTab === Tab.FINANCE && (
            <Finance 
              transactions={transactions} 
              shiftStartTime={shiftStartTime}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default App;