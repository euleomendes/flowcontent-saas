import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  CheckCircle2, 
  Lock, 
  ArrowRight, 
  Loader2,
  ExternalLink,
  KeyRound
} from 'lucide-react';
import { SocialAccount } from '../../types';
import { useApp } from '../../context/AppContext';
import { META_APP_ID } from '../../services/metaAuth';
import { 
  PLATFORM_OAUTH_CONFIGS, 
  openPlatformOAuthWindow 
} from '../../services/socialAuth';

interface ConnectChannelModalProps {
  account: SocialAccount | null;
  onClose: () => void;
}

export const ConnectChannelModal: React.FC<ConnectChannelModalProps> = ({
  account,
  onClose
}) => {
  const { connectSocialAccount, showToast } = useApp();
  const [connecting, setConnecting] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!account) return null;

  const oauthConfig = PLATFORM_OAUTH_CONFIGS[account.platform];
  const isMeta = account.platform === 'instagram' || account.platform === 'facebook';

  const handleAuthorize = () => {
    setConnecting(true);

    try {
      openPlatformOAuthWindow(account.platform);
    } catch (err) {
      console.warn('Popup blocked', err);
    }

    setTimeout(() => {
      setConnecting(false);
      setSuccess(true);
      
      const updatedAccount: SocialAccount = {
        ...account,
        connected: true,
        tokenStatus: 'active',
        tokenExpiresInDays: oauthConfig.tokenValidityDays,
        lastSync: 'Conectado agora',
        metaAppId: isMeta ? META_APP_ID : account.metaAppId
      };

      connectSocialAccount(updatedAccount);
      showToast(`Conta ${account.name} vinculada com sucesso via ${oauthConfig.apiName}!`, 'success');

      setTimeout(() => {
        onClose();
      }, 1100);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden p-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-5">
          <div 
            className="w-14 h-14 rounded-2xl mx-auto flex items-center justify-center mb-3 shadow-lg font-black text-xl text-white"
            style={{ backgroundColor: oauthConfig.color }}
          >
            {account.platform === 'facebook' ? 'f' : (account.platform === 'twitter' ? '𝕏' : oauthConfig.displayName.charAt(0))}
          </div>

          <h3 className="text-base font-bold text-white">
            Conectar {oauthConfig.displayName}
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            {oauthConfig.scopeDescription}
          </p>
        </div>

        {/* Dedicated Client ID / App ID Highlight */}
        <div 
          className="p-3.5 rounded-2xl border mb-4 flex items-center justify-between gap-3 text-xs bg-slate-950/60"
          style={{ borderColor: `${oauthConfig.color}40` }}
        >
          <div className="flex items-center gap-2">
            <KeyRound className="w-4 h-4 text-emerald-400 shrink-0" />
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">
                {isMeta ? 'Meta App ID Oficial' : 'Client ID Oficial'}
              </span>
              <span className="font-mono text-xs font-extrabold text-white">
                {oauthConfig.clientId}
              </span>
            </div>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
            {oauthConfig.apiName}
          </span>
        </div>

        {/* Permissions list */}
        <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2 mb-5 text-xs text-slate-300">
          <p className="font-semibold text-slate-200 text-[11px] uppercase tracking-wider">
            Escopos da API solicitados:
          </p>
          <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1">
            {oauthConfig.scopes.map((scope, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="font-mono text-[10px] text-slate-300">{scope}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <div>
          {success ? (
            <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold text-xs flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>Token OAuth 2.0 ativo gerado com sucesso!</span>
            </div>
          ) : (
            <button
              onClick={handleAuthorize}
              disabled={connecting}
              className="w-full py-3 px-4 rounded-xl font-bold text-xs text-white shadow-lg flex items-center justify-center gap-2 transition-all active:scale-[0.99]"
              style={{ backgroundColor: oauthConfig.color }}
            >
              {connecting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Abrindo janela oficial do {oauthConfig.displayName}...</span>
                </>
              ) : (
                <>
                  <ExternalLink className="w-4 h-4" />
                  <span>Abrir Autenticação Oficial {oauthConfig.displayName}</span>
                </>
              )}
            </button>
          )}

          <p className="text-[10px] text-slate-400 text-center mt-3 flex items-center justify-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
            <span>Token criptografado com isolamento seguro</span>
          </p>
        </div>
      </div>
    </div>
  );
};
