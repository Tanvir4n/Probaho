import React, { useState } from 'react';
import { MASSLABS_PRICING, PricingPlan } from '../data/tokens';
import { Check, ArrowRight, ShieldCheck } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { motion } from 'motion/react';

interface MassPricingSectionProps {
  onSelectPlan: (plan: PricingPlan) => void;
}

export const MassPricingSection: React.FC<MassPricingSectionProps> = ({ onSelectPlan }) => {
  const { isDay } = useTheme();
  const { isBangla, t } = useLanguage();
  const [isAnnual, setIsAnnual] = useState(true);

  return (
    <motion.section
      id="pricing"
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="py-24 border-t border-[var(--color-border-subtle)] bg-[var(--color-surface-base)] text-[var(--color-text-primary)] transition-colors duration-200"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="text-[11px] font-mono uppercase tracking-widest text-[var(--color-surface-raised)]">
            {t.pricing.tag}
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[var(--color-text-primary)]">
            {t.pricing.heading}
          </h2>
          <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
            {t.pricing.subheading}
          </p>

          {/* Billing Cycle Switcher */}
          <div className="pt-4 flex items-center justify-center gap-3">
            <span className={`text-xs font-mono ${!isAnnual ? 'text-[var(--color-text-primary)] font-bold' : 'text-[var(--color-text-secondary)]'}`}>
              {t.pricing.monthly}
            </span>
            <button
              type="button"
              onClick={() => setIsAnnual(!isAnnual)}
              className="w-12 h-6 glass-pill border border-[var(--color-border-subtle)] rounded-full p-0.5 transition-colors relative cursor-pointer"
              aria-label="Toggle annual billing"
            >
              <div
                className={`w-5 h-5 bg-[var(--color-surface-raised)] rounded-full transition-transform shadow-md ${
                  isAnnual ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
            <div className="flex items-center gap-1.5 text-xs font-mono">
              <span className={isAnnual ? 'text-[var(--color-text-primary)] font-bold' : 'text-[var(--color-text-secondary)]'}>
                {t.pricing.annual}
              </span>
              <span className="px-2 py-0.5 text-[10px] glass-pill text-[var(--color-surface-raised)] border border-[var(--color-surface-raised)]/40 rounded-[3px] font-bold shadow-sm">
                {isBangla ? '২০% সাশ্রয়ী' : 'SAVE 20%'}
              </span>
            </div>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {MASSLABS_PRICING.map((plan) => {
            const price = isAnnual ? plan.annualPrice : plan.monthlyPrice;
            const isPro = plan.popular;

            return (
              <div
                key={plan.id}
                className={`rounded-2xl p-8 flex flex-col justify-between transition-all duration-300 relative specular-card ${
                  isPro
                    ? 'border-2 border-emerald-500 shadow-[0_24px_60px_-10px_rgba(0,0,0,0.6),0_0_40px_rgba(16,185,129,0.25)] md:-translate-y-3 relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-b before:from-emerald-500/[0.08] before:to-transparent before:pointer-events-none'
                    : 'border border-white/10 dark:border-white/10 hover:border-emerald-500/40 hover:shadow-[0_20px_45px_rgba(0,0,0,0.4)]'
                }`}
              >
                {plan.badge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-[10px] font-bold font-mono px-3.5 py-1 rounded-full uppercase tracking-wider shadow-[0_4px_16px_rgba(16,185,129,0.5)] z-10">
                    {plan.badge}
                  </div>
                )}

                <div className="space-y-6">
                  <div>
                    <h3 className="text-2xl font-bold tracking-tight text-[var(--color-text-primary)]">{plan.name}</h3>
                    <p className="text-xs sm:text-sm text-[var(--color-text-secondary)] mt-1.5 leading-relaxed">
                      {plan.description}
                    </p>
                  </div>

                  {/* Price */}
                  <div className="border-b border-white/10 dark:border-white/10 pb-6 font-mono">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-4xl sm:text-5xl font-extrabold tracking-tight text-[var(--color-text-primary)] mass-num">
                        ${price}
                      </span>
                      <span className="text-xs text-[var(--color-text-secondary)] font-medium">/ month</span>
                    </div>
                    {isAnnual && price > 0 && (
                      <div className="text-[11px] text-emerald-400 font-semibold mt-1.5">
                        Billed annually (${price * 12}/year) · 20% discount applied
                      </div>
                    )}
                  </div>

                  {/* Features */}
                  <div className="space-y-3">
                    <div className="text-[11px] font-mono text-[var(--color-text-secondary)] uppercase tracking-wider font-semibold">
                      Included Capabilities:
                    </div>
                    <ul className="space-y-2.5 text-xs sm:text-sm text-[var(--color-text-primary)]">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-3 leading-snug">
                          <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5 shadow-sm" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* CTA */}
                <div className="pt-8">
                  <button
                    onClick={() => onSelectPlan(plan)}
                    className={`w-full py-3.5 text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-2 font-mono uppercase tracking-wider cursor-pointer ${
                      isPro
                        ? 'bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 text-white hover:brightness-110 shadow-[0_8px_24px_rgba(16,185,129,0.4)] hover:shadow-[0_10px_30px_rgba(16,185,129,0.55)]'
                        : 'bg-white/5 hover:bg-white/10 text-[var(--color-text-primary)] border border-white/10 hover:border-emerald-500/40'
                    }`}
                  >
                    <span>{plan.cta}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Enterprise Studio Callout */}
        <div className="p-8 sm:p-10 rounded-2xl specular-card border border-white/10 dark:border-white/10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-[0_16px_40px_rgba(0,0,0,0.3)]">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 text-xs font-mono text-emerald-400 uppercase tracking-widest font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>Institutional On-Premise</span>
            </div>
            <h4 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--color-text-primary)]">
              {isBangla ? 'ভূমি রেজিস্ট্রি অফিস, আইনি প্রতিষ্ঠান বা আর্থিক সংস্থা?' : 'Land Registry Office, Legal Practice, or Financial Institution?'}
            </h4>
            <p className="text-xs sm:text-sm text-[var(--color-text-secondary)] leading-relaxed">
              {isBangla ? 'আমরা রেজিস্ট্রি অডিটের জন্য প্রাতিষ্ঠানিক স্থাপন, অন-প্রিমিস ডকুমেন্ট ভল্ট এবং উচ্চ-ক্ষমতার ব্যাচ এপিআই সরবরাহ করি।' : 'We offer institutional deployment, on-premise document vaults, and high-throughput batch APIs for registry audits.'}
            </p>
          </div>
          <button
            onClick={() => onSelectPlan(MASSLABS_PRICING[2])}
            className="px-6 py-3.5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider bg-white text-black hover:bg-zinc-200 transition-all shrink-0 cursor-pointer shadow-lg flex items-center gap-2"
          >
            <span>{isBangla ? 'ইনস্টিটিউশনাল এপিআই' : 'Contact Enterprise'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </motion.section>
  );
};
