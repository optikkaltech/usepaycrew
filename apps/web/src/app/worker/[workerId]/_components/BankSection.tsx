'use client';

import { useState, useEffect } from 'react';

import { BuildingIcon, CheckCircleIcon } from '@/assets';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { http } from '@/services';
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

interface BankSectionProps {
  workerId: string;
  payoutMethods: any[];
  onSuccess: () => void;
}

export function BankSection({ workerId, payoutMethods, onSuccess }: BankSectionProps) {
  const toast = useToast();
  const [banks, setBanks] = useState(defaultBanks);
  const [bankCode, setBankCode] = useState('058');
  const [accountNumber, setAccountNumber] = useState('');
  const [resolvedName, setResolvedName] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Fetch live Korapay bank list on mount
  useEffect(() => {
    http.get('/payout-methods/banks')
      .then((res: any) => {
        if (Array.isArray(res) && res.length > 0) setBanks(res);
      })
      .catch(() => {});
  }, []);

  const defaultMethod = payoutMethods.find((m) => m.isDefault);

  const handleLookup = async (acct: string) => {
    setAccountNumber(acct);
    if (acct.length === 10) {
      try {
        const res = await http.get(`/payout-methods/lookup-bank?accountNumber=${acct}&bankCode=${bankCode}`);
        setResolvedName(res.accountName);
      } catch {
        setResolvedName(null);
      }
    } else {
      setResolvedName(null);
    }
  };


  const handleSave = async () => {
    if (!resolvedName) return;
    setLoading(true);
    try {
      const selectedBank = banks.find((b) => b.code === bankCode);
      await http.post(`/payout-methods/${workerId}/bank`, {
        accountNumber,
        bankCode,
        bankName: selectedBank?.name || 'Commercial Bank',
      });
      toast.success('Bank account linked successfully');
      setAccountNumber('');
      setResolvedName(null);
      onSuccess();
    } catch (err) {
      toast.error(normalizeError(err).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card variant="elevated" className="flex flex-col gap-3">
      <div className="flex items-center gap-2 text-primary">
        <BuildingIcon className="h-5 w-5" />
        <h3 className="text-label-lg font-bold text-foreground">Nigerian Bank Account (NUBAN)</h3>
      </div>

      {defaultMethod && (
        <div className="rounded-lg border border-border bg-secondary/50 p-3">
          <div className="flex items-center gap-1.5 text-success">
            <CheckCircleIcon className="h-4 w-4" />
            <span className="text-label-sm font-semibold">Active Payout Account</span>
          </div>
          <p className="mt-1 text-label-md font-bold text-foreground">{defaultMethod.accountName}</p>
          <p className="text-body-xs text-muted-foreground">
            {defaultMethod.bankName} • {defaultMethod.accountReference}
          </p>
        </div>
      )}

      <div className="flex flex-col gap-2.5 mt-1">
        <label className="text-label-sm text-foreground">Change or Add Account</label>
        <select
          value={bankCode}
          onChange={(e) => {
            setBankCode(e.target.value);
            setResolvedName(null);
          }}
          className="min-h-[44px] rounded-lg border border-input bg-background px-3 py-2 text-body-sm text-foreground"
        >
          {banks.map((b) => (
            <option key={b.code} value={b.code}>
              {b.name}
            </option>
          ))}
        </select>

        <Input
          placeholder="10-digit NUBAN account number"
          maxLength={10}
          value={accountNumber}
          onChange={(e) => handleLookup(e.target.value.replace(/\D/g, ''))}
        />

        {resolvedName && (
          <div className="rounded-lg bg-primary/10 border border-primary/20 p-2.5">
            <p className="text-caption text-primary">Verified Account Name</p>
            <p className="text-label-md font-bold text-foreground">{resolvedName}</p>
          </div>
        )}

        <Button onClick={handleSave} disabled={!resolvedName} isLoading={loading}>
          Save Bank Account
        </Button>
      </div>
    </Card>
  );
}
