import React from 'react';
import { Product, Category } from '../types';
import { Edit2, AlertTriangle, TrendingDown } from 'lucide-react';

interface InventoryProps {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
}

export const Inventory: React.FC<InventoryProps> = ({ products, setProducts }) => {
  
  const handleStockUpdate = (id: string, newStock: number) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, stock: newStock } : p));
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex flex-col h-full">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
        <div>
            <h2 className="text-lg font-black text-slate-800">État des Stocks</h2>
            <p className="text-sm text-slate-500 font-medium">Suivi en temps réel des stocks par catégorie</p>
        </div>
        <button className="bg-orange-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-orange-700 transition-colors shadow-lg shadow-orange-200">
            + Ajouter Produit
        </button>
      </div>

      <div className="flex-1 overflow-auto">
        <table className="w-full text-left">
            <thead className="bg-gray-50 sticky top-0 z-10">
                <tr>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Info Produit</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">SKU / Catégorie</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Prix</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Niveau Stock</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Statut</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
                {products.map(product => {
                    const isLowStock = product.stock <= product.minStock;
                    return (
                        <tr key={product.id} className="hover:bg-orange-50/30 transition-colors">
                            <td className="px-6 py-4">
                                <div className="flex items-center">
                                    <div className="h-12 w-12 flex-shrink-0 rounded-lg bg-gray-100 overflow-hidden mr-4 border border-gray-200">
                                        <img src={product.imageUrl} alt="" className="h-full w-full object-cover" />
                                    </div>
                                    <span className="font-bold text-slate-800">{product.name}</span>
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <div className="text-sm font-medium text-slate-700">{product.sku}</div>
                                <div className="text-xs text-slate-400">{product.category}</div>
                            </td>
                            <td className="px-6 py-4 text-sm font-bold text-slate-600">
                                ${product.price.toFixed(2)}
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex items-center space-x-2">
                                    <input 
                                        type="number" 
                                        value={product.stock}
                                        onChange={(e) => handleStockUpdate(product.id, parseInt(e.target.value) || 0)}
                                        className="w-20 border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none font-medium"
                                    />
                                    <span className="text-xs text-slate-400">unités</span>
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                {isLowStock ? (
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700">
                                        <AlertTriangle className="w-3 h-3 mr-1" />
                                        Stock Faible
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">
                                        En Stock
                                    </span>
                                )}
                            </td>
                            <td className="px-6 py-4">
                                <button className="text-orange-600 hover:text-orange-800 p-2 hover:bg-orange-50 rounded-lg transition-colors">
                                    <Edit2 className="w-4 h-4" />
                                </button>
                            </td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
      </div>
      
      {/* Footer stats */}
      <div className="bg-gray-50 p-4 border-t border-gray-200 flex justify-between text-sm text-slate-500 font-medium">
            <span>Total SKUs: {products.length}</span>
            <div className="flex space-x-4">
                <span className="flex items-center text-red-600 font-bold">
                    <TrendingDown className="w-4 h-4 mr-1" />
                    {products.filter(p => p.stock <= p.minStock).length} Réappro nécessaire
                </span>
            </div>
      </div>
    </div>
  );
};