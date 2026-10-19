'use client';

import { useState } from 'react';
import clsx from 'clsx';
import { DownloadIcon, SearchIcon } from '@/assets';
import { useToast } from '@/hooks';
import { formatCurrency, formatDate } from '@/utils';
import { EarningsMetricsRow } from './EarningsMetricsRow';
import { EarningsListItem, EarningsItem } from './EarningsListItem';

interface ContractorEarningsTabProps {
  payments: any[];
  liveRate: number;
  companyName?: string;
}

type FilterOption = 'all' | 'settled' | 'holding';

export function ContractorEarningsTab({
  payments = [],
  liveRate = 1580.45,
  companyName = 'Acme Inc.',
}: ContractorEarningsTabProps) {
  const toast = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<FilterOption>('all');

  const totalUsd = payments.reduce((acc, p) => acc + (parseFloat(p.amount) || 0), 0);
  const totalNgn = totalUsd * liveRate;
  const count = payments.length;

  const getInitials = (name: string) => {
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return parts[0].slice(0, 2).toUpperCase();
  };

  const employerInitials = getInitials(companyName);

  const items: EarningsItem[] = payments.length > 0
    ? payments.map((p) => {
        const usd = parseFloat(p.amount) || 0;
        const rate = p.fxRate || liveRate;
        const ngn = usd * rate;
        const isSettled = p.status === 'COMPLETED' || p.status === 'PAID';
        return {
          id: p.id,
          title: p.note || `Salary — ${formatDate(p.createdAt || new Date())}`,
          employer: companyName,
          date: formatDate(p.createdAt || new Date()),
          status: isSettled ? 'settled' : 'holding',
          isAutoConverted: true,
          qdAmount: `+${usd.toLocaleString('en-US', { minimumFractionDigits: 2 })} QD`,
          ngnAmount: `≈ ₦${(ngn / 1_000_000).toFixed(2)}M`,
          rateText: `Rate ${formatCurrency(rate, 'NGN')}`,
        };
      })
    : [
        {
          id: 'earn-1',
          title: 'September 2026 Salary',
          employer: companyName,
          date: '30 Sept, 09:12',
          status: 'settled',
          isAutoConverted: true,
          qdAmount: '+1,169.99 QD',
          ngnAmount: '≈ ₦1.85M',
          rateText: 'Rate ₦1,580.45',
        },
        {
          id: 'earn-2',
          title: 'August 2026 Salary',
          employer: companyName,
          date: '31 Aug, 09:10',
          status: 'settled',
          isAutoConverted: true,
          qdAmount: '+1,169.99 QD',
          ngnAmount: '≈ ₦1.85M',
          rateText: 'Rate ₦1,572.10',
        },
        {
          id: 'earn-3',
          title: 'July 2026 Bonus',
          employer: companyName,
          date: '31 Jul, 09:00',
          status: 'holding',
          isAutoConverted: false,
          qdAmount: '+316.40 QD',
          ngnAmount: '≈ ₦500.0K',
          rateText: 'Rate ₦1,580.00',
        },
      ];

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.employer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter === 'all' || item.status === filter;
    return matchesSearch && matchesFilter;
  });

  const handleExport = () => {
    try {
      const headers = ['Title', 'Employer', 'Date', 'Status', 'Amount (QDASH)', 'Estimated (NGN)'];
      const rows = items.map((i) => [`"${i.title}"`, `"${i.employer}"`, `"${i.date}"`, `"${i.status}"`, `"${i.qdAmount}"`, `"${i.ngnAmount}"`]);
      const csv = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
      const link = document.createElement('a');
      link.href = encodeURI(csv);
      link.download = `paycrew_statement_${Date.now()}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('Earnings statement downloaded');
    } catch {
      toast.error('Failed to export statement');
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-display-sm font-black text-foreground">Earnings</h1>
          <p className="text-body-xs sm:text-body-sm text-muted-foreground mt-0.5">
            Every QDASH payment you&apos;ve received from employers.
          </p>
        </div>
        <button
          type="button"
          onClick={handleExport}
          className="h-11 px-4 rounded-xl border border-[#008774] text-[#008774] hover:bg-[#008774]/5 font-bold text-body-xs sm:text-body-sm flex items-center gap-2 transition-colors cursor-pointer shrink-0 self-start sm:self-auto"
        >
          <DownloadIcon className="h-4 w-4" />
          Export statement
        </button>
      </div>

      {/* Top 3 Stat Tiles */}
      <EarningsMetricsRow totalUsd={totalUsd} totalNgn={totalNgn} count={count} />

      {/* Search & Filter bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <SearchIcon className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by cycle or employer..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-11 rounded-xl border border-input bg-card pl-10 pr-4 text-body-xs font-medium text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-[#008774]"
          />
        </div>

        <div className="flex items-center gap-1.5 self-start sm:self-auto">
          {(['all', 'settled', 'holding'] as const).map((tab) => {
            const isActive = filter === tab;
            return (
              <button
                key={tab}
                type="button"
                onClick={() => setFilter(tab)}
                className={clsx(
                  'px-3.5 py-1.5 rounded-lg text-body-xs font-bold capitalize transition-colors cursor-pointer',
                  isActive
                    ? 'border-2 border-[#008774] text-[#008774]'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {tab}
              </button>
            );
          })}
        </div>
      </div>

      {/* List Card */}
      <div className="bg-card border border-border/80 shadow-xs rounded-2xl divide-y divide-border/60 overflow-hidden">
        {filteredItems.length === 0 ? (
          <div className="p-8 text-center text-body-xs text-muted-foreground">
            No earnings records match your search or filter.
          </div>
        ) : (
          filteredItems.map((item) => (
            <EarningsListItem key={item.id} item={item} employerInitials={employerInitials} />
          ))
        )}
      </div>
    </div>
  );
}
