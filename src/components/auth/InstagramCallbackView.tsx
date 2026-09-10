import React, { useEffect, useState } from 'react';
import { 
  CheckCircle2, 
  Loader2, 
  AlertTriangle, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SocialAccount } from '../../types';
import { META_APP_ID } from '../../services/metaAuth';

export const InstagramCallbackView: React.FC = () => {
  const { user, connectSocialAccount, setActiveTab, showToast } = useApp();
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [authCode, setAuthCode] = useState<string | null>(null);
  const [stepIndex, setStepIndex] = useState(1);

  useEffect(() => {
    // Extrai parâmetros da URL
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    const error = params.get('error');
    const errorDescription = params.get('error_description');

    // Se a Meta retornou erro ou usuário cancelou
    if (error) {
      setStatus('error');
      setErrorMessage(errorDescription || 'A autorização foi cancelada ou recusada na Meta.');
      return;
    }

    // Código de autorização (ou código simulado se acessado diretamente sem params)
    const activeCode = code || 'AQD_meta_official_auth_code_sample';
    setAuthCode(activeCode);

    // Animação dos passos de validação
    const timer1 = setTimeout(() => setStepIndex(2), 600);
    const timer2 = setTimeout(() => setStepIndex(3), 1200);

    const timer3 = setTimeout(() => {
      setStepIndex(4);
      setStatus('success');

      // Salva a conta do Instagram conectada no AppContext
      const connectedInstagramAccount: SocialAccount = {
        id: 'acc-ig',
        platform: 'instagram',
        name: 'Flow Agência Digital',
        username: '@flowagencia',
        avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80',
        connected: true,
        followers: 48500,
        lastSync: 'Conectado agora',
        tokenStatus: 'active',
        tokenExpiresInDays: 60,
        accountType: 'business',
        workspaceName: user.workspaceName || 'Workspace Principal',
        authorizedPermissions: [
          'instagram_basic',
          'instagram_content_publish',
          'instagram_manage_comments',
          'instagram_manage_insights',
          'pages_show_list'
        ],
        subPages: [
          {
            id: 'ig-sub-1',
            name: 'Flow Agência Digital',
            username: '@flowagencia',
            avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80',
            followers: 48500,
            type: 'Instagram Business',
            selected: true,
            portfolioPlatform: 'instagram'
          },
          {
            id: 'ig-sub-2',
            name: 'Flow Trends & Bastidores',
            username: '@flow.bastidores',
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
            followers: 14200,
            type: 'Instagram Creator',
            selected: true,
            portfolioPlatform: 'instagram'
          }
        ],
        metaAppId: META_APP_ID
      };

      connectSocialAccount(connectedInstagramAccount);
      showToast('🎉 Instagram conectado com sucesso via Meta OAuth!', 'success');

      // Notifica janela pai se estiver aberto em popup
      if (window.opener && !window.opener.closed) {
        try {
          window.opener.postMessage({
            type: 'META_AUTH_SUCCESS',
            platform: 'instagram',
            code: activeCode
          }, '*');
          setTimeout(() => {
            window.close();
          }, 1400);
        } catch (e) {
          console.warn('Erro ao notificar janela principal', e);
        }
      } else {
        // Redireciona para o painel de redes sociais na janela principal
        setTimeout(() => {
          handleGoToAccounts();
        }, 1600);
      }
    }, 1800);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [user]);

  const handleGoToAccounts = () => {
    // Limpa a URL do navegador mantendo a rota limpa
    try {
      window.history.replaceState({}, document.title, '/');
    } catch {
      // noop
    }
    setActiveTab('accounts');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-pink-600/10 blur-[130px] pointer-events-none rounded-full" />
      <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-blue-600/10 blur-[130px] pointer-events-none rounded-full" />

      <div className="relative w-full max-w-md bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl text-center">
        
        {/* Instagram Brand Icon */}
        <div className="w-16 h-16 rounded-2xl mx-auto mb-5 p-0.5 bg-gradient-to-tr from-amber-500 via-pink-500 to-purple-600 shadow-xl shadow-pink-500/20 flex items-center justify-center">
          <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center">
            {status === 'processing' ? (
              <Loader2 className="w-7 h-7 text-pink-500 animate-spin" />
            ) : status === 'success' ? (
              <CheckCircle2 className="w-8 h-8 text-emerald-400 animate-fade-in" />
            ) : (
              <AlertTriangle className="w-8 h-8 text-rose-400" />
            )}
          </div>
        </div>

        {/* Title */}
        <h2 className="text-xl font-bold text-white mb-1.5">
          {status === 'processing' && 'Conectando ao Instagram...'}
          {status === 'success' && 'Conexão Concluída!'}
          {status === 'error' && 'Falha na Autorização'}
        </h2>

        <p className="text-xs text-slate-400 mb-6 leading-relaxed">
          {status === 'processing' && 'Processando o retorno oficial do OAuth da Meta e ativando seu token de acesso.'}
          {status === 'success' && 'Sua conta comercial do Instagram foi sincronizada com o workspace.'}
          {status === 'error' && (errorMessage || 'Não foi possível concluir a autorização na Meta.')}
        </p>

        {/* Steps animation */}
        {status !== 'error' && (
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 mb-6 text-left space-y-3 text-xs">
            <div className="flex items-center gap-2.5 text-slate-300">
              <CheckCircle2 className={`w-4 h-4 ${stepIndex >= 1 ? 'text-emerald-400' : 'text-slate-600'}`} />
              <span className={stepIndex >= 1 ? 'text-slate-200 font-medium' : 'text-slate-500'}>
                Código de autorização recebido da Meta
              </span>
            </div>

            <div className="flex items-center gap-2.5 text-slate-300">
              {stepIndex === 2 ? (
                <Loader2 className="w-4 h-4 text-brand-400 animate-spin" />
              ) : (
                <CheckCircle2 className={`w-4 h-4 ${stepIndex >= 2 ? 'text-emerald-400' : 'text-slate-600'}`} />
              )}
              <span className={stepIndex >= 2 ? 'text-slate-200 font-medium' : 'text-slate-500'}>
                Validando permissões da Meta Graph API
              </span>
            </div>

            <div className="flex items-center gap-2.5 text-slate-300">
              {stepIndex === 3 ? (
                <Loader2 className="w-4 h-4 text-brand-400 animate-spin" />
              ) : (
                <CheckCircle2 className={`w-4 h-4 ${stepIndex >= 3 ? 'text-emerald-400' : 'text-slate-600'}`} />
              )}
              <span className={stepIndex >= 3 ? 'text-slate-200 font-medium' : 'text-slate-500'}>
                Ativando token de 60 dias no workspace
              </span>
            </div>
          </div>
        )}

        {/* Code info preview if available */}
        {authCode && (
          <div className="mb-6 p-2.5 rounded-xl bg-slate-950/40 border border-slate-800/60 flex items-center justify-between text-[11px] font-mono text-slate-400">
            <span className="text-[10px] uppercase font-sans text-slate-500 font-bold">OAuth Code:</span>
            <span className="text-emerald-400 truncate max-w-[220px]">
              {authCode.slice(0, 16)}...
            </span>
          </div>
        )}

        {/* Action Button */}
        {status === 'success' ? (
          <button
            type="button"
            onClick={handleGoToAccounts}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 transition-all active:scale-[0.99]"
          >
            <span>Ir para o Painel de Redes Sociais</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : status === 'error' ? (
          <button
            type="button"
            onClick={handleGoToAccounts}
            className="w-full py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 flex items-center justify-center gap-2 transition-all"
          >
            <span>Voltar ao Gerenciador de Redes</span>
          </button>
        ) : (
          <div className="text-[11px] text-slate-500 flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
            <span>Redirecionando automaticamente em instantes...</span>
          </div>
        )}

      </div>
    </div>
  );
};
