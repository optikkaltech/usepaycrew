'use client';

import { SlidersIcon, TrendingUpIcon } from '@/assets';
import { WalletHeroCard } from './WalletHeroCard';
import { WalletTransactionsList } from './WalletTransactionsList';

interface ContractorWalletTabProps {
  availableUsd: number;
  availableNgn: number;
  autoCashout: boolean;
  defaultBankName?: string;
  payments: any[];
  liveRate: number;
  isTogglingPreference: boolean;
  onConvert: () => void;
  onToggleAutoCashout: () => void;
  onGoToPreferences: () => void;
}

export function ContractorWalletTab({
  availableUsd,
  availableNgn,
  autoCashout,
  defaultBankName,
  payments,
  liveRate,
  isTogglingPreference,
  onConvert,
  onToggleAutoCashout,
  onGoToPreferences,
}: ContractorWalletTabProps) {
  return (
    <div className="flex flex-col gap-6">
      {/* Wallet Top Header matching mockup */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-display-sm font-black text-foreground">Wallet</h1>
          <p className="text-body-xs sm:text-body-sm text-muted-foreground mt-0.5">
            Your QDASH balance, transactions, and payout preferences.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onGoToPreferences}
            className="h-11 px-4 rounded-xl border border-[#008774] text-[#008774] hover:bg-[#008774]/5 font-bold text-body-xs sm:text-body-sm flex items-center gap-2 transition-colors cursor-pointer"
          >
            <SlidersIcon className="h-4 w-4" />
            Preferences
          </button>
          <button
            type="button"
            onClick={onConvert}
            className="h-11 px-5 rounded-xl bg-[#008774] hover:bg-[#007060] text-white font-bold text-body-xs sm:text-body-sm flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
          >
            <TrendingUpIcon className="h-4 w-4" />
            Convert
          </button>
        </div>
      </div>

      {/* Hero Card */}
      <WalletHeroCard
        availableUsd={availableUsd}
        availableNgn={availableNgn}
        autoCashout={autoCashout}
        defaultBankName={defaultBankName}
        isTogglingPreference={isTogglingPreference}
        onToggleAutoCashout={onToggleAutoCashout}
      />

      {/* Transactions Section */}
      <WalletTransactionsList
        payments={payments}
        liveRate={liveRate}
        defaultBankName={defaultBankName}
      />
    </div>
  );
}
