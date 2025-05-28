import type { LoginPayload } from '@/graphql/types';
import { authManager } from '@/utils/authManager';
import React, { createContext, useState, useCallback, useMemo } from 'react';

interface SessionData {
  token: string;
  user: LoginPayload;
}

interface SessionContextProps {
  session: SessionData;
  updateSession: (data: Partial<SessionData>) => void;
  startSession: (data: SessionData) => void;
  removeSession: () => void;
}

interface SessionProviderProps {
  children: React.ReactNode;
}

export const SessionContext = createContext<SessionContextProps | undefined>(
  undefined
);

export const SessionProvider = ({ children }: SessionProviderProps) => {
  const initialSession = authManager.get();
  const [session, setSession] = useState<SessionData>(initialSession);

  const updateSession = useCallback((data: Partial<SessionData>) => {
    setSession((prev) => {
      const updated = { ...prev, ...data };
      authManager.set(updated.token, updated.user);
      return updated;
    });
  }, []);

  const startSession = useCallback((data: SessionData) => {
    setSession(data);
    authManager.set(data.token, data.user);
  }, []);

  const removeSession = useCallback(() => {
    setSession({ token: '', user: {} as LoginPayload });
    authManager.clear();
  }, []);

  const contextValue = useMemo(
    () => ({ session, updateSession, startSession, removeSession }),
    [session, updateSession, startSession, removeSession]
  );

  return (
    <SessionContext.Provider value={contextValue}>
      {children}
    </SessionContext.Provider>
  );
};
