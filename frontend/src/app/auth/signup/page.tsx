'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, User, Rocket } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { api } from '@/lib/api';
import { getURL } from '@/lib/utils';

export default function SignupPage() {
  const router = useRouter();
  const supabase = createClient();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    if (!agreedToTerms) {
      setError('Please agree to the terms of service');
      return;
    }

    setLoading(true);

    const { data, error: signupError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } },
    });

    if (signupError) {
      setError(signupError.message);
      setLoading(false);
      return;
    }

    if (data.user) {
      try {
        await api.post('/users/profile', { name, email, image: null });
        await api.post('/quests/seed', {});
        await api.post('/skills/seed', {});
      } catch (err) {
        console.warn('Onboarding seed failed (non-critical):', err);
      }
      setSuccess(true);
      setTimeout(() => router.push('/dashboard'), 1500);
    }

    setLoading(false);
  };

  const handleGoogleSignup = async () => {
    setGoogleLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${getURL()}auth/callback` },
    });
    if (error) {
      setError(error.message);
      setGoogleLoading(false);
    }
  };

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card p-8 text-center"
      >
        <div className="w-16 h-16 rounded-full bg-gradient-brand flex items-center justify-center mx-auto mb-4">
          <Rocket className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold mb-2">You're all set! 🎉</h2>
        <p className="text-text-secondary">Redirecting to your dashboard...</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="glass-card p-8"
    >
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-text-primary mb-2">Create your account</h2>
        <p className="text-text-secondary">Start your learning journey today</p>
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm"
        >
          {error}
        </motion.div>
      )}

      <form onSubmit={handleSignup} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-text-secondary mb-2">Full Name</label>
          <div className="relative">
            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              className="input-field pl-11"
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="signup-email" className="block text-sm font-medium text-text-secondary mb-2">Email</label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input
              id="signup-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="input-field pl-11"
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="signup-password" className="block text-sm font-medium text-text-secondary mb-2">Password</label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input
              id="signup-password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min. 8 characters"
              className="input-field pl-11 pr-11"
              required
              minLength={8}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary transition-colors"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div>
          <label htmlFor="confirm-password" className="block text-sm font-medium text-text-secondary mb-2">Confirm Password</label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input
              id="confirm-password"
              type={showPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Repeat password"
              className="input-field pl-11"
              required
            />
          </div>
        </div>

        <label className="flex items-start gap-3 cursor-pointer group">
          <input
            id="terms-checkbox"
            type="checkbox"
            checked={agreedToTerms}
            onChange={(e) => setAgreedToTerms(e.target.checked)}
            className="w-4 h-4 mt-0.5 accent-blue-500"
          />
          <span className="text-sm text-text-secondary group-hover:text-text-primary transition-colors">
            I agree to the{' '}
            <a href="#" className="text-brand-blue hover:text-blue-400">Terms of Service</a>
            {' '}and{' '}
            <a href="#" className="text-brand-blue hover:text-blue-400">Privacy Policy</a>
          </span>
        </label>

        <button
          id="signup-submit"
          type="submit"
          disabled={loading}
          className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
        >
          {loading ? (
            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <Rocket className="w-4 h-4" />
              Create Account
            </>
          )}
        </button>
      </form>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-surface-border" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-3 bg-surface-card text-text-muted">or continue with</span>
        </div>
      </div>

      <button
        id="google-signup"
        onClick={handleGoogleSignup}
        disabled={googleLoading}
        className="btn-secondary w-full flex items-center justify-center gap-3 disabled:opacity-60"
      >
        {googleLoading ? (
          <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
          <>
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </>
        )}
      </button>

      <p className="text-center text-text-muted text-sm mt-6">
        Already have an account?{' '}
        <Link href="/auth/login" className="text-brand-blue hover:text-blue-400 font-medium transition-colors">
          Sign in
        </Link>
      </p>
    </motion.div>
  );
}
