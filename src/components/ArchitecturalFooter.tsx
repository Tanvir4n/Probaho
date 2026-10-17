/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Probaho — Editorial Decimals-Style Minimalist Footer
 * 
 * Reconstructed to match the user's reference picture:
 * - High-contrast, crystal-clear typography (WCAG AAA compliant)
 * - Pure charcoal/black headings on light card (never washed out or white-on-white)
 * - Left: Probaho green emblem, English cadastral tagline, open source copyright
 * - Right: 3 clean columns (Platform, Cadastre & Laws, Resources)
 * - Centered "Back to top ⌃"
 * - Colossal "PROBAHO" Times New Roman serif wordmark with cropped baseline
 */

import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { ChevronUp, HelpCircle, X } from 'lucide-react';

interface ArchitecturalFooterProps {
  onOpenInquiry?: () => void;
  onOpenAuth?: () => void;
  setToastMessage?: (msg: string | null) => void;
}

export const ArchitecturalFooter: React.FC<ArchitecturalFooterProps> = ({
  onOpenInquiry,
  setToastMessage,
}) => {
  const { isDay } = useTheme();
  const { isBangla, t } = useLanguage();
  const [isWordmarkSelected, setIsWordmarkSelected] = useState<boolean>(false);
  const [activeInlineFaq, setActiveInlineFaq] = useState<number | null>(null);
  const [isFaqModalOpen, setIsFaqModalOpen] = useState<boolean>(false);

  const faqs = [
    {
      shortTitle: isBangla ? 'দলিল ও খতিয়ান ফরম্যাট' : 'Document Formats',
      q: t.pricingFaqs.q1,
      a: t.pricingFaqs.a1,
    },
    {
      shortTitle: isBangla ? 'দ্বৈত-বিক্রয় শনাক্তকরণ' : 'Double-Sale Graph',
      q: t.pricingFaqs.q2,
      a: t.pricingFaqs.a2,
    },
    {
      shortTitle: isBangla ? 'আইনি প্রমাণাদি ডসিয়ার' : 'Legal Evidence Dossiers',
      q: t.pricingFaqs.q3,
      a: t.pricingFaqs.a3,
    },
    {
      shortTitle: isBangla ? 'সাবস্ক্রিপশন ও শর্তাবলী' : 'Subscription & Terms',
      q: t.pricingFaqs.q4,
      a: t.pricingFaqs.a4,
    },
  ];

  const handleTermsClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (setToastMessage) {
      setToastMessage('Probaho Terms of Service: Cadastral graph analytics and title verification framework.');
      setTimeout(() => setToastMessage(null), 3500);
    }
  };

  const handlePrivacyClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (setToastMessage) {
      setToastMessage('Probaho Privacy Policy: All cadastral records comply with BD Land Ministry data privacy.');
      setTimeout(() => setToastMessage(null), 3500);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // High-contrast semantic color tokens guaranteed against washed-out rendering
  const headingColor = isDay ? 'text-[#0f172a]' : 'text-[#f8fafc]';
  const bodyColor = isDay ? 'text-[#334155]' : 'text-[#cbd5e1]';
  const mutedColor = isDay ? 'text-[#64748b]' : 'text-[#94a3b8]';
  const linkHoverColor = isDay ? 'hover:text-[#16a34a]' : 'hover:text-[#22c55e]';

  return (
    <footer
      className={`relative w-full overflow-hidden transition-colors duration-500 select-none ${
        isDay
          ? 'bg-[#f4f2ec] text-[#1c1b18]'
          : 'bg-[#181715] text-[#f2efe9]'
      }`}
    >
      {/* 
        ========================================================================
        LAYER 0: ATMOSPHERIC AMBIENT GLOW
        ========================================================================
      */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          background: isDay
            ? 'radial-gradient(ellipse at 50% 0%, rgba(22, 163, 74, 0.06) 0%, transparent 70%)'
            : 'radial-gradient(ellipse at 50% 0%, rgba(40, 37, 32, 0.9) 0%, rgba(15, 14, 12, 1) 100%)',
        }}
      />

      {/* Subtle Blueprint Grid Lines */}
      <div className="absolute inset-0 pointer-events-none z-0 opacity-30">
        <div className="w-full h-full relative">
          <div className={`absolute inset-y-0 left-[20%] w-[1px] ${isDay ? 'bg-black/[0.04]' : 'bg-white/[0.04]'}`} />
          <div className={`absolute inset-y-0 left-[50%] w-[1px] ${isDay ? 'bg-black/[0.04]' : 'bg-white/[0.04]'}`} />
          <div className={`absolute inset-y-0 left-[80%] w-[1px] ${isDay ? 'bg-black/[0.04]' : 'bg-white/[0.04]'}`} />
        </div>
      </div>

      {/* 
        ========================================================================
        MAIN FOOTER CONTENT CONTAINER
        ========================================================================
      */}
      <div className="relative z-10 w-full pt-10 sm:pt-14 pb-0 flex flex-col justify-between items-center">
        
        {/* 
          ======================================================================
          FLOATING PRE-FOOTER CARD
          Contains brand identity and 4 directory sections:
          1. Platform  2. Cadastre & Laws  3. Resources  4. FAQ
          ======================================================================
        */}
        <div id="faq" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full mb-8 sm:mb-10">
          <div
            className={`rounded-[26px] sm:rounded-[32px] p-6 sm:p-9 md:p-12 transition-all duration-300 border ${
              isDay
                ? 'bg-white border-black/[0.08] shadow-[0_14px_45px_rgba(0,0,0,0.05)]'
                : 'bg-[#121117] border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)]'
            } flex flex-col gap-6 sm:gap-8`}
          >
            {/* Top row: Brand + 4-column directory sections */}
            <div className="flex flex-col lg:flex-row justify-between gap-8 sm:gap-12 lg:gap-16 w-full">
              {/* Left Side: Brand Identity, Tagline, Copyright */}
              <div className="flex flex-col justify-between space-y-6 sm:space-y-8 max-w-sm">
                <div className="space-y-3.5">
                  <div className="flex items-center gap-3">
                    {/* Green Emblem */}
                    <div className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center shrink-0">
                      <svg viewBox="0 0 32 32" fill="none" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M 8 26 V 8 C 8 5.79 9.79 4 12 4 H 18 C 22.42 4 26 7.58 26 12 C 26 16.42 22.42 20 18 20 H 8"
                          stroke="#16a34a"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M 11.5 20 C 14.2 15.2 17.8 11.8 23 11.8 C 25.2 11.8 26.8 12.6 28.5 13.8"
                          stroke="#22c55e"
                          strokeWidth="2.2"
                          strokeLinecap="round"
                        />
                        <circle cx="23" cy="11.8" r="2.2" fill="#22c55e" />
                      </svg>
                    </div>
                    {/* "Probaho" Title - High Contrast Bold Heading */}
                    <span className={`text-2xl font-bold tracking-tight ${headingColor} font-sans`}>
                      Probaho
                    </span>
                  </div>
                  <p className={`text-xs sm:text-[13.5px] ${bodyColor} leading-relaxed`}>
                    Bangladesh Cadastral Intelligence &amp; Land Title Graph Engine.
                    <br />
                    Deterministic legal AST. Cryptographic SHA-256 evidence dossiers.
                  </p>
                </div>

                {/* Copyright */}
                <div className={`text-[11px] sm:text-xs ${mutedColor} font-sans pt-2`}>
                  © 2026 Probaho · Built for Bangladesh Land Transparency · Open Source
                </div>
              </div>

              {/* Right Side: 4 Directory Sections matching user request */}
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 md:gap-10 text-xs sm:text-[13px]">
                {/* Section 1: Platform */}
                <div className="space-y-3">
                  <h4 className={`font-bold ${headingColor} tracking-tight text-xs sm:text-sm uppercase sm:normal-case`}>
                    Platform
                  </h4>
                  <ul className={`space-y-2.5 ${bodyColor}`}>
                    <li>
                      <button
                        type="button"
                        onClick={() => scrollToSection('tools')}
                        className={`${linkHoverColor} transition-colors cursor-pointer text-left font-medium`}
                      >
                        Cadastral GIS
                      </button>
                    </li>
                    <li>
                      <button
                        type="button"
                        onClick={() => scrollToSection('tools')}
                        className={`${linkHoverColor} transition-colors cursor-pointer text-left font-medium`}
                      >
                        FraudEngine
                      </button>
                    </li>
                    <li>
                      <button
                        type="button"
                        onClick={() => scrollToSection('tools')}
                        className={`${linkHoverColor} transition-colors cursor-pointer text-left font-medium`}
                      >
                        DocCompare
                      </button>
                    </li>
                    <li>
                      <button
                        type="button"
                        onClick={() => scrollToSection('tools')}
                        className={`${linkHoverColor} transition-colors cursor-pointer text-left font-medium`}
                      >
                        Adversarial Sim
                      </button>
                    </li>
                  </ul>
                </div>

                {/* Section 2: Cadastre & Laws */}
                <div className="space-y-3">
                  <h4 className={`font-bold ${headingColor} tracking-tight text-xs sm:text-sm uppercase sm:normal-case`}>
                    Cadastre &amp; Laws
                  </h4>
                  <ul className={`space-y-2.5 ${bodyColor}`}>
                    <li>
                      <button
                        type="button"
                        onClick={() => {
                          if (setToastMessage) {
                            setToastMessage('CS (1940), SA (1962), RS (1988), and BS (2021) survey DAG verified.');
                            setTimeout(() => setToastMessage(null), 3500);
                          }
                        }}
                        className={`${linkHoverColor} transition-colors cursor-pointer text-left font-medium`}
                      >
                        CS · SA · RS · BS
                      </button>
                    </li>
                    <li>
                      <button
                        type="button"
                        onClick={() => {
                          if (setToastMessage) {
                            setToastMessage('Mouza cadastral plot boundaries and vector topology loaded.');
                            setTimeout(() => setToastMessage(null), 3500);
                          }
                        }}
                        className={`${linkHoverColor} transition-colors cursor-pointer text-left font-medium`}
                      >
                        Mouza Plot Vectors
                      </button>
                    </li>
                    <li>
                      <button
                        type="button"
                        onClick={() => {
                          if (setToastMessage) {
                            setToastMessage('72h Sub-Registry concurrency pre-lock active.');
                            setTimeout(() => setToastMessage(null), 3500);
                          }
                        }}
                        className={`${linkHoverColor} transition-colors cursor-pointer text-left font-medium`}
                      >
                        72h Pre-Lock
                      </button>
                    </li>
                    <li>
                      <button
                        type="button"
                        onClick={() => {
                          if (setToastMessage) {
                            setToastMessage('Transfer of Property Act §53A and SAT Act §89 deterministic rules.');
                            setTimeout(() => setToastMessage(null), 3500);
                          }
                        }}
                        className={`${linkHoverColor} transition-colors cursor-pointer text-left font-medium`}
                      >
                        Legal Rules AST
                      </button>
                    </li>
                  </ul>
                </div>

                {/* Section 3: Resources */}
                <div className="space-y-3">
                  <h4 className={`font-bold ${headingColor} tracking-tight text-xs sm:text-sm uppercase sm:normal-case`}>
                    Resources
                  </h4>
                  <ul className={`space-y-2.5 ${bodyColor}`}>
                    <li>
                      <button
                        type="button"
                        onClick={() => scrollToSection('risk-analytics')}
                        className={`${linkHoverColor} transition-colors cursor-pointer text-left font-medium`}
                      >
                        Risk Radar 360°
                      </button>
                    </li>
                    <li>
                      {onOpenInquiry ? (
                        <button
                          type="button"
                          onClick={onOpenInquiry}
                          className={`${linkHoverColor} transition-colors cursor-pointer text-left font-medium`}
                        >
                          Inquiry Portal
                        </button>
                      ) : (
                        <span className="opacity-60">Inquiry Portal</span>
                      )}
                    </li>
                    <li>
                      <button
                        type="button"
                        onClick={handleTermsClick}
                        className={`${linkHoverColor} transition-colors cursor-pointer text-left font-medium`}
                      >
                        Terms of Service
                      </button>
                    </li>
                    <li>
                      <button
                        type="button"
                        onClick={handlePrivacyClick}
                        className={`${linkHoverColor} transition-colors cursor-pointer text-left font-medium`}
                      >
                        Privacy Policy
                      </button>
                    </li>
                  </ul>
                </div>

                {/* Section 4: FAQ (Added per user request) */}
                <div className="space-y-3">
                  <h4 className={`font-bold ${headingColor} tracking-tight text-xs sm:text-sm uppercase sm:normal-case flex items-center gap-1.5`}>
                    <span>{isBangla ? 'সাধারণ প্রশ্ন' : 'FAQ'}</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#16a34a] dark:bg-[#22c55e] inline-block" />
                  </h4>
                  <ul className={`space-y-2.5 ${bodyColor}`}>
                    {faqs.map((faq, idx) => (
                      <li key={idx}>
                        <button
                          type="button"
                          onClick={() => {
                            setActiveInlineFaq(activeInlineFaq === idx ? null : idx);
                          }}
                          className={`${linkHoverColor} transition-colors cursor-pointer text-left font-medium block w-full truncate ${
                            activeInlineFaq === idx ? 'text-[#16a34a] dark:text-[#22c55e] font-semibold' : ''
                          }`}
                          title={faq.q}
                        >
                          {faq.shortTitle}
                        </button>
                      </li>
                    ))}
                    <li className="pt-0.5">
                      <button
                        type="button"
                        onClick={() => setIsFaqModalOpen(true)}
                        className="text-[#16a34a] dark:text-[#22c55e] hover:underline font-semibold flex items-center gap-1 transition-all text-[11px] sm:text-xs cursor-pointer"
                      >
                        <span>{isBangla ? 'সব প্রশ্ন দেখুন' : 'View all FAQs'}</span>
                        <span aria-hidden="true">→</span>
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Inline FAQ Answer Drawer when an FAQ item is clicked */}
            {activeInlineFaq !== null && (
              <div
                className={`w-full mt-2 pt-6 border-t ${
                  isDay
                    ? 'border-black/[0.08] bg-[#f8f6f0]/70'
                    : 'border-white/10 bg-[#17161c]/80'
                } p-5 sm:p-7 rounded-[20px] transition-all duration-300 space-y-3`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className={`text-sm sm:text-base font-bold ${headingColor} flex items-start gap-2.5`}>
                    <HelpCircle className="w-4 h-4 sm:w-5 sm:h-5 text-[#16a34a] dark:text-[#22c55e] shrink-0 mt-0.5" />
                    <span>{faqs[activeInlineFaq].q}</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => setIsFaqModalOpen(true)}
                      className={`text-[11px] font-mono px-2.5 py-1 rounded-md border cursor-pointer ${
                        isDay
                          ? 'border-black/10 hover:bg-black/5 text-[#334155]'
                          : 'border-white/10 hover:bg-white/5 text-[#cbd5e1]'
                      } transition-colors`}
                    >
                      {isBangla ? 'পূর্ণাঙ্গ ভিউ' : 'Modal View'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveInlineFaq(null)}
                      className={`p-1 rounded-md cursor-pointer ${
                        isDay ? 'hover:bg-black/5 text-slate-500' : 'hover:bg-white/10 text-slate-400'
                      } transition-colors`}
                      aria-label="Close answer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <p className={`text-xs sm:text-[13.5px] ${bodyColor} leading-relaxed pl-6.5 sm:pl-7.5`}>
                  {faqs[activeInlineFaq].a}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* 
          ======================================================================
          FAQ MODAL: COMMON INVESTIGATION QUESTIONS
          Opens on 'View all FAQs' or 'Modal View'
          ======================================================================
        */}
        {isFaqModalOpen && (
          <div
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={() => setIsFaqModalOpen(false)}
          >
            <div
              className={`w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-[24px] sm:rounded-[32px] p-6 sm:p-9 md:p-10 border shadow-2xl transition-all duration-300 ${
                isDay
                  ? 'bg-[#fcfbf9] border-black/[0.1] text-[#0f172a]'
                  : 'bg-[#141318] border-white/15 text-[#f8fafc]'
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-start justify-between gap-4 pb-6 border-b border-black/[0.08] dark:border-white/10">
                <div className="space-y-1.5">
                  <div className="text-[11px] font-mono uppercase tracking-widest text-[#16a34a] dark:text-[#22c55e] font-bold">
                    {t.pricingFaqs.tag}
                  </div>
                  <h3 className={`text-xl sm:text-2xl md:text-3xl font-bold tracking-tight ${headingColor}`}>
                    {t.pricingFaqs.heading}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsFaqModalOpen(false)}
                  className={`p-2 rounded-full cursor-pointer transition-colors ${
                    isDay
                      ? 'hover:bg-black/5 text-slate-500 hover:text-slate-800'
                      : 'hover:bg-white/10 text-slate-400 hover:text-slate-100'
                  }`}
                  aria-label="Close FAQ dialog"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal FAQ 2x2 Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 pt-6">
                {faqs.map((faq, idx) => (
                  <div
                    key={idx}
                    className={`p-5 sm:p-6 rounded-[18px] border transition-all duration-200 ${
                      isDay
                        ? 'bg-white border-black/[0.08] shadow-[0_4px_16px_rgba(0,0,0,0.025)]'
                        : 'bg-[#1a1921] border-white/10 shadow-lg'
                    } space-y-2.5`}
                  >
                    <div className={`text-sm sm:text-base font-bold ${headingColor} flex items-start gap-2.5`}>
                      <HelpCircle className="w-4 h-4 sm:w-5 sm:h-5 text-[#16a34a] dark:text-[#22c55e] shrink-0 mt-0.5" />
                      <span>{faq.q}</span>
                    </div>
                    <p className={`text-xs sm:text-[13px] ${bodyColor} leading-relaxed pl-6.5 sm:pl-7.5`}>
                      {faq.a}
                    </p>
                  </div>
                ))}
              </div>

              {/* Modal Footer Note */}
              <div className="pt-6 mt-6 border-t border-black/[0.08] dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-slate-500">
                <span>SHA-256 Verified · Deterministic Bangladesh Cadastral Rules</span>
                <button
                  type="button"
                  onClick={() => setIsFaqModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-[#16a34a] text-white hover:bg-[#15803d] font-sans font-medium text-xs transition-colors cursor-pointer"
                >
                  {isBangla ? 'বন্ধ করুন' : 'Done'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Scroll to Top Trigger */}
        <div className="flex items-center justify-center gap-6 text-xs font-sans tracking-wide px-4 my-3">
          <button
            type="button"
            onClick={scrollToTop}
            className={`transition-colors duration-200 cursor-pointer inline-flex items-center gap-1.5 ${
              isDay
                ? 'text-[#475569] hover:text-[#0f172a]'
                : 'text-[#94a3b8] hover:text-white'
            }`}
            title="Scroll to Top"
          >
            <span>Back to top</span>
            <ChevronUp className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 
          ----------------------------------------------------------------------
          BOTTOM ROW: COLOSSAL LUXURY SERIF WORDMARK (BASELINE-CROPPED)
          Exact Times New Roman font, tracking and baseline crop
          ----------------------------------------------------------------------
        */}
        <div className="w-full mt-4 sm:mt-6 md:mt-8 overflow-hidden flex justify-center -mb-2 sm:-mb-3 md:-mb-6 lg:-mb-8 pointer-events-auto">
          <style>{`
            .probaho-wordmark::selection,
            .probaho-wordmark *::selection {
              color: ${isDay ? '#16a34a' : '#22c55e'} !important;
              background-color: rgba(34, 197, 94, 0.22) !important;
              text-shadow: 0 0 50px rgba(34, 197, 94, 0.45);
            }
          `}</style>
          <h1
            onClick={() => setIsWordmarkSelected((prev) => !prev)}
            onMouseUp={() => {
              const sel = window.getSelection()?.toString();
              if (sel && sel.trim().length > 0) {
                setIsWordmarkSelected(true);
              }
            }}
            className={`probaho-wordmark font-normal tracking-[0.03em] sm:tracking-[0.04em] md:tracking-[0.05em] leading-[0.74] sm:leading-[0.70] md:leading-[0.68] text-center select-text cursor-pointer whitespace-nowrap text-[17.5vw] sm:text-[18.5vw] md:text-[19.5vw] transition-all duration-300 ${
              isWordmarkSelected
                ? isDay
                  ? 'text-[#16a34a] drop-shadow-[0_0_50px_rgba(22,163,74,0.35)]'
                  : 'text-[#22c55e] drop-shadow-[0_0_50px_rgba(34,197,94,0.45)]'
                : isDay
                  ? 'text-[#000000] hover:text-[#16a34a]'
                  : 'text-[#f2efe9] hover:text-[#22c55e]'
            }`}
            style={{
              fontFamily: "'Times New Roman', Times, 'Nimbus Roman', 'Noto Serif', serif",
              textRendering: 'optimizeLegibility',
              userSelect: 'text',
              WebkitUserSelect: 'text',
            }}
            title="Click or select PROBAHO to turn green"
          >
            PROBAHO
          </h1>
        </div>

      </div>
    </footer>
  );
};
