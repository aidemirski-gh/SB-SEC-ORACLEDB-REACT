import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { apiService } from '../services/api';
import type { AuthResponse, LoginRequest, RegisterRequest } from '../services/api';

interface AuthContextType {
  user: AuthResponse | null;
  loading: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (userData: RegisterRequest) => Promise<void>;
  logout: () => void;
  updateLanguagePreference: (language: string) => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const { i18n } = useTranslation();

  useEffect(() => {
    // Check if user is already logged in
    const currentUser = apiService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      // Sync language with user preference
      if (currentUser.languagePreference && i18n.language !== currentUser.languagePreference) {
        i18n.changeLanguage(currentUser.languagePreference);
      }
    }
    setLoading(false);
  }, [i18n]);

  const login = async (credentials: LoginRequest) => {
    const response = await apiService.login(credentials);
    setUser(response);
    // Sync language with user preference
    if (response.languagePreference) {
      await i18n.changeLanguage(response.languagePreference);
    }
  };

  const register = async (userData: RegisterRequest) => {
    // Include current language preference in registration
    const currentLanguage = i18n.language || 'en';
    const response = await apiService.register({
      ...userData,
      languagePreference: currentLanguage
    });
    setUser(response);
  };

  const logout = () => {
    apiService.logout();
    setUser(null);
  };

  const updateLanguagePreference = async (language: string) => {
    if (user) {
      await apiService.updateUserLanguagePreference(user.id, language);
      // Update local user state
      const updatedUser = { ...user, languagePreference: language };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateLanguagePreference,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
