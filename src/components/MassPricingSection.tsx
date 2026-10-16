import React, { useState } from 'react';
import { MASSLABS_PRICING, PricingPlan } from '../data/tokens';
import { Check, ArrowRight, ShieldCheck, HelpCircle } from 'lucide-react';
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

  const faqs = [
    {
      q: t.pricingFaqs.q1,
      a: t.pricingFaqs.a1,
    },
    {
      q: t.pricingFaqs.q2,
      a: t.pricingFaqs.a2,
    },
    {
      q: t.pricingFaqs.q3,
      a: t.pricingFaqs.a3,
    },
    {
      q: t.pricingFaqs.q4,
      a: t.pricingFaqs.a4,
    },
  ];

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
                className={`rounded-[8px] p-8 flex flex-col justify-between transition-all duration-300 relative glass-card ${
                  isPro
                    ? 'border-2 border-[var(--color-surface-raised)] shadow-[0_24px_60px_-10px_rgba(0,0,0,0.5),0_0_35px_rgba(34,197,94,0.22)] md:-translate-y-2'
                    : 'hover:border-[var(--color-surface-raised)]'
                }`}
              >
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[var(--color-surface-raised)] text-white text-[10px] font-bold font-mono px-3 py-0.5 rounded-[3px] uppercase tracking-wider shadow-[0_4px_12px_rgba(34,197,94,0.4)]">
                    {plan.badge}
                  </div>
                )}

                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-bold text-[var(--color-text-primary)]">{plan.name}</h3>
                    <p className="text-xs text-[var(--color-text-secondary)] mt-1 leading-relaxed">
                      {plan.description}
                    </p>
                  </div>

                  {/* Price */}
                  <div className="border-b border-[var(--color-border-subtle)] pb-6 font-mono">
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-extrabold text-[var(--color-text-primary)] mass-num">
                        ${price}
                      </span>
                      <span className="text-xs text-[var(--color-text-secondary)]">/ month</span>
                    </div>
                    {isAnnual && price > 0 && (
                      <div className="text-[10px] text-[var(--color-text-secondary)] mt-1">
                        Billed annually (${price * 12}/year)
                      </div>
                    )}
                  </div>

                  {/* Features */}
                  <div className="space-y-3">
                    <div className="text-[11px] font-mono text-[var(--color-text-secondary)] uppercase tracking-wider">
                      Included Capabilities:
                    </div>
                    <ul className="space-y-2.5 text-xs text-[var(--color-text-primary)]">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 leading-snug">
                          <Check className="w-4 h-4 text-[var(--color-surface-raised)] shrink-0 mt-0.5" />
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
                    className={`w-full py-3 text-xs font-semibold rounded-[3px] transition-all flex items-center justify-center gap-2 font-mono uppercase tracking-wider cursor-pointer ${
                      isPro
                        ? 'bg-[var(--color-surface-raised)] text-white hover:brightness-110 shadow-[0_8px_20px_rgba(34,197,94,0.35)]'
                        : 'glass-tile text-[var(--color-text-primary)] border border-[var(--color-border-subtle)] hover:border-[var(--color-surface-raised)]'
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
        <div className="p-8 bg-[var(--color-surface-strong)] border border-[var(--color-border-subtle)] rounded-[2px] flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
          <div className="space-y-1">
            <h4 className="text-base font-semibold text-[var(--color-text-primary)]">
              {isBangla ? 'ভূমি রেজিস্ট্রি অফিস, আইনি প্রতিষ্ঠান বা আর্থিক সংস্থা?' : 'Land Registry Office, Legal Practice, or Financial Institution?'}
            </h4>
            <p className="text-xs text-[var(--color-text-secondary)]">
              {isBangla ? 'আমরা রেজিস্ট্রি অডিটের জন্য প্রাতিষ্ঠানিক স্থাপন, অন-প্রিমিস ডকুমেন্ট ভল্ট এবং উচ্চ-ক্ষমতার ব্যাচ এপিআই সরবরাহ করি।' : 'We offer institutional deployment, on-premise document vaults, and high-throughput batch APIs for registry audits.'}
            </p>
          </div>
          <button
            onClick={() => onSelectPlan(MASSLABS_PRICING[2])}
            className="px-5 py-2.5 text-xs font-mono text-[var(--color-text-primary)] bg-[var(--color-surface-muted)] border border-[var(--color-border-subtle)] hover:border-[var(--color-surface-raised)] rounded-[2px] whitespace-nowrap cursor-pointer transition-colors"
          >
            {isBangla ? 'প্রাতিষ্ঠানিক চুক্তি অনুরোধ' : 'Request Enterprise Terms'}
          </button>
        </div>

        {/* FAQs */}
        <div className="pt-12 border-t border-[var(--color-border-subtle)] space-y-8">
          <div className="text-center space-y-2">
            <div className="text-[11px] font-mono uppercase tracking-widest text-[var(--color-text-secondary)]">
              {t.pricingFaqs.tag}
            </div>
            <h3 className="text-2xl font-bold text-[var(--color-text-primary)]">
              {t.pricingFaqs.heading}
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="p-6 bg-[var(--color-surface-strong)] border border-[var(--color-border-subtle)] rounded-[2px] space-y-2 shadow-sm"
              >
                <div className="text-sm font-semibold text-[var(--color-text-primary)] flex items-start gap-2">
                  <HelpCircle className="w-4 h-4 text-[var(--color-surface-raised)] shrink-0 mt-0.5" />
                  <span>{faq.q}</span>
                </div>
                <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed pl-6">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.section>
  );
};
