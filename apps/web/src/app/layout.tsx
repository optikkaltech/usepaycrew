import type { Metadata } from 'next';
import './globals.css';
import { QueryProvider } from '@/components/providers/QueryProvider';

export const metadata: Metadata = {
  title: 'PayCrew — Stablecoin Payroll & Contractor Payments for African Teams',
  description:
    'Pay remote staff in USDC/USDT and let contractors cash out to Nigerian bank accounts in naira with transparent fees and instant compliance.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background text-foreground antialiased selection:bg-brand-sky selection:text-white">
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
