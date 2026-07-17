import { useState, type FormEvent } from 'react';
import { Button, FormField, Toast, colors, fontFamily, fontSize, fontWeight, radius, spacing } from 'minhas-venda-design-system';
import { useAuth } from '../hooks/use-auth.hook';

interface LoginPageProps {
  onLoginSuccess: () => void;
}

export function LoginPage({ onLoginSuccess }: LoginPageProps) {
  const { isLoading, error, login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const isValid = email.trim().length > 0 && password.length > 0;

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!isValid || isLoading) return;

    const success = await login({ email, password });
    if (success) onLoginSuccess();
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: colors.background.page,
        fontFamily,
        color: colors.text.primary,
        padding: spacing[20],
        boxSizing: 'border-box',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '380px',
          background: colors.background.surface,
          borderRadius: radius[16],
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.08)',
          padding: spacing[32],
          boxSizing: 'border-box',
        }}
      >
        <div style={{ marginBottom: spacing[28] }}>
          <div style={{ fontSize: fontSize[20], fontWeight: fontWeight.extrabold, letterSpacing: '-0.2px' }}>
            Minha Comissão
          </div>
          <div style={{ fontSize: fontSize[14], color: colors.text.muted }}>Entre para continuar</div>
        </div>

        {error && (
          <div style={{ marginBottom: spacing[18] }}>
            <Toast variant="danger">{error}</Toast>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div style={{ marginBottom: spacing[18] }}>
            <FormField
              label="Email"
              inputProps={{
                type: 'text',
                value: email,
                onChange: (event) => setEmail(event.target.value),
                placeholder: 'voce@exemplo.com',
                autoComplete: 'username',
                autoFocus: true,
              }}
            />
          </div>

          <div style={{ marginBottom: spacing[26] }}>
            <FormField
              label="Senha"
              inputProps={{
                type: 'password',
                value: password,
                onChange: (event) => setPassword(event.target.value),
                placeholder: '••••••••',
                autoComplete: 'current-password',
              }}
            />
          </div>

          <Button type="submit" variant="primary" size="md" fullWidth disabled={!isValid || isLoading}>
            {isLoading ? 'Entrando...' : 'Entrar'}
          </Button>
        </form>
      </div>
    </div>
  );
}
