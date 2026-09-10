import React, { useState } from 'react';
import { 
  Share2, 
  CheckCircle2, 
  XCircle, 
  RefreshCw, 
  ExternalLink, 
  ShieldCheck, 
  Users, 
  Plus 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SocialAccount } from '../../types';
import { PLATFORM_INFO } from '../../utils/helpers';
import { ConnectChannelModal } from './ConnectChannelModal';

export const AccountsManager: React.FC = () => {
  const { accounts, toggleAccountConnection, showToast } = useApp();
  const [selectedForConnect, setSelectedForConnect] = useState<SocialAccount | null>(null);

  const handleToggle = (account: SocialAccount) => {
    if (!account.connected) {
      setSelectedForConnect(account);
    } else {
      if (window.confirm(`Deseja desconectar a conta ${account.name}?`)) {
        toggleAccountConnection(account.id);
        showToast(`Conta ${account.name} desconectada.`, 'info');
      }
    }
  };

  return (
    <div className="animate-fade-in space-y-6">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-brand-900/40 via-indigo-900/20 to-slate-900 border border-brand-500/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-brand-500/20 text-brand-300 border border-brand-500/30">
            Canais de Publicação
          </span>
          <h2 className="text-xl font-bold text-white mt-1.5">
            Gerenciamento de Redes Conectadas
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Conecte seus perfis sociais para permitir que o FlowContent envie disparos automáticos e em lote com sincronização oficial.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-sm font-bold text-white">
              {accounts.filter(a => a.connected).length} de {accounts.length}
            </div>
            <div className="text-[11px] text-slate-400">Canais ativos</div>
          </div>
        </div>
      </div>

      {/* Grid of Accounts */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {accounts.map((account) => {
          const info = PLATFORM_INFO[account.platform];
          return (
            <div
              key={account.id}
              className={`p-5 rounded-2xl border transition-all ${
                account.connected
                  ? 'bg-slate-900/80 border-slate-700/80 hover:border-slate-600'
                  : 'bg-slate-950/40 border-slate-800/80 opacity-70 hover:opacity-100'
              }`}
            >
              {/* Card Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img
                      src={account.avatar}
                      alt={account.name}
                      className="w-10 h-10 rounded-xl object-cover ring-2 ring-slate-800"
                    />
                    <div 
                      className="w-3.5 h-3.5 rounded-full absolute -bottom-1 -right-1 border-2 border-slate-900 flex items-center justify-center text-[7px] text-white font-bold"
                      style={{ backgroundColor: info.color }}
                    >
                      {info.name.charAt(0)}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
                      {account.name}
                    </h3>
                    <p className="text-[11px] text-slate-400 font-mono">
                      {account.username}
                    </p>
                  </div>
                </div>

                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                    account.connected
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'bg-slate-800 text-slate-400 border border-slate-700'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${account.connected ? 'bg-emerald-400' : 'bg-slate-500'}`} />
                  {account.connected ? 'Conectado' : 'Inativo'}
                </span>
              </div>

              {/* Metrics row */}
              <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/60 mb-4 flex items-center justify-between text-xs text-slate-300">
                <div className="flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-slate-400" />
                  <span className="font-semibold text-white">{account.followers.toLocaleString('pt-BR')}</span>
                  <span className="text-[10px] text-slate-400">seguidores</span>
                </div>
                <div className="text-[10px] text-slate-400">
                  {account.lastSync}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleToggle(account)}
                  className={`w-full py-2 px-3 rounded-xl text-xs font-semibold transition-all ${
                    account.connected
                      ? 'bg-slate-800 hover:bg-rose-500/15 hover:text-rose-400 text-slate-300 border border-slate-700'
                      : 'bg-brand-600 hover:bg-brand-500 text-white shadow-md shadow-brand-600/30'
                  }`}
                >
                  {account.connected ? 'Desconectar Canal' : 'Conectar Conta'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Connect Modal Simulation */}
      <ConnectChannelModal
        account={selectedForConnect}
        onClose={() => setSelectedForConnect(null)}
      />
    </div>
  );
};
