import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AuthError {
  type: 'user_not_registered' | 'auth_required' | string;
  message?: string;
}

interface AuthContextType {
  user: null | Record<string, unknown>;
  isLoadingAuth: boolean;
  isLoadingPublicSettings: boolean;
  authError: AuthError | null;
  navigateToLogin: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoadingAuth: false,
  isLoadingPublicSettings: false,
  authError: null,
  navigateToLogin: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user] = useState<null | Record<string, unknown>>(null);
  const [isLoadingAuth] = useState(false);
  const [isLoadingPublicSettings] = useState(false);
  const [authError] = useState<AuthError | null>(null);

  const navigateToLogin = () => {
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{
      user,
      isLoadingAuth,
      isLoadingPublicSettings,
      authError,
      navigateToLogin
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
