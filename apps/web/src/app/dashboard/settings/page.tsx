'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  BuildingIcon,
  UsersIcon,
  BellIcon,
  ShieldCheckIcon,
  CreditCardIcon,
} from '@/assets';
import { http } from '@/services';
import { CompanyProfileSection } from './_components/CompanyProfileSection';
import { SubscriptionBillingSection } from './_components/SubscriptionBillingSection';
import { Card } from '@/components/ui/Card';

const SETTINGS_SECTIONS = [
  { id: 'PROFILE', label: 'Company profile', icon: BuildingIcon },
  { id: 'ROLES', label: 'Team roles', icon: UsersIcon },
  { id: 'BILLING', label: 'Billing & Plan', icon: CreditCardIcon },
  { id: 'NOTIFICATIONS', label: 'Notifications', icon: BellIcon },
  { id: 'SECURITY', label: 'Security', icon: ShieldCheckIcon },
];

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState('PROFILE');

  const { data: summary } = useQuery({
    queryKey: ['subscriptionSummary'],
    queryFn: () => http.get('/subscriptions/summary'),
  });

  const { data: company } = useQuery({
    queryKey: ['companyInfo'],
    queryFn: () => http.get('/companies/me'),
  });

  return (
    <div className="flex flex-col gap-6 sm:gap-8 max-w-6xl">
      <div>
        <h1 className="text-display-md text-foreground font-extrabold">Settings</h1>
        <p className="mt-1 text-body-sm text-muted-foreground">
          Manage your company profile, roles, and security.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
        {/* Left Navigation Tabs (Image 2 design) */}
        <Card variant="elevated" className="md:col-span-1 p-2 flex flex-col gap-1 border-border">
          {SETTINGS_SECTIONS.map((sec) => {
            const Icon = sec.icon;
            const isActive = activeSection === sec.id;
            return (
              <button
                key={sec.id}
                type="button"
                onClick={() => setActiveSection(sec.id)}
                className={`flex items-center gap-3 w-full px-3.5 py-3 rounded-xl text-label-md font-medium transition-all text-left min-h-[44px] cursor-pointer ${
                  isActive
                    ? 'bg-brand-emerald/15 text-brand-emerald font-semibold shadow-xs'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary/60'
                }`}
              >
                <Icon className={`h-4 w-4 shrink-0 ${isActive ? 'text-brand-emerald' : 'text-muted-foreground'}`} />
                <span>{sec.label}</span>
              </button>
            );
          })}
        </Card>

        {/* Right Content Panel */}
        <div className="md:col-span-3">
          {activeSection === 'PROFILE' && (
            <CompanyProfileSection company={company} />
          )}

          {activeSection === 'BILLING' && (
            <SubscriptionBillingSection summary={summary} />
          )}

          {activeSection === 'ROLES' && (
            <Card variant="elevated" className="p-6 border-border">
              <h2 className="text-display-xs text-foreground font-bold">Team roles</h2>
              <p className="mt-1 text-body-xs text-muted-foreground">
                Manage owner, admin, and payroll approver permissions.
              </p>
              <div className="mt-6 p-4 rounded-xl border border-border bg-secondary/30">
                <p className="text-body-sm text-foreground font-medium">Owner</p>
                <p className="text-caption text-muted-foreground mt-0.5">
                  Full control over company treasury, contracts, and payroll disbursement.
                </p>
              </div>
            </Card>
          )}

          {activeSection === 'NOTIFICATIONS' && (
            <Card variant="elevated" className="p-6 border-border">
              <h2 className="text-display-xs text-foreground font-bold">Notifications</h2>
              <p className="mt-1 text-body-xs text-muted-foreground">
                Configure payout receipts, invite reminders, and security alerts.
              </p>
              <div className="mt-6 flex flex-col gap-3">
                <label className="flex items-center gap-3 text-body-sm text-foreground">
                  <input type="checkbox" defaultChecked className="h-4 w-4 rounded text-primary" />
                  Email notifications on successful payroll runs
                </label>
                <label className="flex items-center gap-3 text-body-sm text-foreground">
                  <input type="checkbox" defaultChecked className="h-4 w-4 rounded text-primary" />
                  Alert on contractor agreement signatures
                </label>
              </div>
            </Card>
          )}

          {activeSection === 'SECURITY' && (
            <Card variant="elevated" className="p-6 border-border">
              <h2 className="text-display-xs text-foreground font-bold">Security</h2>
              <p className="mt-1 text-body-xs text-muted-foreground">
                Two-factor authentication and session management.
              </p>
              <div className="mt-6 p-4 rounded-xl border border-border bg-secondary/30 flex items-center justify-between">
                <div>
                  <p className="text-body-sm text-foreground font-medium">Two-Factor Authentication (OTP)</p>
                  <p className="text-caption text-muted-foreground mt-0.5">
                    Secures high-value payout transactions with authenticator codes.
                  </p>
                </div>
                <span className="text-caption text-success font-semibold px-2 py-1 rounded-md bg-success/10">Active</span>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
