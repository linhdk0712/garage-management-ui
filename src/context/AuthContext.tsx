import React, { useState, useEffect, useCallback, useMemo, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, register, logout, requestPasswordReset } from '../api/auth';
import { User, LoginCredentials, RegisterData } from '../types/auth.types';
import { getStoredAuth, setStoredAuth, removeStoredAuth } from '../utils/storageUtils';
import { AuthContext } from './AuthContextType';
import { USER_ROLES } from '../config/constants';

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = useCallback(async (credentials: LoginCredentials) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await login(credentials);

      const userData: User = {
        id: response.id,
        username: response.username,
        email: response.email,
        roles: response.roles,
        firstName: response.firstName,
        lastName: response.lastName
      };
      
      setUser(userData);
      const authData = {
        token: response.token,
        user: userData,
      };
      setStoredAuth(authData);
      
      const role = response.roles[0];
      navigate(getInitialRoutePath(role));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to login');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  const handleRegister = useCallback(async (data: RegisterData) => {
    try {
      setIsLoading(true);
      setError(null);
      await register(data);
      navigate('/auth/login');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to register');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  const handleLogout = useCallback(async () => {
    try {
      getStoredAuth();
      if (user?.id) {
        try {
          await logout(user.id);
        } catch (error) {
          console.error("Error during logout API call:", error);
        }
      }
    } finally {
      setUser(null);
      removeStoredAuth();
      navigate('/auth/login');
    }
  }, [navigate, user?.id]);

  useEffect(() => {
    const initAuth = async () => {
      setIsLoading(true);
      try {
        const auth = getStoredAuth();
        if (auth?.token && auth?.user) {
          setUser(auth.user);
        }
      } catch (err: unknown) {
        console.error('Auth initialization failed:', err);
        setUser(null);
        setError(err instanceof Error ? err.message : 'Failed to initialize authentication'); 
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const getInitialRoutePath = (role: string): string => {
    switch (role) {
      case USER_ROLES.CUSTOMER:
        return '/customer/dashboard';
      case USER_ROLES.STAFF:
        return '/staff/appointments';
      case USER_ROLES.MANAGER:
        return '/manager/dashboard';
      default:
        return '/auth/login';
    }
  };

  const handleRequestPasswordReset = useCallback(async (email: string) => {
    try {
      setIsLoading(true);
      setError(null);
      await requestPasswordReset(email);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to send password reset email');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const value = useMemo(() => ({
    user,
    isAuthenticated: !!user,
    isLoading,
    error,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
    requestPasswordReset: handleRequestPasswordReset,
  }), [user, isLoading, error, handleLogin, handleRegister, handleLogout, handleRequestPasswordReset]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};