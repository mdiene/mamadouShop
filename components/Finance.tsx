import React from 'react';
import { Transaction, PaymentMethod } from '../types';
import { DollarSign, CreditCard, Smartphone, Wallet, ArrowUpRight, ArrowDownLeft } from 'lucide-react';

interface FinanceProps {
  transactions: Transaction[];
  shiftStartTime: Date;
}

export const Finance: React.FC<FinanceProps> = ({ transactions, shiftStartTime }) => {
  // Filter for transactions since shift start
  const currentShiftTransactions = transactions.filter(t => new Date(t.timestamp) >= shiftStartTime);

  const stats = {
    totalSales: currentShiftTransactions.reduce((acc, t) => acc + t.totalAmount, 0),
    cash: currentShiftTransactions.filter(t => t.paymentMethod === PaymentMethod.CASH).reduce((acc, t) => acc + t.totalAmount, 0),
    card: currentShiftTransactions.filter(t => t.paymentMethod === PaymentMethod.CARD).reduce((acc, t) => acc + t.totalAmount, 0),
    mobile: currentShiftTransactions.filter(t => t.paymentMethod === PaymentMethod.MOBILE).reduce((acc, t) => acc + t.totalAmount, 0),
    count: currentShiftTransactions.length
  };

  const cashInDrawerStart = 250.00; // Mock float
  const expectedCashInDrawer = cashInDrawerStart + stats.cash;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Sales Card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-slate-500 text-sm font-bold uppercase tracking-wide">CA Total (Service)</h3>
                <div className="bg-orange-100 p-2.5 rounded-xl">
                    <DollarSign className="w-5 h-5 text-orange-600" />
                </div>
            </div>
            <div className="flex items-baseline">
                <span className="text-3xl font-black text-slate-800">${stats.totalSales.toFixed(2)}</span>
                <span className="ml-2 text-xs text-green-600 font-bold flex items-center bg-green-50 px-2 py-0.5 rounded-full">
                    <ArrowUpRight className="w-3 h-3 mr-0.5" />
                    En direct
                </span>
            </div>
        </div>

        {/* Cash Card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-slate-500 text-sm font-bold uppercase tracking-wide">Espèces (Tiroir)</h3>
                <div className="bg-green-100 p-2.5 rounded-xl">
                    <Wallet className="w-5 h-5 text-green-600" />
                </div>
            </div>
            <div className="flex flex-col">
                <span className="text-3xl font-black text-slate-800">${expectedCashInDrawer.toFixed(2)}</span>
                <span className="text-xs text-slate-400 mt-1 font-medium">Inclut ${cashInDrawerStart.toFixed(0)} fond de caisse</span>
            </div>
        </div>

        {/* Card Payments */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
             <div className="flex items-center justify-between mb-4">
                <h3 className="text-slate-500 text-sm font-bold uppercase tracking-wide">Carte Bancaire</h3>
                <div className="bg-sky-100 p-2.5 rounded-xl">
                    <CreditCard className="w-5 h-5 text-sky-600" />
                </div>
            </div>
            <span className="text-3xl font-black text-slate-800">${stats.card.toFixed(2)}</span>
        </div>

        {/* Mobile Payments */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-slate-500 text-sm font-bold uppercase tracking-wide">Paiement Mobile</h3>
                <div className="bg-orange-100 p-2.5 rounded-xl">
                    <Smartphone className="w-5 h-5 text-orange-600" />
                </div>
            </div>
            <span className="text-3xl font-black text-slate-800">${stats.mobile.toFixed(2)}</span>
        </div>
      </div>

      {/* Transaction Log */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
            <h3 className="font-black text-slate-800 text-lg">Flux de Transactions</h3>
            <span className="text-xs font-medium text-slate-500 bg-white px-3 py-1 rounded-full border border-gray-200">Début service: {shiftStartTime.toLocaleTimeString()}</span>
        </div>
        <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Heure</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">ID Transaction</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Articles</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Méthode</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-right">Montant</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {currentShiftTransactions.length === 0 ? (
                        <tr>
                            <td colSpan={5} className="px-6 py-12 text-center text-slate-400 font-medium">Aucune transaction pour ce service.</td>
                        </tr>
                    ) : (
                        currentShiftTransactions.slice().reverse().map(t => (
                            <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4 text-sm font-medium text-slate-600">
                                    {new Date(t.timestamp).toLocaleTimeString()}
                                </td>
                                <td className="px-6 py-4 text-sm font-mono text-slate-500">{t.id}</td>
                                <td className="px-6 py-4 text-sm font-medium text-slate-800">
                                    {t.items.length} articles
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                                        t.paymentMethod === PaymentMethod.CASH ? 'bg-green-100 text-green-700' :
                                        t.paymentMethod === PaymentMethod.CARD ? 'bg-sky-100 text-sky-700' :
                                        'bg-orange-100 text-orange-700'
                                    }`}>
                                        {t.paymentMethod}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm font-black text-slate-800 text-right">
                                    ${t.totalAmount.toFixed(2)}
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
};