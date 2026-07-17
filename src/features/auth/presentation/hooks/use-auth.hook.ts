import { useCallback, useState } from 'react';
import { authContainer } from '../../auth.container';
import { isValidLoginCredentials, type LoginCredentials } from '../../domain/entities/session.entity';

interface UseAuthState {
  isLoading: boolean;
  error: string | null;
}

export function useAuth() {
  const [state, setState] = useState<UseAuthState>({ isLoading: false, error: null });

  const login = useCallback(async (credentials: LoginCredentials): Promise<boolean> => {
    if (!isValidLoginCredentials(credentials)) {
      setState({ isLoading: false, error: 'Informe um e-mail válido e a senha.' });
      return false;
    }

    setState({ isLoading: true, error: null });
    try {
      await authContainer.login(credentials);
      setState({ isLoading: false, error: null });
      return true;
    } catch (error) {
      setState({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Não foi possível entrar. Tente novamente.',
      });
      return false;
    }
  }, []);

  return { ...state, login };
}
