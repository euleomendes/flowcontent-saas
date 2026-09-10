import React from 'react';
import { 
  LayoutDashboard, 
  CalendarDays, 
  Layers, 
  Share2, 
  Settings, 
  Zap, 
  ExternalLink,
  ChevronRight,
  Sparkles,
  HelpCircle,
  Crown,
  ShieldCheck
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { NavigationTab } from '../../types';

interface SidebarProps {
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = () => {
  const { activeTab, setActiveTab, stats, user, masterEmail, registeredUsers } = useApp();

  const isMaster = user.isMaster || user.email.toLowerCase() === masterEmail.toLowerCase();
  const pendingCount = registeredUsers.filter(u => u.status === 'pending').length;

  const navItems: { id: NavigationTab; label: string; icon: React.ElementType; badge?: string | number }[] = [
    { id: 'dashboard', label: 'Dashboard & Calendário', icon: LayoutDashboard, badge: stats.totalScheduled },
    { id: 'bulk', label: 'Agendamento em Lote', icon: Layers, badge: 'Core' },
    { id: 'accounts', label: 'Redes Conectadas', icon: Share2, badge: `${stats.connectedAccounts}/6` },
    ...(isMaster ? [
      { 
        id: 'admin' as NavigationTab, 
        label: 'Painel Master Admin', 
        icon: Crown, 
        badge: pendingCount > 0 ? `${pendingCount} pendente(s)` : undefined 
      }
    ] : []),
    { id: 'settings', label: 'Configurações', icon: Settings }
  ];

  return (
    <aside className="w-64 bg-slate-900/95 border-r border-slate-800 flex flex-col shrink-0 select-none z-30 transition-all duration-300">
      {/* Brand Header */}
      <div className="h-16 px-5 flex items-center justify-between border-b border-slate-800/80">
        <div 
          onClick={() => setActiveTab('dashboard')} 
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 via-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform">
            <Zap className="w-5 h-5 text-white fill-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-base tracking-tight text-white">FlowContent</span>
              <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-brand-500/20 text-brand-400 border border-brand-500/30">MVP</span>
            </div>
            <p className="text-[11px] text-slate-400">Bulk Social Scheduler</p>
          </div>
        </div>
      </div>

      {/* Quick Action Button */}
      <div className="p-4">
        <button
          onClick={() => setActiveTab('bulk')}
          className="w-full py-2.5 px-3.5 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-medium text-xs flex items-center justify-center gap-2 shadow-md shadow-brand-600/30 hover:shadow-brand-600/50 transition-all duration-200 group active:scale-[0.98]"
        >
          <Sparkles className="w-4 h-4 text-indigo-200 group-hover:rotate-12 transition-transform" />
          <span>Novo Agendamento em Lote</span>
        </button>
      </div>

      {/* Navigation List */}
      <div className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Gerenciamento
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all duration-150 ${
                isActive
                  ? 'bg-brand-600/15 text-brand-400 border border-brand-500/30 font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-brand-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge !== undefined && (
                <span
                  className={`text-[11px] px-2 py-0.5 rounded-full font-semibold ${
                    isActive
                      ? 'bg-brand-500 text-white'
                      : typeof item.badge === 'string' && item.badge === 'Core'
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}

        <div className="pt-6 px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Atalhos
        </div>
        <button
          onClick={() => setActiveTab('landing')}
          className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 transition-colors"
        >
          <div className="flex items-center gap-3">
            <ExternalLink className="w-4 h-4 text-slate-400" />
            <span>Ver Landing Page</span>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        </button>
      </div>

      {/* Plan & User Widget */}
      <div className="p-3 border-t border-slate-800/80">
        <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/50 mb-3">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-semibold text-slate-300">Plano {user.plan}</span>
            <span className="text-[10px] text-brand-400 font-bold bg-brand-500/10 px-1.5 py-0.5 rounded">Ativo</span>
          </div>
          <div className="w-full bg-slate-700/60 h-1.5 rounded-full overflow-hidden mb-1.5">
            <div 
              className="bg-brand-500 h-full rounded-full transition-all duration-500" 
              style={{ width: `${Math.min(100, (stats.totalScheduled / 50) * 100)}%` }} 
            />
          </div>
          <p className="text-[10px] text-slate-400 flex justify-between">
            <span>{stats.totalScheduled} de 50 posts</span>
            <span className="text-slate-300 font-medium">Ilimitado</span>
          </p>
        </div>

        {/* User profile row */}
        <div className="flex items-center gap-3 px-1 py-1">
          <div className="relative shrink-0">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-8 h-8 rounded-full object-cover border border-slate-700 ring-2 ring-brand-500/20"
            />
            {isMaster && (
              <div className="w-3.5 h-3.5 rounded-full bg-amber-500 text-slate-950 font-bold absolute -top-1 -right-1 flex items-center justify-center text-[8px] shadow">
                👑
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <p className="text-xs font-semibold text-slate-200 truncate">{user.name}</p>
              {isMaster && (
                <span className="text-[9px] px-1 py-0.2 rounded bg-amber-500/20 text-amber-300 font-bold">
                  Master
                </span>
              )}
            </div>
            <p className="text-[10px] text-slate-400 truncate">
              {isMaster ? 'Administrador Master' : user.workspaceName || user.role}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};
