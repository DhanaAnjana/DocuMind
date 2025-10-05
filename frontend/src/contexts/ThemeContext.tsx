// src/contexts/ThemeContext.tsx
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Theme {
  id: string;
  name: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    surfaceMuted: string;
    success: string;
    warning: string;
    error: string;
    textPrimary: string;
    textSecondary: string;
    textMuted: string;
    border: string;
  };
}

const themes: Theme[] = [
  {
    id: 'purple',
    name: 'Purple Dream',
    colors: {
      primary: '#6B3F69',
      secondary: '#8D5F8C',
      accent: '#A376A2',
      background: '#FFF5F7',
      surface: '#FFFFFF',
      surfaceMuted: '#DDC3C3',
      success: '#27ae60',
      warning: '#f39c12',
      error: '#e74c3c',
      textPrimary: '#2d1b2e',
      textSecondary: '#6B3F69',
      textMuted: '#8D5F8C',
      border: '#DDC3C3',
    }
  },
  {
    id: 'blue',
    name: 'Ocean Blue',
    colors: {
      primary: '#1e40af',
      secondary: '#3b82f6',
      accent: '#60a5fa',
      background: '#eff6ff',
      surface: '#ffffff',
      surfaceMuted: '#dbeafe',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      textPrimary: '#1e3a8a',
      textSecondary: '#1e40af',
      textMuted: '#3b82f6',
      border: '#bfdbfe',
    }
  },
  {
    id: 'green',
    name: 'Forest Green',
    colors: {
      primary: '#065f46',
      secondary: '#059669',
      accent: '#10b981',
      background: '#f0fdf4',
      surface: '#ffffff',
      surfaceMuted: '#d1fae5',
      success: '#22c55e',
      warning: '#f59e0b',
      error: '#ef4444',
      textPrimary: '#064e3b',
      textSecondary: '#065f46',
      textMuted: '#059669',
      border: '#a7f3d0',
    }
  },
  {
    id: 'orange',
    name: 'Sunset Orange',
    colors: {
      primary: '#c2410c',
      secondary: '#ea580c',
      accent: '#fb923c',
      background: '#fff7ed',
      surface: '#ffffff',
      surfaceMuted: '#fed7aa',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#dc2626',
      textPrimary: '#7c2d12',
      textSecondary: '#c2410c',
      textMuted: '#ea580c',
      border: '#fdba74',
    }
  },
  {
    id: 'pink',
    name: 'Rose Pink',
    colors: {
      primary: '#be185d',
      secondary: '#db2777',
      accent: '#ec4899',
      background: '#fdf2f8',
      surface: '#ffffff',
      surfaceMuted: '#fce7f3',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#dc2626',
      textPrimary: '#831843',
      textSecondary: '#be185d',
      textMuted: '#db2777',
      border: '#fbcfe8',
    }
  },
  {
    id: 'teal',
    name: 'Teal Breeze',
    colors: {
      primary: '#0f766e',
      secondary: '#14b8a6',
      accent: '#2dd4bf',
      background: '#f0fdfa',
      surface: '#ffffff',
      surfaceMuted: '#ccfbf1',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      textPrimary: '#134e4a',
      textSecondary: '#0f766e',
      textMuted: '#14b8a6',
      border: '#99f6e4',
    }
  },
  {
    id: 'indigo',
    name: 'Deep Indigo',
    colors: {
      primary: '#4338ca',
      secondary: '#6366f1',
      accent: '#818cf8',
      background: '#eef2ff',
      surface: '#ffffff',
      surfaceMuted: '#e0e7ff',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      textPrimary: '#312e81',
      textSecondary: '#4338ca',
      textMuted: '#6366f1',
      border: '#c7d2fe',
    }
  },
  {
    id: 'dark',
    name: 'Dark Mode',
    colors: {
      primary: '#8b5cf6',
      secondary: '#a78bfa',
      accent: '#c4b5fd',
      background: '#0f172a',
      surface: '#1e293b',
      surfaceMuted: '#334155',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      textPrimary: '#f1f5f9',
      textSecondary: '#cbd5e1',
      textMuted: '#94a3b8',
      border: '#475569',
    }
  }
];

interface ThemeContextType {
  currentTheme: Theme;
  themes: Theme[];
  setTheme: (themeId: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [currentTheme, setCurrentTheme] = useState<Theme>(() => {
    const savedThemeId = localStorage.getItem('app_theme');
    return themes.find(t => t.id === savedThemeId) || themes[0];
  });

  const setTheme = (themeId: string) => {
    const theme = themes.find(t => t.id === themeId);
    if (theme) {
      setCurrentTheme(theme);
      localStorage.setItem('app_theme', themeId);
    }
  };

  useEffect(() => {
    const root = document.documentElement;
    Object.entries(currentTheme.colors).forEach(([key, value]) => {
      const cssVar = key.replace(/([A-Z])/g, '-$1').toLowerCase();
      root.style.setProperty(`--${cssVar}`, value);
    });
  }, [currentTheme]);

  return (
    <ThemeContext.Provider value={{ currentTheme, themes, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};