import React from 'react';
import { 
  CalendarClock, 
  CheckCircle2, 
  Share2, 
  TrendingUp, 
  Sparkles, 
  ArrowUpRight 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const MetricCards: React.FC = () => {
  const { stats, posts, accounts, setActiveTab } = useApp();

  // Find next upcoming post
  const scheduledPosts = posts
    .filter(p => p.status === 'scheduled')
    .sort((a, b) => `${a.scheduledDate} ${a.scheduledTime}`.localeCompare(`${b.scheduledDate} ${b.scheduledTime}`));

  const nextPost = scheduledPosts[0];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* Card 1: Total Agendados */}
      <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700/80 transition-all shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-slate-400">Total Agendados</span>
          <div className="w-7 h-7 rounded-lg bg-brand-500/10 text-brand-400 flex items-center justify-center">
            <CalendarClock className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-black text-white tracking-tight">{stats.totalScheduled}</span>
          <span className="text-[11px] font-semibold text-emerald-400 flex items-center">
            <ArrowUpRight className="w-3 h-3" />
            +8 esta semana
          </span>
        </div>
        <p className="text-[11px] text-slate-400 mt-1">Prontos na fila para publicação</p>
      </div>

      {/* Card 2: Próximo Disparo */}
      <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700/80 transition-all shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-slate-400">Próximo Disparo</span>
          <div className="w-7 h-7 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
        </div>
        {nextPost ? (
          <div>
            <div className="text-sm font-bold text-slate-200 truncate">
              {nextPost.scheduledDate} às {nextPost.scheduledTime}
            </div>
            <p className="text-[11px] text-slate-400 mt-1 truncate">
              {nextPost.caption.substring(0, 35)}...
            </p>
          </div>
        ) : (
          <div>
            <div className="text-sm font-bold text-slate-400">Nenhum post na fila</div>
            <button
              onClick={() => setActiveTab('bulk')}
              className="text-[11px] text-brand-400 hover:underline mt-1 font-semibold block"
            >
              + Criar primeiro lote
            </button>
          </div>
        )}
      </div>

      {/* Card 3: Taxa de Sucesso */}
      <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700/80 transition-all shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-slate-400">Taxa de Sucesso</span>
          <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-black text-white tracking-tight">{stats.successRate}%</span>
          <span className="text-[11px] font-semibold text-slate-400">Uptime das APIs</span>
        </div>
        <p className="text-[11px] text-slate-400 mt-1">{stats.publishedThisMonth} publicações entregues</p>
      </div>

      {/* Card 4: Redes Conectadas */}
      <div 
        onClick={() => setActiveTab('accounts')}
        className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-brand-500/40 transition-all shadow-sm cursor-pointer group"
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-slate-400">Redes Conectadas</span>
          <div className="w-7 h-7 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center group-hover:scale-105 transition-transform">
            <Share2 className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-black text-white tracking-tight">
            {stats.connectedAccounts} <span className="text-xs font-normal text-slate-400">/ {accounts.length}</span>
          </span>
          <span className="text-[11px] font-semibold text-brand-400 group-hover:underline">
            Gerenciar &rarr;
          </span>
        </div>
        <div className="flex items-center gap-1.5 mt-1.5">
          {accounts.map(acc => (
            <span
              key={acc.id}
              className={`w-2 h-2 rounded-full ${acc.connected ? 'bg-emerald-400 ring-2 ring-emerald-400/20' : 'bg-slate-700'}`}
              title={`${acc.name}: ${acc.connected ? 'Conectado' : 'Desconectado'}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
