import React, { useState } from 'react';
import { X, Loader2, CheckCircle2, Lock, Mail, User, ArrowRight } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { ProbahoLogo, ProbahoBrand } from './ProbahoLogo';
import { motion } from 'motion/react';

interface MassAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: { email: string; name: string }) => void;
}

export const MassAuthModal: React.FC<MassAuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const { isDay } = useTheme();
  const { isBangla } = useLanguage();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [infoMessage, setInfoMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setError(isBangla ? 'সঠিক প্রাতিষ্ঠানিক অথবা অনুসন্ধানকারী ইমেইল প্রদান করুন।' : 'Please provide a valid investigator or institutional email address.');
      return;
    }
    if (password.length < 6) {
      setError(isBangla ? 'পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।' : 'Password must be at least 6 characters.');
      return;
    }

    setError('');
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess({
        email,
        name: name || email.split('@')[0],
      });
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 36, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 24, scale: 0.98 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="glass-panel rounded-[8px] max-w-md w-full p-6 sm:p-8 shadow-2xl relative space-y-6 text-[var(--color-text-primary)]"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--color-border-subtle)] pb-4">
          <ProbahoBrand size={22} textSize="text-base" />
          <button
            onClick={onClose}
            className="p-1 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] rounded-[3px] cursor-pointer"
            aria-label="Close auth dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 p-1 glass-pill rounded-[4px] text-xs font-mono">
          <button
            type="button"
            onClick={() => {
              setMode('signin');
              setError('');
            }}
            className={`py-2 rounded-[3px] transition-colors cursor-pointer ${
              mode === 'signin'
                ? 'bg-[var(--color-surface-raised)] text-white font-semibold shadow-sm'
                : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
            }`}
          >
            {isBangla ? 'লগইন' : 'Sign In'}
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('signup');
              setError('');
            }}
            className={`py-2 rounded-[3px] transition-colors cursor-pointer ${
              mode === 'signup'
                ? 'bg-[var(--color-surface-raised)] text-white font-semibold shadow-sm'
                : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
            }`}
          >
            {isBangla ? 'অ্যাকাউন্ট তৈরি' : 'Create Account'}
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <div>
              <label className="block text-[11px] font-mono text-[var(--color-text-secondary)] mb-1">
                {isBangla ? 'পূর্ণ নাম / প্রতিষ্ঠানের নাম' : 'FULL NAME / STUDIO NAME'}
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder={isBangla ? 'যেমন: ঢাকা ল্যান্ড রেজিস্ট্রি ও লিগ্যাল প্র্যাকটিস' : 'e.g. Dhaka Land Registry & Legal Practice'}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 text-xs glass-tile text-[var(--color-text-primary)] border border-[var(--color-border-subtle)] focus:border-[var(--color-surface-raised)] focus:outline-none rounded-[3px] font-mono"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-[11px] font-mono text-[var(--color-text-secondary)] mb-1">
              {isBangla ? 'ইমেইল ঠিকানা *' : 'EMAIL ADDRESS *'}
            </label>
            <div className="relative">
              <input
                type="email"
                required
                placeholder="investigator@land-registry.gov.bd"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 text-xs glass-tile text-[var(--color-text-primary)] border border-[var(--color-border-subtle)] focus:border-[var(--color-surface-raised)] focus:outline-none rounded-[3px] font-mono"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] font-mono text-[var(--color-text-secondary)]">
                {isBangla ? 'পাসওয়ার্ড *' : 'PASSWORD *'}
              </label>
              {mode === 'signin' && (
                <button
                  type="button"
                  onClick={() => {
                    setInfoMessage(isBangla ? 'আপনার ইমেইলে পাসওয়ার্ড রিসেটের নির্দেশনা পাঠানো হয়েছে।' : 'Password reset instructions sent to your email address.');
                    setError('');
                  }}
                  className="text-[10px] font-mono text-[var(--color-surface-raised)] hover:underline cursor-pointer"
                >
                  {isBangla ? 'পাসওয়ার্ড ভুলে গেছেন?' : 'Forgot password?'}
                </button>
              )}
            </div>
            <div className="relative">
              <input
                type="password"
                required
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 text-xs glass-tile text-[var(--color-text-primary)] border border-[var(--color-border-subtle)] focus:border-[var(--color-surface-raised)] focus:outline-none rounded-[3px] font-mono"
              />
            </div>
          </div>

          {infoMessage && (
            <div className="text-xs text-[var(--color-surface-raised)] font-mono bg-[var(--color-surface-raised)]/10 p-2.5 border border-[var(--color-surface-raised)]/20 rounded-[3px]">
              {infoMessage}
            </div>
          )}

          {error && (
            <div className="text-xs text-red-500 font-mono bg-red-500/10 p-2.5 border border-red-500/20 rounded-[3px]">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 text-xs font-semibold text-white bg-[var(--color-surface-raised)] hover:brightness-110 active:translate-y-[1px] rounded-[3px] transition-all flex items-center justify-center gap-2 font-mono uppercase tracking-wider cursor-pointer shadow-[0_4px_16px_rgba(34,197,94,0.35)]"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-current" />
                <span>{isBangla ? 'যাচাই করা হচ্ছে...' : 'Authenticating...'}</span>
              </>
            ) : (
              <span>
                {mode === 'signin' 
                  ? (isBangla ? 'প্রবাহে লগইন করুন' : 'Sign In to Probaho') 
                  : (isBangla ? 'প্রবাহ স্টুডিওতে যোগ দিন' : 'Join Probaho Studio')}
              </span>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="relative flex items-center justify-center text-[10px] font-mono text-[var(--color-text-tertiary)] border-t border-[var(--color-border-subtle)] pt-4">
          <span className="glass-tile px-2 uppercase rounded-[2px]">
            {isBangla ? 'অথবা এর মাধ্যমে প্রবেশ করুন' : 'or continue with'}
          </span>
        </div>

        {/* Third-party SSO */}
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => {
              onLoginSuccess({ email: 'analyst@probaho.bd', name: isBangla ? 'রেজিস্ট্রি কর্মকর্তা' : 'Registry Officer' });
              onClose();
            }}
            className="py-2 px-3 bg-[var(--color-surface-muted)] border border-[var(--color-border-subtle)] hover:border-[var(--color-surface-raised)] rounded-[2px] text-xs font-mono text-[var(--color-text-primary)] flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <span>Google</span>
          </button>
          <button
            type="button"
            onClick={() => {
              onLoginSuccess({ email: 'developer@probaho.bd', name: isBangla ? 'ইন্টেলিজেন্স লিড' : 'Intelligence Lead' });
              onClose();
            }}
            className="py-2 px-3 bg-[var(--color-surface-muted)] border border-[var(--color-border-subtle)] hover:border-[var(--color-surface-raised)] rounded-[2px] text-xs font-mono text-[var(--color-text-primary)] flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <span>GitHub</span>
          </button>
        </div>

        <div className="text-[10px] text-center text-[var(--color-text-tertiary)] font-mono leading-relaxed">
          {isBangla 
            ? 'লগইন করার মাধ্যমে আপনি প্রবাহ ব্যবহারের শর্তাবলী এবং ভূমি রেকর্ড গোপনীয়তা নীতিতে সম্মত হচ্ছেন।' 
            : 'By signing in, you agree to Probaho Terms of Service and Land Record Privacy Policy.'}
        </div>
      </motion.div>
    </div>
  );
};
