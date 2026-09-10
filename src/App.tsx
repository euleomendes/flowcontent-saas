import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { ToastContainer } from './components/layout/ToastContainer';
import { LandingPage } from './components/landing/LandingPage';
import { AuthModal } from './components/landing/AuthModal';
import { MetricCards } from './components/dashboard/MetricCards';
import { EditorialCalendar } from './components/dashboard/EditorialCalendar';
import { PostDetailModal } from './components/dashboard/PostDetailModal';
import { BulkScheduler } from './components/bulk/BulkScheduler';
import { AccountsManager } from './components/channels/AccountsManager';
import { SettingsView } from './components/settings/SettingsView';
import { OnboardingFlow } from './components/onboarding/OnboardingFlow';
import { AuthorizedChannelsStatus } from './components/dashboard/AuthorizedChannelsStatus';
import { PendingApprovalView } from './components/auth/PendingApprovalView';
import { MasterAdminPanel } from './components/admin/MasterAdminPanel';
import { InstagramCallbackView } from './components/auth/InstagramCallbackView';

const AppContent: React.FC = () => {
  const { activeTab, user, masterEmail } = useApp();
  const [searchQuery, setSearchQuery] = useState('');

  const isMaster = user.isMaster || user.email.toLowerCase() === masterEmail.toLowerCase();
  const isPending = user.status === 'pending';
  const isBlocked = user.status === 'blocked';

  // Verifica se a URL atual é uma rota de retorno do OAuth
  const isCallbackRoute = typeof window !== 'undefined' && (
    window.location.pathname.startsWith('/auth/instagram/callback') ||
    window.location.pathname.startsWith('/auth/meta/callback') ||
    window.location.pathname.startsWith('/auth/callback')
  );

  if (isCallbackRoute) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
        <InstagramCallbackView />
        <ToastContainer />
      </div>
    );
  }

  // Dedicated full-screen Onboarding flow
  if (activeTab === 'onboarding') {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
        <OnboardingFlow />
        <ToastContainer />
      </div>
    );
  }

  // If on landing page, display standalone landing layout
  if (activeTab === 'landing') {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
        <LandingPage />
        <AuthModal />
        <ToastContainer />
      </div>
    );
  }

  // Gated Access: If user is Pending Approval or Blocked, block access to Dashboard and Scheduling tools
  if (activeTab === 'pending_approval' || ((isPending || isBlocked) && !isMaster)) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
        <PendingApprovalView />
        <ToastContainer />
      </div>
    );
  }

  // Dashboard / In-app workspace layout
  return (
    <div className="flex h-screen overflow-hidden bg-slate-950 text-slate-100 font-sans">
      {/* Sidebar navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <Header 
          onSearchChange={setSearchQuery}
          searchQuery={searchQuery}
        />

        {/* Scrollable View Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {activeTab === 'dashboard' && (
              <div className="space-y-6">
                <MetricCards />
                <AuthorizedChannelsStatus />
                <EditorialCalendar searchQuery={searchQuery} />
              </div>
            )}

            {activeTab === 'bulk' && (
              <BulkScheduler />
            )}

            {activeTab === 'accounts' && (
              <AccountsManager />
            )}

            {activeTab === 'admin' && (
              <MasterAdminPanel />
            )}

            {activeTab === 'settings' && (
              <SettingsView />
            )}
          </div>
        </main>
      </div>

      {/* Global Modals & Notifications */}
      <PostDetailModal />
      <AuthModal />
      <ToastContainer />
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
