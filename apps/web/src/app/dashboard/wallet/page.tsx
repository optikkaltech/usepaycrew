'use client';

import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  AppStrings,
  SlidersIcon,
} from '@/assets';
import { Button } from '@/components/ui/Button';
import { http } from '@/services';
import { WalletBalanceCard } from './_components/WalletBalanceCard';
import { DepositAddressCard } from './_components/DepositAddressCard';
import { WalletMetricsCards } from './_components/WalletMetricsCards';
import { FundingHistoryCard } from './_components/FundingHistoryCard';
import { AutoFundingModal } from './_components/AutoFundingModal';
import { GenerateWalletModal } from './_components/GenerateWalletModal';
import { WalletSkeleton } from './_components/WalletSkeleton';

export default function WalletFundingPage() {
  const [isRulesOpen, setIsRulesOpen] = useState(false);
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const [selectedWalletId, setSelectedWalletId] = useState<string | null>(null);

  // 1. Fetch live company ledger balance
  const { data: balanceData, isLoading: isBalanceLoading } = useQuery({
    queryKey: ['companyBalance', 'USD'],
    queryFn: () => http.get('/ledger/company-balance?currency=USD'),
  });

  // 2. Fetch live Quidax OTC rate
  const { data: rateData, isLoading: isRateLoading } = useQuery({
    queryKey: ['liveRate', 'USDT_NGN'],
    queryFn: () => http.get('/payments/rate?pair=USDT_NGN'),
    staleTime: 30000,
  });

  // 3. Fetch company wallets (live generated addresses & QR codes)
  const { data: wallets = [], isLoading: isWalletsLoading } = useQuery({
    queryKey: ['companyWallets'],
    queryFn: () => http.get('/companies/wallets'),
  });

  // 4. Fetch workers to calculate real monthly burn
  const { data: workers = [], isLoading: isWorkersLoading } = useQuery({
    queryKey: ['workers'],
    queryFn: () => http.get('/workers'),
  });

  // 5. Fetch ledger funding history
  const { data: entries = [], isLoading: isEntriesLoading } = useQuery({
    queryKey: ['companyLedgerEntries'],
    queryFn: () => http.get('/ledger/company-entries'),
  });

  // Show skeleton while initial critical data is loading
  const isInitialLoading = (isBalanceLoading || isWalletsLoading) && wallets.length === 0 && !balanceData;

  const liveRate = rateData?.rate || rateData?.data?.rate || 1355.27;
  const rawBalance = balanceData?.availableBalance ? parseFloat(balanceData.availableBalance) : 0;

  // Real-time monthly payroll burn across active contractors (zero static fallback)
  const monthlyBurn = useMemo(() => {
    if (!workers || workers.length === 0) return 0;
    return workers.reduce((acc: number, w: any) => {
      const amount = parseFloat(w.payAmount) || 0;
      return acc + (w.payCurrency === 'NGN' && liveRate > 0 ? amount / liveRate : amount);
    }, 0);
  }, [workers, liveRate]);

  const runwayMonths = monthlyBurn > 0 && rawBalance > 0 ? rawBalance / monthlyBurn : 0;

  if (isInitialLoading) {
    return <WalletSkeleton />;
  }

  return (
    <div className="flex flex-col gap-6 sm:gap-8 max-w-7xl">
      {/* Header matching Image 1 */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-display-md text-foreground font-extrabold">
            {AppStrings.wallet.title}
          </h1>
          <p className="mt-1 text-body-sm text-muted-foreground">
            {AppStrings.wallet.subtitle}
          </p>
        </div>

        <Button
          variant="outline"
          onClick={() => setIsRulesOpen(true)}
          className="min-h-[44px] self-start sm:self-auto"
        >
          <SlidersIcon className="mr-2 h-4 w-4" />
          {AppStrings.wallet.autoFundingRules}
        </Button>
      </div>

      {/* Hero Available Balance Card */}
      <WalletBalanceCard
        balanceUsdt={rawBalance}
        rateNgn={liveRate}
        runwayMonths={runwayMonths}
        onDepositClick={() => {
          const el = document.getElementById('deposit-section');
          el?.scrollIntoView({ behavior: 'smooth' });
        }}
        onWithdrawClick={() => {
          window.location.href = '/dashboard/payroll';
        }}
      />

      {/* 3-Column Grid matching Image 1 */}
      <div id="deposit-section" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-5">
          <DepositAddressCard
            wallets={wallets}
            selectedWalletId={selectedWalletId}
            onSelectWallet={setSelectedWalletId}
            onOpenGenerateModal={() => setIsGenerateModalOpen(true)}
          />
        </div>

        <div className="lg:col-span-3">
          <WalletMetricsCards
            monthlyBurnUsdt={monthlyBurn}
            rateNgn={liveRate}
            pendingDepositsCount={0}
          />
        </div>

        <div className="md:col-span-2 lg:col-span-4">
          <FundingHistoryCard entries={entries} />
        </div>
      </div>

      <AutoFundingModal
        isOpen={isRulesOpen}
        onClose={() => setIsRulesOpen(false)}
      />

      <GenerateWalletModal
        isOpen={isGenerateModalOpen}
        onClose={() => setIsGenerateModalOpen(false)}
        existingNetworks={wallets.map((w: any) => w.network)}
      />
    </div>
  );
}
