import React, { useState, useEffect } from 'react';
import { 
  X, 
  ShieldCheck, 
  CheckCircle2, 
  Lock, 
  ArrowRight, 
  Loader2, 
  Check, 
  ExternalLink, 
  Info, 
  Sparkles, 
  AlertCircle,
  Building2,
  UserCheck,
  KeyRound
} from 'lucide-react';
import { SocialAccount, SocialPlatform, SocialSubPage } from '../../types';
import { PLATFORM_INFO } from '../../utils/helpers';
import { DISCOVERED_OAUTH_PAGES } from '../../data/mockData';
import { useApp } from '../../context/AppContext';

interface OAuthModalProps {
  isOpen: boolean;
  initialAccount?: SocialAccount | null;
  initialPlatform?: SocialPlatform;
  onClose: () => void;
  onSuccess?: (account: SocialAccount) => void;
}

export const OAuthModal: React.FC<OAuthModalProps> = ({
  isOpen,
  initialAccount,
  initialPlatform,
  onClose,
  onSuccess
}) => {
  const { user, connectSocialAccount, updateAccountSubPages, showToast } = useApp();

  const [selectedPlatform, setSelectedPlatform] = useState<SocialPlatform>(
    initialAccount?.platform || initialPlatform || 'instagram'
  );

  // Flow step: 1 = Permissions / OAuth Consent, 2 = Select Sub-pages / Profiles, 3 = Token Active Success
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [authenticating, setAuthenticating] = useState(false);
  const [candidatePages, setCandidatePages] = useState<SocialSubPage[]>([]);

  useEffect(() => {
    if (initialAccount?.platform) {
      setSelectedPlatform(initialAccount.platform);
    } else if (initialPlatform) {
      setSelectedPlatform(initialPlatform);
    }
  }, [initialAccount, initialPlatform]);

  // Load candidate pages when platform changes or modal opens
  useEffect(() => {
    if (!isOpen) {
      setStep(1);
      setAuthenticating(false);
      return;
    }

    const platformConfig = DISCOVERED_OAUTH_PAGES[selectedPlatform];
    if (initialAccount?.subPages && initialAccount.subPages.length > 0) {
      setCandidatePages(initialAccount.subPages);
    } else if (platformConfig?.pages) {
      setCandidatePages(platformConfig.pages);
    } else {
      setCandidatePages([
        {
          id: `${selectedPlatform}-default-1`,
          name: `${user.organization || 'Meu Negócio'} Oficial`,
          username: `@${selectedPlatform}_${user.name.toLowerCase().replace(/\s+/g, '')}`,
          avatar: user.avatar,
          followers: 12500,
          type: 'Perfil Oficial',
          selected: true
        }
      ]);
    }
  }, [isOpen, selectedPlatform, initialAccount, user]);

  if (!isOpen) return null;

  const platformInfo = PLATFORM_INFO[selectedPlatform];
  const oauthData = DISCOVERED_OAUTH_PAGES[selectedPlatform] || {
    authHeader: `${platformInfo.name} API v2.0 • OAuth Authorization`,
    authDescription: `Autorização segura para agendamento e sincronização direta no ${platformInfo.name}.`,
    scopes: ['read_profile', 'publish_media', 'view_insights'],
    pages: []
  };

  const handleToggleSubPage = (pageId: string) => {
    setCandidatePages(prev =>
      prev.map(p => (p.id === pageId ? { ...p, selected: !p.selected } : p))
    );
  };

  const handleSelectAll = (select: boolean) => {
    setCandidatePages(prev => prev.map(p => ({ ...p, selected: select })));
  };

  const handleStartAuth = () => {
    setAuthenticating(true);
    setTimeout(() => {
      setAuthenticating(false);
      // Move to page selection step
      setStep(2);
    }, 1100);
  };

  const handleConfirmPages = () => {
    const selectedList = candidatePages.filter(p => p.selected);
    if (selectedList.length === 0) {
      showToast('Por favor, selecione pelo menos uma página ou perfil para vincular.', 'error');
      return;
    }

    setAuthenticating(true);
    setTimeout(() => {
      setAuthenticating(false);
      
      const primaryPage = selectedList[0];
      const finalizedAccount: SocialAccount = {
        id: initialAccount?.id || `acc-${selectedPlatform}-${Date.now()}`,
        platform: selectedPlatform,
        name: primaryPage.name,
        username: primaryPage.username,
        avatar: primaryPage.avatar,
        connected: true,
        followers: selectedList.reduce((acc, p) => acc + p.followers, 0),
        lastSync: 'Conectado agora',
        tokenStatus: 'active',
        tokenExpiresInDays: 60,
        accountType: primaryPage.type.toLowerCase().includes('company') || primaryPage.type.toLowerCase().includes('comercial') ? 'business' : 'creator',
        workspaceName: user.workspaceName || 'Workspace Principal',
        authorizedPermissions: oauthData.scopes,
        subPages: candidatePages
      };

      if (initialAccount?.connected) {
        updateAccountSubPages(initialAccount.id, candidatePages);
      } else {
        connectSocialAccount(finalizedAccount);
      }

      if (onSuccess) {
        onSuccess(finalizedAccount);
      }

      setStep(3);
    }, 900);
  };

  const selectedCount = candidatePages.filter(p => p.selected).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Top Official OAuth Header Bar */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white shadow-md text-sm shrink-0"
              style={{ backgroundColor: platformInfo.color }}
            >
              {platformInfo.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white tracking-wide">
                  {oauthData.authHeader}
                </span>
                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                  <Lock className="w-2.5 h-2.5" /> SSL 256-bit
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                OAuth 2.0 PKCE • FlowContent Integration Gateway
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stepper Indicator */}
        <div className="px-5 py-2.5 bg-slate-950/50 border-b border-slate-800/80 flex items-center justify-between text-[11px] font-medium">
          <div className={`flex items-center gap-1.5 ${step >= 1 ? 'text-brand-400 font-bold' : 'text-slate-500'}`}>
            <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${step >= 1 ? 'bg-brand-500 text-white' : 'bg-slate-800 text-slate-400'}`}>1</span>
            <span>Permissões OAuth</span>
          </div>
          <div className="w-6 h-0.5 bg-slate-800" />
          <div className={`flex items-center gap-1.5 ${step >= 2 ? 'text-brand-400 font-bold' : 'text-slate-500'}`}>
            <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${step >= 2 ? 'bg-brand-500 text-white' : 'bg-slate-800 text-slate-400'}`}>2</span>
            <span>Seleção de Páginas</span>
          </div>
          <div className="w-6 h-0.5 bg-slate-800" />
          <div className={`flex items-center gap-1.5 ${step === 3 ? 'text-emerald-400 font-bold' : 'text-slate-500'}`}>
            <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${step === 3 ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-slate-400'}`}>3</span>
            <span>Token Ativo</span>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-5 text-slate-200 text-xs">
          
          {/* STEP 1: OAuth Consent & Permissions */}
          {step === 1 && (
            <div className="space-y-4 animate-fade-in">
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 flex items-start gap-3">
                <div className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0 text-white font-bold">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-9 h-9 rounded-full object-cover" />
                  ) : (
                    user.name.charAt(0)
                  )}
                </div>
                <div>
                  <div className="text-xs font-semibold text-white">
                    Continuar como {user.name}
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono">
                    {user.email} • Workspace: {user.workspaceName || 'Principal'}
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-bold text-white mb-1">
                  Autorizar o FlowContent a gerenciar publicações
                </h4>
                <p className="text-slate-400 leading-relaxed text-xs">
                  {oauthData.authDescription}
                </p>
              </div>

              {/* Scope permissions box */}
              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/90 space-y-2.5">
                <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-brand-400" />
                  <span>Escopos oficiais solicitados:</span>
                </div>

                <div className="space-y-2">
                  {oauthData.scopes.map((scope, idx) => (
                    <div key={idx} className="flex items-center gap-2.5 text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <span className="font-mono text-[11px] text-slate-200">{scope}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                  <span>Token renovável com criptografia AES-256 no banco do workspace.</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleStartAuth}
                disabled={authenticating}
                className="w-full py-3 px-4 rounded-xl font-bold text-xs text-white shadow-lg flex items-center justify-center gap-2 transition-all active:scale-[0.99]"
                style={{ backgroundColor: platformInfo.color }}
              >
                {authenticating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Conectando com a API oficial do {platformInfo.name}...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Conectar e Prosseguir para Seleção de Perfis</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          )}

          {/* STEP 2: Page / Account Selection */}
          {step === 2 && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white">
                    Páginas e Perfis Detectados no {platformInfo.name}
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Selecione quais contas autorizar para disparos e agendamento em lote.
                  </p>
                </div>

                <div className="flex items-center gap-2 text-[11px]">
                  <button
                    type="button"
                    onClick={() => handleSelectAll(true)}
                    className="text-brand-400 hover:underline font-semibold"
                  >
                    Marcar Todas
                  </button>
                  <span className="text-slate-600">•</span>
                  <button
                    type="button"
                    onClick={() => handleSelectAll(false)}
                    className="text-slate-400 hover:text-white"
                  >
                    Desmarcar
                  </button>
                </div>
              </div>

              {/* Pages List */}
              <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
                {candidatePages.map((page) => (
                  <div
                    key={page.id}
                    onClick={() => handleToggleSubPage(page.id)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      page.selected
                        ? 'bg-brand-950/30 border-brand-500/50 shadow-sm'
                        : 'bg-slate-950/40 border-slate-800 opacity-60 hover:opacity-90'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="relative shrink-0">
                        <img
                          src={page.avatar}
                          alt={page.name}
                          className="w-10 h-10 rounded-xl object-cover ring-1 ring-slate-700"
                        />
                        <div 
                          className="w-3 h-3 rounded-full absolute -bottom-0.5 -right-0.5 border border-slate-900"
                          style={{ backgroundColor: platformInfo.color }}
                        />
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-xs text-white truncate">
                            {page.name}
                          </span>
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 font-medium shrink-0">
                            {page.type}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                          <span className="font-mono text-slate-300">{page.username}</span>
                          <span>•</span>
                          <span>{page.followers.toLocaleString('pt-BR')} seguidores</span>
                        </div>
                      </div>
                    </div>

                    <div className={`w-5 h-5 rounded-lg border flex items-center justify-center shrink-0 transition-colors ${
                      page.selected
                        ? 'bg-brand-500 border-brand-500 text-white'
                        : 'border-slate-700 bg-slate-800'
                    }`}>
                      {page.selected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center gap-2.5 text-slate-400 text-[11px]">
                <Info className="w-4 h-4 text-brand-400 shrink-0" />
                <span>
                  {selectedCount} página(s) selecionada(s). Você pode adicionar ou revogar autorizações a qualquer momento.
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs border border-slate-700 transition-colors"
                >
                  Voltar
                </button>

                <button
                  type="button"
                  onClick={handleConfirmPages}
                  disabled={authenticating || selectedCount === 0}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-brand-600 hover:bg-brand-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-xs shadow-lg shadow-brand-600/30 flex items-center justify-center gap-2 transition-all active:scale-[0.99]"
                >
                  {authenticating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Gerando tokens OAuth 2.0 ativos...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      <span>Autorizar {selectedCount} Conta(s) no Painel</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Success & Active Token Details */}
          {step === 3 && (
            <div className="space-y-4 text-center py-4 animate-fade-in">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 mx-auto flex items-center justify-center shadow-xl shadow-emerald-500/10">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <h3 className="text-base font-extrabold text-white">
                  Conexão Concluída com Sucesso!
                </h3>
                <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                  As páginas autorizadas do {platformInfo.name} já estão sincronizadas com o seu workspace e prontas para disparos em lote.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-left space-y-2 text-xs">
                <div className="flex items-center justify-between text-slate-300">
                  <span className="text-slate-400">Status do Token:</span>
                  <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    Ativo (Válido por 60 dias)
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span className="text-slate-400">Contas/Páginas Vinculadas:</span>
                  <span className="font-bold text-white">{selectedCount} perfis selecionados</span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span className="text-slate-400">Pronto para Agendamento:</span>
                  <span className="font-bold text-indigo-300">Sim • Fila Ilimitada</span>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/25 transition-all"
              >
                Concluir e Voltar ao Gerenciador
              </button>
            </div>
          )}

        </div>

        {/* Modal Footer Security Badge */}
        <div className="px-5 py-3 bg-slate-950/80 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-slate-500" />
            <span>Tokens protegidos com isolamento multi-inquilino</span>
          </div>
          <div className="text-[10px] font-mono text-slate-500">
            FlowContent Security v2.4
          </div>
        </div>

      </div>
    </div>
  );
};
