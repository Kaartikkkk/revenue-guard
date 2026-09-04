'use client';

import { useState, useEffect } from 'react';
import { StatusBadge } from '@/components/StatusBadge';
import {
  CreditCard,
  RefreshCw,
  Search,
  Filter,
  Download,
  ArrowRight,
  ExternalLink,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface Payment {
  id: string;
  razorpay_payment_id: string;
  amount: number;
  currency: string;
  customer_email: string | null;
  customer_name: string | null;
  error_code: string | null;
  error_description: string | null;
  failure_category: string;
  status: string;
  method: string | null;
  retry_count: number;
  max_retries: number;
  created_at: string;
  amountFormatted: string;
  recoveryAttempts: Array<{
    id: string;
    strategy: string;
    status: string;
    attempt_number: number;
    diagnosis: string | null;
    reasoning: string | null;
    result: string | null;
    payment_link_url: string | null;
    created_at: string;
  }>;
}

export default function TransactionsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const fetchPayments = async () => {
    try {
      const url = filter ? `/api/recovery?status=${filter}` : '/api/recovery';
      const res = await fetch(url);
      const json = await res.json();
      setPayments(json.payments || []);
    } catch (error) {
      console.error('Failed to fetch transaction data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
    const interval = setInterval(fetchPayments, 4000);
    return () => clearInterval(interval);
  }, [filter]);

  const exportCSV = () => {
    if (payments.length === 0) return;
    const headers = ['Payment ID', 'Customer', 'Email', 'Amount (INR)', 'Category', 'Method', 'Status', 'Created At'];
    const rows = payments.map(p => [
      p.razorpay_payment_id,
      `"${p.customer_name || 'Unknown'}"`,
      `"${p.customer_email || 'N/A'}"`,
      (p.amount / 100).toFixed(2),
      p.failure_category,
      p.method || 'unknown',
      p.status,
      p.created_at,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `revenueguard_transactions_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredPayments = payments.filter((p) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      p.razorpay_payment_id.toLowerCase().includes(term) ||
      (p.customer_name && p.customer_name.toLowerCase().includes(term)) ||
      (p.customer_email && p.customer_email.toLowerCase().includes(term))
    );
  });

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6 pb-16 font-sans select-none">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-3 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-blue-500/20 text-blue-400 border border-blue-500/30">
              Merchant Ledger
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-3">
            Transaction <span className="text-blue-400">Inspector</span>
          </h1>
          <p className="text-xs text-slate-400 font-medium mt-0.5">
            Complete transaction ledger of all ingested, recovering, and preserved revenue events.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={exportCSV}
            className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl shadow-lg shadow-blue-600/30 transition-all"
          >
            <Download className="w-4 h-4" />
            Export CSV Ledger
          </button>
          <button
            onClick={fetchPayments}
            className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-slate-300 bg-[#0e1526] hover:bg-[#131c33] rounded-xl border border-slate-800 transition-all shadow-md"
          >
            <RefreshCw className="w-4 h-4 text-blue-400" />
            Refresh
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          {['', 'recovering', 'recovered', 'pending_approval', 'failed'].map((val) => (
            <button
              key={val}
              onClick={() => setFilter(val)}
              className={`
                px-3.5 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-2 whitespace-nowrap capitalize
                ${filter === val
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'text-slate-400 hover:text-slate-200 bg-[#0e1526] border border-slate-800'
                }
              `}
            >
              {val === '' ? 'All Transactions' : val.replace(/_/g, ' ')}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Filter by Payment ID or Customer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#0e1526] text-xs text-slate-200 rounded-xl pl-10 pr-4 py-2 border border-slate-800 focus:border-blue-500 focus:outline-none placeholder:text-slate-500 font-medium"
          />
        </div>
      </div>

      {/* Transactions Table Panel */}
      <div className="mockup-card p-6 overflow-hidden">
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-12 bg-slate-900 rounded animate-pulse" />
            ))}
          </div>
        ) : filteredPayments.length === 0 ? (
          <div className="text-center py-12">
            <CreditCard className="w-10 h-10 text-slate-500 mx-auto mb-2 opacity-60" />
            <p className="text-sm font-bold text-slate-300">No transactions recorded</p>
            <p className="text-xs text-slate-500 mt-1">Run a simulation scenario to populate transaction data.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs font-mono">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                  <th className="py-3 px-4">Payment ID</th>
                  <th className="py-3 px-4">Customer Name</th>
                  <th className="py-3 px-4">Method</th>
                  <th className="py-3 px-4">Failure Reason</th>
                  <th className="py-3 px-4 text-right">Amount</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {filteredPayments.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-blue-400">{p.razorpay_payment_id}</td>
                    <td className="py-3.5 px-4 text-slate-200">{p.customer_name || p.customer_email || 'Unknown'}</td>
                    <td className="py-3.5 px-4 text-slate-400 capitalize">{p.method || 'card'}</td>
                    <td className="py-3.5 px-4 text-purple-300 font-sans font-semibold">{p.failure_category.replace(/_/g, ' ')}</td>
                    <td className="py-3.5 px-4 text-right font-bold text-white">{p.amountFormatted}</td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={p.status} />
                    </td>
                    <td className="py-3.5 px-4 text-right text-slate-500">
                      {new Date(p.created_at).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
