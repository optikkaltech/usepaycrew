'use client';

import { ConvertFormCard } from './ConvertFormCard';
import { ConversionHistoryCard } from './ConversionHistoryCard';
import { RateAlertCard } from './RateAlertCard';

interface ContractorConvertTabProps {
  availableUsd: number;
  liveRate: number;
  payoutMethods: any[];
  workerName?: string;
  defaultBankName?: string;
  defaultBankLast4?: string;
  payments: any[];
  onReviewConversion: (amountUsd: number, methodId?: string) => void;
}

export function ContractorConvertTab({
  availableUsd,
  liveRate,
  payoutMethods,
  workerName,
  defaultBankName,
  defaultBankLast4,
  payments,
  onReviewConversion,
}: ContractorConvertTabProps) {
  return (
    <div className="flex flex-col gap-6">
      {/* Header matching Image 2 */}
      <div>
        <h1 className="text-display-sm font-black text-foreground">Convert & withdraw</h1>
        <p className="text-body-xs sm:text-body-sm text-muted-foreground mt-0.5">
          Convert USDT to Naira and send it to your bank account.
        </p>
      </div>

      {/* 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Convert Form */}
        <div className="lg:col-span-7">
          <ConvertFormCard
            availableUsd={availableUsd}
            liveRate={liveRate}
            payoutMethods={payoutMethods}
            workerName={workerName}
            onReviewConversion={onReviewConversion}
          />
        </div>

        {/* Right Column: History + Rate Alert */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <ConversionHistoryCard
            payments={payments}
            defaultBankName={defaultBankName}
            defaultBankLast4={defaultBankLast4}
            liveRate={liveRate}
          />
          <RateAlertCard />
        </div>
      </div>
    </div>
  );
}
