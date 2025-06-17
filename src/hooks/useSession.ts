import { SessionContext, type SessionData } from '@/context/SessionContext';
import type { LoginPayload } from '@/graphql/types';
import { useContext } from 'react';

export interface UseSessionReturn {
  session: SessionData;
  user: LoginPayload;
  token: string;
  isAuth: boolean;
  isAdmin: boolean;
  startSession: (data: SessionData) => void;
  removeSession: () => void;
}

export const useSession = (): UseSessionReturn => {
  const context = useContext(SessionContext);

  if (!context) {
    throw new Error('useSession must be used within a SessionProvider');
  }

  try {
    const { token, user } = context.session;

    return {
      ...context,
      token,
      user,
      isAuth: Boolean(token && user),
      isAdmin: Boolean(user?.perfis?.some((p) => p.nome === 'admin')),
    };
  } catch (error) {
    console.error(error);

    return {
      ...context,
      token: '',
      user: {} as LoginPayload,
      isAuth: false,
      isAdmin: false,
    };
  }
};
