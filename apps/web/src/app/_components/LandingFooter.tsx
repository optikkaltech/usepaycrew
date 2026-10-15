import Link from 'next/link';
import { InstagramIcon, LinkedinIcon, TwitterIcon } from '@/assets';

export function LandingFooter() {
  const columns = [
    {
      title: 'Product',
      links: [
        { label: 'Payroll Operations', href: '/#products' },
        { label: 'Pricing Plans', href: '/pricing' },
        { label: 'Treasury Funding', href: '/#products' },
        { label: 'Local Cashout', href: '/#use-cases' },
        { label: 'Maker-Checker Security', href: '/#products' },
      ],
    },
    {
      title: 'Company',
      links: [
        { label: 'About PayCrew', href: '/#about' },
        { label: 'How It Works', href: '/#use-cases' },
        { label: 'Customer Stories', href: '/#use-cases' },
        { label: 'Compliance & KYB', href: '/#about' },
        { label: 'Careers', href: '#' },
      ],
    },
    {
      title: 'Rails & Partners',
      links: [
        { label: 'Korapay Virtual NUBANs', href: '#' },
        { label: 'Quidax Liquidity Off-Ramp', href: '#' },
        { label: 'Base USDC Rails', href: '#' },
        { label: 'TRON USDT Network', href: '#' },
        { label: 'CBN Compliance Guidelines', href: '#' },
      ],
    },
    {
      title: 'Account',
      links: [
        { label: 'Create Account', href: '/register' },
        { label: 'Sign In', href: '/login' },
        { label: 'Demo Dashboard', href: '/dashboard' },
        { label: 'Contractor Portal', href: '/login' },
      ],
    },
  ];

  return (
    <footer className="relative border-t border-black/[0.06] bg-[#fafbfc] dark:border-white/[0.04] dark:bg-[#07080a] pt-16 pb-12 overflow-hidden transition-colors duration-200">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Top: Logo, Address, and Socials */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-12 border-b border-black/[0.06] dark:border-white/[0.04]">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-md bg-brand-emerald text-black font-bold text-xs">
                P
              </div>
              <span className="text-label-lg font-bold text-gray-900 dark:text-white tracking-tight">PayCrew</span>
            </div>
            <p className="mt-2 text-caption text-gray-500 dark:text-[#6b7280]">
              The stablecoin payroll and contractor operations platform for modern African companies.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="#"
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-black/[0.08] bg-white text-gray-700 hover:text-black shadow-xs dark:border-white/[0.08] dark:bg-[#121317] dark:text-[#8a8f98] dark:hover:text-white hover:border-black/[0.15] dark:hover:border-white/[0.2] transition-colors"
              aria-label="Instagram"
            >
              <InstagramIcon className="h-4 w-4" />
            </Link>
            <Link
              href="#"
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-black/[0.08] bg-white text-gray-700 hover:text-black shadow-xs dark:border-white/[0.08] dark:bg-[#121317] dark:text-[#8a8f98] dark:hover:text-white hover:border-black/[0.15] dark:hover:border-white/[0.2] transition-colors"
              aria-label="Twitter / X"
            >
              <TwitterIcon className="h-4 w-4" />
            </Link>
            <Link
              href="#"
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-black/[0.08] bg-white text-gray-700 hover:text-black shadow-xs dark:border-white/[0.08] dark:bg-[#121317] dark:text-[#8a8f98] dark:hover:text-white hover:border-black/[0.15] dark:hover:border-white/[0.2] transition-colors"
              aria-label="LinkedIn"
            >
              <LinkedinIcon className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* Multi-column Links */}
        <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-8">
          {columns.map((col) => (
            <div key={col.title} className="space-y-3">
              <h3 className="text-label-sm font-semibold text-gray-900 dark:text-white">{col.title}</h3>
              <ul className="space-y-2">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      prefetch={true}
                      className="text-body-xs text-gray-600 hover:text-black dark:text-[#8a8f98] dark:hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Large subtle watermark wordmark */}
        <div className="relative mt-16 pt-8 border-t border-black/[0.06] dark:border-white/[0.04] text-center select-none overflow-hidden">
          <div className="text-[13vw] font-bold tracking-tighter text-black/[0.03] dark:text-white/[0.04] leading-none pointer-events-none flex items-center justify-center gap-3">
            <span className="text-[9vw] leading-none text-black/[0.03] dark:text-white/[0.04]">✦</span>
            <span>PayCrew</span>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-caption text-gray-500 dark:text-[#6b7280]">
          <div className="flex items-center gap-3">
            <Link href="#" className="hover:text-black dark:hover:text-white transition-colors">Privacy policy</Link>
            <span>•</span>
            <Link href="#" className="hover:text-black dark:hover:text-white transition-colors">Terms of Service</Link>
          </div>
          <div>© 2026 PayCrew Inc. All rights reserved.</div>
        </div>
      </div>
    </footer>
  );
}
