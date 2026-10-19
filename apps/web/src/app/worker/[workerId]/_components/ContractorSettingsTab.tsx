'use client';

import { useState } from 'react';
import clsx from 'clsx';
import { UserIcon, CreditCardIcon, BellIcon, ShieldIcon, CheckCircleIcon } from '@/assets';
import { SettingsProfilePanel } from './SettingsProfilePanel';

interface ContractorSettingsTabProps {
  workerId: string;
  worker: any;
  autoCashout: boolean;
  defaultBankName?: string;
  defaultBankLast4?: string;
  isTogglingPreference: boolean;
  onToggleAutoCashout: () => void;
  onSuccess: () => void;
}

type SubTab = 'profile' | 'payout' | 'notifications' | 'security';

export function ContractorSettingsTab({
  workerId,
  worker,
  autoCashout,
  defaultBankName,
  defaultBankLast4,
  isTogglingPreference,
  onToggleAutoCashout,
  onSuccess,
}: ContractorSettingsTabProps) {
  const [activeSubTab, setActiveSubTab] = useState<SubTab>('profile');

  const subNavItems = [
    { id: 'profile' as const, label: 'Profile', icon: UserIcon },
    { id: 'payout' as const, label: 'Payout preferences', icon: CreditCardIcon },
    { id: 'notifications' as const, label: 'Notifications', icon: BellIcon },
    { id: 'security' as const, label: 'Security', icon: ShieldIcon },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="text-display-sm font-black text-foreground">Settings</h1>
        <p className="text-body-xs sm:text-body-sm text-muted-foreground mt-0.5">
          Manage your profile, payout preferences, and security.
        </p>
      </div>

      {/* Main 2-column layout */}
      <div className="flex flex-col md:flex-row gap-6 items-start">
        {/* Left Subnav */}
        <div className="w-full md:w-60 bg-card border border-border/80 shadow-xs rounded-2xl p-2 shrink-0 flex flex-col gap-1">
          {subNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSubTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveSubTab(item.id)}
                className={clsx(
                  'flex items-center gap-3 px-3.5 py-3 rounded-xl text-body-xs font-semibold transition-all text-left cursor-pointer min-h-[44px]',
                  isActive
                    ? 'bg-[#008774]/10 text-[#008774] dark:bg-[#008774]/20 dark:text-emerald-400 font-bold'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                )}
              >
                <Icon className={clsx('h-4 w-4 shrink-0', isActive ? 'text-[#008774] dark:text-emerald-400' : 'text-muted-foreground')} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right Content Panel */}
        <div className="flex-1 w-full min-w-0">
          {activeSubTab === 'profile' && (
            <SettingsProfilePanel workerId={workerId} worker={worker} onSuccess={onSuccess} />
          )}

          {activeSubTab === 'payout' && (
            <div className="bg-card border border-border/80 shadow-xs rounded-2xl p-6 sm:p-8 flex flex-col gap-6">
              <div>
                <h2 className="text-display-xs font-bold text-foreground">Payout Preferences</h2>
                <p className="text-body-xs text-muted-foreground mt-0.5">
                  Configure automatic conversions and default bank accounts.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-border bg-secondary/30 flex items-center justify-between">
                <div>
                  <div className="text-body-xs font-bold text-foreground">Auto-Convert & Cashout</div>
                  <div className="text-caption text-muted-foreground">
                    Automatically convert incoming USDT payments to Naira and wire to your default bank.
                  </div>
                </div>
                <button
                  type="button"
                  disabled={isTogglingPreference}
                  onClick={onToggleAutoCashout}
                  className={clsx(
                    'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none',
                    autoCashout ? 'bg-[#008774]' : 'bg-muted'
                  )}
                >
                  <span
                    className={clsx(
                      'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                      autoCashout ? 'translate-x-5' : 'translate-x-0'
                    )}
                  />
                </button>
              </div>

              <div className="p-4 rounded-xl border border-border bg-secondary/20">
                <div className="text-caption font-semibold text-muted-foreground mb-1">Default Settlement Bank</div>
                <div className="text-body-sm font-bold text-foreground">
                  {defaultBankName ? `${defaultBankName} ••••${defaultBankLast4}` : 'No default bank selected yet'}
                </div>
              </div>
            </div>
          )}

          {activeSubTab === 'notifications' && (
            <div className="bg-card border border-border/80 shadow-xs rounded-2xl p-6 sm:p-8 flex flex-col gap-5">
              <div>
                <h2 className="text-display-xs font-bold text-foreground">Notification Settings</h2>
                <p className="text-body-xs text-muted-foreground mt-0.5">Choose which notifications you wish to receive.</p>
              </div>
              <div className="space-y-3">
                {['Salary payment received', 'Conversion & withdrawal settled', 'Market rate alert triggers'].map((label, idx) => (
                  <div key={label} className="p-3.5 rounded-xl border border-border flex items-center justify-between">
                    <span className="text-body-xs font-medium text-foreground">{label}</span>
                    <span className="text-[11px] font-bold text-[#008774] flex items-center gap-1">
                      <CheckCircleIcon className="h-3.5 w-3.5" /> Enabled
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSubTab === 'security' && (
            <div className="bg-card border border-border/80 shadow-xs rounded-2xl p-6 sm:p-8 flex flex-col gap-5">
              <div>
                <h2 className="text-display-xs font-bold text-foreground">Security & Access</h2>
                <p className="text-body-xs text-muted-foreground mt-0.5">Manage your worker account security and authentication.</p>
              </div>
              <div className="p-4 rounded-xl border border-border bg-secondary/30 flex items-center justify-between">
                <div>
                  <div className="text-body-xs font-bold text-foreground">2-Factor Authentication</div>
                  <div className="text-caption text-muted-foreground">Protect your withdrawals with SMS / Authenticator verification.</div>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#008774]/10 text-[#008774]">Active</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
