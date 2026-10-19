'use client';

import { useState } from 'react';
import {
  AppStrings,
  XIcon,
  SlidersIcon,
} from '@/assets';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useToast } from '@/hooks';

interface AutoFundingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AutoFundingModal({ isOpen, onClose }: AutoFundingModalProps) {
  const [threshold, setThreshold] = useState('2500');
  const [notifyEmail, setNotifyEmail] = useState(true);
  const toast = useToast();

  if (!isOpen) return null;

  const handleSave = () => {
    toast.success('Auto-funding rules saved successfully');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-md rounded-2xl bg-card border border-border p-6 shadow-xl animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <div className="flex items-center gap-2">
            <SlidersIcon className="h-5 w-5 text-brand-emerald" />
            <h2 className="text-display-xs text-foreground font-bold">
              {AppStrings.wallet.autoFundingRules}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-foreground hover:bg-secondary"
          >
            <XIcon className="h-4 w-4" />
          </button>
        </div>

        <div className="my-5 flex flex-col gap-4">
          <p className="text-body-xs text-muted-foreground">
            Configure automated liquidity monitors to ensure your treasury never runs short on payroll disbursement days.
          </p>

          <Input
            label="Low balance threshold (USDT)"
            value={threshold}
            onChange={(e) => setThreshold(e.target.value)}
            placeholder="2500.00"
          />

          <label className="flex items-center gap-3 text-body-sm text-foreground pt-1 cursor-pointer">
            <input
              type="checkbox"
              checked={notifyEmail}
              onChange={(e) => setNotifyEmail(e.target.checked)}
              className="h-4 w-4 rounded text-brand-emerald"
            />
            Send emergency email when balance is under 7-day runway
          </label>
        </div>

        <div className="flex justify-end gap-3 pt-3 border-t border-border">
          <Button variant="outline" onClick={onClose}>
            {AppStrings.common.cancel}
          </Button>
          <Button onClick={handleSave}>
            Save rules
          </Button>
        </div>
      </div>
    </div>
  );
}
