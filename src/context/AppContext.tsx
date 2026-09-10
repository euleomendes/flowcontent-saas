import React, { createContext, useContext, useState, useEffect } from 'react';
import { PostItem, SocialAccount, UserProfile, NavigationTab, DashboardStats } from '../types';
import { INITIAL_POSTS, INITIAL_ACCOUNTS, INITIAL_USER } from '../data/mockData';
import { triggerCelebrationConfetti } from '../utils/helpers';

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
  resetDemoData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_POSTS_KEY = 'flowcontent_posts_v1';
const STORAGE_ACCOUNTS_KEY = 'flowcontent_accounts_v1';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<NavigationTab>('landing');
  const [selectedPostForDetail, setSelectedPostForDetail] = useState<PostItem | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastState[]>([]);
  const [user] = useState<UserProfile>(INITIAL_USER);

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

  // Save to localStorage when changed
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_POSTS_KEY, JSON.stringify(posts));
    } catch (e) {
      console.error('Failed to save posts to localStorage', e);
    }
  }, [posts]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_ACCOUNTS_KEY, JSON.stringify(accounts));
    } catch (e) {
      console.error('Failed to save accounts to localStorage', e);
    }
  }, [accounts]);

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

  const toggleAccountConnection = (accountId: string) => {
    setAccounts(prev =>
      prev.map(acc => {
        if (acc.id === accountId) {
          const nextState = !acc.connected;
          return {
            ...acc,
            connected: nextState,
            lastSync: nextState ? 'Conectado agora' : 'Desconectado'
          };
        }
        return acc;
      })
    );
  };

  const resetDemoData = () => {
    setPosts(INITIAL_POSTS);
    setAccounts(INITIAL_ACCOUNTS);
    localStorage.removeItem(STORAGE_POSTS_KEY);
    localStorage.removeItem(STORAGE_ACCOUNTS_KEY);
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
        resetDemoData
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
