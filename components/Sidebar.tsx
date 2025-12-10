import React from 'react';
import { LayoutDashboard, ShoppingCart, Package, DollarSign, LogOut, Store } from 'lucide-react';
import { Tab } from '../types';

interface SidebarProps {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const navItems = [
    { id: Tab.DASHBOARD, label: 'Tableau de bord', icon: LayoutDashboard },
    { id: Tab.POS, label: 'Point de Vente', icon: ShoppingCart },
    { id: Tab.INVENTORY, label: 'Stocks', icon: Package },
    { id: Tab.FINANCE, label: 'Finance & Caisse', icon: DollarSign },
  ];

  return (
    <aside className="w-72 bg-white border-r border-gray-200 flex flex-col h-full shadow-lg z-10 hidden md:flex">
      {/* Branding Section */}
      <div className="p-8 border-b border-gray-100 flex flex-col items-center text-center">
        <div className="mb-3 relative">
            <div className="w-14 h-14 bg-gradient-to-br from-sky-600 to-slate-800 rounded-xl flex items-center justify-center shadow-lg relative overflow-hidden">
                 <div className="absolute top-0 w-full h-1/3 bg-gradient-to-r from-orange-400 to-orange-600"></div>
                 <Store className="w-8 h-8 text-white relative z-10 mt-1" />
            </div>
        </div>
        <div>
            <h1 className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-orange-700 tracking-tight">
                SHOP CONNECT
            </h1>
            <p className="text-[10px] font-bold text-slate-500 tracking-[0.2em] uppercase mt-1">
                by Mamadou Diene
            </p>
        </div>
      </div>

      <nav className="flex-1 px-4 py-8 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center space-x-4 px-6 py-4 rounded-xl transition-all duration-200 group ${
                isActive
                  ? 'bg-orange-50 text-orange-600 shadow-sm border border-orange-100'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <Icon className={`w-5 h-5 transition-colors ${isActive ? 'text-orange-600' : 'text-gray-400 group-hover:text-gray-600'}`} />
              <span className={`font-medium ${isActive ? 'font-bold' : ''}`}>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-6 border-t border-gray-100">
        <button className="w-full flex items-center justify-center space-x-3 px-4 py-3 rounded-xl text-slate-500 hover:bg-red-50 hover:text-red-600 transition-colors border border-transparent hover:border-red-100">
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Déconnexion</span>
        </button>
      </div>
    </aside>
  );
};