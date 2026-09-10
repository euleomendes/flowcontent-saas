import React, { useState } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  ExternalLink, 
  Users, 
  Plus,
  Layers,
  Settings,
  ArrowRight,
  Sparkles,
  Link2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SocialAccount, SocialPlatform } from '../../types';
import { PLATFORM_INFO } from '../../utils/helpers';
import { OAuthModal } from './OAuthModal';

export const AccountsManager: React.FC = () => {
  const { accounts, disconnectSocialAccount } = useApp();
  const [selectedForOAuth, setSelectedForOAuth] = useState<SocialAccount | null>(null);
  const [filter, setFilter] = useState<'all' | 'active' | 'available'>('all');
  const [isConnectNewOpen, setIsConnectNewOpen] = useState(false);

  const handleDisconnect = (account: SocialAccount) => {
    const info = PLATFORM_INFO[account.platform];
    if (window.confirm(`Tem certeza que deseja desconectar o ${info.name} (${account.name})?`)) {
      disconnectSocialAccount(account.id);
    }
  };

  const filteredAccounts = accounts.filter(acc => {
    if (filter === 'active') return acc.connected && acc.tokenStatus === 'active';
    if (filter === 'available') return !acc.connected;
    return true;
  });

  const connectedCount = accounts.filter(a => a.connected && a.tokenStatus === 'active').length;

  return (
    <div className="animate-fade-in space-y-6">
      {/* Top Header */}
      <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-brand-500/15 text-brand-400 border border-brand-500/20">
              Canais & Perfis
            </span>
            <span className="text-xs text-slate-400">
              {connectedCount} de {accounts.length} redes conectadas
            </span>
          </div>
          <h2 className="text-xl font-bold text-white mt-1.5">
            Redes Sociais
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Conecte suas contas para habilitar a fila de agendamento automático e disparos de conteúdo em lote.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsConnectNewOpen(true)}
            className="py-2.5 px-4 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs shadow-md shadow-brand-600/20 flex items-center gap-2 transition-all active:scale-[0.99]"
          >
            <Plus className="w-4 h-4" />
            <span>Conectar Nova Rede</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              filter === 'all'
                ? 'bg-slate-800 text-white border border-slate-700'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Todas ({accounts.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter('active')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              filter === 'active'
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Conectadas ({connectedCount})
          </button>
          <button
            type="button"
            onClick={() => setFilter('available')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              filter === 'available'
                ? 'bg-slate-800 text-slate-200 border border-slate-700'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Desconectadas ({accounts.length - connectedCount})
          </button>
        </div>
      </div>

      {/* Grid of Clean Minimalist Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAccounts.map((account) => {
          const info = PLATFORM_INFO[account.platform];
          const isConnected = account.connected && account.tokenStatus === 'active';
          const selectedSubPages = account.subPages?.filter(p => p.selected) || [];

          return (
            <div
              key={account.id}
              className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                isConnected
                  ? 'bg-slate-900/90 border-slate-700/80 shadow-md'
                  : 'bg-slate-950/40 border-slate-800/80 hover:border-slate-700'
              }`}
            >
              <div>
                {/* Header: Platform Info + Status */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img
                        src={account.avatar}
                        alt={account.name}
                        className="w-12 h-12 rounded-xl object-cover ring-1 ring-slate-800"
                      />
                      <div 
                        className="w-4 h-4 rounded-full absolute -bottom-1 -right-1 border-2 border-slate-900 flex items-center justify-center text-[8px] text-white font-bold shadow"
                        style={{ backgroundColor: info.color }}
                      >
                        {account.platform === 'facebook' ? 'f' : (account.platform === 'twitter' ? '𝕏' : info.name.charAt(0))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-bold text-white leading-tight">
                        {info.name}
                      </h3>
                      <p className="text-xs text-slate-300 font-medium truncate max-w-[160px]">
                        {account.name}
                      </p>
                      <p className="text-[11px] text-slate-500 font-mono truncate max-w-[160px]">
                        {account.username}
                      </p>
                    </div>
                  </div>

                  {/* Status Pill */}
                  <span
                    className={`text-[11px] font-semibold px-2.5 py-1 rounded-full flex items-center gap-1.5 shrink-0 ${
                      isConnected
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-slate-800/80 text-slate-400 border border-slate-700/60'
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-emerald-400' : 'bg-slate-500'}`} />
                    {isConnected ? 'Conectado' : 'Desconectado'}
                  </span>
                </div>

                {/* Account Details / Stats */}
                <div className="py-2.5 px-3 rounded-xl bg-slate-950/60 border border-slate-800/80 mb-4 text-xs">
                  {isConnected ? (
                    <div className="flex items-center justify-between text-slate-300">
                      <span className="flex items-center gap-1.5 text-slate-400">
                        <Users className="w-3.5 h-3.5 text-slate-500" />
                        {account.followers.toLocaleString('pt-BR')} seguidores
                      </span>
                      {selectedSubPages.length > 0 && (
                        <span className="text-[11px] text-brand-400 font-medium">
                          {selectedSubPages.length} {selectedSubPages.length === 1 ? 'página' : 'páginas'}
                        </span>
                      )}
                    </div>
                  ) : (
                    <p className="text-slate-400 text-[11px]">
                      Conecte sua conta para agendar postagens automáticas no feed e stories.
                    </p>
                  )}
                </div>

                {/* Sub-pages pill list (if connected) */}
                {isConnected && selectedSubPages.length > 0 && (
                  <div className="mb-4 flex flex-wrap gap-1.5">
                    {selectedSubPages.map(sub => (
                      <span
                        key={sub.id}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-slate-800 text-[10px] text-slate-300 border border-slate-700/80 max-w-[180px] truncate"
                      >
                        <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                        <span className="truncate">{sub.name}</span>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-800/80 flex items-center gap-2">
                {isConnected ? (
                  <>
                    <button
                      type="button"
                      onClick={() => setSelectedForOAuth(account)}
                      className="flex-1 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Settings className="w-3.5 h-3.5 text-slate-400" />
                      <span>Gerenciar</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDisconnect(account)}
                      title="Desconectar conta"
                      className="py-2 px-3 rounded-xl bg-slate-800/50 hover:bg-rose-500/15 hover:text-rose-400 text-slate-400 border border-slate-700/80 text-xs font-semibold transition-colors flex items-center justify-center gap-1"
                    >
                      <span>Desconectar</span>
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => setSelectedForOAuth(account)}
                    className="w-full py-2.5 px-4 rounded-xl text-white font-bold text-xs shadow-sm flex items-center justify-center gap-2 transition-all active:scale-[0.99] hover:opacity-95"
                    style={{ backgroundColor: info.color }}
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Conectar {info.name}</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* OAuth Modal */}
      {selectedForOAuth && (
        <OAuthModal
          isOpen={!!selectedForOAuth}
          initialAccount={selectedForOAuth}
          initialPlatform={selectedForOAuth.platform}
          onClose={() => setSelectedForOAuth(null)}
          onSuccess={() => setSelectedForOAuth(null)}
        />
      )}

      {/* Quick Connect Modal */}
      {isConnectNewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl">
            <h3 className="text-base font-bold text-white mb-1">
              Conectar Rede Social
            </h3>
            <p className="text-xs text-slate-400 mb-5">
              Selecione qual plataforma você deseja autorizar para agendamento:
            </p>

            <div className="grid grid-cols-2 gap-3 mb-6">
              {accounts.map(acc => {
                const info = PLATFORM_INFO[acc.platform];
                return (
                  <button
                    key={acc.id}
                    type="button"
                    onClick={() => {
                      setIsConnectNewOpen(false);
                      setSelectedForOAuth(acc);
                    }}
                    className="p-3 rounded-2xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition-all flex items-center gap-2.5 text-left group hover:scale-[1.02]"
                  >
                    <div 
                      className="w-8 h-8 rounded-xl flex items-center justify-center font-bold text-white shadow-sm text-xs shrink-0"
                      style={{ backgroundColor: info.color }}
                    >
                      {acc.platform === 'facebook' ? 'f' : (acc.platform === 'twitter' ? '𝕏' : info.name.charAt(0))}
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-white truncate">{info.name}</div>
                      <div className="text-[10px] text-slate-400">
                        {acc.connected ? '🟢 Conectado' : '⚪ Conectar'}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => setIsConnectNewOpen(false)}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs border border-slate-700 transition-colors"
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
