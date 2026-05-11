"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import { ShieldCheck, Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const supabase = useMemo(() => createClient(), []);

  useEffect(() => {
    const error = searchParams.get('error');
    if (error === 'auth_failed') {
      setMessage('Erreur d\'authentification. Veuillez réessayer.');
    }
  }, [searchParams]);

  useEffect(() => {
    let cancelled = false;
    const checkUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!cancelled && user) {
          router.push('/dashboard');
        }
      } catch (err) {
        console.warn('Session check failed:', err);
      } finally {
        if (!cancelled) setCheckingSession(false);
      }
    };
    checkUser();
    const timeout = setTimeout(() => { if (!cancelled) setCheckingSession(false); }, 5000);
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) router.push('/dashboard');
    });
    return () => { cancelled = true; clearTimeout(timeout); subscription.unsubscribe(); };
  }, [router, supabase]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    if (showPassword && password) {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setMessage(`Erreur: ${error.message}`);
      else window.location.href = '/dashboard';
    } else {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: `${window.location.origin}/auth/callback` }
      });
      if (error) setMessage(`Erreur: ${error.message}`);
      else setMessage('✉️ Lien envoyé ! Vérifiez votre boîte mail.');
    }
    setLoading(false);
  };

  if (checkingSession) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md space-y-8 text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white shadow-xl border border-gray-100 mb-4">
          <ShieldCheck className="w-8 h-8 text-blue-600" />
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Espace OPAYS HQ</h1>
          <p className="text-gray-500">Connectez-vous pour accéder à votre tableau de bord.</p>
        </div>
      </div>

      <div className="w-full max-w-md bg-white border border-gray-200 p-8 rounded-3xl shadow-xl shadow-gray-200/50">
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2 text-left">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Email Professionnel</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-10 pr-4 text-gray-900 focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
                placeholder="votre@email.com"
                required
              />
            </div>
          </div>

          {showPassword && (
            <div className="space-y-2 text-left animate-in slide-in-from-top-2 duration-300">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Mot de passe</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-10 pr-4 text-gray-900 focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
                  placeholder="••••••••"
                  required={showPassword}
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white font-bold py-3.5 rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 group disabled:opacity-50"
          >
            {loading ? 'Connexion...' : showPassword ? 'Se connecter' : 'Recevoir mon accès'}
            {!loading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-100 text-center">
          <button 
            onClick={() => setShowPassword(!showPassword)}
            className="text-xs font-bold text-gray-400 hover:text-blue-600 uppercase tracking-widest transition-colors"
          >
            {showPassword ? "Utiliser le lien magique" : "Utiliser un mot de passe"}
          </button>
        </div>

        {message && (
          <div className={`mt-6 p-4 rounded-xl text-xs font-semibold text-center border animate-in zoom-in-95 duration-200 ${message.includes('Erreur') ? 'bg-red-50 border-red-100 text-red-600' : 'bg-green-50 border-green-100 text-green-600'}`}>
            {message}
          </div>
        )}
      </div>

      <p className="mt-8 text-xs text-gray-400 font-medium">
        OPAYS TECH • Gouvernance Digitale 2026
      </p>
    </div>
  );
}
