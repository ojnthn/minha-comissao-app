import type { LoginCredentials, Session } from '../entities/session.entity';

export interface AuthRepository {
  login(credentials: LoginCredentials): Promise<Session>;
  logout(): void;
  getToken(): string | null;
}
