import React from 'react';
import { 
  Bell, 
  Search, 
  Sparkles, 
  Clock, 
  RotateCcw, 
  Plus, 
  CheckCircle2,
  Calendar
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface HeaderProps {
  onSearchChange?: (query: string) => void;
  searchQuery?: string;
}

export const Header: React.FC<HeaderProps> = ({ onSearchChange, searchQuery = '' }) => {
  const { activeTab, setActiveTab, resetDemoData, stats } = useApp();

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

  return (
    <header className="h-16 px-6 border-b border-slate-800 bg-slate-900/60 backdrop-blur-md flex items-center justify-between sticky top-0 z-20">
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
      <div className="flex items-center gap-3">
        {/* Search input (visible in dashboard) */}
        {activeTab === 'dashboard' && onSearchChange && (
          <div className="relative hidden md:block w-56">
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
        <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-800/50 border border-slate-700/50 text-[11px] text-slate-400">
          <Clock className="w-3.5 h-3.5 text-indigo-400" />
          <span>Brasília (GMT-3)</span>
        </div>

        {/* Reset Demo Data Button */}
        <button
          onClick={resetDemoData}
          title="Restaurar dados de teste"
          className="p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/70 border border-slate-800 transition-colors text-xs flex items-center gap-1.5"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="hidden xl:inline text-[11px]">Reset Demo</span>
        </button>

        {/* Quick CTA if not on Bulk */}
        {activeTab !== 'bulk' && (
          <button
            onClick={() => setActiveTab('bulk')}
            className="flex items-center gap-1.5 py-1.5 px-3 rounded-lg bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold shadow-sm transition-all active:scale-[0.98]"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Agendar em Lote</span>
          </button>
        )}
      </div>
    </header>
  );
};
