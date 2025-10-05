// components/ThemeSelector.tsx
import { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Palette, Check } from 'lucide-react';

const ThemeSelector: React.FC = () => {
  const { currentTheme, themes, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2.5 text-text-secondary hover:bg-surface-muted/50 rounded-xl transition-all duration-200 hover:scale-105"
        title="Change Theme"
      >
        <Palette className="w-5 h-5" />
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          <div className={`absolute right-0 mt-2 w-72 rounded-xl shadow-large border py-3 z-50 animate-in fade-in slide-in-from-top-2 duration-200 ${
            currentTheme.id === 'dark' 
              ? 'bg-surface border-surface-muted' 
              : 'bg-white border-border'
          }`}>
            <div className={`px-4 py-2 border-b ${
              currentTheme.id === 'dark' ? 'border-surface-muted' : 'border-border'
            }`}>
              <h3 className={`font-semibold ${
                currentTheme.id === 'dark' ? 'text-white' : 'text-text-primary'
              }`}>Choose Theme</h3>
              <p className="text-xs text-text-muted mt-0.5">Select your favorite color scheme</p>
            </div>
            
            <div className="py-2 max-h-96 overflow-y-auto">
              {themes.map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => {
                    setTheme(theme.id);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-4 py-3 transition-colors ${
                    currentTheme.id === theme.id 
                      ? 'bg-primary/5' 
                      : currentTheme.id === 'dark'
                        ? 'hover:bg-surface-muted/30'
                        : 'hover:bg-surface-muted/30'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="flex space-x-1">
                      <div 
                        className="w-6 h-6 rounded-md shadow-sm border border-gray-200"
                        style={{ backgroundColor: theme.colors.primary }}
                      />
                      <div 
                        className="w-6 h-6 rounded-md shadow-sm border border-gray-200"
                        style={{ backgroundColor: theme.colors.secondary }}
                      />
                      <div 
                        className="w-6 h-6 rounded-md shadow-sm border border-gray-200"
                        style={{ backgroundColor: theme.colors.accent }}
                      />
                    </div>
                    <span className={`text-sm font-medium ${
                      currentTheme.id === 'dark' ? 'text-white' : 'text-text-primary'
                    }`}>
                      {theme.name}
                    </span>
                  </div>
                  {currentTheme.id === theme.id && (
                    <Check className="w-5 h-5 text-primary" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ThemeSelector;