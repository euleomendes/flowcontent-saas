import React, { useState, useEffect } from 'react';
import { 
  Plus,
  Settings,
  XCircle,
  ExternalLink,
  CheckCircle2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SocialAccount } from '../../types';
import { PLATFORM_INFO } from '../../utils/helpers';
import { OAuthModal } from './OAuthModal';
import { META_APP_ID } from '../../services/metaAuth';

export const AccountsManager: React.FC = () => {
  const { accounts, disconnectSocialAccount, connectSocialAccount, user } = useApp();
  const [selectedForOAuth, setSelectedForOAuth] = useState<SocialAccount | null>(null);
  const [filter, setFilter] = useState<'all' | 'active' | 'available'>('all');
  const [isConnectNewOpen, setIsConnectNewOpen] = useState(false);
  const [oauthNotice, setOauthNotice] = useState<string | null>(null);

  // Lê código ou token de autorização diretamente da URL ao retornar do OAuth da Meta
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const params = new URLSearchParams(window.location.search);
    const hash = window.location.hash;
    const code = params.get('code');
    const token = params.get('access_token') || (hash.includes('access_token=') ? new URLSearchParams(hash.replace(/^#/, '')).get('access_token') : null);
    const state = params.get('state');

    if (code || token) {
      const isFB = state === 'facebook';
      const targetPlatform = isFB ? 'facebook' : 'instagram';
      const targetName = isFB ? 'Página Oficial do Facebook' : 'Flow Agência Digital';

      connectSocialAccount({
        id: isFB ? 'acc-fb' : 'acc-ig',
        platform: targetPlatform,
        name: targetName,
        username: isFB ? 'flowagencia.fb' : '@flowagencia',
        avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80',
        connected: true,
        followers: 48500,
        lastSync: 'Conectado agora',
        tokenStatus: 'active',
        tokenExpiresInDays: 60,
        accountType: isFB ? 'page' : 'business',
        workspaceName: user.workspaceName || 'Workspace Principal',
        metaAppId: META_APP_ID
      });

      setOauthNotice(`Conta ${targetName} conectada com sucesso via Meta OAuth (App ID: ${META_APP_ID})!`);

      try {
        window.history.replaceState({}, document.title, window.location.pathname);
      } catch {
        // noop
      }

      const timer = setTimeout(() => {
        setOauthNotice(null);
      }, 7000);
      return () => clearTimeout(timer);
    }
  }, [user]);

  const handleDisconnect = (account: SocialAccount) => {
    const info = PLATFORM_INFO[account.platform];
    if (window.confirm(`Deseja desconectar o ${info.name} (${account.name})?`)) {
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
    <div className="animate-fade-in space-y-5">
      {/* OAuth Success Notification Banner */}
      {oauthNotice && (
        <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-between gap-3 text-xs text-emerald-300 animate-fade-in shadow-sm">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="font-medium">{oauthNotice}</span>
          </div>
          <button
            type="button"
            onClick={() => setOauthNotice(null)}
            className="text-slate-400 hover:text-white text-xs px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700 transition-colors"
          >
            OK
          </button>
        </div>
      )}

      {/* Header Bar */}
      <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-lg font-bold text-white">
              Redes Sociais
            </h2>
            <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
              {connectedCount} de {accounts.length} conectadas
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Conecte suas contas para habilitar a fila de agendamento em lote.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsConnectNewOpen(true)}
          className="py-2 px-3.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs shadow-sm flex items-center gap-1.5 transition-all self-start sm:self-auto active:scale-[0.99]"
        >
          <Plus className="w-4 h-4" />
          <span>Conectar Rede</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 text-xs">
        <button
          type="button"
          onClick={() => setFilter('all')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
            filter === 'all'
              ? 'bg-slate-800 text-white'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Todas ({accounts.length})
        </button>
        <button
          type="button"
          onClick={() => setFilter('active')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
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
          className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
            filter === 'available'
              ? 'bg-slate-800 text-slate-200'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Desconectadas ({accounts.length - connectedCount})
        </button>
      </div>

      {/* Ultra-minimalist Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {filteredAccounts.map((account) => {
          const info = PLATFORM_INFO[account.platform];
          const isConnected = account.connected && account.tokenStatus === 'active';

          return (
            <div
              key={account.id}
              className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                isConnected
                  ? 'bg-slate-900/90 border-slate-800 hover:border-slate-700 shadow-sm'
                  : 'bg-slate-950/40 border-slate-800/80 hover:border-slate-700'
              }`}
            >
              {/* Card Main: Logo + Name + Status */}
              <div className="flex items-center justify-between gap-3 mb-3.5">
                <div className="flex items-center gap-3 min-w-0">
                  <div 
                    className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white shadow-sm text-sm shrink-0"
                    style={{ backgroundColor: info.color }}
                  >
                    {account.platform === 'facebook' ? 'f' : (account.platform === 'twitter' ? '𝕏' : info.name.charAt(0))}
                  </div>

                  <div className="min-w-0">
                    <h3 className="text-xs font-bold text-white truncate">
                      {info.name}
                    </h3>
                    <p className="text-[11px] text-slate-400 font-medium truncate">
                      {isConnected ? (account.username || account.name) : 'Nenhuma conta'}
                    </p>
                  </div>
                </div>

                {/* Status Badge */}
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1.5 shrink-0 ${
                    isConnected
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'bg-slate-800/80 text-slate-400 border border-slate-700/60'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-emerald-400' : 'bg-slate-500'}`} />
                  {isConnected ? 'Conectado' : 'Desconectado'}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-2.5 border-t border-slate-800/70">
                {isConnected ? (
                  <>
                    <button
                      type="button"
                      onClick={() => setSelectedForOAuth(account)}
                      className="flex-1 py-1.5 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-medium text-xs border border-slate-700 transition-colors flex items-center justify-center gap-1"
                    >
                      <span>Gerenciar</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDisconnect(account)}
                      className="py-1.5 px-2.5 rounded-lg bg-slate-800/40 hover:bg-rose-500/15 hover:text-rose-400 text-slate-400 border border-slate-700/80 text-xs transition-colors"
                    >
                      Desconectar
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => setSelectedForOAuth(account)}
                    className="w-full py-1.5 px-3 rounded-lg text-white font-semibold text-xs shadow-sm flex items-center justify-center gap-1.5 transition-all active:scale-[0.99] hover:opacity-95"
                    style={{ backgroundColor: info.color }}
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Conectar</span>
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
          <div className="relative w-full max-w-sm bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-2xl">
            <h3 className="text-sm font-bold text-white mb-1">
              Conectar Rede Social
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Escolha qual plataforma vincular:
            </p>

            <div className="grid grid-cols-2 gap-2.5 mb-4">
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
                    className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition-all flex items-center gap-2 text-left group"
                  >
                    <div 
                      className="w-7 h-7 rounded-lg flex items-center justify-center font-bold text-white shadow-sm text-xs shrink-0"
                      style={{ backgroundColor: info.color }}
                    >
                      {acc.platform === 'facebook' ? 'f' : (acc.platform === 'twitter' ? '𝕏' : info.name.charAt(0))}
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-white truncate">{info.name}</div>
                      <div className="text-[10px] text-slate-400">
                        {acc.connected ? 'Conectado' : 'Conectar'}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => setIsConnectNewOpen(false)}
              className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs border border-slate-700 transition-colors"
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
