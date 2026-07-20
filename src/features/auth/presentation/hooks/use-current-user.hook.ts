import { useEffect, useState } from 'react';
import { authContainer } from '../../auth.container';
import type { User } from '../../domain/entities/session.entity';

export function useCurrentUser() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (!authContainer.isAuthenticated()) return;

    let cancelled = false;

    authContainer
      .getMe()
      .then((me) => {
        if (!cancelled) setUser(me);
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, []);

  return { user };
}
