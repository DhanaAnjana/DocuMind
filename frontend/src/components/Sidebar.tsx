// src/components/Sidebar.tsx
import { LayoutDashboard, FileText, Search, User, ChevronRight } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface SidebarProps {
  activeView: string;
  setActiveView: (view: string) => void;
}

const Sidebar = ({ activeView, setActiveView }: SidebarProps) => {
  const { currentTheme } = useTheme();
  const isDarkMode = currentTheme.id === 'dark';

  const menuItems = [
    { 
      id: 'dashboard', 
      label: 'Dashboard', 
      icon: LayoutDashboard,
      badge: null
    },
    { 
      id: 'documents', 
      label: 'Documents', 
      icon: FileText,
      badge: '12'
    },
    { 
      id: 'searchqa', 
      label: 'Search & Q&A', 
      icon: Search,
      badge: null
    },
    { 
      id: 'account', 
      label: 'Account', 
      icon: User,
      badge: null
    },
  ];

  return (
    <aside className={`w-72 border-r border-border min-h-screen p-6 flex flex-col ${
      isDarkMode ? 'bg-surface' : 'bg-white'
    }`}>
      {/* Navigation Menu */}
      <nav className="flex-1 mt-8">
        <div className="space-y-1.5">
          {menuItems.map(item => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={`
                  group relative w-full flex items-center justify-between p-3.5 rounded-xl 
                  transition-all duration-200 font-medium text-sm
                  ${isActive 
                    ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-medium' 
                    : isDarkMode
                      ? 'text-text-muted hover:bg-surface-muted/30 hover:text-white'
                      : 'text-text-secondary hover:bg-surface-muted/50 hover:text-primary'
                  }
                `}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`w-5 h-5 ${
                    isActive 
                      ? 'text-white' 
                      : isDarkMode 
                        ? 'text-text-muted group-hover:text-white' 
                        : 'text-text-muted group-hover:text-primary'
                  } transition-colors`} />
                  <span>{item.label}</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  {item.badge && (
                    <span className={`
                      px-2 py-0.5 rounded-full text-xs font-semibold
                      ${isActive 
                        ? 'bg-white/20 text-white' 
                        : 'bg-accent/10 text-accent'
                      }
                    `}>
                      {item.badge}
                    </span>
                  )}
                  {isActive && (
                    <ChevronRight className="w-4 h-4 text-white" />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Storage Usage Card */}
      <div className={`mt-auto pt-6 border-t ${
        isDarkMode ? 'border-surface-muted' : 'border-border'
      }`}>
        <div className={`rounded-xl p-4 border ${
          isDarkMode 
            ? 'bg-surface-muted/20 border-surface-muted' 
            : 'bg-gradient-to-br from-accent/10 to-secondary/10 border-accent/20'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <span className={`text-sm font-medium ${
              isDarkMode ? 'text-white' : 'text-text-primary'
            }`}>Storage</span>
            <span className={`text-xs ${
              isDarkMode ? 'text-text-muted' : 'text-text-muted'
            }`}>42%</span>
          </div>
          <div className={`w-full rounded-full h-2 overflow-hidden ${
            isDarkMode ? 'bg-surface-muted/50' : 'bg-white/50'
          }`}>
            <div className="bg-gradient-to-r from-primary to-accent h-full rounded-full transition-all duration-500" style={{ width: '42%' }}></div>
          </div>
          <p className={`text-xs mt-2 ${
            isDarkMode ? 'text-text-muted' : 'text-text-muted'
          }`}>4.2 GB of 10 GB used</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;