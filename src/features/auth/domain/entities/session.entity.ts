export interface Session {
  token: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidLoginCredentials(credentials: LoginCredentials): boolean {
  return EMAIL_PATTERN.test(credentials.email) && credentials.password.length > 0;
}
