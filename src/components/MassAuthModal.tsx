import React, { useState } from 'react';
import { X, Loader2, CheckCircle2, Lock, Mail, User, ArrowRight } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

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
      setError('Please provide a valid architect or institutional email address.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
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
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div
        className="bg-[var(--color-surface-strong)] border border-[var(--color-border-subtle)] rounded-[2px] max-w-md w-full p-6 sm:p-8 shadow-2xl relative space-y-6 animate-in fade-in zoom-in-95 duration-200 text-[var(--color-text-primary)]"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--color-border-subtle)] pb-4">
          <div className="flex items-center gap-2">
            <svg
              className="w-5 h-5 text-[var(--color-surface-raised)]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 19V5l9 7 9-7v14" />
            </svg>
            <span className="font-bold tracking-tight text-sm font-mono uppercase text-[var(--color-text-primary)]">
              MassLabs Account
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] rounded-[2px] cursor-pointer"
            aria-label="Close auth dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 p-1 bg-[var(--color-surface-muted)] border border-[var(--color-border-subtle)] rounded-[2px] text-xs font-mono">
          <button
            type="button"
            onClick={() => {
              setMode('signin');
              setError('');
            }}
            className={`py-2 rounded-[2px] transition-colors cursor-pointer ${
              mode === 'signin'
                ? 'bg-[var(--color-surface-raised)] text-white font-semibold shadow-sm'
                : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('signup');
              setError('');
            }}
            className={`py-2 rounded-[2px] transition-colors cursor-pointer ${
              mode === 'signup'
                ? 'bg-[var(--color-surface-raised)] text-white font-semibold shadow-sm'
                : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <div>
              <label className="block text-[11px] font-mono text-[var(--color-text-secondary)] mb-1">
                FULL NAME / STUDIO NAME
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="e.g. Maya Lin Architecture Studio"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-[var(--color-surface-base)] text-[var(--color-text-primary)] border border-[var(--color-border-subtle)] focus:border-[var(--color-surface-raised)] focus:outline-none rounded-[2px] font-mono"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-[11px] font-mono text-[var(--color-text-secondary)] mb-1">
              EMAIL ADDRESS *
            </label>
            <div className="relative">
              <input
                type="email"
                required
                placeholder="architect@studio-practice.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-[var(--color-surface-base)] text-[var(--color-text-primary)] border border-[var(--color-border-subtle)] focus:border-[var(--color-surface-raised)] focus:outline-none rounded-[2px] font-mono"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] font-mono text-[var(--color-text-secondary)]">
                PASSWORD *
              </label>
              {mode === 'signin' && (
                <button
                  type="button"
                  onClick={() => {
                    setInfoMessage('Password reset instructions sent to your email address.');
                    setError('');
                  }}
                  className="text-[10px] font-mono text-[var(--color-surface-raised)] hover:underline cursor-pointer"
                >
                  Forgot password?
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
                className="w-full px-3 py-2 text-xs bg-[var(--color-surface-base)] text-[var(--color-text-primary)] border border-[var(--color-border-subtle)] focus:border-[var(--color-surface-raised)] focus:outline-none rounded-[2px] font-mono"
              />
            </div>
          </div>

          {infoMessage && (
            <div className="text-xs text-[var(--color-surface-raised)] font-mono bg-[var(--color-surface-raised)]/10 p-2.5 border border-[var(--color-surface-raised)]/20 rounded-[2px]">
              {infoMessage}
            </div>
          )}

          {error && (
            <div className="text-xs text-red-500 font-mono bg-red-500/10 p-2.5 border border-red-500/20 rounded-[2px]">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 text-xs font-semibold text-white bg-[var(--color-surface-raised)] hover:brightness-110 active:translate-y-[1px] rounded-[2px] transition-all flex items-center justify-center gap-2 font-mono uppercase tracking-wider cursor-pointer shadow-md"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-current" />
                <span>Authenticating...</span>
              </>
            ) : (
              <span>{mode === 'signin' ? 'Sign In to MassLabs' : 'Join MassLabs Studio'}</span>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="relative flex items-center justify-center text-[10px] font-mono text-[var(--color-text-tertiary)] border-t border-[var(--color-border-subtle)] pt-4">
          <span className="bg-[var(--color-surface-strong)] px-2 uppercase">or continue with</span>
        </div>

        {/* Third-party SSO */}
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => {
              onLoginSuccess({ email: 'google.architect@practice.com', name: 'Studio Partner' });
              onClose();
            }}
            className="py-2 px-3 bg-[var(--color-surface-muted)] border border-[var(--color-border-subtle)] hover:border-[var(--color-surface-raised)] rounded-[2px] text-xs font-mono text-[var(--color-text-primary)] flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <span>Google</span>
          </button>
          <button
            type="button"
            onClick={() => {
              onLoginSuccess({ email: 'github.dev@rhino-tools.org', name: 'Computational Lead' });
              onClose();
            }}
            className="py-2 px-3 bg-[var(--color-surface-muted)] border border-[var(--color-border-subtle)] hover:border-[var(--color-surface-raised)] rounded-[2px] text-xs font-mono text-[var(--color-text-primary)] flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <span>GitHub</span>
          </button>
        </div>

        <div className="text-[10px] text-center text-[var(--color-text-tertiary)] font-mono leading-relaxed">
          By signing in, you agree to MassLabs Terms of Service and Architectural Data Privacy Policy.
        </div>
      </div>
    </div>
  );
};
