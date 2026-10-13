import Link from 'next/link';
import {
  AppStrings,
  ShieldCheckIcon,
  ArrowUpRightIcon,
  BanknoteIcon,
  BuildingIcon,
} from '@/assets';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Navbar */}
      <header className="flex h-20 items-center justify-between border-b border-border px-6 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground font-black shadow-brand">
            P
          </div>
          <span className="text-display-sm font-extrabold text-foreground">{AppStrings.appName}</span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login">
            <Button variant="outline" size="sm">
              Sign In
            </Button>
          </Link>
          <Link href="/register">
            <Button size="sm">Get Started</Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-16 sm:py-24 text-center max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 rounded-full border border-brand-teal/40 bg-accent px-3 py-1 text-label-sm text-accent-foreground mb-6">
          <ShieldCheckIcon className="h-4 w-4" />
          <span>Licensed Settlement Partners • Nigerian Compliance Ready</span>
        </div>

        <h1 className="text-display-lg sm:text-display-xl font-extrabold tracking-tight text-foreground max-w-3xl">
          Stablecoin payroll and contractor payouts for African teams
        </h1>

        <p className="mt-4 text-body-lg text-muted-foreground max-w-2xl">
          Pay your remote staff in USDC or USDT in under 10 minutes. Let contractors cash out directly into Nigerian commercial banks in naira with transparent, statutory fees.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <Link href="/register" className="w-full sm:w-auto">
            <Button size="lg" className="w-full sm:w-auto">
              Start Paying Contractors
              <ArrowUpRightIcon className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <Link href="/login" className="w-full sm:w-auto">
            <Button variant="secondary" size="lg" className="w-full sm:w-auto">
              Employer Login
            </Button>
          </Link>
        </div>

        {/* Feature Cards */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 text-left w-full">
          <Card variant="elevated" className="flex flex-col gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <BuildingIcon className="h-5 w-5" />
            </div>
            <h3 className="text-label-lg font-bold text-foreground">1. Onboard in Minutes</h3>
            <p className="text-body-xs text-muted-foreground">
              Add contractors, auto-generate standard Nigeria contractor agreements, and verify BVN/NIN with zero paperwork.
            </p>
          </Card>

          <Card variant="elevated" className="flex flex-col gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-sky/10 text-brand-sky">
              <BanknoteIcon className="h-5 w-5" />
            </div>
            <h3 className="text-label-lg font-bold text-foreground">2. Transparent 1% Fee</h3>
            <p className="text-body-xs text-muted-foreground">
              Fund via virtual accounts or crypto transfer. Pay contractors with flat 1% processing fee and no hidden spreads.
            </p>
          </Card>

          <Card variant="elevated" className="flex flex-col gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10 text-success">
              <ShieldCheckIcon className="h-5 w-5" />
            </div>
            <h3 className="text-label-lg font-bold text-foreground">3. Instant Naira Cash Out</h3>
            <p className="text-body-xs text-muted-foreground">
              Workers withdraw to any Nigerian bank in under 5 minutes with statutory stamp duty and receipts automatically calculated.
            </p>
          </Card>
        </div>
      </main>

      <footer className="border-t border-border py-6 text-center text-caption text-muted-foreground">
        © 2026 PayCrew Technologies. Double-entry ledger verified. All rights reserved.
      </footer>
    </div>
  );
}
