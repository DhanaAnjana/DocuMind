// src/hooks/useAuth.tsx
import { useState, useEffect, useCallback } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authAPI, type User, type LoginCredentials, type RegisterCredentials } from '../api/auth';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const queryClient = useQueryClient();

  // Check for existing session on mount
  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    const userData = localStorage.getItem('user_data');
    
    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_data');
      }
    }
    setLoading(false);
  }, []);

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: (credentials: LoginCredentials) => authAPI.login(credentials),
    onSuccess: (data: { user: User; token: string }) => {
      const { user, token } = data;
      setUser(user);
      localStorage.setItem('auth_token', token);
      localStorage.setItem('user_data', JSON.stringify(user));
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
    onError: (error: Error) => {
      console.error('Login failed:', error);
      throw error;
    },
  });

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: (credentials: RegisterCredentials) => authAPI.register(credentials),
    onSuccess: (data: { user: User; token: string }) => {
      const { user, token } = data;
      setUser(user);
      localStorage.setItem('auth_token', token);
      localStorage.setItem('user_data', JSON.stringify(user));
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
    onError: (error: Error) => {
      console.error('Registration failed:', error);
      throw error;
    },
  });

  // Change password mutation
  const changePasswordMutation = useMutation({
    mutationFn: ({ currentPassword, newPassword }: { currentPassword: string; newPassword: string }) =>
      authAPI.changePassword(currentPassword, newPassword),
    onSuccess: () => {
      // Password changed successfully
    },
    onError: (error: Error) => {
      console.error('Password change failed:', error);
      throw error;
    },
  });

  // Login function
  const login = useCallback(async (email: string, password: string) => {
    await loginMutation.mutateAsync({ email, password });
  }, [loginMutation]);

  // Register function
  const register = useCallback(async (email: string, password: string, name?: string) => {
    await registerMutation.mutateAsync({ email, password, name });
  }, [registerMutation]);

  // Logout function
  const logout = useCallback(async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
      queryClient.clear();
    }
  }, [queryClient]);

  // Change password function
  const changePassword = useCallback(async (currentPassword: string, newPassword: string) => {
    await changePasswordMutation.mutateAsync({ currentPassword, newPassword });
  }, [changePasswordMutation]);

  return {
    user,
    loading: loading || loginMutation.isPending || registerMutation.isPending,
    login,
    register,
    logout,
    changePassword,
    isAuthenticated: !!user,
    loginError: loginMutation.error,
    registerError: registerMutation.error,
  };
};