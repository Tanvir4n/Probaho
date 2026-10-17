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
      <div className="relative z-10 w-full pt-10 sm:pt-14 md:pt-20 pb-0 flex flex-col justify-between items-center">
        
        {/* 
          ----------------------------------------------------------------------
          TOP ROW: QUIET CENTERED LINKS ("Terms of Service" & "Privacy Policy")
          Matches exact composition from user's Mobile & Desktop screenshots
          ----------------------------------------------------------------------
        */}
        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 md:gap-14 text-xs sm:text-sm font-sans tracking-wide px-4">
          <button
            type="button"
            onClick={handleTermsClick}
            className={`transition-colors duration-200 cursor-pointer ${
              isDay
                ? 'text-[#5a5750] hover:text-[#16a34a]'
                : 'text-white/65 hover:text-white'
            }`}
          >
            {isBangla ? 'সেবা শর্তাবলী' : 'Terms of Service'}
          </button>

          <button
            type="button"
            onClick={handlePrivacyClick}
            className={`transition-colors duration-200 cursor-pointer ${
              isDay
                ? 'text-[#5a5750] hover:text-[#16a34a]'
                : 'text-white/65 hover:text-white'
            }`}
          >
            {isBangla ? 'গোপনীয়তা নীতি' : 'Privacy Policy'}
          </button>

          {/* Optional dispatch / inquiry link for quick access */}
          {onOpenInquiry && (
            <button
              type="button"
              onClick={onOpenInquiry}
              className={`hidden md:inline-flex items-center gap-1.5 transition-colors duration-200 cursor-pointer ${
                isDay
                  ? 'text-[#5a5750] hover:text-[#16a34a]'
                  : 'text-white/50 hover:text-[#22c55e]'
              }`}
            >
              <span>{isBangla ? 'অনুসন্ধান ভল্ট' : 'Inquiry Portal'}</span>
              <span className={`w-1 h-1 rounded-full ${isDay ? 'bg-[#16a34a]' : 'bg-[#22c55e]'}`} />
            </button>
          )}

          {/* Scroll to Top Trigger */}
          <button
            type="button"
            onClick={scrollToTop}
            className={`transition-colors duration-200 cursor-pointer inline-flex items-center gap-1 ${
              isDay
                ? 'text-[#5a5750] hover:text-[#16a34a]'
                : 'text-white/50 hover:text-white'
            }`}
            title="Scroll to Top"
          >
            <span>{isBangla ? 'শীর্ষে' : 'Top'}</span>
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
