import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  CheckCircle2, 
  Lock, 
  ArrowRight, 
  Loader2 
} from 'lucide-react';
import { SocialAccount } from '../../types';
import { PLATFORM_INFO } from '../../utils/helpers';
import { useApp } from '../../context/AppContext';

interface ConnectChannelModalProps {
  account: SocialAccount | null;
  onClose: () => void;
}

export const ConnectChannelModal: React.FC<ConnectChannelModalProps> = ({
  account,
  onClose
}) => {
  const { toggleAccountConnection, showToast } = useApp();
  const [connecting, setConnecting] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!account) return null;

  const platformInfo = PLATFORM_INFO[account.platform];

  const handleAuthorize = () => {
    setConnecting(true);
    setTimeout(() => {
      setConnecting(false);
      setSuccess(true);
      toggleAccountConnection(account.id);
      showToast(`Conta ${account.name} vinculada com sucesso!`, 'success');
      setTimeout(() => {
        onClose();
      }, 1000);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden p-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl mx-auto flex items-center justify-center mb-3 shadow-lg"
            style={{ backgroundColor: `${platformInfo.color}20`, color: platformInfo.color }}
          >
            <span className="text-xl font-bold">{platformInfo.name.substring(0, 2)}</span>
          </div>

          <h3 className="text-base font-bold text-white">
            Conectar conta do {platformInfo.name}
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Permitir que o FlowContent envie postagens agendadas automaticamente para seu perfil
          </p>
        </div>

        {/* Permissions list */}
        <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2.5 mb-6 text-xs text-slate-300">
          <p className="font-semibold text-slate-200 text-[11px] uppercase tracking-wider">
            Permissões solicitadas:
          </p>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Publicar posts, imagens e carrosséis no seu feed</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Acessar métricas e relatórios de engajamento</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Sincronização em segundo plano via token oficial</span>
          </div>
        </div>

        {/* Action Button */}
        <div>
          {success ? (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold text-xs flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>Autenticação autorizada com sucesso!</span>
            </div>
          ) : (
            <button
              onClick={handleAuthorize}
              disabled={connecting}
              className="w-full py-2.5 px-4 rounded-xl font-bold text-xs text-white shadow-lg flex items-center justify-center gap-2 transition-all"
              style={{ backgroundColor: platformInfo.color }}
            >
              {connecting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Autenticando via OAuth 2.0...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Autorizar Conexão do {platformInfo.name}</span>
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
