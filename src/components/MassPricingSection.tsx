import React, { useState } from 'react';
import { MASSLABS_PRICING, PricingPlan } from '../data/tokens';
import { Check, ArrowRight, ShieldCheck, HelpCircle } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface MassPricingSectionProps {
  onSelectPlan: (plan: PricingPlan) => void;
}

export const MassPricingSection: React.FC<MassPricingSectionProps> = ({ onSelectPlan }) => {
  const { isDay } = useTheme();
  const [isAnnual, setIsAnnual] = useState(true);

  const faqs = [
    {
      q: 'Which CAD / 3D software applications are supported?',
      a: 'MassLabs exports standard DXF, SVG, GeoJSON, and Shapefile geometry natively compatible with Rhino 7/8, Grasshopper, AutoCAD, Revit, SketchUp, ArchiCAD, and Blender.',
    },
    {
      q: 'How does LaserFish model-making work?',
      a: 'LaserFish automatically slices 3D terrain into stepped contour layers at chosen material thicknesses (e.g. 1mm, 2mm, 3mm), adds automatic laser kerf tolerance offsets (0.05mm), and nests parts onto standard laser cutting sheet sizes.',
    },
    {
      q: 'Are site analysis datasets permitted for commercial architectural client presentations?',
      a: 'Yes. All datasets and vector exports generated with Pro Architect and Studio plans include full worldwide commercial licensing rights for client proposals, planning applications, and monographs.',
    },
    {
      q: 'Can I cancel or switch subscriptions at any time?',
      a: 'Yes, you can upgrade, downgrade, or cancel your subscription at any time directly inside your account settings with zero lock-in.',
    },
  ];

  return (
    <section id="pricing" className="py-24 border-t border-[var(--color-border-subtle)] bg-[var(--color-surface-base)] text-[var(--color-text-primary)] transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="text-[11px] font-mono uppercase tracking-widest text-[var(--color-surface-raised)]">
            Transparent Pricing For Architects
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[var(--color-text-primary)]">
            One subscription. All architectural tools.
          </h2>
          <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
            Access archiMap, LaserFish, Cologram, and Globee under a unified studio membership. No hidden data fees.
          </p>

          {/* Billing Cycle Switcher */}
          <div className="pt-4 flex items-center justify-center gap-3">
            <span className={`text-xs font-mono ${!isAnnual ? 'text-[var(--color-text-primary)] font-bold' : 'text-[var(--color-text-secondary)]'}`}>
              Monthly
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
                Annual Billing
              </span>
              <span className="px-2 py-0.5 text-[10px] glass-pill text-[var(--color-surface-raised)] border border-[var(--color-surface-raised)]/40 rounded-[3px] font-bold shadow-sm">
                SAVE 20%
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
              Academic Faculty or Large Global Architecture Office?
            </h4>
            <p className="text-xs text-[var(--color-text-secondary)]">
              We offer campus-wide university licenses and dedicated compute clusters for large practices.
            </p>
          </div>
          <button
            onClick={() => onSelectPlan(MASSLABS_PRICING[2])}
            className="px-5 py-2.5 text-xs font-mono text-[var(--color-text-primary)] bg-[var(--color-surface-muted)] border border-[var(--color-border-subtle)] hover:border-[var(--color-surface-raised)] rounded-[2px] whitespace-nowrap cursor-pointer transition-colors"
          >
            Request Enterprise Terms
          </button>
        </div>

        {/* FAQs */}
        <div className="pt-12 border-t border-[var(--color-border-subtle)] space-y-8">
          <div className="text-center space-y-2">
            <div className="text-[11px] font-mono uppercase tracking-widest text-[var(--color-text-secondary)]">
              Frequently Asked Questions
            </div>
            <h3 className="text-2xl font-bold text-[var(--color-text-primary)]">
              Common Architectural Questions
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
    </section>
  );
};
