import {
  BanknoteIcon,
  BuildingIcon,
  CommandIcon,
  DownloadIcon,
  FileCheckIcon,
  SearchIcon,
  ShieldCheckIcon,
  UserPlusIcon,
} from '@/assets';

export function CommandCenterSection() {
  return (
    <section className="relative px-4 py-20 sm:py-32 overflow-hidden">
      <div className="mx-auto max-w-5xl">
        {/* Pill badge */}
        <div className="inline-flex items-center gap-1.5 rounded-full border border-black/[0.08] bg-black/[0.03] dark:border-white/[0.08] dark:bg-white/[0.03] px-3 py-1 text-caption text-gray-700 dark:text-[#8a8f98] mb-6">
          <CommandIcon className="h-3 w-3 text-brand-emerald" />
          <span>⌘ K</span>
        </div>

        {/* Heading in modern sans italic matching reference */}
        <h2 className="text-display-md sm:text-display-lg text-gray-900 dark:text-white font-heading italic font-normal tracking-tight">
          One command center for your entire contractor workforce
        </h2>

        {/* Subtitle */}
        <p className="mt-4 text-body-sm sm:text-body-md text-gray-600 dark:text-[#8a8f98] max-w-xl leading-relaxed">
          Disburse batch payroll, verify contractor BVN/NIN, fund corporate treasury,
          and approve high-value dispatches without leaving your keyboard.
        </p>

        {/* Keyboard + Command Palette Showcase */}
        <div className="relative mt-12 sm:mt-16 rounded-2xl border border-black/[0.08] bg-white shadow-xl dark:border-white/[0.06] dark:bg-[#0c0d11] p-6 sm:p-12 overflow-hidden dark:shadow-2xl">
          {/* Ambient backlight glow behind keyboard */}
          <div className="pointer-events-none absolute right-1/4 top-1/2 -translate-y-1/2 h-[220px] w-[450px] rounded-full bg-brand-emerald/[0.12] blur-[90px]" />

          {/* Realistic chiclet keyboard illustration matching reference */}
          <div className="pointer-events-none absolute inset-0 opacity-70 flex flex-col items-center justify-center gap-2 p-4 select-none">
            <div className="flex gap-2 w-full justify-center">
              {['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'].map((k) => (
                <div key={k} className="h-10 w-10 sm:h-12 sm:w-12 rounded-[10px] border border-black/[0.06] bg-[#f1f3f6] shadow-xs dark:border-white/[0.08] dark:bg-[#16171d]/80 dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.06)]" />
              ))}
            </div>
            <div className="flex gap-2 w-full justify-center">
              {['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'].map((k) => (
                <div
                  key={k}
                  className={`h-10 w-10 sm:h-12 sm:w-12 rounded-[10px] border flex items-center justify-center text-xs font-mono transition-all ${
                    k === 'K'
                      ? 'border-brand-emerald bg-brand-emerald/20 text-emerald-800 dark:text-white font-bold shadow-[0_0_30px_rgba(6,214,160,0.6),inset_0_0_15px_rgba(6,214,160,0.4)]'
                      : 'border-black/[0.06] bg-[#f1f3f6] text-gray-400 dark:border-white/[0.08] dark:bg-[#16171d]/80 dark:text-white/30 shadow-xs'
                  }`}
                >
                  {k}
                </div>
              ))}
            </div>
            <div className="flex gap-2 w-full justify-center">
              <div className="h-10 w-24 sm:h-12 sm:w-28 rounded-[10px] border border-brand-emerald/80 bg-brand-emerald/15 text-emerald-800 dark:text-white font-mono flex items-center justify-center text-caption shadow-[0_0_25px_rgba(6,214,160,0.5),inset_0_0_12px_rgba(6,214,160,0.3)]">
                ⌘ command
              </div>
              <div className="h-10 w-48 sm:h-12 sm:w-64 rounded-[10px] border border-black/[0.06] bg-[#f1f3f6] shadow-xs dark:border-white/[0.08] dark:bg-[#16171d]/80" />
            </div>
          </div>

          {/* Floating Command Palette Modal */}
          <div className="relative z-10 mx-auto max-w-lg rounded-xl border border-black/[0.08] bg-white/95 text-gray-900 shadow-2xl backdrop-blur-xl dark:border-white/[0.1] dark:bg-[#14151a]/95 dark:text-white overflow-hidden">
            {/* Search Input */}
            <div className="flex items-center justify-between border-b border-black/[0.06] dark:border-white/[0.08] px-4 py-3">
              <div className="flex items-center gap-2 text-label-sm text-gray-500 dark:text-[#9ca3af]">
                <SearchIcon className="h-4 w-4 text-gray-400 dark:text-[#6b7280]" />
                <span className="text-gray-400 dark:text-white/40">Search contractors or actions...</span>
              </div>
              <kbd className="rounded border border-black/[0.08] bg-black/[0.04] dark:border-white/[0.1] dark:bg-white/[0.05] px-1.5 py-0.5 text-[10px] text-gray-600 dark:text-[#9ca3af]">
                ⌘ K
              </kbd>
            </div>

            {/* List */}
            <div className="p-2 space-y-3">
              <div>
                <span className="px-2 text-[10px] font-semibold uppercase tracking-wider text-gray-400 dark:text-[#6b7280]">
                  Frequent Operations
                </span>
                <div className="mt-1 space-y-0.5">
                  <div className="flex items-center justify-between rounded-lg bg-black/[0.04] dark:bg-white/[0.06] px-3 py-2 text-label-sm text-gray-900 dark:text-white cursor-pointer hover:bg-black/[0.08] dark:hover:bg-white/[0.1]">
                    <div className="flex items-center gap-2.5">
                      <BanknoteIcon className="h-4 w-4 text-brand-emerald" />
                      <span>Disburse Batch Payroll</span>
                    </div>
                    <kbd className="text-[10px] text-gray-500 dark:text-[#9ca3af]">⌘ P</kbd>
                  </div>
                  <div className="flex items-center justify-between rounded-lg px-3 py-2 text-label-sm text-gray-600 dark:text-[#8a8f98] cursor-pointer hover:bg-black/[0.03] hover:text-black dark:hover:bg-white/[0.04] dark:hover:text-white">
                    <div className="flex items-center gap-2.5">
                      <BuildingIcon className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
                      <span>Fund Treasury (Instant / Crypto)</span>
                    </div>
                    <kbd className="text-[10px] text-gray-400 dark:text-[#6b7280]">⌘ F</kbd>
                  </div>
                  <div className="flex items-center justify-between rounded-lg px-3 py-2 text-label-sm text-gray-600 dark:text-[#8a8f98] cursor-pointer hover:bg-black/[0.03] hover:text-black dark:hover:bg-white/[0.04] dark:hover:text-white">
                    <div className="flex items-center gap-2.5">
                      <UserPlusIcon className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                      <span>Invite New Contractor</span>
                    </div>
                    <kbd className="text-[10px] text-gray-400 dark:text-[#6b7280]">⌘ N</kbd>
                  </div>
                </div>
              </div>

              <div>
                <span className="px-2 text-[10px] font-semibold uppercase tracking-wider text-gray-400 dark:text-[#6b7280]">
                  Compliance &amp; Approvals
                </span>
                <div className="mt-1 space-y-0.5">
                  <div className="flex items-center justify-between rounded-lg px-3 py-2 text-label-sm text-gray-600 dark:text-[#8a8f98] hover:bg-black/[0.03] hover:text-black dark:hover:bg-white/[0.04] dark:hover:text-white cursor-pointer">
                    <div className="flex items-center gap-2.5">
                      <ShieldCheckIcon className="h-3.5 w-3.5 text-brand-emerald" />
                      <span>Maker-Checker Dual Sign-off</span>
                    </div>
                    <kbd className="text-[10px] text-gray-400 dark:text-[#6b7280]">⌘ A</kbd>
                  </div>
                  <div className="flex items-center justify-between rounded-lg px-3 py-2 text-label-sm text-gray-600 dark:text-[#8a8f98] hover:bg-black/[0.03] hover:text-black dark:hover:bg-white/[0.04] dark:hover:text-white cursor-pointer">
                    <div className="flex items-center gap-2.5">
                      <DownloadIcon className="h-3.5 w-3.5 text-gray-400 dark:text-[#6b7280]" />
                      <span>Export Monthly Tax &amp; Payroll CSV</span>
                    </div>
                    <kbd className="text-[10px] text-gray-400 dark:text-[#6b7280]">⌘ E</kbd>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom helper */}
            <div className="flex items-center justify-between border-t border-black/[0.06] dark:border-white/[0.06] bg-gray-50 dark:bg-[#0f1014] px-4 py-2 text-[10px] text-gray-500 dark:text-[#6b7280]">
              <div className="flex items-center gap-1.5">
                <span className="rounded border border-black/[0.08] dark:border-white/[0.08] px-1">↑</span>
                <span className="rounded border border-black/[0.08] dark:border-white/[0.08] px-1">↓</span>
                <span>to navigate</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="rounded border border-black/[0.08] dark:border-white/[0.08] px-1">↵</span>
                <span>to select</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
