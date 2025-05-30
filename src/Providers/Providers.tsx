import { authManager, SessionProvider } from '@/context/SessionContext';
import { ToastProvider } from '@/context/ToastContext';
import {
  ApolloClient,
  ApolloProvider,
  createHttpLink,
  InMemoryCache,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import React from 'react';

const httpLink = createHttpLink({
  uri: import.meta.env.VITE_API_URL,
});

const authLink = setContext((_, { headers }) => {
  const { token } = authManager.get();
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ApolloProvider client={client}>
        <ToastProvider>{children}</ToastProvider>
      </ApolloProvider>
    </SessionProvider>
  );
}
