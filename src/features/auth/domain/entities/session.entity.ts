export interface Session {
  token: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface User {
  name: string;
  email: string;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidLoginCredentials(credentials: LoginCredentials): boolean {
  return EMAIL_PATTERN.test(credentials.email) && credentials.password.length > 0;
}

export function getInitials(name: string): string {
  const letters = name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? '');
  return letters.join('') || '?';
}
