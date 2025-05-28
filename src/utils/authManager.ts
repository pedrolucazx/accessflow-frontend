import { LOCAL_STORAGE } from '@/config/constants';
import type { LoginPayload } from '@/graphql/types';

export const authManager = {
  set: (token: string, user: LoginPayload) => {
    try {
      localStorage.setItem(LOCAL_STORAGE.TOKEN, token);
      localStorage.setItem(LOCAL_STORAGE.USER, JSON.stringify(user));
      return true;
    } catch {
      return false;
    }
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
