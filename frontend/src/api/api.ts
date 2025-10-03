// src/api/auth.ts
export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  plan: 'free' | 'pro' | 'enterprise';
  storageUsed: number;
  storageLimit: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  name?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

// Mock API functions - replace with actual API calls
export const authAPI = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock validation
    if (credentials.email === 'demo@example.com' && credentials.password === 'password') {
      const user: User = {
        id: '1',
        email: credentials.email,
        name: 'Demo User',
        createdAt: new Date().toISOString(),
        plan: 'pro',
        storageUsed: 42,
        storageLimit: 100,
      };
      
      return {
        user,
        token: 'mock-jwt-token',
      };
    } else {
      throw new Error('Invalid email or password');
    }
  },

  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const user: User = {
      id: Math.random().toString(36).substr(2, 9),
      email: credentials.email,
      name: credentials.name || credentials.email.split('@')[0],
      createdAt: new Date().toISOString(),
      plan: 'free',
      storageUsed: 0,
      storageLimit: 10,
    };
    
    return {
      user,
      token: 'mock-jwt-token',
    };
  },

  async logout(): Promise<void> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    // In a real app, you might want to invalidate the token on the server
  },

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock validation
    if (currentPassword === 'password') {
      // Simulate updating the password
      console.log(`Password changed to: ${newPassword}`);
      return;
    } else {
      throw new Error('Current password is incorrect');
    }
  },

  async refreshToken(): Promise<{ token: string }> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      token: 'new-mock-jwt-token',
    };
  },
};