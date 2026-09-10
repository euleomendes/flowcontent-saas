import React, { useState } from 'react';
import { X, Zap, Lock, Mail, ArrowRight, ShieldCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, setIsAuthModalOpen, setActiveTab, showToast, user } = useApp();
  const [email, setEmail] = useState('camila@agenciafluxo.com.br');
  const [password, setPassword] = useState('••••••••••••');
  const [loading, setLoading] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setIsAuthModalOpen(false);
      setActiveTab('dashboard');
      showToast(`Bem-vinda de volta, ${user.name}!`, 'success');
    }, 600);
  };

  const handleDemoAccess = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setIsAuthModalOpen(false);
      setActiveTab('dashboard');
      showToast('Acesso com perfil de demonstração iniciado!', 'success');
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden p-6 sm:p-8">
        {/* Close button */}
        <button
          onClick={() => setIsAuthModalOpen(false)}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Logo and title */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 mx-auto flex items-center justify-center shadow-lg shadow-brand-500/25 mb-3">
            <Zap className="w-6 h-6 text-white fill-white" />
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Acessar o FlowContent
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Entre na sua conta para agendar e sincronizar postagens
          </p>
        </div>

        {/* 1-Click Instant Demo Button */}
        <div className="mb-5">
          <button
            type="button"
            onClick={handleDemoAccess}
            disabled={loading}
            className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-brand-600 via-indigo-600 to-purple-600 hover:from-brand-500 hover:to-purple-500 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-lg shadow-brand-500/20 transition-all active:scale-[0.99]"
          >
            <ShieldCheck className="w-4 h-4 text-indigo-200" />
            <span>Entrar com Acesso Demo (1 Clique)</span>
          </button>
          <p className="text-[11px] text-slate-400 text-center mt-1.5">
            Explore imediatamente o dashboard e o motor em lote
          </p>
        </div>

        <div className="relative flex py-2 items-center mb-5">
          <div className="flex-grow border-t border-slate-800"></div>
          <span className="flex-shrink mx-3 text-[11px] text-slate-400 uppercase tracking-wider font-semibold">ou com e-mail</span>
          <div className="flex-grow border-t border-slate-800"></div>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              E-mail profissional
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-brand-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-xs font-medium text-slate-300">
                Senha
              </label>
              <a href="#" className="text-[11px] text-brand-400 hover:underline">
                Esqueceu?
              </a>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-brand-500 transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs flex items-center justify-center gap-2 border border-slate-700 transition-colors"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>Entrar na plataforma</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
