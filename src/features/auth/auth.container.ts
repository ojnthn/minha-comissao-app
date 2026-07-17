import { configureHttpClient } from '../../shared/http/http-client';
import { createAuthRepository } from './data/repositories/auth.repository.impl';

const authRepository = createAuthRepository();

configureHttpClient({
  getToken: () => authRepository.getToken(),
  onUnauthorized: () => {
    authRepository.logout();
    window.location.assign('/login');
  },
});

export const authContainer = {
  login: authRepository.login,
  logout: authRepository.logout,
  isAuthenticated: () => authRepository.getToken() !== null,
};
