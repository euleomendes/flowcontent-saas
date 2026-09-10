import React, { useState } from 'react';
import { 
  Share2, 
  CheckCircle2, 
  XCircle, 
  RefreshCw, 
  ExternalLink, 
  ShieldCheck, 
  Users, 
  Plus,
  KeyRound,
  Lock,
  Layers,
  Check,
  Building2,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SocialAccount, SocialPlatform } from '../../types';
import { PLATFORM_INFO } from '../../utils/helpers';
import { OAuthModal } from './OAuthModal';

export const AccountsManager: React.FC = () => {
  const { accounts, disconnectSocialAccount, showToast } = useApp();
  const [selectedForOAuth, setSelectedForOAuth] = useState<SocialAccount | null>(null);
  const [filter, setFilter] = useState<'all' | 'active' | 'available'>('all');
  const [isConnectNewOpen, setIsConnectNewOpen] = useState(false);

  const handleDisconnect = (account: SocialAccount) => {
    if (window.confirm(`Deseja revogar o token e desconectar a conta ${account.name} e suas páginas autorizadas?`)) {
      disconnectSocialAccount(account.id);
    }
  };

  const filteredAccounts = accounts.filter(acc => {
    if (filter === 'active') return acc.connected && acc.tokenStatus === 'active';
    if (filter === 'available') return !acc.connected;
    return true;
  });

  const totalSubPages = accounts.reduce((acc, a) => {
    return acc + (a.subPages?.filter(p => p.selected).length || (a.connected ? 1 : 0));
  }, 0);

  const activeTokensCount = accounts.filter(a => a.connected && a.tokenStatus === 'active').length;

  return (
    <div className="animate-fade-in space-y-6">
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-brand-900/40 via-indigo-900/20 to-slate-900 border border-brand-500/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-brand-500/20 text-brand-300 border border-brand-500/30">
              Autenticação OAuth 2.0 Oficial
            </span>
            <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Criptografia AES-256
            </span>
          </div>
          <h2 className="text-xl font-bold text-white mt-1.5">
            Gerenciamento de Redes Sociais & Contas Autorizadas
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Conecte suas páginas comerciais e perfis de criador via OAuth para permitir disparos de agendamento em lote com sincronização oficial e persistência garantida.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-sm font-black text-white">
              {activeTokensCount} / {accounts.length}
            </div>
            <div className="text-[11px] text-slate-400">Tokens ativos ({totalSubPages} páginas vinculadas)</div>
          </div>

          <button
            type="button"
            onClick={() => setIsConnectNewOpen(true)}
            className="py-2.5 px-4 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-lg shadow-brand-600/30 flex items-center gap-2 transition-all shrink-0"
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
            Todas as Redes ({accounts.length})
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
            Tokens Ativos ({activeTokensCount})
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
            Disponíveis para Conectar ({accounts.length - activeTokensCount})
          </button>
        </div>
      </div>

      {/* Grid of Accounts */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAccounts.map((account) => {
          const info = PLATFORM_INFO[account.platform];
          const isConnected = account.connected;
          const selectedSubPages = account.subPages?.filter(p => p.selected) || [];

          return (
            <div
              key={account.id}
              className={`p-5 rounded-3xl border transition-all flex flex-col justify-between ${
                isConnected
                  ? 'bg-slate-900/90 border-slate-700/80 shadow-md'
                  : 'bg-slate-950/40 border-slate-800/80 opacity-70 hover:opacity-100'
              }`}
            >
              <div>
                {/* Card Header */}
                <div className="flex items-start justify-between mb-3.5">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img
                        src={account.avatar}
                        alt={account.name}
                        className="w-11 h-11 rounded-2xl object-cover ring-2 ring-slate-800 shadow-sm"
                      />
                      <div 
                        className="w-4 h-4 rounded-full absolute -bottom-1 -right-1 border-2 border-slate-900 flex items-center justify-center text-[8px] text-white font-bold shadow"
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
                      isConnected
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-slate-800 text-slate-400 border border-slate-700'
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-emerald-400' : 'bg-slate-500'}`} />
                    {isConnected ? 'Autorizado' : 'Inativo'}
                  </span>
                </div>

                {/* Token status & expiration badge */}
                <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800/80 mb-3.5 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-slate-400 flex items-center gap-1">
                      <KeyRound className="w-3.5 h-3.5 text-brand-400" />
                      Status do Token:
                    </span>
                    <span className={`text-[11px] font-bold ${isConnected ? 'text-emerald-400' : 'text-slate-500'}`}>
                      {isConnected ? `Ativo • Expira em ${account.tokenExpiresInDays || 60}d` : 'Revogado'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-400 flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-slate-500" />
                      Seguidores totais:
                    </span>
                    <span className="font-bold text-white">
                      {account.followers.toLocaleString('pt-BR')}
                    </span>
                  </div>
                </div>

                {/* Authorized Sub-Pages List */}
                {isConnected && account.subPages && account.subPages.length > 0 && (
                  <div className="mb-4 space-y-1.5">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-400 font-semibold">Páginas Autorizadas:</span>
                      <span className="text-brand-400 font-mono text-[10px]">
                        {selectedSubPages.length} vinculada(s)
                      </span>
                    </div>

                    <div className="space-y-1 max-h-28 overflow-y-auto pr-1">
                      {account.subPages.map((sub) => (
                        <div
                          key={sub.id}
                          className={`p-2 rounded-xl text-[11px] flex items-center justify-between border ${
                            sub.selected
                              ? 'bg-slate-950/60 border-slate-800 text-slate-200'
                              : 'bg-slate-950/20 border-slate-900 text-slate-500 line-through'
                          }`}
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <img src={sub.avatar} alt={sub.name} className="w-5 h-5 rounded-md object-cover shrink-0" />
                            <span className="truncate font-medium">{sub.name}</span>
                          </div>
                          {sub.selected && (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Permissions Chips */}
                {isConnected && account.authorizedPermissions && account.authorizedPermissions.length > 0 && (
                  <div className="mb-4 flex flex-wrap gap-1">
                    {account.authorizedPermissions.slice(0, 2).map((perm, idx) => (
                      <span
                        key={idx}
                        className="text-[9px] font-mono px-2 py-0.5 rounded-lg bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 truncate max-w-[200px]"
                      >
                        {perm}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 pt-2 border-t border-slate-800/80">
                {isConnected ? (
                  <>
                    <button
                      type="button"
                      onClick={() => setSelectedForOAuth(account)}
                      className="flex-1 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Layers className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Gerenciar Páginas</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDisconnect(account)}
                      title="Desconectar e revogar token"
                      className="p-2 rounded-xl bg-slate-800/80 hover:bg-rose-500/15 hover:text-rose-400 text-slate-400 border border-slate-700 transition-colors"
                    >
                      <XCircle className="w-4 h-4" />
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => setSelectedForOAuth(account)}
                    className="w-full py-2.5 px-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-md shadow-brand-600/30 flex items-center justify-center gap-1.5 transition-all"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>Conectar via OAuth 2.0</span>
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

      {/* Connect New Channel Modal */}
      {isConnectNewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl">
            <h3 className="text-base font-bold text-white mb-2">
              Escolha a rede social para autorizar
            </h3>
            <p className="text-xs text-slate-400 mb-5">
              Selecione qual canal você deseja vincular através do protocolo oficial de autenticação:
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
                    className="p-3 rounded-2xl bg-slate-950 border border-slate-800 hover:border-brand-500/50 transition-all flex items-center gap-2.5 text-left group"
                  >
                    <div 
                      className="w-8 h-8 rounded-xl flex items-center justify-center font-bold text-white shadow-sm text-xs shrink-0 group-hover:scale-105 transition-transform"
                      style={{ backgroundColor: info.color }}
                    >
                      {info.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-white truncate">{info.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono">
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
