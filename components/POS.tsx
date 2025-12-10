import React, { useState, useMemo } from 'react';
import { Product, CartItem, PaymentMethod, Category } from '../types';
import { Search, Plus, Minus, Trash2, CreditCard, Banknote, Smartphone, Receipt, ShoppingCart } from 'lucide-react';

interface POSProps {
  products: Product[];
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, delta: number) => void;
  clearCart: () => void;
  onCheckout: (method: PaymentMethod) => void;
}

export const POS: React.FC<POSProps> = ({ 
  products, 
  cart, 
  addToCart, 
  removeFromCart, 
  updateCartQuantity, 
  clearCart,
  onCheckout 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Tous');
  const [isProcessing, setIsProcessing] = useState(false);

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            product.sku.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'Tous' || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchTerm, selectedCategory]);

  const cartTotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const tax = cartTotal * 0.20; // 20% tax example for France
  const finalTotal = cartTotal + tax;

  const handlePayment = (method: PaymentMethod) => {
    setIsProcessing(true);
    // Simulate processing delay
    setTimeout(() => {
        onCheckout(method);
        setIsProcessing(false);
    }, 1000);
  };

  const categories = ['Tous', ...Object.values(Category)];

  return (
    <div className="flex flex-col md:flex-row h-full gap-6">
      {/* Product Grid - Left Side */}
      <div className="flex-1 flex flex-col bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Filter Bar */}
        <div className="p-4 border-b border-gray-100 space-y-4">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input 
                    type="text" 
                    placeholder="Rechercher par nom ou SKU..." 
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
                {categories.map(cat => (
                    <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                            selectedCategory === cat 
                            ? 'bg-orange-600 text-white shadow-md shadow-orange-200' 
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>
        </div>

        {/* Grid */}
        <div className="flex-1 overflow-y-auto p-4 grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 bg-gray-50/30">
            {filteredProducts.map(product => (
                <button 
                    key={product.id}
                    onClick={() => addToCart(product)}
                    disabled={product.stock <= 0 && product.category !== Category.SERVICES}
                    className={`group flex flex-col bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg hover:border-orange-200 transition-all text-left ${
                         product.stock <= 0 && product.category !== Category.SERVICES ? 'opacity-50 cursor-not-allowed' : 'active:scale-95'
                    }`}
                >
                    <div className="h-36 bg-gray-100 relative overflow-hidden">
                        <img 
                            src={product.imageUrl} 
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-2 right-2 bg-slate-900/70 text-white text-[10px] font-bold px-2 py-1 rounded backdrop-blur-sm">
                            Stock: {product.stock}
                        </div>
                    </div>
                    <div className="p-4 flex flex-col flex-1">
                        <h3 className="font-semibold text-slate-800 text-sm line-clamp-2 mb-1">{product.name}</h3>
                        <p className="text-xs text-slate-400 mb-2">{product.sku}</p>
                        <div className="mt-auto flex justify-between items-center">
                            <span className="font-bold text-lg text-orange-600">${product.price.toFixed(2)}</span>
                            <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition-colors">
                                <Plus className="w-5 h-5" />
                            </div>
                        </div>
                    </div>
                </button>
            ))}
        </div>
      </div>

      {/* Cart - Right Side */}
      <div className="w-full md:w-96 bg-white rounded-2xl shadow-xl border border-gray-200 flex flex-col h-full">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-slate-50 rounded-t-2xl">
            <h2 className="font-bold text-slate-800 flex items-center">
                <Receipt className="w-5 h-5 mr-2 text-orange-600" />
                Vente en cours
            </h2>
            <button 
                onClick={clearCart}
                className="text-xs text-red-500 hover:text-red-700 hover:underline font-medium"
            >
                Vider le panier
            </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-300 space-y-4">
                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center">
                        <ShoppingCart className="w-10 h-10 opacity-30" />
                    </div>
                    <div className="text-center">
                        <p className="font-medium text-gray-400">Le panier est vide</p>
                        <p className="text-xs text-gray-400 mt-1">Scannez un article ou sélectionnez dans la grille</p>
                    </div>
                </div>
            ) : (
                cart.map(item => (
                    <div key={item.product.id} className="flex justify-between items-center p-3 bg-white rounded-xl border border-gray-100 shadow-sm group hover:border-orange-200 transition-colors">
                        <div className="flex-1">
                            <h4 className="font-semibold text-slate-800 text-sm">{item.product.name}</h4>
                            <p className="text-xs text-slate-500 mt-0.5">${item.product.price.toFixed(2)} /u</p>
                        </div>
                        <div className="flex items-center space-x-3 ml-4 bg-gray-50 rounded-lg p-1">
                            <button 
                                onClick={() => updateCartQuantity(item.product.id, -1)}
                                className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-white rounded-md transition-all shadow-sm"
                            >
                                <Minus className="w-4 h-4" />
                            </button>
                            <span className="font-bold w-4 text-center text-sm text-slate-700">{item.quantity}</span>
                            <button 
                                onClick={() => updateCartQuantity(item.product.id, 1)}
                                disabled={item.product.stock <= item.quantity && item.product.category !== Category.SERVICES}
                                className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-green-500 hover:bg-white rounded-md transition-all shadow-sm disabled:opacity-30"
                            >
                                <Plus className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                ))
            )}
        </div>

        {/* Totals Section */}
        <div className="p-6 bg-slate-50 border-t border-gray-200 rounded-b-2xl space-y-4">
            <div className="space-y-2 text-sm text-slate-600">
                <div className="flex justify-between">
                    <span>Sous-total</span>
                    <span className="font-medium">${cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                    <span>TVA (20%)</span>
                    <span className="font-medium">${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between pt-3 border-t border-slate-200 text-xl font-black text-slate-900">
                    <span>Total</span>
                    <span className="text-orange-600">${finalTotal.toFixed(2)}</span>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
                <button 
                    disabled={cart.length === 0 || isProcessing}
                    onClick={() => handlePayment(PaymentMethod.CASH)}
                    className="flex flex-col items-center justify-center p-3 rounded-xl border border-green-200 bg-white text-green-700 hover:bg-green-50 transition-all shadow-sm hover:shadow-md disabled:opacity-50 disabled:shadow-none"
                >
                    <Banknote className="w-6 h-6 mb-1.5" />
                    <span className="text-[10px] uppercase font-bold tracking-wide">Espèces</span>
                </button>
                <button 
                    disabled={cart.length === 0 || isProcessing}
                    onClick={() => handlePayment(PaymentMethod.CARD)}
                    className="flex flex-col items-center justify-center p-3 rounded-xl border border-sky-200 bg-white text-sky-700 hover:bg-sky-50 transition-all shadow-sm hover:shadow-md disabled:opacity-50 disabled:shadow-none"
                >
                    <CreditCard className="w-6 h-6 mb-1.5" />
                    <span className="text-[10px] uppercase font-bold tracking-wide">Carte</span>
                </button>
                <button 
                    disabled={cart.length === 0 || isProcessing}
                    onClick={() => handlePayment(PaymentMethod.MOBILE)}
                    className="flex flex-col items-center justify-center p-3 rounded-xl border border-orange-200 bg-white text-orange-700 hover:bg-orange-50 transition-all shadow-sm hover:shadow-md disabled:opacity-50 disabled:shadow-none"
                >
                    <Smartphone className="w-6 h-6 mb-1.5" />
                    <span className="text-[10px] uppercase font-bold tracking-wide">Mobile</span>
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};