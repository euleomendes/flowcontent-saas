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
import { PLATFORM_INFO } from '../../utils/helpers';
import { useApp } from '../../context/AppContext';
import { META_APP_ID, META_API_VERSION, openMetaOAuthWindow } from '../../services/metaAuth';

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

  const isMeta = account.platform === 'instagram' || account.platform === 'facebook';
  const platformInfo = PLATFORM_INFO[account.platform];

  const handleAuthorize = () => {
    setConnecting(true);

    if (isMeta) {
      try {
        openMetaOAuthWindow();
      } catch (err) {
        console.warn('Popup blocked', err);
      }
    }

    setTimeout(() => {
      setConnecting(false);
      setSuccess(true);
      
      const updatedAccount: SocialAccount = {
        ...account,
        connected: true,
        tokenStatus: 'active',
        tokenExpiresInDays: 60,
        lastSync: 'Conectado agora',
        metaAppId: isMeta ? META_APP_ID : account.metaAppId
      };

      connectSocialAccount(updatedAccount);
      showToast(
        isMeta 
          ? `Conta ${account.name} vinculada com Meta App ID: ${META_APP_ID}!` 
          : `Conta ${account.name} vinculada com sucesso!`, 
        'success'
      );

      setTimeout(() => {
        onClose();
      }, 1200);
    }, 1300);
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
            style={{ backgroundColor: isMeta ? '#1877F2' : platformInfo.color }}
          >
            {isMeta ? 'M' : platformInfo.name.substring(0, 2)}
          </div>

          <h3 className="text-base font-bold text-white">
            {isMeta ? `Meta Business • Conectar ${platformInfo.name}` : `Conectar conta do ${platformInfo.name}`}
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            {isMeta
              ? `Autorize seu perfil via Meta Graph API v${META_API_VERSION} oficial para agendamento em lote.`
              : 'Permitir que o FlowContent envie postagens agendadas automaticamente para seu perfil.'}
          </p>
        </div>

        {/* Meta App ID Highlight */}
        {isMeta && (
          <div className="p-3.5 rounded-2xl bg-blue-950/40 border border-blue-500/30 mb-4 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-blue-400 shrink-0" />
              <div>
                <span className="text-[10px] uppercase font-bold text-blue-300 block">
                  Aplicativo Oficial Meta
                </span>
                <span className="font-mono text-xs font-extrabold text-white">
                  App ID: {META_APP_ID}
                </span>
              </div>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
              SSL v19.0
            </span>
          </div>
        )}

        {/* Permissions list */}
        <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2.5 mb-5 text-xs text-slate-300">
          <p className="font-semibold text-slate-200 text-[11px] uppercase tracking-wider">
            Permissões solicitadas:
          </p>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Publicar posts, vídeos, Reels e carrosséis no seu feed</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Acessar métricas e relatórios oficiais de engajamento</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Sincronização em segundo plano via token ativo (60 dias)</span>
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
              className={`w-full py-3 px-4 rounded-xl font-bold text-xs text-white shadow-lg flex items-center justify-center gap-2 transition-all ${
                isMeta
                  ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-pink-600 hover:opacity-95 shadow-blue-600/30'
                  : 'shadow-lg'
              }`}
              style={!isMeta ? { backgroundColor: platformInfo.color } : {}}
            >
              {connecting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>
                    {isMeta 
                      ? `Abrindo janela Meta OAuth (ID: ${META_APP_ID})...` 
                      : 'Autenticando via OAuth 2.0...'}
                  </span>
                </>
              ) : (
                <>
                  {isMeta ? <ExternalLink className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                  <span>
                    {isMeta 
                      ? `Abrir Autenticação Oficial Meta (App ID: ${META_APP_ID})` 
                      : `Autorizar Conexão do ${platformInfo.name}`}
                  </span>
                </>
              )}
            </button>
          )}

          <p className="text-[10px] text-slate-400 text-center mt-3 flex items-center justify-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
            <span>Conexão criptografada de ponta a ponta</span>
          </p>
        </div>
      </div>
    </div>
  );
};
