import { httpClient } from '../../../../shared/http/http-client';

interface LoginResponseDto {
  token: string;
}

export function createAuthHttpDatasource() {
  return {
    login: (email: string, senha: string) =>
      httpClient.post<LoginResponseDto>('/auth/login', { email, senha }),
  };
}
