import React, { useState } from 'react';
import { Transaction, Product, Tab } from '../types';
import { generateRetailInsights } from '../services/geminiService';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Sparkles, TrendingUp, AlertCircle, ArrowRight } from 'lucide-react';

interface DashboardProps {
  transactions: Transaction[];
  products: Product[];
  setActiveTab: (tab: Tab) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ transactions, products, setActiveTab }) => {
  const [insight, setInsight] = useState<string | null>(null);
  const [loadingInsight, setLoadingInsight] = useState(false);

  // Prepare Chart Data
  const salesByMethod = [
    { name: 'Espèces', amount: transactions.filter(t => t.paymentMethod === 'Espèces').reduce((sum, t) => sum + t.totalAmount, 0) },
    { name: 'Carte', amount: transactions.filter(t => t.paymentMethod === 'Carte').reduce((sum, t) => sum + t.totalAmount, 0) },
    { name: 'Mobile', amount: transactions.filter(t => t.paymentMethod === 'Mobile').reduce((sum, t) => sum + t.totalAmount, 0) },
  ];

  // Group sales by day (simplified for mock data spread)
  const salesOverTime = transactions
    .slice()
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
    .map(t => ({
      time: new Date(t.timestamp).toLocaleDateString(),
      amount: t.totalAmount
    }))
    .reduce((acc: any[], curr) => {
        const existing = acc.find(item => item.time === curr.time);
        if (existing) {
            existing.amount += curr.amount;
        } else {
            acc.push({ ...curr });
        }
        return acc;
    }, [])
    .slice(-7); // Last 7 days/entries

  const handleGenerateInsight = async () => {
    setLoadingInsight(true);
    const result = await generateRetailInsights(transactions, products);
    setInsight(result);
    setLoadingInsight(false);
  };

  const lowStockCount = products.filter(p => p.stock <= p.minStock).length;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Main Stats Area */}
      <div className="lg:col-span-2 space-y-8">
        
        {/* Quick Stats Row */}
        <div className="grid grid-cols-3 gap-4">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <p className="text-sm text-slate-500 font-bold uppercase tracking-wide">Total Transactions</p>
                <p className="text-4xl font-black text-slate-800 mt-2">{transactions.length}</p>
            </div>
             <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <p className="text-sm text-slate-500 font-bold uppercase tracking-wide">Valeur Stock</p>
                <p className="text-4xl font-black text-slate-800 mt-2">
                    ${products.reduce((acc, p) => acc + (p.price * p.stock), 0).toFixed(0)}
                </p>
            </div>
             <div 
                className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 cursor-pointer hover:border-orange-300 hover:shadow-md transition-all group"
                onClick={() => setActiveTab(Tab.INVENTORY)}
             >
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-sm text-slate-500 font-bold uppercase tracking-wide group-hover:text-orange-600 transition-colors">Alertes Stock</p>
                        <p className={`text-4xl font-black mt-2 ${lowStockCount > 0 ? 'text-red-600' : 'text-green-600'}`}>
                            {lowStockCount}
                        </p>
                    </div>
                    {lowStockCount > 0 && <AlertCircle className="text-red-500 animate-pulse w-8 h-8" />}
                </div>
            </div>
        </div>

        {/* Charts */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-black text-slate-800 mb-6 flex items-center">
                <TrendingUp className="w-5 h-5 text-orange-600 mr-2" />
                Tendance Revenus (7 derniers jours)
            </h3>
            <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={salesOverTime}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                        <XAxis dataKey="time" stroke="#94A3B8" tick={{fontSize: 12}} axisLine={false} tickLine={false} dy={10} />
                        <YAxis stroke="#94A3B8" tick={{fontSize: 12}} prefix="$" axisLine={false} tickLine={false} />
                        <Tooltip 
                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                        />
                        <Line type="monotone" dataKey="amount" stroke="#EA580C" strokeWidth={4} dot={{r: 4, fill: '#EA580C', strokeWidth: 2, stroke: '#fff'}} activeDot={{r: 8, fill: '#EA580C'}} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
             <h3 className="text-lg font-black text-slate-800 mb-6">Ventes par Méthode de Paiement</h3>
             <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={salesByMethod} layout="vertical">
                         <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#F1F5F9" />
                        <XAxis type="number" stroke="#94A3B8" tick={{fontSize: 12}} axisLine={false} tickLine={false} />
                        <YAxis dataKey="name" type="category" stroke="#94A3B8" tick={{fontSize: 12, fontWeight: 500}} width={60} axisLine={false} tickLine={false} />
                        <Tooltip cursor={{fill: '#F8FAFC'}} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
                        <Bar dataKey="amount" fill="#0EA5E9" radius={[0, 6, 6, 0]} barSize={24} />
                    </BarChart>
                </ResponsiveContainer>
             </div>
        </div>
      </div>

      {/* Sidebar / AI Section */}
      <div className="space-y-6">
        <div className="bg-gradient-to-br from-slate-800 to-sky-900 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden border border-white/10">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-orange-500 rounded-full blur-3xl opacity-20"></div>
            <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black/20 to-transparent"></div>
            
            <h3 className="text-2xl font-black flex items-center mb-4 relative z-10">
                <Sparkles className="w-6 h-6 mr-3 text-orange-400" />
                Analyste IA
            </h3>
            
            <p className="text-slate-200 text-sm mb-8 leading-relaxed relative z-10 font-medium">
                Obtenez des analyses en temps réel sur la vitesse de stock, les flux de trésorerie et les prévisions de vente avec Gemini.
            </p>

            {!insight && !loadingInsight && (
                <button 
                    onClick={handleGenerateInsight}
                    className="relative z-10 w-full bg-white text-slate-900 font-bold py-4 px-6 rounded-xl hover:bg-orange-50 transition-all flex items-center justify-center shadow-lg hover:shadow-orange-500/20 group"
                >
                    Générer Rapport
                    <ArrowRight className="w-4 h-4 ml-2 text-orange-600 group-hover:translate-x-1 transition-transform" />
                </button>
            )}

            {loadingInsight && (
                <div className="flex flex-col items-center justify-center py-4 space-y-4">
                    <div className="w-10 h-10 border-4 border-white/20 border-t-orange-400 rounded-full animate-spin"></div>
                    <span className="text-sm font-bold text-orange-100 animate-pulse">Analyse des données en cours...</span>
                </div>
            )}

            {insight && (
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 text-sm leading-relaxed border border-white/10 animate-fade-in relative z-10 shadow-inner">
                    <p className="text-slate-100">{insight}</p>
                    <button 
                        onClick={() => setInsight(null)}
                        className="mt-4 text-xs font-bold text-orange-300 hover:text-white uppercase tracking-wider"
                    >
                        Effacer l'analyse
                    </button>
                </div>
            )}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-black text-slate-800 mb-4">Actions Rapides</h3>
            <div className="space-y-3">
                <button 
                    onClick={() => setActiveTab(Tab.POS)}
                    className="w-full flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-orange-200 hover:bg-orange-50 transition-all text-left group"
                >
                    <span className="text-sm font-bold text-slate-600 group-hover:text-orange-700">Ouvrir Nouvelle Caisse</span>
                    <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-orange-500 transition-colors" />
                </button>
                <button 
                    onClick={() => setActiveTab(Tab.INVENTORY)}
                    className="w-full flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-orange-200 hover:bg-orange-50 transition-all text-left group"
                >
                    <span className="text-sm font-bold text-slate-600 group-hover:text-orange-700">Réceptionner Stock</span>
                    <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-orange-500 transition-colors" />
                </button>
                <button className="w-full flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-orange-200 hover:bg-orange-50 transition-all text-left group">
                    <span className="text-sm font-bold text-slate-600 group-hover:text-orange-700">Imprimer Rapport Z</span>
                    <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-orange-500 transition-colors" />
                </button>
            </div>
        </div>

        <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-100">
             <div className="flex items-center mb-2">
                <TrendingUp className="w-5 h-5 text-emerald-600 mr-2" />
                <h3 className="font-bold text-emerald-800">Conseil Efficacité</h3>
             </div>
             <p className="text-sm text-emerald-700 leading-relaxed font-medium">
                Les paiements mobiles sont en hausse de 15% cette semaine. Envisagez d'ajouter une file dédiée pour réduire l'attente.
             </p>
        </div>
      </div>
    </div>
  );
};