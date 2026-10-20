'use client';

import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { XIcon, ShieldAlertIcon, AppStrings } from '@/assets';
import { SearchableSelect } from '@/components/ui/SearchableSelect';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { PayoutService } from '@/services';
import { useToast } from '@/hooks';
import { normalizeError } from '@/utils';

const defaultBanks = [
  { code: '058', name: 'GTBank (Guaranty Trust Bank)' },
  { code: '011', name: 'First Bank of Nigeria' },
  { code: '033', name: 'United Bank for Africa (UBA)' },
  { code: '057', name: 'Zenith Bank' },
  { code: '044', name: 'Access Bank' },
  { code: '035', name: 'Wema Bank' },
  { code: '101', name: 'Providus Bank' },
  { code: '232', name: 'Sterling Bank' },
];

interface AddBankModalProps {
  isOpen: boolean;
  onClose: () => void;
  workerId: string;
  workerName?: string;
  onSuccess: () => void;
}

export function AddBankModal({
  isOpen,
  onClose,
  workerId,
  workerName,
  onSuccess,
}: AddBankModalProps) {
  const toast = useToast();
  const [bankCode, setBankCode] = useState('058');
  const [accountNumber, setAccountNumber] = useState('');
  const [resolvedName, setResolvedName] = useState<string | null>(null);

  const { data: banks = defaultBanks } = useQuery({
    queryKey: ['payout-banks'],
    queryFn: async () => {
      const res = await PayoutService.getBanks();
      return Array.isArray(res) && res.length > 0 ? res : defaultBanks;
    },
    staleTime: 60 * 60 * 1000,
  });

  const saveBankMutation = useMutation({
    mutationFn: async () => {
      const selectedBank = banks.find((b: any) => b.code === bankCode);
      return PayoutService.linkBank(workerId, {
        accountNumber,
        bankCode,
        bankName: selectedBank?.name || 'Commercial Bank',
      });
    },
    onSuccess: () => {
      toast.success('Bank account linked successfully');
      setAccountNumber('');
      setResolvedName(null);
      onSuccess();
      onClose();
    },
    onError: (err) => {
      toast.error(normalizeError(err).message);
    },
  });

  if (!isOpen) return null;

  const handleLookup = async (acct: string) => {
    setAccountNumber(acct);
    if (acct.length === 10) {
      try {
        const res = await PayoutService.lookupBank(acct, bankCode);
        setResolvedName(res.accountName);
      } catch {
        setResolvedName(null);
      }
    } else {
      setResolvedName(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="w-full max-w-lg rounded-2xl bg-card border border-border shadow-xl p-6 sm:p-7 flex flex-col gap-5">
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <div>
            <h3 className="text-display-xs font-bold text-foreground">Add Bank Account</h3>
            <p className="text-caption text-muted-foreground mt-0.5">
              Link a Nigerian bank account for local currency payouts.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="h-8 w-8 rounded-lg hover:bg-secondary flex items-center justify-center text-muted-foreground"
          >
            <XIcon className="h-4 w-4" />
          </button>
        </div>

        <div className="flex flex-col gap-3.5">
          <SearchableSelect
            label="Bank Name"
            placeholder="Select bank..."
            searchPlaceholder="Type to search 200+ banks..."
            value={bankCode}
            onChange={(val) => {
              setBankCode(val);
              setResolvedName(null);
            }}
            options={banks.map((b: any) => ({ value: b.code, label: b.name }))}
          />

          <div>
            <label className="text-body-xs font-medium text-foreground mb-1 block">
              Account Number
            </label>
            <Input
              placeholder="10-digit account number"
              maxLength={10}
              value={accountNumber}
              onChange={(e) => handleLookup(e.target.value.replace(/\D/g, ''))}
            />
          </div>

          {resolvedName && (
            <div className="rounded-xl bg-primary/10 border border-primary/20 p-3">
              <p className="text-caption font-semibold text-primary">Verified Account Name</p>
              <p className="text-body-sm font-bold text-foreground">{resolvedName}</p>
            </div>
          )}

          {resolvedName && workerName && !(() => {
            const cleanResolved = resolvedName.toLowerCase().replace(/[^a-z]/g, '');
            const parts = workerName.toLowerCase().split(/\s+/).filter(Boolean);
            return parts.some((p) => cleanResolved.includes(p));
          })() && (
            <div className="rounded-xl bg-warning/10 border border-warning/30 p-3 flex flex-col gap-1">
              <div className="flex items-center gap-1.5 text-warning font-semibold text-caption">
                <ShieldAlertIcon className="h-3.5 w-3.5 shrink-0" />
                <span>{AppStrings.checkers.nameMismatchWarning}</span>
              </div>
              <p className="text-caption text-muted-foreground">{AppStrings.checkers.nameMismatchDescription}</p>
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={() => saveBankMutation.mutate()}
            disabled={!resolvedName || saveBankMutation.isPending}
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold"
          >
            {saveBankMutation.isPending ? 'Linking...' : 'Add Account'}
          </Button>
        </div>
      </div>
    </div>
  );
}
