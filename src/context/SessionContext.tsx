import { LOCAL_STORAGE } from '@/config/constants';
import type { LoginPayload } from '@/graphql/types';
import React, { createContext, useCallback, useMemo, useState } from 'react';

export interface SessionData {
  token: string;
  user: LoginPayload;
}

interface SessionContextProps {
  session: SessionData;
  startSession: (data: SessionData) => void;
  removeSession: () => void;
}

interface SessionProviderProps {
  children: React.ReactNode;
}

export const SessionContext = createContext<SessionContextProps | undefined>(
  undefined
);

export const authManager = {
  set: (token: string, user: LoginPayload) => {
    localStorage.setItem(LOCAL_STORAGE.TOKEN, token);
    localStorage.setItem(LOCAL_STORAGE.USER, JSON.stringify(user));
  },

  get: () => {
    const token = localStorage.getItem(LOCAL_STORAGE.TOKEN) || '';
    const user = localStorage.getItem(LOCAL_STORAGE.USER);
    return { token, user: user ? JSON.parse(user) : {} };
  },

  clear: () => {
    localStorage.removeItem(LOCAL_STORAGE.TOKEN);
    localStorage.removeItem(LOCAL_STORAGE.USER);
  },
};

export const SessionProvider = ({ children }: SessionProviderProps) => {
  const initialSession = authManager.get();
  const [session, setSession] = useState<SessionData>(initialSession);

  const startSession = useCallback((data: SessionData) => {
    setSession(data);
    authManager.set(data.token, data.user);
  }, []);

  const removeSession = useCallback(() => {
    setSession({ token: '', user: {} as LoginPayload });
    authManager.clear();
  }, []);

  const contextValue = useMemo(
    () => ({ session, startSession, removeSession }),
    [session, startSession, removeSession]
  );

  return (
    <SessionContext.Provider value={contextValue}>
      {children}
    </SessionContext.Provider>
  );
};
