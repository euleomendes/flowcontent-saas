import React from 'react';
import { 
  Bell, 
  Search, 
  Sparkles, 
  Clock, 
  RotateCcw, 
  Plus, 
  CheckCircle2,
  Calendar,
  LogOut,
  Crown,
  User,
  ShieldCheck
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface HeaderProps {
  onSearchChange?: (query: string) => void;
  searchQuery?: string;
}

export const Header: React.FC<HeaderProps> = ({ onSearchChange, searchQuery = '' }) => {
  const { 
    activeTab, 
    setActiveTab, 
    resetDemoData, 
    stats, 
    user, 
    masterEmail, 
    setIsAuthModalOpen, 
    showToast 
  } = useApp();

  const isMaster = user.isMaster || user.email.toLowerCase() === masterEmail.toLowerCase();

  const getPageMeta = () => {
    switch (activeTab) {
      case 'dashboard':
        return {
          title: 'Calendário Editorial & Fila',
          subtitle: 'Visão unificada das publicações agendadas e métricas'
        };
      case 'bulk':
        return {
          title: 'Agendamento em Lote (Bulk Flow)',
          subtitle: 'Faça upload de dezenas de mídias e dispare sua grade em segundos'
        };
      case 'accounts':
        return {
          title: 'Canais e Redes Conectadas',
          subtitle: 'Gerencie tokens e permissões dos perfis sociais'
        };
      case 'admin':
        return {
          title: 'Painel Master Admin',
          subtitle: 'Aprovação de acessos e validação de usuários cadastrados'
        };
      case 'settings':
        return {
          title: 'Configurações do Espaço de Trabalho',
          subtitle: 'Ajustes de fuso horário, padrões de publicação e automações'
        };
      default:
        return {
          title: 'FlowContent',
          subtitle: 'Agendamento de conteúdo em lote'
        };
    }
  };

  const meta = getPageMeta();

  const handleLogout = () => {
    setActiveTab('landing');
    showToast('Você saiu da sua conta.', 'info');
  };

  return (
    <header className="h-16 px-4 sm:px-6 border-b border-slate-800 bg-slate-900/80 backdrop-blur-md flex items-center justify-between sticky top-0 z-20">
      {/* Page Title & Breadcrumb */}
      <div>
        <h1 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
          {meta.title}
        </h1>
        <p className="text-xs text-slate-400 hidden sm:block">
          {meta.subtitle}
        </p>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* Search input (visible in dashboard) */}
        {activeTab === 'dashboard' && onSearchChange && (
          <div className="relative hidden md:block w-48 lg:w-56">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Buscar legenda ou tag..."
              className="w-full bg-slate-800/80 border border-slate-700/60 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:border-brand-500 transition-colors"
            />
          </div>
        )}

        {/* Timezone badge */}
        <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-800/50 border border-slate-700/50 text-[11px] text-slate-400">
          <Clock className="w-3.5 h-3.5 text-indigo-400" />
          <span>Brasília (GMT-3)</span>
        </div>

        {/* Reset Demo Data Button */}
        <button
          type="button"
          onClick={resetDemoData}
          title="Restaurar dados de teste"
          className="p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/70 border border-slate-800 transition-colors text-xs flex items-center gap-1.5"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="hidden 2xl:inline text-[11px]">Reset</span>
        </button>

        {/* Quick CTA if not on Bulk */}
        {activeTab !== 'bulk' && (
          <button
            type="button"
            onClick={() => setActiveTab('bulk')}
            className="hidden sm:flex items-center gap-1.5 py-1.5 px-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold shadow-sm transition-all active:scale-[0.98]"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Agendar em Lote</span>
          </button>
        )}

        {/* Authentication & User Status Widget in Header */}
        <div className="flex items-center gap-2 pl-2 sm:pl-3 border-l border-slate-800">
          <div 
            onClick={() => setIsAuthModalOpen(true)}
            title="Clique para alternar perfil de usuário"
            className="flex items-center gap-2 cursor-pointer p-1 rounded-xl hover:bg-slate-800/50 transition-colors group"
          >
            <div className="relative shrink-0">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-700 group-hover:ring-brand-500 transition-colors"
              />
              {isMaster && (
                <div className="w-3.5 h-3.5 rounded-full bg-amber-500 text-slate-950 font-bold absolute -top-1 -right-1 flex items-center justify-center text-[8px] shadow">
                  👑
                </div>
              )}
            </div>

            <div className="hidden md:block text-left">
              <div className="text-xs font-bold text-white flex items-center gap-1">
                <span className="truncate max-w-[120px]">{user.name}</span>
                {isMaster ? (
                  <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold">
                    Master
                  </span>
                ) : (
                  <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">
                    Aprovado
                  </span>
                )}
              </div>
              <div className="text-[10px] text-slate-400 font-mono truncate max-w-[130px]">
                {user.email}
              </div>
            </div>
          </div>

          {/* Logout Button */}
          <button
            type="button"
            onClick={handleLogout}
            title="Sair da conta (Logout)"
            className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 border border-slate-800 transition-colors flex items-center gap-1"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden lg:inline text-[11px] font-semibold">Sair</span>
          </button>
        </div>
      </div>
    </header>
  );
};
