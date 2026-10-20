'use client';

import { useState } from 'react';
import { useToast } from '@/hooks';

export function RateAlertCard() {
  const toast = useToast();
  const [targetRate, setTargetRate] = useState('');
  const [activeAlert, setActiveAlert] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('paycrew_target_rate_alert');
    }
    return null;
  });

  const handleSetAlert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetRate) {
      toast.error('Please enter a target rate');
      return;
    }
    localStorage.setItem('paycrew_target_rate_alert', targetRate);
    setActiveAlert(targetRate);
    toast.success(`Alert set! You'll be notified when rate reaches ₦${targetRate}`);
    setTargetRate('');
  };

  const handleClearAlert = () => {
    localStorage.removeItem('paycrew_target_rate_alert');
    setActiveAlert(null);
    toast.info('Rate alert removed');
  };

  return (
    <div className="bg-card border border-border/80 shadow-xs rounded-2xl p-6 flex flex-col gap-3">
      <div>
        <h3 className="text-body-md font-bold text-foreground">Rate alert</h3>
        <p className="text-body-xs text-muted-foreground mt-0.5">
          Get notified when USDT/NGN hits your target.
        </p>
      </div>

      <form onSubmit={handleSetAlert} className="flex items-center gap-2.5 mt-2">
        <div className="relative flex-1">
          <input
            type="number"
            placeholder="₦ e.g. 1600"
            value={targetRate}
            onChange={(e) => setTargetRate(e.target.value)}
            className="w-full h-11 rounded-xl border border-input bg-background px-3 text-body-xs font-semibold text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <button
          type="submit"
          className="h-11 px-4 rounded-xl border border-primary/30 text-primary hover:bg-primary/5 font-bold text-body-xs transition-colors shrink-0 cursor-pointer"
        >
          Set alert
        </button>
      </form>

      {activeAlert && (
        <div className="flex items-center justify-between text-[11px] bg-secondary/50 rounded-lg px-2.5 py-1.5 text-muted-foreground">
          <span>Active alert: <strong>₦{activeAlert}</strong></span>
          <button type="button" onClick={handleClearAlert} className="text-destructive hover:underline cursor-pointer">
            Clear
          </button>
        </div>
      )}
    </div>
  );
}
