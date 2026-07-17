import { httpClient } from '../../../../shared/http/http-client';

interface LoginResponseDto {
  token: string;
}

interface MeResponseDto {
  nome: string;
  email: string;
}

export function createAuthHttpDatasource() {
  return {
    login: (email: string, senha: string) =>
      httpClient.post<LoginResponseDto>('/auth/login', { email, senha }),
    getMe: () => httpClient.get<MeResponseDto>('/auth'),
  };
}
