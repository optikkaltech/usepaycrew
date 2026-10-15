'use client';

import { useState } from 'react';
import { ArrowLeftIcon, ArrowRightIcon, UserIcon } from '@/assets';

const testimonials = [
  {
    quote:
      'Before PayCrew, paying our 18 remote engineers across Lagos, Nairobi, and Kigali took 3 bank days and cost a fortune in wire fees. Now we fund our treasury in Naira and everyone gets paid in USDC within 20 seconds.',
    name: 'Tunde Balogun',
    role: 'CTO, Apex Logistics',
    initials: 'TB',
  },
  {
    quote:
      'The automated BVN and NIN contractor verification combined with dual Maker-Checker approval gave our board complete confidence. Our contractors love being able to cash out directly to their Nigerian bank accounts in seconds.',
    name: 'Chioma Eze',
    role: 'Head of People, MonoDrive Africa',
    initials: 'CE',
  },
];

export function TestimonialsSection() {
  const [index, setIndex] = useState(0);

  const prev = () => setIndex((i) => (i === 0 ? testimonials.length - 1 : i - 1));
  const next = () => setIndex((i) => (i === testimonials.length - 1 ? 0 : i + 1));

  const t = testimonials[index];

  return (
    <section className="relative px-4 py-20 sm:py-32 overflow-hidden border-t border-black/[0.06] dark:border-white/[0.04] transition-colors duration-200">
      {/* Overhead Ambient Light Plume */}
      <div className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 h-[260px] w-[650px] rounded-full bg-brand-emerald/[0.05] dark:bg-white/[0.04] blur-[110px]" />

      <div className="relative z-10 mx-auto max-w-5xl">
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-black/[0.08] bg-black/[0.03] dark:border-white/[0.1] dark:bg-white/[0.03] px-3.5 py-1 text-caption text-gray-700 dark:text-[#8a8f98] mb-6 backdrop-blur-md shadow-sm">
            <UserIcon className="h-3 w-3 text-brand-emerald" />
            <span>Customer Stories</span>
          </div>

          <h2 className="text-display-md sm:text-display-xl font-heading font-semibold tracking-tight text-glow-silver max-w-2xl mx-auto leading-tight">
            Trusted by fast-growing
            <br />
            African tech companies
          </h2>

          <p className="mt-4 text-body-sm sm:text-body-md text-gray-600 dark:text-[#8a8f98] max-w-xl mx-auto leading-relaxed">
            See how African founders and engineering leaders streamline remote contractor payroll
            and off-ramp compliance.
          </p>
        </div>

        {/* Testimonial Quote & Author */}
        <div className="mt-16 sm:mt-24 flex flex-col md:flex-row items-start md:items-end justify-between gap-8 max-w-4xl mx-auto">
          <div className="space-y-8 flex-1">
            <blockquote className="text-display-xs sm:text-display-sm text-gray-900 dark:text-white/95 font-normal leading-relaxed min-h-[90px]">
              &ldquo;{t.quote}&rdquo;
            </blockquote>

            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-brand-emerald to-cyan-400 p-0.5 shadow-sm">
                <div className="h-full w-full rounded-full bg-white dark:bg-[#14151a] flex items-center justify-center text-label-sm font-bold text-gray-900 dark:text-white">
                  {t.initials}
                </div>
              </div>
              <div>
                <div className="text-label-md font-semibold text-gray-900 dark:text-white">{t.name}</div>
                <div className="text-caption text-gray-500 dark:text-[#8a8f98]">{t.role}</div>
              </div>
            </div>
          </div>

          {/* Navigation Arrows */}
          <div className="flex items-center gap-2 self-end md:self-auto">
            <button
              type="button"
              onClick={prev}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-black/[0.08] bg-white text-gray-700 hover:text-black hover:border-black/[0.15] shadow-xs dark:border-white/[0.08] dark:bg-[#14151a] dark:text-[#8a8f98] dark:hover:text-white dark:hover:border-white/[0.2] transition-colors cursor-pointer"
              aria-label="Previous testimonial"
            >
              <ArrowLeftIcon className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={next}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-black/[0.08] bg-white text-gray-700 hover:text-black hover:border-black/[0.15] shadow-xs dark:border-white/[0.08] dark:bg-[#14151a] dark:text-[#8a8f98] dark:hover:text-white dark:hover:border-white/[0.2] transition-colors cursor-pointer"
              aria-label="Next testimonial"
            >
              <ArrowRightIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
