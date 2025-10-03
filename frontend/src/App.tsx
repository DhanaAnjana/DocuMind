// src/App.tsx
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { AuthProvider, useAuthContext } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import DashboardPage from './pages/DashboardPage';
import DocumentPage from './pages/DocumentPage';
import SearchQAPage from './pages/SearchQAPage';
import UserAccountPage from './pages/UserAccountPage';
import LoginPage from './pages/LoginPage';
import LoadingSpinner from './components/LoadingSpinner';
import './App.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
    },
  },
});

const AuthenticatedApp: React.FC = () => {
  const [activeView, setActiveView] = React.useState('dashboard');

  const renderActiveView = () => {
    switch(activeView) {
      case 'dashboard':
        return <DashboardPage />;
      case 'documents':
        return <DocumentPage />;
      case 'searchqa':
        return <SearchQAPage />;
      case 'account':
        return <UserAccountPage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <div className="App bg-background min-h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar activeView={activeView} setActiveView={setActiveView} />
        <main className="flex-1 p-6 overflow-auto">
          {renderActiveView()}
        </main>
      </div>
    </div>
  );
};

const AppContent: React.FC = () => {
  const { isAuthenticated, loading } = useAuthContext();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="text-text-dark mt-4">Loading...</p>
        </div>
      </div>
    );
  }

  return isAuthenticated ? <AuthenticatedApp /> : <LoginPage />;
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AppContent />
        <ReactQueryDevtools initialIsOpen={false} />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;