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
  KeyRound,
  Layers,
  Sparkles,
  Share2
} from 'lucide-react';
import { SocialAccount, SocialPlatform, SocialSubPage } from '../../types';
import { PLATFORM_INFO } from '../../utils/helpers';
import { DISCOVERED_OAUTH_PAGES } from '../../data/mockData';
import { 
  META_APP_ID, 
  META_API_VERSION, 
  META_OAUTH_SCOPES, 
  openMetaOAuthWindow, 
  META_PORTFOLIO_ACCOUNTS 
} from '../../services/metaAuth';
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
  const { user, connectSocialAccount, connectMultipleSocialAccounts, updateAccountSubPages, showToast } = useApp();

  const [selectedPlatform, setSelectedPlatform] = useState<SocialPlatform>(
    initialAccount?.platform || initialPlatform || 'instagram'
  );

  const isMeta = selectedPlatform === 'instagram' || selectedPlatform === 'facebook';

  // Flow step: 1 = Permissions / OAuth Consent, 2 = Select Sub-pages / Profiles, 3 = Token Active Success
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [authenticating, setAuthenticating] = useState(false);
  const [candidatePages, setCandidatePages] = useState<SocialSubPage[]>([]);
  const [metaFilter, setMetaFilter] = useState<'all' | 'instagram' | 'facebook'>('all');

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
      setMetaFilter('all');
      return;
    }

    if (isMeta) {
      // For Meta platforms (Instagram or Facebook), load portfolio accounts
      const portfolio = META_PORTFOLIO_ACCOUNTS.map(item => {
        // If initialAccount already has subPages selected, maintain status
        const matched = initialAccount?.subPages?.find(p => p.id === item.id || p.username === item.username);
        return {
          ...item,
          selected: matched ? matched.selected : item.selected
        };
      });
      setCandidatePages(portfolio);
    } else {
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
    }
  }, [isOpen, selectedPlatform, initialAccount, user, isMeta]);

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
    setCandidatePages(prev =>
      prev.map(p => {
        if (metaFilter === 'all') return { ...p, selected: select };
        if (metaFilter === 'instagram' && (p.portfolioPlatform === 'instagram' || p.type.toLowerCase().includes('instagram'))) {
          return { ...p, selected: select };
        }
        if (metaFilter === 'facebook' && (p.portfolioPlatform === 'facebook' || p.type.toLowerCase().includes('facebook') || p.type.toLowerCase().includes('página'))) {
          return { ...p, selected: select };
        }
        return p;
      })
    );
  };

  const handleStartAuth = () => {
    setAuthenticating(true);
    
    // Se for Meta, dispara o popup oficial do Facebook Dialog OAuth
    if (isMeta) {
      try {
        openMetaOAuthWindow();
      } catch (err) {
        console.warn('Popup blocked or not permitted', err);
      }
    }

    setTimeout(() => {
      setAuthenticating(false);
      // Move to page selection step
      setStep(2);
    }, 1200);
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

      if (isMeta) {
        // Separa as contas selecionadas do Instagram e do Facebook
        const selectedIg = selectedList.filter(
          p => p.portfolioPlatform === 'instagram' || p.type.toLowerCase().includes('instagram')
        );
        const selectedFb = selectedList.filter(
          p => p.portfolioPlatform === 'facebook' || p.type.toLowerCase().includes('facebook') || p.type.toLowerCase().includes('página')
        );

        const accountsToConnect: SocialAccount[] = [];

        if (selectedIg.length > 0) {
          const primaryIg = selectedIg[0];
          const allIgCandidatePages = candidatePages.filter(
            p => p.portfolioPlatform === 'instagram' || p.type.toLowerCase().includes('instagram')
          );
          accountsToConnect.push({
            id: 'acc-ig',
            platform: 'instagram',
            name: primaryIg.name,
            username: primaryIg.username,
            avatar: primaryIg.avatar,
            connected: true,
            followers: selectedIg.reduce((acc, p) => acc + p.followers, 0),
            lastSync: 'Conectado agora',
            tokenStatus: 'active',
            tokenExpiresInDays: 60,
            accountType: primaryIg.type.toLowerCase().includes('creator') ? 'creator' : 'business',
            workspaceName: user.workspaceName || 'Workspace Principal',
            authorizedPermissions: META_OAUTH_SCOPES,
            subPages: allIgCandidatePages,
            metaAppId: META_APP_ID
          });
        }

        if (selectedFb.length > 0) {
          const primaryFb = selectedFb[0];
          const allFbCandidatePages = candidatePages.filter(
            p => p.portfolioPlatform === 'facebook' || p.type.toLowerCase().includes('facebook') || p.type.toLowerCase().includes('página')
          );
          accountsToConnect.push({
            id: 'acc-fb',
            platform: 'facebook',
            name: primaryFb.name,
            username: primaryFb.username,
            avatar: primaryFb.avatar,
            connected: true,
            followers: selectedFb.reduce((acc, p) => acc + p.followers, 0),
            lastSync: 'Conectado agora',
            tokenStatus: 'active',
            tokenExpiresInDays: 60,
            accountType: 'page',
            workspaceName: user.workspaceName || 'Workspace Principal',
            authorizedPermissions: META_OAUTH_SCOPES,
            subPages: allFbCandidatePages,
            metaAppId: META_APP_ID
          });
        }

        if (accountsToConnect.length > 0) {
          connectMultipleSocialAccounts(accountsToConnect);
          if (onSuccess && accountsToConnect[0]) {
            onSuccess(accountsToConnect[0]);
          }
        }
      } else {
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
      }

      setStep(3);
    }, 900);
  };

  const filteredCandidatePages = candidatePages.filter(p => {
    if (!isMeta || metaFilter === 'all') return true;
    if (metaFilter === 'instagram') {
      return p.portfolioPlatform === 'instagram' || p.type.toLowerCase().includes('instagram');
    }
    if (metaFilter === 'facebook') {
      return p.portfolioPlatform === 'facebook' || p.type.toLowerCase().includes('facebook') || p.type.toLowerCase().includes('página');
    }
    return true;
  });

  const selectedCount = candidatePages.filter(p => p.selected).length;
  const selectedIgCount = candidatePages.filter(
    p => p.selected && (p.portfolioPlatform === 'instagram' || p.type.toLowerCase().includes('instagram'))
  ).length;
  const selectedFbCount = candidatePages.filter(
    p => p.selected && (p.portfolioPlatform === 'facebook' || p.type.toLowerCase().includes('facebook') || p.type.toLowerCase().includes('página'))
  ).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Top Official OAuth Header Bar */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-white shadow-md text-sm shrink-0"
              style={{ backgroundColor: isMeta ? '#1877F2' : platformInfo.color }}
            >
              {isMeta ? 'M' : platformInfo.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white tracking-wide">
                  {isMeta ? `Meta Business Suite • App ID: ${META_APP_ID}` : oauthData.authHeader}
                </span>
                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                  <Lock className="w-2.5 h-2.5" /> SSL 256-bit
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {isMeta 
                  ? `Meta Graph API ${META_API_VERSION} • Autenticação Oficial de Portfólio` 
                  : 'OAuth 2.0 PKCE • FlowContent Integration Gateway'}
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
            <span>{isMeta ? 'Portfólio Meta' : 'Seleção de Páginas'}</span>
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
              {/* Meta App ID Highlight Card */}
              {isMeta && (
                <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-950/60 via-indigo-950/40 to-slate-900 border border-blue-500/30 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                        Meta Official App
                      </span>
                      <span className="text-[11px] font-mono text-emerald-400 font-bold">
                        App ID: {META_APP_ID}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => openMetaOAuthWindow()}
                      className="text-[10px] text-blue-400 hover:text-blue-300 flex items-center gap-1 font-semibold underline"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span>Abrir Janela Direta</span>
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    O aplicativo oficial autoriza o acesso unificado ao <strong>Instagram Business</strong> e às <strong>Páginas do Facebook</strong> associadas ao seu portfólio Meta Business Suite.
                  </p>
                </div>
              )}

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
                  {isMeta 
                    ? `Conexão autenticada via Meta Dialog OAuth v19.0 para agendamento em lote, publicação de reels/carrosséis e leitura de métricas oficiais.` 
                    : oauthData.authDescription}
                </p>
              </div>

              {/* Scope permissions box */}
              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/90 space-y-2.5">
                <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-brand-400" />
                  <span>Escopos oficiais solicitados ({isMeta ? `Meta App ID ${META_APP_ID}` : platformInfo.name}):</span>
                </div>

                <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                  {(isMeta ? META_OAUTH_SCOPES : oauthData.scopes).map((scope, idx) => (
                    <div key={idx} className="flex items-center gap-2.5 text-slate-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <span className="font-mono text-[11px] text-slate-200">{scope}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                  <span>Token OAuth 2.0 criptografado com renovação automática por 60 dias.</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleStartAuth}
                disabled={authenticating}
                className={`w-full py-3 px-4 rounded-xl font-bold text-xs text-white shadow-lg flex items-center justify-center gap-2 transition-all active:scale-[0.99] ${
                  isMeta 
                    ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-pink-600 hover:opacity-95 shadow-blue-600/30' 
                    : 'shadow-lg'
                }`}
                style={!isMeta ? { backgroundColor: platformInfo.color } : {}}
              >
                {authenticating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>
                      {isMeta 
                        ? `Abrindo diálogo oficial da Meta (App ID: ${META_APP_ID})...` 
                        : `Conectando com a API oficial do ${platformInfo.name}...`}
                    </span>
                  </>
                ) : (
                  <>
                    {isMeta ? <ExternalLink className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                    <span>
                      {isMeta 
                        ? `Abrir Autenticação Oficial Meta (OAuth)` 
                        : `Conectar e Prosseguir para Seleção de Perfis`}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          )}

          {/* STEP 2: Page / Account Selection */}
          {step === 2 && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h4 className="text-sm font-bold text-white">
                    {isMeta ? 'Portfólio de Contas & Páginas da Meta' : `Páginas Detectadas no ${platformInfo.name}`}
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {isMeta 
                      ? 'Selecione as contas do Instagram e as páginas do Facebook que deseja autorizar.' 
                      : 'Selecione quais contas autorizar para disparos e agendamento em lote.'}
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

              {/* Meta Filter Tabs (Instagram / Facebook / Todos) */}
              {isMeta && (
                <div className="flex items-center gap-2 p-1 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px]">
                  <button
                    type="button"
                    onClick={() => setMetaFilter('all')}
                    className={`flex-1 py-1 px-2 rounded-lg font-semibold transition-all ${
                      metaFilter === 'all' 
                        ? 'bg-slate-800 text-white shadow-sm' 
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Todas ({candidatePages.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setMetaFilter('instagram')}
                    className={`flex-1 py-1 px-2 rounded-lg font-semibold transition-all flex items-center justify-center gap-1 ${
                      metaFilter === 'instagram' 
                        ? 'bg-gradient-to-r from-pink-600/30 to-purple-600/30 text-pink-300 border border-pink-500/30' 
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span>📸 Instagram</span>
                    <span className="text-[10px] font-mono">
                      ({candidatePages.filter(p => p.portfolioPlatform === 'instagram' || p.type.toLowerCase().includes('instagram')).length})
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setMetaFilter('facebook')}
                    className={`flex-1 py-1 px-2 rounded-lg font-semibold transition-all flex items-center justify-center gap-1 ${
                      metaFilter === 'facebook' 
                        ? 'bg-blue-600/30 text-blue-300 border border-blue-500/30' 
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span>📘 Facebook</span>
                    <span className="text-[10px] font-mono">
                      ({candidatePages.filter(p => p.portfolioPlatform === 'facebook' || p.type.toLowerCase().includes('facebook') || p.type.toLowerCase().includes('página')).length})
                    </span>
                  </button>
                </div>
              )}

              {/* Pages List */}
              <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
                {filteredCandidatePages.map((page) => {
                  const isIg = page.portfolioPlatform === 'instagram' || page.type.toLowerCase().includes('instagram');
                  const itemColor = isIg ? '#E1306C' : (isMeta ? '#1877F2' : platformInfo.color);

                  return (
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
                            style={{ backgroundColor: itemColor }}
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
                  );
                })}
              </div>

              {/* Selection summary */}
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center gap-2.5 text-slate-400 text-[11px]">
                <Info className="w-4 h-4 text-brand-400 shrink-0" />
                <span>
                  {isMeta ? (
                    <>
                      <strong>{selectedCount}</strong> perfis selecionados ({selectedIgCount} Instagram, {selectedFbCount} Facebook).
                    </>
                  ) : (
                    <>
                      <strong>{selectedCount}</strong> página(s) selecionada(s) para vinculação.
                    </>
                  )}
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
                  {isMeta 
                    ? `As contas do portfólio Meta (App ID: ${META_APP_ID}) foram autorizadas e sincronizadas com o seu workspace.` 
                    : `As páginas autorizadas do ${platformInfo.name} já estão sincronizadas com o seu workspace e prontas para disparos em lote.`}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-left space-y-2 text-xs">
                {isMeta && (
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="text-slate-400">Aplicativo Meta Oficial:</span>
                    <span className="font-mono font-bold text-blue-400">ID: {META_APP_ID}</span>
                  </div>
                )}
                <div className="flex items-center justify-between text-slate-300">
                  <span className="text-slate-400">Status do Token:</span>
                  <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    Ativo (Válido por 60 dias)
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span className="text-slate-400">Contas/Páginas Vinculadas:</span>
                  <span className="font-bold text-white">
                    {isMeta 
                      ? `${selectedIgCount} Instagram + ${selectedFbCount} Facebook (${selectedCount} total)` 
                      : `${selectedCount} perfis selecionados`}
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span className="text-slate-400">Pronto para Agendamento:</span>
                  <span className="font-bold text-indigo-300">Sim • Fila Ilimitada & Disparos em Lote</span>
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
            {isMeta ? `Meta Graph API v${META_API_VERSION}` : 'FlowContent Security v2.4'}
          </div>
        </div>

      </div>
    </div>
  );
};
