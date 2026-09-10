import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  PostItem, 
  SocialAccount, 
  SocialSubPage, 
  UserProfile, 
  NavigationTab, 
  DashboardStats,
  RegisteredUser,
  UserAccessStatus
} from '../types';
import { 
  INITIAL_POSTS, 
  INITIAL_ACCOUNTS, 
  INITIAL_USER, 
  DEFAULT_MASTER_EMAIL,
  INITIAL_REGISTERED_USERS 
} from '../data/mockData';
import { triggerCelebrationConfetti } from '../utils/helpers';
import { META_APP_ID } from '../services/metaAuth';

interface ToastState {
  id: string;
  message: string;
  type: 'success' | 'info' | 'error';
}

interface AppContextType {
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  posts: PostItem[];
  accounts: SocialAccount[];
  user: UserProfile;
  stats: DashboardStats;
  selectedPostForDetail: PostItem | null;
  setSelectedPostForDetail: (post: PostItem | null) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (isOpen: boolean) => void;
  toasts: ToastState[];
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
  removeToast: (id: string) => void;
  addBulkPosts: (newPosts: PostItem[]) => void;
  updatePost: (updatedPost: PostItem) => void;
  deletePost: (id: string) => void;
  toggleAccountConnection: (accountId: string) => void;
  connectSocialAccount: (account: SocialAccount) => void;
  connectMultipleSocialAccounts: (accountsToConnect: SocialAccount[]) => void;
  disconnectSocialAccount: (accountId: string) => void;
  updateAccountSubPages: (accountId: string, subPages: SocialSubPage[]) => void;
  updateUserProfile: (profile: Partial<UserProfile>) => void;
  startOnboarding: () => void;
  finishOnboarding: (userData: Partial<UserProfile>, selectedAccounts?: SocialAccount[]) => void;
  resetDemoData: () => void;
  
  masterEmail: string;
  setMasterEmail: (email: string) => void;
  registeredUsers: RegisteredUser[];
  approveUser: (userId: string) => void;
  rejectUser: (userId: string) => void;
  blockUser: (userId: string) => void;
  deleteUser: (userId: string) => void;
  loginWithEmail: (email: string) => { success: boolean; status: UserAccessStatus; message?: string };
  loginAsMaster: () => void;
  loginAsUser: (user: RegisteredUser) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_POSTS_KEY = 'flowcontent_posts_v1';
const STORAGE_ACCOUNTS_KEY = 'flowcontent_accounts_v1';
const STORAGE_USER_KEY = 'flowcontent_user_v1';
const STORAGE_MASTER_EMAIL_KEY = 'flowcontent_master_email_v1';
const STORAGE_REGISTERED_USERS_KEY = 'flowcontent_registered_users_v1';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<NavigationTab>(() => {
    if (typeof window !== 'undefined') {
      const search = window.location.search;
      const hash = window.location.hash;
      if (
        search.includes('code=') ||
        search.includes('access_token=') ||
        hash.includes('access_token=') ||
        search.includes('error=')
      ) {
        return 'accounts';
      }
    }
    return 'landing';
  });
  const [selectedPostForDetail, setSelectedPostForDetail] = useState<PostItem | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastState[]>([]);

