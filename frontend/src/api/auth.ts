export type User = {
  id: string;
  email: string;
  name?: string;
};

export type LoginCredentials = {
  email: string;
  password: string;
};

export type RegisterCredentials = {
  email: string;
  password: string;
  name?: string;
};

export const authAPI = {
  async login(credentials: LoginCredentials): Promise<{ user: User; token: string }> {
    // TODO: Replace with real API call
    return {
      user: { id: '1', email: credentials.email, name: 'Test User' },
      token: 'fake-jwt-token',
    };
  },
  async register(credentials: RegisterCredentials): Promise<{ user: User; token: string }> {
    // TODO: Replace with real API call
    return {
      user: { id: '2', email: credentials.email, name: credentials.name },
      token: 'fake-jwt-token',
    };
  },
  async logout(): Promise<void> {
    // TODO: Replace with real API call
    return;
  },
  async changePassword(_currentPassword: string, _newPassword: string): Promise<void> {
    // TODO: Replace with real API call
    return;
  },
};