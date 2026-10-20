'use client';

import { use, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { http } from '@/services';
import { useToast, useTheme, useAuth } from '@/hooks';
import { usePrivacyStore } from '@/store';
import { ContractorSidebar } from './_components/ContractorSidebar';
import { WorkerHeader } from './_components/WorkerHeader';
import { ContractorOverviewTab } from './_components/ContractorOverviewTab';
import { ContractorConvertTab } from './_components/ContractorConvertTab';
import { ContractorSettingsTab } from './_components/ContractorSettingsTab';
import { ContractorWalletTab } from './_components/ContractorWalletTab';
import { ContractorEarningsTab } from './_components/ContractorEarningsTab';
import { BankSection } from './_components/BankSection';
import { WithdrawModal } from './_components/WithdrawModal';
import { ContractorTab } from './_components/contractor.types';

export default function WorkerPortalPage({ params }: { params: Promise<{ workerId: string }> }) {
  const { workerId } = use(params);
  const toast = useToast();
  const { logout } = useAuth();
  const { isDark, toggleTheme, mounted } = useTheme();
  const { isPrivacyMode, togglePrivacyMode } = usePrivacyStore();

  const [activeTab, setActiveTab] = useState<ContractorTab>('overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState<string>('');
  const [isUpdatingPreference, setIsUpdatingPreference] = useState(false);

  const { data: worker, refetch: refetchWorker } = useQuery({ queryKey: ['worker', workerId], queryFn: () => http.get(`/workers/${workerId}`) });
  const { data: balanceData, refetch: refetchBalance } = useQuery({ queryKey: ['workerBalance', workerId], queryFn: () => http.get('/ledger/worker-balance?currency=USD') });
  const { data: payoutMethods = [], refetch: refetchMethods } = useQuery({ queryKey: ['payoutMethods', workerId], queryFn: () => http.get(`/payout-methods/${workerId}`) });
  const { data: rateData } = useQuery({ queryKey: ['marketRate'], queryFn: () => http.get('/payments/rate'), refetchInterval: 30000 });
  const { data: payments = [] } = useQuery({ queryKey: ['workerPayments', workerId], queryFn: () => http.get(`/payments?workerId=${workerId}`) });

  const refetchAll = () => { refetchWorker(); refetchBalance(); refetchMethods(); };

  const liveRate = rateData?.rate || 1580.45;
  const availableUsd = balanceData?.availableBalance ? parseFloat(balanceData.availableBalance) : 0;
  const availableNgn = availableUsd * liveRate;
  const defaultMethod = payoutMethods.find((m: any) => m.isDefault);
  const defaultBankLast4 = defaultMethod?.accountReference ? defaultMethod.accountReference.slice(-4) : '';
  const firstName = worker?.name ? worker.name.split(' ')[0] : 'Contractor';
  const totalEarnedUsd = payments.reduce((acc: number, p: any) => acc + (parseFloat(p.amount) || 0), 0);
  const settledCount = payments.filter((p: any) => p.status === 'COMPLETED' || p.status === 'PAID').length;

  const toggleAutoCashout = async () => {
    setIsUpdatingPreference(true);
    try {
      const nextState = !worker?.autoCashoutEnabled;
      await http.patch(`/workers/${workerId}/preferences`, { autoCashoutEnabled: nextState });
      await refetchWorker();
      toast.success(nextState ? 'Auto-convert enabled' : 'Auto-convert disabled');
    } catch (err: any) {
      toast.error(err.message || 'Failed to update preferences');
    } finally {
      setIsUpdatingPreference(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <ContractorSidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        onLogout={logout}
      />

      <main className="flex-1 flex flex-col min-w-0">
        <WorkerHeader
          firstName={firstName}
          fullName={worker?.name}
          activeTab={activeTab}
          liveRate={liveRate}
          isDark={isDark}
          mounted={mounted}
          toggleTheme={toggleTheme}
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
          isPrivacyMode={isPrivacyMode}
          togglePrivacyMode={togglePrivacyMode}
          onLogout={logout}
        />

        <div className="flex-1 p-4 sm:p-6 lg:p-8 w-full flex flex-col gap-6">
          {activeTab !== 'settings' && activeTab !== 'convert' && activeTab !== 'wallet' && activeTab !== 'earnings' && activeTab !== 'banks' && (
            <div>
              <h1 className="text-display-sm font-black text-foreground">Welcome back, {firstName}</h1>
              <p className="text-body-xs sm:text-body-sm text-muted-foreground mt-0.5">
                Your USDT earnings and Naira conversions at a glance.
              </p>
            </div>
          )}

          {activeTab === 'overview' && (
            <ContractorOverviewTab
              availableUsd={availableUsd}
              availableNgn={availableNgn}
              autoCashout={!!worker?.autoCashoutEnabled}
              defaultBankName={defaultMethod?.bankName}
              defaultBankLast4={defaultBankLast4}
              totalEarnedUsd={totalEarnedUsd}
              settledCount={settledCount}
              liveRate={liveRate}
              payments={payments}
              isTogglingPreference={isUpdatingPreference}
              onConvert={() => setActiveTab('convert')}
              onWithdraw={() => setActiveTab('convert')}
              onToggleAutoCashout={toggleAutoCashout}
              onViewAllEarnings={() => setActiveTab('earnings')}
            />
          )}

          {activeTab === 'convert' && (
            <ContractorConvertTab
              availableUsd={availableUsd}
              liveRate={liveRate}
              payoutMethods={payoutMethods}
              workerName={worker?.name}
              defaultBankName={defaultMethod?.bankName}
              defaultBankLast4={defaultBankLast4}
              payments={payments}
              onReviewConversion={(amt) => {
                setWithdrawAmount(amt.toString());
                setWithdrawOpen(true);
              }}
            />
          )}

          {activeTab === 'earnings' && (
            <ContractorEarningsTab
              payments={payments}
              liveRate={liveRate}
              companyName={worker?.company?.name || worker?.companyName || 'Your Employer'}
            />
          )}

          {activeTab === 'wallet' && (
            <ContractorWalletTab
              availableUsd={availableUsd}
              availableNgn={availableNgn}
              autoCashout={!!worker?.autoCashoutEnabled}
              defaultBankName={defaultMethod?.bankName}
              payments={payments}
              liveRate={liveRate}
              isTogglingPreference={isUpdatingPreference}
              onConvert={() => setActiveTab('convert')}
              onToggleAutoCashout={toggleAutoCashout}
              onGoToPreferences={() => setActiveTab('settings')}
            />
          )}

          {activeTab === 'banks' && (
            <BankSection
              workerId={workerId}
              workerName={worker?.name}
              payoutMethods={payoutMethods}
              onSuccess={refetchAll}
            />
          )}

          {activeTab === 'settings' && (
            <ContractorSettingsTab
              workerId={workerId}
              worker={worker}
              autoCashout={!!worker?.autoCashoutEnabled}
              defaultBankName={defaultMethod?.bankName}
              defaultBankLast4={defaultBankLast4}
              isTogglingPreference={isUpdatingPreference}
              onToggleAutoCashout={toggleAutoCashout}
              onSuccess={refetchAll}
            />
          )}
        </div>
      </main>

      <WithdrawModal
        isOpen={withdrawOpen}
        onClose={() => setWithdrawOpen(false)}
        onSuccess={refetchAll}
        workerId={workerId}
        defaultMethod={defaultMethod}
        availableBalance={availableUsd}
        initialAmount={withdrawAmount}
      />
    </div>
  );
}
