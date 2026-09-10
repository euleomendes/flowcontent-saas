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

const AppContent: React.FC = () => {
  const { activeTab } = useApp();
  const [searchQuery, setSearchQuery] = useState('');

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
                <EditorialCalendar searchQuery={searchQuery} />
              </div>
            )}

            {activeTab === 'bulk' && (
              <BulkScheduler />
            )}

            {activeTab === 'accounts' && (
              <AccountsManager />
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
