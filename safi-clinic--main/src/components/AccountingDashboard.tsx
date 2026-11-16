import React, { useState, useEffect, useCallback } from 'react';
import {
  TrendingUp,
  Users,
  DollarSign,
  Receipt,
  RefreshCw,
  ArrowUpRight,
  Stethoscope,
  ShoppingBag,
  Percent,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { AnalyticsPeriod, NetRevenueMetrics } from '../utils/clinicLogic';
import { TransactionRecord } from '../types/clinic';
import { useCurrency } from '../context/CurrencyContext';
import { formatShortAxisPrice } from '../utils/currency';

interface ChartPoint {
  label: string;
  grossRevenue: number;
  netRevenue: number;
  cogsAndOverhead: number;
}

interface AccountingDashboardProps {
  refreshTrigger?: number;
}

/**
 * AccountingDashboard
 * ----------------------------------------------------------------------------
 * Real-time clinical financial analytics & automated ledger viewer.
 *
 * Accounting Calculation Formula (enforced consistently on server & client):
 *   1. Gross Revenue   = Sum of all patient consultation fees + pharmacy/POS sales
 *   2. COGS            = Wholesale / compounding cost of medicines sold
 *   3. Flat Overhead   = Gross Revenue * (configurable overheadPercentage / 100)
 *   4. Net Revenue     = Gross Revenue - COGS - Flat Overhead
 *
 * Every consultation booking, QR triage check-in, online order, or POS terminal
 * checkout writes atomically to PostgreSQL `transactions` with zero manual entry.
 */
export const AccountingDashboard: React.FC<AccountingDashboardProps> = ({ refreshTrigger }) => {
  const { currency, formatPrice } = useCurrency();
  const [period, setPeriod] = useState<AnalyticsPeriod>('monthly');
  const [loading, setLoading] = useState<boolean>(true);
  const [overheadPct, setOverheadPct] = useState<number>(15);
  const [summary, setSummary] = useState<NetRevenueMetrics>({
    totalPatientsSeen: 0,
    consultationCount: 0,
    pharmacyOrderCount: 0,
    grossRevenue: 0,
    totalCogs: 0,
    totalOverhead: 0,
    netRevenue: 0,
    profitMarginPercent: 0,
  });
  const [chartData, setChartData] = useState<ChartPoint[]>([]);
  const [transactions, setTransactions] = useState<TransactionRecord[]>([]);

  const fetchAnalytics = useCallback(async (selectedPeriod: AnalyticsPeriod) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/analytics/summary?period=${selectedPeriod}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setSummary(data.summary);
          setOverheadPct(data.overheadPercentage ?? 15);
          setChartData(data.chartData || []);
          setTransactions(data.transactions || []);
        }
      }
    } catch (err) {
      console.error('Failed to fetch analytics:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAnalytics(period);
  }, [period, refreshTrigger, fetchAnalytics]);

  return (
    <div className="space-y-6">
      {/* Top Toolbar: Period Switcher + Formula Note */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1b3b2f]">
        <div>
          <h2 className="font-serif-classic text-xl sm:text-2xl font-bold text-[#f5f3ec]">
            Financial & Accounting Overview
          </h2>
          <p className="text-xs text-[#8da396] mt-0.5">
            Net Revenue = Gross Revenue − Medicine COGS − {overheadPct}% Flat Clinical Overhead
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="inline-flex p-1 rounded-lg bg-[#05110a] border border-[#1b3b2f]">
            {(['daily', 'weekly', 'monthly'] as AnalyticsPeriod[]).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPeriod(p)}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold capitalize whitespace-nowrap transition-colors cursor-pointer ${
                  period === p
                    ? 'bg-[#d4af37] text-black font-bold'
                    : 'text-[#a6b6ad] hover:text-[#f5f3ec]'
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => fetchAnalytics(period)}
            aria-label="Refresh financial ledger"
            className="p-2 rounded-lg bg-[#0a1e15] border border-[#1b3b2f] hover:border-[#d4af37] text-[#a6b6ad] hover:text-[#d4af37] transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* 4 Executive KPI Metrics (Tabular Numerals) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-xl bg-[#07160f] border border-[#1b3b2f] space-y-2">
          <div className="flex items-center justify-between text-xs text-[#8da396]">
            <span className="uppercase tracking-wider font-semibold">Patients Seen ({period})</span>
            <Users className="w-4 h-4 text-[#d4af37]" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-[#f5f3ec] font-mono tabular-nums">
            {summary.totalPatientsSeen}
          </div>
          <div className="text-[11px] text-[#a6b6ad] tabular-nums">
            {summary.consultationCount} consultations · {summary.pharmacyOrderCount} pharmacy sales
          </div>
        </div>

        <div className="p-5 rounded-xl bg-[#07160f] border border-[#1b3b2f] space-y-2">
          <div className="flex items-center justify-between text-xs text-[#8da396]">
            <span className="uppercase tracking-wider font-semibold">Gross Revenue</span>
            <DollarSign className="w-4 h-4 text-[#d4af37]" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-[#d4af37] font-mono tabular-nums">
            <span dir="ltr">{formatPrice(summary.grossRevenue)}</span>
          </div>
          <div className="text-[11px] text-[#a6b6ad]">
            Combined clinical fees & dispensary sales
          </div>
        </div>

        <div className="p-5 rounded-xl bg-[#07160f] border border-[#1b3b2f] space-y-2">
          <div className="flex items-center justify-between text-xs text-[#8da396]">
            <span className="uppercase tracking-wider font-semibold">COGS & Overhead</span>
            <Percent className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-amber-300 font-mono tabular-nums">
            <span dir="ltr">{formatPrice(summary.totalCogs + summary.totalOverhead)}</span>
          </div>
          <div className="text-[11px] text-[#a6b6ad] tabular-nums">
            COGS <span dir="ltr">{formatPrice(summary.totalCogs)}</span> + Overhead{' '}
            <span dir="ltr">{formatPrice(summary.totalOverhead)}</span>
          </div>
        </div>

        <div className="p-5 rounded-xl bg-[#07160f] border border-emerald-700/50 space-y-2">
          <div className="flex items-center justify-between text-xs text-emerald-300">
            <span className="uppercase tracking-wider font-semibold">Net Revenue</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-emerald-400 font-mono tabular-nums">
            <span dir="ltr">{formatPrice(summary.netRevenue)}</span>
          </div>
          <div className="text-[11px] text-emerald-300/80 flex items-center gap-1 tabular-nums">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>{summary.profitMarginPercent}% net operating margin</span>
          </div>
        </div>
      </div>

      {/* Data Visualizations (Recharts) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Income vs Net Trend Area Chart */}
        <div className="lg:col-span-7 p-5 rounded-xl bg-[#07160f] border border-[#1b3b2f] space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-serif-classic font-bold text-base text-[#f5f3ec]">
                Gross Revenue vs. Net Profit Trend
              </h3>
              <p className="text-[11px] text-[#8da396]">Daily cashflow progression across consultations and POS sales</p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartData}
                margin={{ top: 10, right: 10, left: currency === 'AFN' ? 14 : -10, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="grossGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#d4af37" stopOpacity={0.45} />
                    <stop offset="95%" stopColor="#d4af37" stopOpacity={0.02} />
                  </linearGradient>
                  <linearGradient id="netGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#16a34a" stopOpacity={0.45} />
                    <stop offset="95%" stopColor="#16a34a" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1b3b2f" />
                <XAxis dataKey="label" stroke="#8da396" tick={{ fontSize: 11 }} />
                <YAxis
                  stroke="#8da396"
                  tick={{ fontSize: 11 }}
                  tickFormatter={(v) => formatShortAxisPrice(Number(v), currency)}
                />
                <Tooltip
                  formatter={(value: unknown) => formatPrice(Number(value))}
                  contentStyle={{
                    backgroundColor: '#05110a',
                    borderColor: '#d4af37',
                    borderRadius: '10px',
                    fontSize: '12px',
                    color: '#f5f3ec',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="grossRevenue"
                  name={`Gross Revenue (${currency === 'AFN' ? 'AFG' : '$'})`}
                  stroke="#d4af37"
                  strokeWidth={2}
                  fill="url(#grossGrad)"
                />
                <Area
                  type="monotone"
                  dataKey="netRevenue"
                  name={`Net Revenue (${currency === 'AFN' ? 'AFG' : '$'})`}
                  stroke="#22c55e"
                  strokeWidth={2}
                  fill="url(#netGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Revenue vs COGS/Overhead Bar Comparison */}
        <div className="lg:col-span-5 p-5 rounded-xl bg-[#07160f] border border-[#1b3b2f] space-y-4">
          <div>
            <h3 className="font-serif-classic font-bold text-base text-[#f5f3ec]">
              Operating Margin Breakdown
            </h3>
            <p className="text-[11px] text-[#8da396]">
              Net Revenue vs. COGS & {overheadPct}% Overhead per billing cycle
            </p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 10, right: 10, left: currency === 'AFN' ? 14 : -10, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#1b3b2f" />
                <XAxis dataKey="label" stroke="#8da396" tick={{ fontSize: 11 }} />
                <YAxis
                  stroke="#8da396"
                  tick={{ fontSize: 11 }}
                  tickFormatter={(v) => formatShortAxisPrice(Number(v), currency)}
                />
                <Tooltip
                  formatter={(value: unknown) => formatPrice(Number(value))}
                  contentStyle={{
                    backgroundColor: '#05110a',
                    borderColor: '#1b3b2f',
                    borderRadius: '10px',
                    fontSize: '12px',
                    color: '#f5f3ec',
                  }}
                />
                <Bar
                  dataKey="netRevenue"
                  name={`Net Profit (${currency === 'AFN' ? 'AFG' : '$'})`}
                  fill="#16a34a"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="cogsAndOverhead"
                  name={`COGS & Overhead (${currency === 'AFN' ? 'AFG' : '$'})`}
                  fill="#d97706"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Automated Centralized Accounting Ledger */}
      <div className="rounded-xl bg-[#07160f] border border-[#1b3b2f] overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-[#1b3b2f] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Receipt className="w-4 h-4 text-[#d4af37]" />
            <h3 className="font-serif-classic font-bold text-base text-[#f5f3ec]">
              Automated Transaction Ledger
            </h3>
          </div>
          <span className="text-xs text-[#8da396] tabular-nums">
            Showing {transactions.length} synchronized entries
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#05110a] border-b border-[#1b3b2f] text-[#8da396] uppercase text-[11px] tracking-wider">
                <th className="py-3 px-4">Reference</th>
                <th className="py-3 px-4">Stream</th>
                <th className="py-3 px-4">Patient / Description</th>
                <th className="py-3 px-4 text-right">Gross</th>
                <th className="py-3 px-4 text-right">COGS</th>
                <th className="py-3 px-4 text-right">Overhead</th>
                <th className="py-3 px-4 text-right">Net Profit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1b3b2f]/60">
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-[#8da396]">
                    No automated ledger transactions recorded yet.
                  </td>
                </tr>
              ) : (
                transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-[#0b2117] transition-colors">
                    <td className="py-3 px-4 font-mono text-[#d4af37] font-semibold whitespace-nowrap">
                      {tx.referenceNumber}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      {tx.type === 'consultation' ? (
                        <span className="inline-flex items-center gap-1.5 text-sky-300 font-medium">
                          <Stethoscope className="w-3.5 h-3.5" />
                          Consultation
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-amber-300 font-medium">
                          <ShoppingBag className="w-3.5 h-3.5" />
                          Pharmacy POS
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-[#f5f3ec]">
                        {tx.patientName || 'Clinic Patient'}
                      </div>
                      <div className="text-[11px] text-[#8da396] line-clamp-1">
                        {tx.description}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right font-mono tabular-nums text-[#f5f3ec] whitespace-nowrap">
                      <span dir="ltr">{formatPrice(Number(tx.grossAmount))}</span>
                    </td>
                    <td className="py-3 px-4 text-right font-mono tabular-nums text-[#a6b6ad] whitespace-nowrap">
                      <span dir="ltr">{formatPrice(Number(tx.cogsAmount))}</span>
                    </td>
                    <td className="py-3 px-4 text-right font-mono tabular-nums text-amber-300 whitespace-nowrap">
                      <span dir="ltr">{formatPrice(Number(tx.overheadAmount))}</span>
                    </td>
                    <td className="py-3 px-4 text-right font-mono tabular-nums font-bold text-emerald-400 whitespace-nowrap">
                      <span dir="ltr">{formatPrice(Number(tx.netAmount))}</span>
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
