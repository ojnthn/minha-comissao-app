import type { AuthRepository } from '../../domain/repositories/auth.repository';
import type { LoginCredentials, Session } from '../../domain/entities/session.entity';
import { createAuthHttpDatasource } from '../datasources/auth-http.datasource';
import { createSessionStorageDatasource } from '../datasources/session-storage.datasource';

export function createAuthRepository(): AuthRepository {
  const httpDatasource = createAuthHttpDatasource();
  const storageDatasource = createSessionStorageDatasource();

  return {
    async login(credentials: LoginCredentials): Promise<Session> {
      const response = await httpDatasource.login(credentials.email, credentials.password);
      storageDatasource.setToken(response.token);
      return { token: response.token };
    },
    logout() {
      storageDatasource.clearToken();
    },
    getToken() {
      return storageDatasource.getToken();
    },
  };
}
