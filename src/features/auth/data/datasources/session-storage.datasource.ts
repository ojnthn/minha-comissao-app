const TOKEN_KEY = 'minha-comissao:token';

/** Encapsula sessionStorage — nunca acessada direto fora daqui. */
export function createSessionStorageDatasource() {
  return {
    getToken: (): string | null => sessionStorage.getItem(TOKEN_KEY),
    setToken: (token: string): void => sessionStorage.setItem(TOKEN_KEY, token),
    clearToken: (): void => sessionStorage.removeItem(TOKEN_KEY),
  };
}
