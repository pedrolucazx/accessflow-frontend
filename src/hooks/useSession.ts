import { SessionContext, authManager } from '@/context/SessionContext';
import { useContext } from 'react';

export const useSession = () => {
  const context = useContext(SessionContext);

  if (!context) {
    throw new Error('useSession must be used within a SessionProvider');
  }

  try {
    const { token, user } = authManager.get();
    return {
      ...context,
      user,
      token,
      isAuth: Boolean(token && user),
    };
  } catch (error) {
    console.error(error);
    return {
      ...context,
      isAuth: false,
    };
  }
};
