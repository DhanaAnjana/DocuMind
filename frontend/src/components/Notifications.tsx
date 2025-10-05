// components/Notifications.tsx
import { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Bell, Check, X, FileText, AlertCircle, CheckCircle, Clock } from 'lucide-react';

interface Notification {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message: string;
  time: string;
  read: boolean;
}

const Notifications: React.FC = () => {
  const { currentTheme } = useTheme();
  const isDarkMode = currentTheme.id === 'dark';
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'success',
      title: 'Document Processed',
      message: 'Contract_2024.pdf has been successfully processed',
      time: '2 min ago',
      read: false
    },
    {
      id: '2',
      type: 'info',
      title: 'New Feature Available',
      message: 'Try our new theme selector in the navbar',
      time: '1 hour ago',
      read: false
    },
    {
      id: '3',
      type: 'warning',
      title: 'Storage Warning',
      message: 'You have used 80% of your storage quota',
      time: '3 hours ago',
      read: true
    },
    {
      id: '4',
      type: 'success',
      title: 'Upload Complete',
      message: 'Invoice_Jan.pdf uploaded successfully',
      time: '1 day ago',
      read: true
    }
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-success" />;
      case 'info':
        return <FileText className="w-5 h-5 text-accent" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-warning" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-error" />;
      default:
        return <Bell className="w-5 h-5 text-text-muted" />;
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`relative p-2.5 rounded-xl transition-all duration-200 hover:scale-105 ${
          isDarkMode
            ? 'text-text-muted hover:bg-surface-muted/50 hover:text-white'
            : 'text-text-secondary hover:bg-surface-muted/50'
        }`}
        title="Notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1.5 bg-error rounded-full ring-2 ring-white flex items-center justify-center text-xs font-bold text-white">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          <div className={`absolute right-0 mt-2 w-96 rounded-xl shadow-large border z-50 animate-in fade-in slide-in-from-top-2 duration-200 ${
            isDarkMode
              ? 'bg-surface border-surface-muted'
              : 'bg-white border-border'
          }`}>
            {/* Header */}
            <div className={`px-4 py-3 border-b flex items-center justify-between ${
              isDarkMode ? 'border-surface-muted' : 'border-border'
            }`}>
              <div>
                <h3 className={`font-semibold ${
                  isDarkMode ? 'text-white' : 'text-text-primary'
                }`}>Notifications</h3>
                <p className="text-xs text-text-muted">
                  {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up!'}
                </p>
              </div>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-xs text-primary hover:text-secondary font-medium transition-colors"
                >
                  Mark all read
                </button>
              )}
            </div>

            {/* Notifications List */}
            <div className="max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="py-12 text-center">
                  <Bell className={`w-12 h-12 mx-auto mb-3 ${
                    isDarkMode ? 'text-text-muted' : 'text-text-light'
                  }`} />
                  <p className={`text-sm ${
                    isDarkMode ? 'text-text-muted' : 'text-text-light'
                  }`}>No notifications</p>
                </div>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`px-4 py-3 border-b transition-colors ${
                      isDarkMode ? 'border-surface-muted' : 'border-border'
                    } ${
                      !notification.read 
                        ? isDarkMode 
                          ? 'bg-primary/5 hover:bg-primary/10' 
                          : 'bg-primary/5 hover:bg-primary/10'
                        : isDarkMode
                          ? 'hover:bg-surface-muted/30'
                          : 'hover:bg-surface-muted/30'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 mt-0.5">
                        {getIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <p className={`text-sm font-semibold ${
                              isDarkMode ? 'text-white' : 'text-text-primary'
                            }`}>
                              {notification.title}
                              {!notification.read && (
                                <span className="ml-2 inline-block w-2 h-2 bg-primary rounded-full"></span>
                              )}
                            </p>
                            <p className={`text-xs mt-0.5 ${
                              isDarkMode ? 'text-text-muted' : 'text-text-light'
                            }`}>
                              {notification.message}
                            </p>
                            <div className="flex items-center mt-2 space-x-2">
                              <Clock className="w-3 h-3 text-text-muted" />
                              <span className="text-xs text-text-muted">{notification.time}</span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-1">
                            {!notification.read && (
                              <button
                                onClick={() => markAsRead(notification.id)}
                                className="p-1 hover:bg-success/10 rounded transition-colors"
                                title="Mark as read"
                              >
                                <Check className="w-4 h-4 text-success" />
                              </button>
                            )}
                            <button
                              onClick={() => deleteNotification(notification.id)}
                              className="p-1 hover:bg-error/10 rounded transition-colors"
                              title="Delete"
                            >
                              <X className="w-4 h-4 text-error" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className={`px-4 py-3 border-t ${
                isDarkMode ? 'border-surface-muted' : 'border-border'
              }`}>
                <button
                  onClick={() => {
                    setNotifications([]);
                    setIsOpen(false);
                  }}
                  className={`w-full text-sm font-medium py-2 rounded-lg transition-colors ${
                    isDarkMode
                      ? 'text-text-muted hover:bg-surface-muted/30 hover:text-white'
                      : 'text-text-secondary hover:bg-surface-muted/50'
                  }`}
                >
                  Clear All Notifications
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Notifications;