import React, { useState } from 'react';
import { 
  X, 
  Zap, 
  Lock, 
  Mail, 
  ArrowRight, 
  ShieldCheck, 
  Crown, 
  UserCheck, 
  Clock,
  CheckCircle2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AuthModal: React.FC = () => {
  const { 
    isAuthModalOpen, 
    setIsAuthModalOpen, 
    masterEmail, 
    loginWithEmail, 
    loginAsMaster, 
    startOnboarding 
  } = useApp();

  const [email, setEmail] = useState(masterEmail);
  const [password, setPassword] = useState('••••••••••••');
  const [loading, setLoading] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      loginWithEmail(email);
    }, 500);
  };

  const handleSelectQuickProfile = (targetEmail: string) => {
    setEmail(targetEmail);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      loginWithEmail(targetEmail);
    }, 400);
  };

  const handleStartRegister = () => {
    setIsAuthModalOpen(false);
    startOnboarding();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden p-6 sm:p-8 max-h-[92vh] overflow-y-auto">
        {/* Close button */}
        <button
          onClick={() => setIsAuthModalOpen(false)}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Logo and title */}
        <div className="text-center mb-5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-500 mx-auto flex items-center justify-center shadow-lg shadow-brand-500/25 mb-3">
            <Zap className="w-6 h-6 text-white fill-white" />
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Acessar o FlowContent
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Entre na sua conta ou use os perfis de validação do sistema
          </p>
        </div>

        {/* Quick Test Profiles for Reviewer */}
        <div className="mb-5 space-y-2">
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block text-center">
            Perfis de Demonstração (1 Clique):
          </span>

          <div className="grid grid-cols-1 gap-2">
            {/* Master Admin */}
            <button
              type="button"
              onClick={() => handleSelectQuickProfile(masterEmail)}
              disabled={loading}
              className="w-full py-2 px-3 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold flex items-center justify-between transition-all group"
            >
              <div className="flex items-center gap-2">
                <Crown className="w-4 h-4 text-amber-400 shrink-0 group-hover:scale-110 transition-transform" />
                <div className="text-left">
                  <div className="leading-tight">👑 Master Admin (Dono)</div>
                  <div className="text-[10px] font-normal text-amber-400/70 font-mono">{masterEmail}</div>
                </div>
              </div>
              <span className="text-[10px] bg-amber-500/20 px-1.5 py-0.5 rounded text-amber-200">Acesso Total</span>
            </button>

            {/* Approved User */}
            <button
              type="button"
              onClick={() => handleSelectQuickProfile('camila@agenciafluxo.com.br')}
              disabled={loading}
              className="w-full py-2 px-3 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold flex items-center justify-between transition-all group"
            >
              <div className="flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-emerald-400 shrink-0 group-hover:scale-110 transition-transform" />
                <div className="text-left">
                  <div className="leading-tight">🟢 Usuário Aprovado</div>
                  <div className="text-[10px] font-normal text-emerald-400/70 font-mono">camila@agenciafluxo.com.br</div>
                </div>
              </div>
              <span className="text-[10px] bg-emerald-500/20 px-1.5 py-0.5 rounded text-emerald-200">Liberado</span>
            </button>

            {/* Pending User */}
            <button
              type="button"
              onClick={() => handleSelectQuickProfile('lucas@techgrowth.io')}
              disabled={loading}
              className="w-full py-2 px-3 rounded-xl bg-slate-800/80 hover:bg-amber-500/15 text-slate-300 hover:text-amber-300 border border-slate-700/80 hover:border-amber-500/30 text-xs font-bold flex items-center justify-between transition-all group"
            >
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400 shrink-0 group-hover:rotate-45 transition-transform" />
                <div className="text-left">
                  <div className="leading-tight">🟡 Usuário Pendente</div>
                  <div className="text-[10px] font-normal text-slate-400 font-mono">lucas@techgrowth.io</div>
                </div>
              </div>
              <span className="text-[10px] bg-amber-500/20 px-1.5 py-0.5 rounded text-amber-200">Aguardando</span>
            </button>
          </div>
        </div>

        <div className="relative flex py-1 items-center mb-4">
          <div className="flex-grow border-t border-slate-800"></div>
          <span className="flex-shrink mx-3 text-[11px] text-slate-500 uppercase tracking-wider font-semibold">
            ou digite qualquer e-mail
          </span>
          <div className="flex-grow border-t border-slate-800"></div>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-3.5">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              E-mail de acesso
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-brand-500 transition-colors font-mono"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-xs font-medium text-slate-300">
                Senha
              </label>
              <span className="text-[11px] text-slate-500">Qualquer senha no modo demo</span>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-brand-500 transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-brand-600/30 transition-all active:scale-[0.99]"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>Entrar na Plataforma</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          <div className="pt-3 border-t border-slate-800 text-center">
            <button
              type="button"
              onClick={handleStartRegister}
              className="text-xs text-brand-400 hover:text-brand-300 hover:underline font-semibold"
            >
              Novo por aqui? Criar conta e configurar Workspace &rarr;
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
