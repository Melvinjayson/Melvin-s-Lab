import { useState, useEffect } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { io, Socket } from 'socket.io-client';

// Pages
import Home from '@pages/Home';
import ChatPage from '@pages/ChatPage';
import KnowledgeGraphPage from '@pages/KnowledgeGraphPage';
import FeaturesPage from '@pages/FeaturesPage';
import NotFound from '@pages/NotFound';
import SplashPage from '@pages/SplashPage';

// Components
import Header from '@components/layout/Header';
import Footer from '@components/layout/Footer';
import Sidebar from '@components/layout/Sidebar';

// Context
import { SocketProvider } from '@context/SocketContext';
import { AuthProvider } from '@context/AuthContext';
import { SystemStatusProvider } from '@context/SystemStatusContext';

// Types
import { SystemStatus } from '@types/system';

// Hooks
import useSystemStatus from '@hooks/useSystemStatus';

/**
 * Main App component
 */
function App() {
  const location = useLocation();
  const [socket, setSocket] = useState<Socket | null>(null);
  const { systemStatus, updateSystemStatus } = useSystemStatus();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Initialize WebSocket connection
  useEffect(() => {
    const socketInstance = io(import.meta.env.VITE_API_URL || 'http://localhost:3000', {
      transports: ['websocket'],
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socketInstance.on('connect', () => {
      console.log('WebSocket connected');
    });

    socketInstance.on('error', (error) => {
      console.error('WebSocket error:', error);
    });

    socketInstance.on('system_status', (status: SystemStatus) => {
      updateSystemStatus(status);
    });

    setSocket(socketInstance);

    // Cleanup on unmount
    return () => {
      socketInstance.disconnect();
    };
  }, [updateSystemStatus]);

  // Toggle sidebar
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Check if we're on the splash page
  const isOnSplashPage = location.pathname === '/splash';

  return (
    <AuthProvider>
      <SocketProvider socket={socket}>
        <SystemStatusProvider value={systemStatus}>
          <div className="flex h-full bg-gray-50">
            {!isOnSplashPage && (
              <>
                <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
                <div className="flex flex-col flex-1 overflow-hidden">
                  <Header onMenuClick={toggleSidebar} systemStatus={systemStatus} />
                  <main className="flex-1 overflow-y-auto bg-gray-50 p-4">
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/chat" element={<ChatPage />} />
                      <Route path="/knowledge-graph" element={<KnowledgeGraphPage />} />
                      <Route path="/features" element={<FeaturesPage />} />
                      <Route path="/splash" element={<SplashPage />} />
                      <Route path="/404" element={<NotFound />} />
                      <Route path="*" element={<Navigate to="/404" replace />} />
                    </Routes>
                  </main>
                  <Footer />
                </div>
              </>
            )}
            {isOnSplashPage && (
              <main className="flex-1">
                <Routes>
                  <Route path="/splash" element={<SplashPage />} />
                </Routes>
              </main>
            )}
          </div>
        </SystemStatusProvider>
      </SocketProvider>
    </AuthProvider>
  );
}

export default App;