  // Master Admin Email state (fixo: leandromendesjor@gmail.com)
  const [masterEmail, setMasterEmailState] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_MASTER_EMAIL_KEY);
      if (!saved || saved === 'admin@flowcontent.com.br') {
        localStorage.setItem(STORAGE_MASTER_EMAIL_KEY, DEFAULT_MASTER_EMAIL);
        return DEFAULT_MASTER_EMAIL;
      }
      return saved;
    } catch {
      return DEFAULT_MASTER_EMAIL;
    }
  });

  // Registered Users list
  const [registeredUsers, setRegisteredUsers] = useState<RegisteredUser[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_REGISTERED_USERS_KEY);
      if (saved) {
        const parsed: RegisteredUser[] = JSON.parse(saved);
        // Ensure leandromendesjor@gmail.com is present as master
        const hasLeandro = parsed.some(u => u.email.toLowerCase() === DEFAULT_MASTER_EMAIL.toLowerCase());
        if (!hasLeandro) {
          localStorage.setItem(STORAGE_REGISTERED_USERS_KEY, JSON.stringify(INITIAL_REGISTERED_USERS));
          return INITIAL_REGISTERED_USERS;
        }
        return parsed;
      }
      return INITIAL_REGISTERED_USERS;
    } catch {
      return INITIAL_REGISTERED_USERS;
    }
  });
  
  // Initialize current user from localStorage or mock
  const [user, setUser] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_USER_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.email === 'admin@flowcontent.com.br') {
          return INITIAL_USER;
        }
        return parsed;
      }
      return INITIAL_USER;
    } catch {
      return INITIAL_USER;
    }
  });

  // Initialize posts from localStorage or mock
  const [posts, setPosts] = useState<PostItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_POSTS_KEY);
      return saved ? JSON.parse(saved) : INITIAL_POSTS;
    } catch {
      return INITIAL_POSTS;
    }
  });

  // Initialize accounts from localStorage or mock
  const [accounts, setAccounts] = useState<SocialAccount[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_ACCOUNTS_KEY);
      return saved ? JSON.parse(saved) : INITIAL_ACCOUNTS;
    } catch {
      return INITIAL_ACCOUNTS;
    }
  });

  // Persist posts
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_POSTS_KEY, JSON.stringify(posts));
    } catch (e) {
      console.error('Failed to save posts to localStorage', e);
    }
  }, [posts]);

  // Persist accounts
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_ACCOUNTS_KEY, JSON.stringify(accounts));
    } catch (e) {
      console.error('Failed to save accounts to localStorage', e);
    }
  }, [accounts]);

  // Persist user
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(user));
    } catch (e) {
      console.error('Failed to save user to localStorage', e);
    }
  }, [user]);

  // Persist registered users
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_REGISTERED_USERS_KEY, JSON.stringify(registeredUsers));
    } catch (e) {
      console.error('Failed to save registered users to localStorage', e);
    }
  }, [registeredUsers]);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const addBulkPosts = (newPosts: PostItem[]) => {
    setPosts(prev => [...newPosts, ...prev]);
    triggerCelebrationConfetti();
    showToast(`🎉 ${newPosts.length} postagens agendadas com sucesso no calendário!`, 'success');
    setActiveTab('dashboard');
  };

  const updatePost = (updatedPost: PostItem) => {
    setPosts(prev => prev.map(p => (p.id === updatedPost.id ? updatedPost : p)));
    if (selectedPostForDetail?.id === updatedPost.id) {
      setSelectedPostForDetail(updatedPost);
    }
    showToast('Postagem atualizada com sucesso!', 'info');
  };

  const deletePost = (id: string) => {
    setPosts(prev => prev.filter(p => p.id !== id));
    if (selectedPostForDetail?.id === id) {
      setSelectedPostForDetail(null);
    }
    showToast('Postagem removida da fila.', 'info');
  };

  const updateUserProfile = (profile: Partial<UserProfile>) => {
    setUser(prev => {
      const updated = { ...prev, ...profile };
      return updated;
    });

    // Also update in registeredUsers list if exists
    if (profile.email) {
      setRegisteredUsers(prev =>
        prev.map(u => (u.email.toLowerCase() === profile.email?.toLowerCase() ? { ...u, ...profile } : u))
      );
    }

    showToast('Perfil e espaço de trabalho atualizados com sucesso!', 'success');
  };

  const connectSocialAccount = (account: SocialAccount) => {
    setAccounts(prev => {
      const exists = prev.some(a => a.id === account.id || a.platform === account.platform);
      if (exists) {
        return prev.map(a => {
          if (a.id === account.id || a.platform === account.platform) {
            return {
              ...a,
              ...account,
              connected: true,
              tokenStatus: 'active',
              tokenExpiresInDays: 60,
              lastSync: 'Conectado agora'
            };
          }
          return a;
        });
      }
      return [...prev, { ...account, connected: true, tokenStatus: 'active', tokenExpiresInDays: 60, lastSync: 'Conectado agora' }];
    });
    triggerCelebrationConfetti();
    showToast(`🎉 ${account.name} conectado com token OAuth 2.0 ativo!`, 'success');
  };

  // Monitora retornos de OAuth (Instagram / Facebook / Meta) via URL query params e postMessage
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const params = new URLSearchParams(window.location.search);
    const hash = window.location.hash;
    const code = params.get('code');
    const error = params.get('error');
    const errorDescription = params.get('error_description');
    const stateParam = params.get('state');

    let token = params.get('access_token');
    if (!token && hash && hash.includes('access_token=')) {
      const hashParams = new URLSearchParams(hash.replace(/^#/, ''));
      token = hashParams.get('access_token');
    }

    // Ouvinte para mensagens vindas de janelas filhas (popup de login OAuth)
    const handleAuthMessage = (event: MessageEvent) => {
      if (event.data?.type === 'META_AUTH_SUCCESS') {
        const platform = event.data.platform || 'instagram';
        const isFB = platform === 'facebook';
        
        connectSocialAccount({
          id: isFB ? 'acc-fb' : 'acc-ig',
          platform: isFB ? 'facebook' : 'instagram',
          name: isFB ? 'Página Oficial do Facebook' : 'Flow Agência Digital',
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

        setActiveTab('accounts');
      }
    };

    window.addEventListener('message', handleAuthMessage);

    // Tratamento de cancelamento ou recusa na Meta
    if (error) {
      if (window.opener && !window.opener.closed) {
        try {
          window.opener.postMessage({ type: 'META_AUTH_ERROR', error: errorDescription || error }, '*');
          setTimeout(() => window.close(), 600);
        } catch {
          // noop
        }
      } else {
        showToast(errorDescription || 'A autorização da Meta foi cancelada ou recusada.', 'error');
        setActiveTab('accounts');
        try {
          window.history.replaceState({}, document.title, window.location.pathname);
        } catch {
          // noop
        }
      }
      return () => window.removeEventListener('message', handleAuthMessage);
    }

    // Tratamento de sucesso com código ou token presente na URL
    if (code || token) {
      const isFB = stateParam === 'facebook';
      const targetPlatform = isFB ? 'facebook' : 'instagram';

      // Se estiver em janela popup aberta via window.open, notifica opener e fecha
      if (window.opener && !window.opener.closed) {
        try {
          window.opener.postMessage({
            type: 'META_AUTH_SUCCESS',
            platform: targetPlatform,
            code: code || token
          }, '*');
          setTimeout(() => window.close(), 600);
        } catch {
          // noop
        }
        return () => window.removeEventListener('message', handleAuthMessage);
      }

      // Redirecionamento na janela principal: vincula a conta no estado
      connectSocialAccount({
        id: isFB ? 'acc-fb' : 'acc-ig',
        platform: isFB ? 'facebook' : 'instagram',
        name: isFB ? 'Página Oficial do Facebook' : 'Flow Agência Digital',
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

      setActiveTab('accounts');
      triggerCelebrationConfetti();
      showToast(`🎉 ${isFB ? 'Página do Facebook' : 'Instagram Business'} conectado com sucesso via Meta OAuth (App ID: ${META_APP_ID})!`, 'success');

      // Limpa os parâmetros (?code=... e #_=_) da URL para manter a barra de endereços limpa
      try {
        window.history.replaceState({}, document.title, window.location.pathname);
      } catch {
        // noop
      }
    }

    return () => {
      window.removeEventListener('message', handleAuthMessage);
    };
  }, []);

  const connectMultipleSocialAccounts = (accountsToConnect: SocialAccount[]) => {
    setAccounts(prev => {
      let updated = [...prev];
      accountsToConnect.forEach(acc => {
        const idx = updated.findIndex(a => a.id === acc.id || a.platform === acc.platform);
        const item: SocialAccount = {
          ...(idx >= 0 ? updated[idx] : acc),
          ...acc,
          connected: true,
          tokenStatus: 'active',
          tokenExpiresInDays: 60,
          lastSync: 'Conectado agora'
        };
        if (idx >= 0) {
          updated[idx] = item;
        } else {
          updated.push(item);
        }
      });
      return updated;
    });
    triggerCelebrationConfetti();
    const names = accountsToConnect.map(a => a.name).join(' e ');
    showToast(`🎉 ${names} vinculadas com sucesso via Meta OAuth (App ID: 2745781192554036)!`, 'success');
  };

  const disconnectSocialAccount = (accountId: string) => {
    setAccounts(prev =>
      prev.map(acc => {
        if (acc.id === accountId) {
          return {
            ...acc,
            connected: false,
            tokenStatus: 'revoked',
            lastSync: 'Desconectado',
            subPages: acc.subPages?.map(p => ({ ...p, selected: false }))
          };
        }
        return acc;
      })
    );
    showToast('Conta e páginas desvinculadas.', 'info');
  };

  const updateAccountSubPages = (accountId: string, subPages: SocialSubPage[]) => {
    setAccounts(prev =>
      prev.map(acc => {
        if (acc.id === accountId) {
          const selectedPages = subPages.filter(p => p.selected);
          return {
            ...acc,
            subPages,
            name: selectedPages[0]?.name || acc.name,
            username: selectedPages[0]?.username || acc.username
          };
        }
        return acc;
      })
    );
    showToast('Páginas autorizadas atualizadas com sucesso!', 'success');
  };

  const startOnboarding = () => {
    setIsAuthModalOpen(false);
    setActiveTab('onboarding');
  };

  const finishOnboarding = (userData: Partial<UserProfile>, selectedAccounts?: SocialAccount[]) => {
    const targetEmail = (userData.email || user.email).trim().toLowerCase();
    const isMaster = targetEmail === masterEmail.toLowerCase();
    const status: UserAccessStatus = isMaster ? 'approved' : 'pending';

    const newUserObj: RegisteredUser = {
      id: user.id || `user-${Date.now()}`,
      name: userData.name || user.name,
      email: targetEmail,
      role: userData.role || user.role || 'Social Media Specialist',
      avatar: userData.avatar || user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      organization: userData.organization || user.organization || 'Minha Organização',
      workspaceName: userData.workspaceName || user.workspaceName || 'Workspace Principal',
      industry: userData.industry || user.industry || 'Agência & Marketing Digital',
      status,
      isMaster,
      createdAt: 'Hoje',
      plan: userData.plan || user.plan || 'Starter'
    };

    // Upsert into registeredUsers
    setRegisteredUsers(prev => {
      const filtered = prev.filter(u => u.email.toLowerCase() !== targetEmail);
      return [newUserObj, ...filtered];
    });

    setUser(prev => ({
      ...prev,
      ...userData,
      id: newUserObj.id,
      email: targetEmail,
      status,
      isMaster,
      onboardingCompleted: true
    }));

    if (selectedAccounts && selectedAccounts.length > 0) {
      setAccounts(prev => {
        const updated = [...prev];
        selectedAccounts.forEach(sel => {
          const idx = updated.findIndex(u => u.platform === sel.platform);
          if (idx >= 0) {
            updated[idx] = { ...updated[idx], ...sel, connected: true, tokenStatus: 'active', tokenExpiresInDays: 60, lastSync: 'Conectado agora' };
          } else {
            updated.push({ ...sel, connected: true, tokenStatus: 'active', tokenExpiresInDays: 60, lastSync: 'Conectado agora' });
          }
        });
        return updated;
      });
    }

    if (isMaster) {
      triggerCelebrationConfetti();
      showToast(`🎉 Bem-vindo Administrador Master! Seu workspace está pronto.`, 'success');
      setActiveTab('dashboard');
    } else {
      showToast('Solicitação de cadastro recebida! Aguardando aprovação do Master.', 'info');
      setActiveTab('pending_approval');
    }
  };

  const toggleAccountConnection = (accountId: string) => {
    setAccounts(prev =>
      prev.map(acc => {
        if (acc.id === accountId) {
          const nextState = !acc.connected;
          return {
            ...acc,
            connected: nextState,
            tokenStatus: nextState ? 'active' : 'revoked',
            tokenExpiresInDays: nextState ? 60 : 0,
            lastSync: nextState ? 'Conectado agora' : 'Desconectado'
          };
        }
        return acc;
      })
    );
  };

  // ================= Master Admin & Access Control Methods =================
  const setMasterEmail = (email: string) => {
    const normalized = email.trim().toLowerCase();
    setMasterEmailState(normalized);
    try {
      localStorage.setItem(STORAGE_MASTER_EMAIL_KEY, normalized);
    } catch (e) {
      console.error(e);
    }

    // Update user if currently Master
    if (user.isMaster) {
      setUser(prev => ({ ...prev, email: normalized }));
    }

    showToast(`E-mail do Administrador Master definido para: ${normalized}`, 'success');
  };

  const approveUser = (userId: string) => {
    setRegisteredUsers(prev =>
      prev.map(u => (u.id === userId ? { ...u, status: 'approved', approvedAt: 'Agora' } : u))
    );
    setUser(prev => (prev.id === userId ? { ...prev, status: 'approved' } : prev));
    triggerCelebrationConfetti();
    showToast('✅ Acesso do usuário APROVADO com sucesso!', 'success');
  };

  const blockUser = (userId: string) => {
    setRegisteredUsers(prev =>
      prev.map(u => (u.id === userId ? { ...u, status: 'blocked' } : u))
    );
    setUser(prev => (prev.id === userId ? { ...prev, status: 'blocked' } : prev));
    showToast('Acesso do usuário bloqueado.', 'info');
  };

  const rejectUser = (userId: string) => {
    setRegisteredUsers(prev =>
      prev.map(u => (u.id === userId ? { ...u, status: 'blocked' } : u))
    );
    setUser(prev => (prev.id === userId ? { ...prev, status: 'blocked' } : prev));
    showToast('Solicitação de acesso rejeitada pelo Administrador Master.', 'info');
  };

  const deleteUser = (userId: string) => {
    setRegisteredUsers(prev => prev.filter(u => u.id !== userId));
    showToast('Usuário removido da base de dados.', 'info');
  };

  const loginWithEmail = (emailInput: string): { success: boolean; status: UserAccessStatus; message?: string } => {
    const normalizedEmail = emailInput.trim().toLowerCase();

    // 1. Is it the Master Admin?
    if (normalizedEmail === masterEmail.toLowerCase()) {
      const masterObj = registeredUsers.find(u => u.email.toLowerCase() === masterEmail.toLowerCase()) || {
        id: 'user-master-leandro',
        name: 'Leandro Mendes',
        email: masterEmail,
        role: 'Administrador Master & Proprietário',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        organization: 'FlowContent HQ',
        workspaceName: 'Workspace Master',
        industry: 'SaaS & Tecnologia',
        status: 'approved' as UserAccessStatus,
        isMaster: true,
        createdAt: '2026-01-10',
        plan: 'Agência' as const
      };

      setUser({
        ...masterObj,
        onboardingCompleted: true
      });
      setIsAuthModalOpen(false);
      setActiveTab('dashboard');
      showToast(`👑 Bem-vindo de volta, Administrador Master!`, 'success');
      return { success: true, status: 'approved' };
    }

    // 2. Is it in registeredUsers?
    const existing = registeredUsers.find(u => u.email.toLowerCase() === normalizedEmail);
    if (existing) {
      setUser({
        ...existing,
        onboardingCompleted: true
      });
      setIsAuthModalOpen(false);

      if (existing.status === 'approved') {
        setActiveTab('dashboard');
        showToast(`Bem-vinda(o) de volta, ${existing.name}!`, 'success');
        return { success: true, status: 'approved' };
      } else if (existing.status === 'pending') {
        setActiveTab('pending_approval');
        showToast('Sua solicitação de acesso está aguardando aprovação pelo Master.', 'info');
        return { success: true, status: 'pending' };
      } else {
        showToast('❌ Acesso bloqueado pelo Administrador Master.', 'error');
        return { success: false, status: 'blocked', message: 'Acesso bloqueado pelo Administrador Master.' };
      }
    }

    // 3. Brand new user attempting login without prior account -> create pending
    const newUser: RegisteredUser = {
      id: `user-${Date.now()}`,
      name: emailInput.split('@')[0],
      email: normalizedEmail,
      role: 'Usuário Convidado',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      organization: 'Nova Organização',
      workspaceName: 'Workspace Principal',
      industry: 'Agência & Marketing Digital',
      status: 'pending',
      isMaster: false,
      createdAt: 'Hoje',
      plan: 'Starter'
    };

    setRegisteredUsers(prev => [newUser, ...prev]);
    setUser({
      ...newUser,
      onboardingCompleted: true
    });
    setIsAuthModalOpen(false);
    setActiveTab('pending_approval');
    showToast('Cadastro realizado! Aguardando aprovação pelo Administrador Master.', 'info');
    return { success: true, status: 'pending' };
  };

  const loginAsMaster = () => {
    loginWithEmail(masterEmail);
  };

  const loginAsUser = (targetUser: RegisteredUser) => {
    setUser({
      ...targetUser,
      onboardingCompleted: true
    });
    setIsAuthModalOpen(false);

    if (targetUser.isMaster || targetUser.status === 'approved') {
      setActiveTab('dashboard');
      showToast(`Conectado como ${targetUser.name}`, 'success');
    } else if (targetUser.status === 'pending') {
      setActiveTab('pending_approval');
      showToast(`Conectado como ${targetUser.name} (Pendente de Aprovação)`, 'info');
    } else {
      setActiveTab('pending_approval');
      showToast(`Conta de ${targetUser.name} está bloqueada pelo Master.`, 'error');
    }
  };

  const resetDemoData = () => {
    setPosts(INITIAL_POSTS);
    setAccounts(INITIAL_ACCOUNTS);
    setUser(INITIAL_USER);
    setMasterEmailState(DEFAULT_MASTER_EMAIL);
    setRegisteredUsers(INITIAL_REGISTERED_USERS);

    localStorage.removeItem(STORAGE_POSTS_KEY);
    localStorage.removeItem(STORAGE_ACCOUNTS_KEY);
    localStorage.removeItem(STORAGE_USER_KEY);
    localStorage.removeItem(STORAGE_MASTER_EMAIL_KEY);
    localStorage.removeItem(STORAGE_REGISTERED_USERS_KEY);

    showToast('Dados de demonstração restaurados.', 'info');
  };

  // Compute live dashboard stats
  const scheduledCount = posts.filter(p => p.status === 'scheduled').length;
  const publishedCount = posts.filter(p => p.status === 'published').length;
  const connectedCount = accounts.filter(a => a.connected).length;
  const totalCount = posts.length || 1;
  const successRate = Number(((publishedCount + scheduledCount) / totalCount * 100).toFixed(1));

  const stats: DashboardStats = {
    totalScheduled: scheduledCount,
    publishedThisMonth: publishedCount + 42,
    successRate: Math.min(99.4, successRate),
    connectedAccounts: connectedCount,
    queuedNext7Days: Math.min(scheduledCount, 14)
  };

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        posts,
        accounts,
        user,
        stats,
        selectedPostForDetail,
        setSelectedPostForDetail,
        isAuthModalOpen,
        setIsAuthModalOpen,
        toasts,
        showToast,
        removeToast,
        addBulkPosts,
        updatePost,
        deletePost,
        toggleAccountConnection,
        connectSocialAccount,
        connectMultipleSocialAccounts,
        disconnectSocialAccount,
        updateAccountSubPages,
        updateUserProfile,
        startOnboarding,
        finishOnboarding,
        resetDemoData,

        masterEmail,
        setMasterEmail,
        registeredUsers,
        approveUser,
        rejectUser,
        blockUser,
        deleteUser,
        loginWithEmail,
        loginAsMaster,
        loginAsUser
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
