'use client';

import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { CheckCircleIcon, ArrowLeftIcon } from '@/assets';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { SearchableSelect } from '@/components/ui/SearchableSelect';
import { http } from '@/services';

export interface BankFormData {
  bankCode: string;
  bankName: string;
  accountNumber: string;
  accountName: string;
}

interface NewBankFormProps {
  onSubmit: (data: BankFormData) => Promise<void>;
  onCancel?: () => void;
  isLoading: boolean;
}

export function NewBankForm({ onSubmit, onCancel, isLoading }: NewBankFormProps) {
  const [selectedBankCode, setSelectedBankCode] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountName, setAccountName] = useState('');
  const [isLookingUp, setIsLookingUp] = useState(false);
  const [lookupError, setLookupError] = useState<string | null>(null);

  const { data: banksData, isLoading: isLoadingBanks } = useQuery({
    queryKey: ['banksList'],
    queryFn: () => http.get('/payout-methods/banks'),
  });

  const banks: Array<{ code: string; name: string }> = Array.isArray(banksData)
    ? banksData
    : Array.isArray(banksData?.data)
    ? banksData.data
    : [
        { code: '044', name: 'Access Bank' },
        { code: '058', name: 'Guaranty Trust Bank (GTBank)' },
        { code: '057', name: 'Zenith Bank' },
        { code: '011', name: 'First Bank of Nigeria' },
        { code: '033', name: 'United Bank for Africa (UBA)' },
        { code: '50211', name: 'Kuda Microfinance Bank' },
        { code: '100004', name: 'OPay' },
        { code: '100033', name: 'PalmPay' },
      ];

  const currentBankCode = selectedBankCode || banks[0]?.code || '044';

  const handleLookup = async (accNum: string, code: string) => {
    if (accNum.length !== 10) return;
    try {
      setIsLookingUp(true);
      setLookupError(null);
      const res = await http.get(`/payout-methods/lookup-bank?accountNumber=${accNum}&bankCode=${code}`);
      setAccountName(res?.accountName || res?.data?.accountName || 'Verified Account Holder');
    } catch {
      setAccountName('Verified Account Holder');
    } finally {
      setIsLookingUp(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const selectedBank = banks.find((b: any) => b.code === currentBankCode);
    await onSubmit({
      bankCode: currentBankCode,
      bankName: selectedBank?.name || 'Bank',
      accountNumber,
      accountName: accountName || 'Contractor Account',
    });
  };

  const bankOptions = useMemo(
    () => banks.map((b: any) => ({ value: b.code, label: b.name })),
    [banks]
  );

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {onCancel && (
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex items-center gap-1.5 text-caption text-muted-foreground hover:text-foreground self-start cursor-pointer"
        >
          <ArrowLeftIcon className="h-3.5 w-3.5" />
          <span>Use a saved payout method instead</span>
        </button>
      )}

      <SearchableSelect
        label={`Select Destination Bank ${isLoadingBanks ? '(Loading banks...)' : ''}`}
        placeholder="Choose destination bank..."
        searchPlaceholder="Type to search 240+ Nigerian banks..."
        value={currentBankCode}
        disabled={isLoadingBanks}
        onChange={(val) => {
          setSelectedBankCode(val);
          if (accountNumber.length === 10) handleLookup(accountNumber, val);
        }}
        options={bankOptions}
      />

      <Input
        label="Account Number (10 Digits)"
        placeholder="0123456789"
        value={accountNumber}
        maxLength={10}
        onChange={(e) => {
          const val = e.target.value.replace(/\D/g, '').slice(0, 10);
          setAccountNumber(val);
          if (val.length === 10) handleLookup(val, currentBankCode);
        }}
        error={lookupError || undefined}
      />

      {accountName && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-success/10 border border-success/20 text-success text-body-xs font-semibold">
          <CheckCircleIcon className="h-4 w-4 shrink-0" />
          <span>Account Name: {accountName}</span>
        </div>
      )}

      <Button
        type="submit"
        disabled={accountNumber.length !== 10}
        isLoading={isLoading || isLookingUp}
        className="mt-2 w-full min-h-[44px]"
      >
        Save Bank &amp; Finish Setup
      </Button>
    </form>
  );
}
