import React, { useState } from 'react';
import { 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw, 
  Plus, 
  ExternalLink, 
  Layers, 
  KeyRound, 
  Lock,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SocialAccount, SocialPlatform } from '../../types';
import { PLATFORM_INFO } from '../../utils/helpers';
import { OAuthModal } from '../channels/OAuthModal';
import { META_APP_ID } from '../../services/metaAuth';

export const AuthorizedChannelsStatus: React.FC = () => {
  const { accounts, setActiveTab } = useApp();
  const [selectedOAuthAccount, setSelectedOAuthAccount] = useState<SocialAccount | null>(null);
  const [isOAuthOpen, setIsOAuthOpen] = useState(false);

  const connectedAccounts = accounts.filter(a => a.connected);
  const activeTokensCount = accounts.filter(a => a.connected && a.tokenStatus === 'active').length;

  const handleOpenOAuth = (account: SocialAccount) => {
    setSelectedOAuthAccount(account);
    setIsOAuthOpen(true);
  };

  return (
    <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-4 sm:p-5 shadow-sm space-y-4">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white tracking-tight">
                Status de Autorização dos Perfis para Agendamento em Lote
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                {activeTokensCount} com Token Ativo
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Canais autorizados via OAuth 2.0 oficial com permissão para receber publicações automáticas e em lote.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('accounts')}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold border border-slate-700 transition-colors flex items-center gap-1.5"
          >
            <span>Gerenciar Conexões</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Grid of Channels */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {accounts.map((account) => {
          const info = PLATFORM_INFO[account.platform];
          const isConnected = account.connected;
          const selectedSubPagesCount = account.subPages?.filter(p => p.selected).length || (isConnected ? 1 : 0);

          return (
            <div
              key={account.id}
              className={`p-3.5 rounded-xl border transition-all flex flex-col justify-between ${
                isConnected
                  ? 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                  : 'bg-slate-950/30 border-slate-800/60 opacity-60 hover:opacity-100'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2.5">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="relative shrink-0">
                      <img
                        src={account.avatar}
                        alt={account.name}
                        className="w-8 h-8 rounded-lg object-cover ring-1 ring-slate-800"
                      />
                      <div 
                        className="w-3 h-3 rounded-full absolute -bottom-1 -right-1 border border-slate-900 flex items-center justify-center text-[7px] text-white font-bold"
                        style={{ backgroundColor: info.color }}
                      >
                        {info.name.charAt(0)}
                      </div>
                    </div>

                    <div className="min-w-0">
                      <div className="text-xs font-bold text-white truncate flex items-center gap-1">
                        <span>{account.name}</span>
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono truncate">
                        {account.username}
                      </div>
                    </div>
                  </div>

                  <span
                    className={`text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shrink-0 ${
                      isConnected
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-slate-800 text-slate-500 border border-slate-700'
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-emerald-400' : 'bg-slate-500'}`} />
                    {isConnected ? 'Pronto p/ Lote' : 'Inativo'}
                  </span>
                </div>

                {/* Sub-pages and Token Status */}
                <div className="space-y-1.5 text-[10px] text-slate-400 mb-3 bg-slate-900/50 p-2 rounded-lg border border-slate-800/60">
                  {(account.platform === 'instagram' || account.platform === 'facebook') && (
                    <div className="flex items-center justify-between pb-1 border-b border-slate-800/80">
                      <span className="text-blue-400 font-semibold">Meta App ID:</span>
                      <span className="font-mono text-[9px] text-slate-300 font-bold">{META_APP_ID}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Páginas Autorizadas:</span>
                    <span className="font-semibold text-slate-300">
                      {isConnected ? `${selectedSubPagesCount} selecionada(s)` : 'Nenhuma'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Validade do Token:</span>
                    <span className={`font-semibold ${isConnected ? 'text-emerald-400' : 'text-slate-500'}`}>
                      {isConnected ? `${account.tokenExpiresInDays || 60} dias restantes` : 'Sem token'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <button
                type="button"
                onClick={() => handleOpenOAuth(account)}
                className={`w-full py-1.5 px-3 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
                  isConnected
                    ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
                    : 'bg-brand-600 hover:bg-brand-500 text-white shadow-sm'
                }`}
              >
                {isConnected ? (
                  <>
                    <KeyRound className="w-3 h-3 text-indigo-400" />
                    <span>Ajustar Páginas / Token</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-3 h-3" />
                    <span>Autorizar Perfil</span>
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>

      {/* OAuth Modal */}
      {isOAuthOpen && selectedOAuthAccount && (
        <OAuthModal
          isOpen={isOAuthOpen}
          initialAccount={selectedOAuthAccount}
          initialPlatform={selectedOAuthAccount.platform}
          onClose={() => {
            setIsOAuthOpen(false);
            setSelectedOAuthAccount(null);
          }}
          onSuccess={() => {
            setIsOAuthOpen(false);
            setSelectedOAuthAccount(null);
          }}
        />
      )}
    </div>
  );
};
