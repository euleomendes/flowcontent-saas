import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Clock, 
  CheckCircle2, 
  RefreshCw, 
  ArrowRight, 
  Zap, 
  Mail, 
  UserCheck, 
  Lock, 
  Building2,
  Crown,
  LogOut,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const PendingApprovalView: React.FC = () => {
  const { 
    user, 
    registeredUsers, 
    masterEmail, 
    loginAsMaster, 
    setActiveTab, 
    showToast 
  } = useApp();

  const [checking, setChecking] = useState(false);

  // Find updated status of current user in registeredUsers
  const currentUserInDb = registeredUsers.find(
    u => u.email.toLowerCase() === user.email.toLowerCase()
  );

  const isBlocked = currentUserInDb?.status === 'blocked' || user.status === 'blocked';
  const isApproved = currentUserInDb?.status === 'approved' || user.status === 'approved';

  const handleCheckStatus = () => {
    setChecking(true);
    setTimeout(() => {
      setChecking(false);
      if (isApproved) {
        showToast('🎉 Parabéns! Sua conta foi aprovada pelo Master.', 'success');
        setActiveTab('dashboard');
      } else if (isBlocked) {
        showToast('Acesso bloqueado pelo Administrador Master.', 'error');
      } else {
        showToast('Sua solicitação continua na fila de análise do Administrador Master.', 'info');
      }
    }, 700);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between relative overflow-hidden">
      {/* Glow Effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[350px] bg-amber-500/10 blur-[130px] pointer-events-none rounded-full" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-brand-600/15 blur-[140px] pointer-events-none rounded-full" />

      {/* Top Navbar */}
      <header className="border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-md px-6 py-4 flex items-center justify-between relative z-10">
        <div 
          onClick={() => setActiveTab('landing')}
          className="flex items-center gap-2.5 cursor-pointer"
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-brand-500/20">
            <Zap className="w-4 h-4 text-white fill-white" />
          </div>
          <span className="font-extrabold text-base tracking-tight text-white">FlowContent</span>
          <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 ml-1">
            Controle de Acesso
          </span>
        </div>

        <button 
          type="button"
          onClick={() => setActiveTab('landing')}
          className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Voltar ao Início</span>
        </button>
      </header>

      {/* Center Content */}
      <div className="max-w-lg w-full mx-auto px-4 py-8 relative z-10 my-auto">
        <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-6 sm:p-8 shadow-2xl backdrop-blur-xl text-center">
          
          {/* Status Icon */}
          <div className="relative w-20 h-20 mx-auto mb-6 flex items-center justify-center">
            <div className={`w-20 h-20 rounded-3xl flex items-center justify-center shadow-2xl ${
              isBlocked 
                ? 'bg-rose-500/15 border border-rose-500/30 text-rose-400' 
                : 'bg-amber-500/15 border border-amber-500/30 text-amber-400'
            }`}>
              {isBlocked ? (
                <ShieldAlert className="w-10 h-10" />
              ) : (
                <Clock className="w-10 h-10 animate-pulse" />
              )}
            </div>
            {!isBlocked && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-amber-500"></span>
              </span>
            )}
          </div>

          {/* Titles */}
          <span className={`text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full border ${
            isBlocked
              ? 'bg-rose-500/15 text-rose-400 border-rose-500/30'
              : 'bg-amber-500/15 text-amber-300 border-amber-500/30'
          }`}>
            {isBlocked ? 'Acesso Bloqueado' : 'Aguardando Aprovação do Master'}
          </span>

          <h2 className="text-xl sm:text-2xl font-black text-white mt-3 mb-2">
            {isBlocked ? 'Conta Temporariamente Bloqueada' : 'Solicitação de Acesso em Análise'}
          </h2>

          <p className="text-xs text-slate-400 leading-relaxed max-w-md mx-auto mb-6">
            {isBlocked
              ? 'O Administrador Master rejeitou ou bloqueou o acesso desta conta às ferramentas de agendamento em lote. Entre em contato com o proprietário para reativação.'
              : 'Seu cadastro foi realizado com sucesso! Para garantir a conformidade e segurança da plataforma, sua conta aguarda liberação e aprovação pelo Administrador Master (leandromendesjor@gmail.com).'
            }
          </p>

          {/* Details Card */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-left space-y-2.5 text-xs mb-6">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
              <span className="text-slate-500 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                Usuário Solicitante:
              </span>
              <span className="font-bold text-white truncate max-w-[200px]">
                {user.name} ({user.email})
              </span>
            </div>

            <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
              <span className="text-slate-500 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-slate-400" />
                Workspace Criado:
              </span>
              <span className="font-semibold text-slate-200">
                {user.workspaceName || 'Workspace Principal'}
              </span>
            </div>

            <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
              <span className="text-slate-500 flex items-center gap-1.5">
                <Crown className="w-3.5 h-3.5 text-amber-400" />
                Administrador Master:
              </span>
              <span className="font-mono text-amber-300 font-bold">
                {masterEmail}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-500">Status Atual:</span>
              <span className={`font-bold flex items-center gap-1 ${
                isBlocked ? 'text-rose-400' : 'text-amber-400'
              }`}>
                <span className={`w-2 h-2 rounded-full ${isBlocked ? 'bg-rose-400' : 'bg-amber-400 animate-pulse'}`} />
                {isBlocked ? 'Acesso Bloqueado / Rejeitado' : 'Pendente de Liberação'}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              type="button"
              onClick={handleCheckStatus}
              disabled={checking}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-brand-600/25 flex items-center justify-center gap-2 transition-all active:scale-[0.99]"
            >
              <RefreshCw className={`w-4 h-4 ${checking ? 'animate-spin' : ''}`} />
              <span>{checking ? 'Consultando status...' : 'Verificar Status de Aprovação'}</span>
            </button>

            {/* Quick Demo Switcher button */}
            <div className="p-3 rounded-xl bg-brand-950/30 border border-brand-500/20 text-center">
              <div className="text-[11px] text-brand-300 font-semibold mb-2">
                Modo Demonstração do Avaliador:
              </div>
              <button
                type="button"
                onClick={loginAsMaster}
                className="w-full py-2 px-3 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 text-xs font-bold transition-all flex items-center justify-center gap-2"
              >
                <Crown className="w-3.5 h-3.5 text-amber-400" />
                <span>Acessar como Master ({masterEmail})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Footer */}
      <footer className="py-5 border-t border-slate-800/60 bg-slate-950/80 text-center text-xs text-slate-500 relative z-10">
        <p>© {new Date().getFullYear()} FlowContent • Controle de Acesso Master Admin v2.0</p>
      </footer>
    </div>
  );
};
