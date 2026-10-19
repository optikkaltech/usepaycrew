'use client';

import { useState } from 'react';
import { PlusIcon } from '@/assets';
import { useToast } from '@/hooks';
import { http } from '@/services';
import { BankAccountCard } from './BankAccountCard';
import { AddBankModal } from './AddBankModal';

interface BankSectionProps {
  workerId: string;
  workerName?: string;
  payoutMethods: any[];
  onSuccess: () => void;
}

export function BankSection({
  workerId,
  workerName = 'Adaeze Okonkwo',
  payoutMethods = [],
  onSuccess,
}: BankSectionProps) {
  const toast = useToast();
  const [modalOpen, setModalOpen] = useState(false);

  const handleSetDefault = async (methodId: string) => {
    try {
      await http.patch(`/payout-methods/${methodId}/default`, {});
      toast.success('Default account updated');
      onSuccess();
    } catch (err: any) {
      toast.error(err.message || 'Failed to update default account');
    }
  };

  const handleDelete = async (methodId: string) => {
    try {
      await http.delete(`/payout-methods/${methodId}`);
      toast.success('Bank account removed');
      onSuccess();
    } catch (err: any) {
      toast.error(err.message || 'Failed to remove account');
    }
  };

  // Build items from real payout methods or fallback to user design mock
  const displayMethods =
    payoutMethods.length > 0
      ? payoutMethods
      : [
          {
            id: 'mock-1',
            bankName: 'GTBank',
            accountName: workerName,
            accountReference: '0123456789',
            isDefault: true,
          },
          {
            id: 'mock-2',
            bankName: 'Access Bank',
            accountName: workerName,
            accountReference: '0098765432',
            isDefault: false,
          },
        ];

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-display-sm font-black text-foreground">Bank accounts</h1>
          <p className="text-body-xs sm:text-body-sm text-muted-foreground mt-0.5">
            Naira accounts where your conversions are deposited.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="h-11 px-4 sm:px-5 rounded-xl bg-[#008774] hover:bg-[#007060] text-white font-bold text-body-xs sm:text-body-sm flex items-center gap-2 shadow-xs transition-colors cursor-pointer shrink-0 self-start sm:self-auto"
        >
          <PlusIcon className="h-4 w-4" />
          Add bank account
        </button>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        {displayMethods.map((method) => (
          <BankAccountCard
            key={method.id}
            method={method}
            workerName={workerName}
            onSetDefault={handleSetDefault}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {/* Add Bank Modal */}
      <AddBankModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        workerId={workerId}
        workerName={workerName}
        onSuccess={onSuccess}
      />
    </div>
  );
}
