/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Probaho — Editorial Decimals-Style Minimalist Footer
 * 
 * Inspired by the luxury editorial aesthetic:
 * - Quiet top utility links: "Terms of Service" & "Privacy Policy"
 * - Colossal edge-to-edge luxury display serif wordmark: "PROBAHO"
 * - Distinctive baseline crop matching Mobile and Desktop reference views
 * - Calibrated with White & Emerald Green color scheme and Day/Night support
 */

import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { ChevronUp } from 'lucide-react';
import { ProbahoLogo } from './ProbahoLogo';

interface ArchitecturalFooterProps {
  onOpenInquiry?: () => void;
  onOpenAuth?: () => void;
  setToastMessage?: (msg: string | null) => void;
}

export const ArchitecturalFooter: React.FC<ArchitecturalFooterProps> = ({
  onOpenInquiry,
  onOpenAuth,
  setToastMessage,
}) => {
  const { isBangla } = useLanguage();
  const { isDay } = useTheme();
  const [wordmarkText, setWordmarkText] = useState<'PROBAHO' | 'DECIMALS'>('PROBAHO');

  const handleTermsClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (setToastMessage) {
      setToastMessage(
        isBangla
          ? 'প্রবাহ সেবা শর্তাবলী: ভুয়া দলিল শনাক্তকরণ ও আরএস/বিএস খতিয়ান যাচাই ফ্রেমওয়ার্ক।'
          : 'Probaho Terms of Service: Cadastral graph analytics and title verification framework.'
      );
      setTimeout(() => setToastMessage(null), 3500);
    }
  };

  const handlePrivacyClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (setToastMessage) {
      setToastMessage(
        isBangla
          ? 'প্রবাহ ডাটা সুরক্ষানীতি: সকল আরএস/বিএস খতিয়ান সরকারি ওআইএমএস মানদণ্ড মেনে সুরক্ষিত।'
          : 'Probaho Privacy Policy: All cadastral records comply with BD Land Ministry data privacy.'
      );
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

  return (
    <footer
      className={`relative w-full overflow-hidden transition-colors duration-500 select-none ${
        isDay
          ? 'bg-[#f4f2ec] text-[#1c1b18] border-t border-black/10'
          : 'bg-[#181715] text-[#f2efe9] border-t border-white/10'
      }`}
    >
      {/* 
        ========================================================================
        LAYER 0: ATMOSPHERIC AMBIENT GLOW (Emerald & Warm Olive Lighting)
        ========================================================================
      */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          background: isDay
            ? 'radial-gradient(ellipse at 50% 0%, rgba(22, 163, 74, 0.08) 0%, rgba(22, 163, 74, 0.02) 50%, transparent 80%)'
            : 'radial-gradient(ellipse at 50% 0%, rgba(40, 37, 32, 0.9) 0%, rgba(24, 23, 21, 0.95) 60%, rgba(15, 14, 12, 1) 100%), radial-gradient(circle at 50% 40%, rgba(34, 197, 94, 0.08) 0%, transparent 60%)',
        }}
      />

      {/* Subtle Blueprint Grid Lines */}
      <div className="absolute inset-0 pointer-events-none z-0 opacity-40">
        <div className="w-full h-full relative">
          <div className={`absolute inset-y-0 left-[20%] w-[1px] ${isDay ? 'bg-black/[0.03]' : 'bg-white/[0.04]'}`} />
          <div className={`absolute inset-y-0 left-[50%] w-[1px] ${isDay ? 'bg-black/[0.03]' : 'bg-white/[0.04]'}`} />
          <div className={`absolute inset-y-0 left-[80%] w-[1px] ${isDay ? 'bg-black/[0.03]' : 'bg-white/[0.04]'}`} />
        </div>
      </div>

      {/* 
        ========================================================================
        MAIN FOOTER CONTENT CONTAINER
        ========================================================================
      */}
      <div className="relative z-10 w-full pt-10 sm:pt-14 md:pt-16 pb-0 flex flex-col justify-between items-center">
        
        {/* 
          ======================================================================
          REACT BITS-STYLE MODULAR PRE-FOOTER CARD
          - Matches exact layout from reference: Left Brand & Bio, Right 3 Link Columns
          - Fully customized for Probaho LandTech Cadastral Ecosystem
          ======================================================================
        */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full mb-8 sm:mb-12">
          <div
            className={`rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 transition-all duration-300 border ${
              isDay
                ? 'bg-white/85 border-black/10 shadow-[0_12px_40px_rgba(0,0,0,0.05)] text-[#1c1b18]'
                : 'bg-[#121117]/90 border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] text-[#f2efe9]'
            } backdrop-blur-xl flex flex-col lg:flex-row justify-between gap-8 sm:gap-12`}
          >
            {/* Left Side: Brand Identity, Tagline, Copyright */}
            <div className="flex flex-col justify-between space-y-6 sm:space-y-8 max-w-sm">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <ProbahoLogo className="w-8 h-8 text-[var(--color-surface-raised)]" />
                  <span className="text-2xl font-bold tracking-tight text-[var(--color-text-primary)]">
                    {isBangla ? 'প্রবাহ' : 'Probaho'}
                  </span>
                </div>
                <p className="text-xs sm:text-[13px] text-[var(--color-text-secondary)] leading-relaxed">
                  {isBangla ? (
                    <>
                      ক্যাডাস্ট্রাল ইন্টেলিজেন্স ও ভূমির মালিকানা গ্রাফ ইঞ্জিন।
                      <br />
                      আইনি বিধিমালা ও ক্রিপ্টোগ্রাফিক প্রামাণ্য ডসিয়ার প্ল্যাটফর্ম।
                    </>
                  ) : (
                    <>
                      Bangladesh Cadastral Intelligence &amp; Land Title Graph Engine.
                      <br />
                      Deterministic legal AST. Cryptographic SHA-256 evidence dossiers.
                    </>
                  )}
                </p>
              </div>

              {/* Bottom Copyright line matching React Bits */}
              <div className="text-[11px] sm:text-xs text-[var(--color-text-tertiary)] font-sans">
                {isBangla ? (
                  <span>© ২০২৬ প্রবাহ · নির্ভুল ভূমি রেকর্ড ও স্বচ্ছতার প্রত্যয়ে · ওপেন সোর্স</span>
                ) : (
                  <span>© 2026 Probaho · Built for Bangladesh Land Transparency · Open Source</span>
                )}
              </div>
            </div>

            {/* Right Side: 3 Columns matching React Bits layout */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 sm:gap-8 md:gap-12 text-xs sm:text-[13px]">
              {/* Column 1: Platform / Engines */}
              <div className="space-y-3">
                <h4 className="font-semibold text-[var(--color-text-primary)] tracking-tight text-xs sm:text-sm">
                  {isBangla ? 'প্লাটফর্ম' : 'Platform'}
                </h4>
                <ul className="space-y-2 sm:space-y-2.5 text-[var(--color-text-secondary)]">
                  <li>
                    <button
                      type="button"
                      onClick={() => scrollToSection('tools')}
                      className="hover:text-[var(--color-surface-raised)] transition-colors cursor-pointer text-left"
                    >
                      {isBangla ? 'ক্যাডাস্ট্রাল জিআইএস' : 'Cadastral GIS'}
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => scrollToSection('tools')}
                      className="hover:text-[var(--color-surface-raised)] transition-colors cursor-pointer text-left"
                    >
                      {isBangla ? 'ফ্রডইঞ্জিন' : 'FraudEngine'}
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => scrollToSection('tools')}
                      className="hover:text-[var(--color-surface-raised)] transition-colors cursor-pointer text-left"
                    >
                      {isBangla ? 'দলিল তুলনাকারী' : 'DocCompare'}
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => scrollToSection('tools')}
                      className="hover:text-[var(--color-surface-raised)] transition-colors cursor-pointer text-left"
                    >
                      {isBangla ? 'ঝুঁকি সিমুলেটর' : 'Adversarial Sim'}
                    </button>
                  </li>
                </ul>
              </div>

              {/* Column 2: Cadastre & Legal Rules */}
              <div className="space-y-3">
                <h4 className="font-semibold text-[var(--color-text-primary)] tracking-tight text-xs sm:text-sm">
                  {isBangla ? 'রেকর্ড ও আইন' : 'Cadastre & Laws'}
                </h4>
                <ul className="space-y-2 sm:space-y-2.5 text-[var(--color-text-secondary)]">
                  <li>
                    <button
                      type="button"
                      onClick={() => {
                        if (setToastMessage) {
                          setToastMessage(isBangla ? 'সিএস (১৯৪০), এসএ (১৯৬২), আরএস (১৯৮৮) ও বিএস (২০২১) জরিপ ধারা যাচাইকৃত।' : 'CS (1940), SA (1962), RS (1988), and BS (2021) survey DAG verified.');
                          setTimeout(() => setToastMessage(null), 3500);
                        }
                      }}
                      className="hover:text-[var(--color-surface-raised)] transition-colors cursor-pointer text-left"
                    >
                      {isBangla ? 'সিএস/এসএ/আরএস/বিএস' : 'CS · SA · RS · BS'}
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => {
                        if (setToastMessage) {
                          setToastMessage(isBangla ? 'মৌজা ক্যাডাস্ট্রাল প্লট ও দাগ সীমানা ভেক্টর লোড হচ্ছে।' : 'Mouza cadastral plot boundaries and vector topology loaded.');
                          setTimeout(() => setToastMessage(null), 3500);
                        }
                      }}
                      className="hover:text-[var(--color-surface-raised)] transition-colors cursor-pointer text-left"
                    >
                      {isBangla ? 'মৌজা দাগ নকশা' : 'Mouza Plot Vectors'}
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => {
                        if (setToastMessage) {
                          setToastMessage(isBangla ? 'সাব-রেজিস্ট্রি ৭২ ঘণ্টা কনকারেন্সি সফট-লক কার্যকর।' : '72h Sub-Registry concurrency pre-lock active.');
                          setTimeout(() => setToastMessage(null), 3500);
                        }
                      }}
                      className="hover:text-[var(--color-surface-raised)] transition-colors cursor-pointer text-left"
                    >
                      {isBangla ? 'সাব-রেজিস্ট্রি প্রি-লক' : '72h Pre-Lock'}
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => {
                        if (setToastMessage) {
                          setToastMessage(isBangla ? 'সম্পত্তি হস্তান্তর আইন ৫৩এ ও রাষ্ট্রীয় অধিগ্রহণ আইন ৮৯ ধারা।' : 'Transfer of Property Act §53A and SAT Act §89 deterministic rules.');
                          setTimeout(() => setToastMessage(null), 3500);
                        }
                      }}
                      className="hover:text-[var(--color-surface-raised)] transition-colors cursor-pointer text-left"
                    >
                      {isBangla ? 'আইনি বিধিমালা AST' : 'Legal Rules AST'}
                    </button>
                  </li>
                </ul>
              </div>

              {/* Column 3: Resources & Actions */}
              <div className="space-y-3">
                <h4 className="font-semibold text-[var(--color-text-primary)] tracking-tight text-xs sm:text-sm">
                  {isBangla ? 'রিসোর্স ও সেবা' : 'Resources'}
                </h4>
                <ul className="space-y-2 sm:space-y-2.5 text-[var(--color-text-secondary)]">
                  <li>
                    <button
                      type="button"
                      onClick={() => scrollToSection('risk-analytics')}
                      className="hover:text-[var(--color-surface-raised)] transition-colors cursor-pointer text-left"
                    >
                      {isBangla ? 'জাতীয় ঝুঁকি রাডার' : 'Risk Radar 360°'}
                    </button>
                  </li>
                  <li>
                    {onOpenInquiry ? (
                      <button
                        type="button"
                        onClick={onOpenInquiry}
                        className="hover:text-[var(--color-surface-raised)] transition-colors cursor-pointer text-left"
                      >
                        {isBangla ? 'তদন্ত পোর্টাল' : 'Inquiry Portal'}
                      </button>
                    ) : (
                      <span className="opacity-60">{isBangla ? 'তদন্ত পোর্টাল' : 'Inquiry Portal'}</span>
                    )}
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={handleTermsClick}
                      className="hover:text-[var(--color-surface-raised)] transition-colors cursor-pointer text-left"
                    >
                      {isBangla ? 'সেবা শর্তাবলী' : 'Terms of Service'}
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={handlePrivacyClick}
                      className="hover:text-[var(--color-surface-raised)] transition-colors cursor-pointer text-left"
                    >
                      {isBangla ? 'গোপনীয়তা নীতি' : 'Privacy Policy'}
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll to Top Trigger */}
        <div className="flex items-center justify-center gap-6 text-xs font-sans tracking-wide px-4 mb-2">
          <button
            type="button"
            onClick={scrollToTop}
            className={`transition-colors duration-200 cursor-pointer inline-flex items-center gap-1.5 ${
              isDay
                ? 'text-[#5a5750] hover:text-[#16a34a]'
                : 'text-white/50 hover:text-white'
            }`}
            title="Scroll to Top"
          >
            <span>{isBangla ? 'পৃষ্ঠার শীর্ষে যান' : 'Back to top'}</span>
            <ChevronUp className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 
          ----------------------------------------------------------------------
          BOTTOM ROW: COLOSSAL LUXURY SERIF WORDMARK (BASELINE-CROPPED)
          Matches exact letterforms, proportions, and baseline crop from reference
          ----------------------------------------------------------------------
        */}
        <div className="w-full mt-6 sm:mt-10 md:mt-14 overflow-hidden flex justify-center -mb-2 sm:-mb-3 md:-mb-6 lg:-mb-8 select-none">
          <h1
            onClick={() => setWordmarkText(prev => prev === 'PROBAHO' ? 'DECIMALS' : 'PROBAHO')}
            className={`font-times-roman font-normal tracking-[0.03em] sm:tracking-[0.04em] md:tracking-[0.05em] leading-[0.76] sm:leading-[0.72] md:leading-[0.68] text-center select-none whitespace-nowrap text-[17.5vw] sm:text-[18.5vw] md:text-[19.5vw] transition-all duration-500 transform hover:scale-[1.008] cursor-pointer ${
              isDay
                ? 'text-[#1c1b18] hover:text-[#16a34a]'
                : 'text-[#f2efe9] hover:text-[#22c55e] drop-shadow-[0_0_50px_rgba(34,197,94,0.22)]'
            }`}
            style={{
              fontFamily: "'Times New Roman', Times, 'Nimbus Roman', 'Noto Serif', serif",
              textRendering: 'optimizeLegibility',
            }}
            title="Click to toggle display between PROBAHO and DECIMALS"
          >
            {wordmarkText === 'DECIMALS' ? 'DECIMALS' : (isBangla ? 'প্রবাহ' : 'PROBAHO')}
          </h1>
        </div>

      </div>
    </footer>
  );
};
