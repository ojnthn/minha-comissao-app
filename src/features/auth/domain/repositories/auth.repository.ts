import type { LoginCredentials, Session, User } from '../entities/session.entity';

export interface AuthRepository {
  login(credentials: LoginCredentials): Promise<Session>;
  logout(): void;
  getToken(): string | null;
  getMe(): Promise<User>;
}
