import { ROUTES } from '@/config/routes';
import { authManager, SessionProvider } from '@/context/SessionContext';
import { ToastProvider } from '@/context/ToastContext';
import {
  ApolloClient,
  ApolloProvider,
  from,
  HttpLink,
  InMemoryCache,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

export function Providers({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const httpLink = useMemo(
    () => new HttpLink({ uri: import.meta.env.VITE_API_URL }),
    []
  );

  const errorLink = useMemo(
    () =>
      onError(({ graphQLErrors }) => {
        if (!graphQLErrors) return;

        const unauthenticatedError = graphQLErrors.find(
          (err) => err.extensions?.code === 'UNAUTHENTICATED'
        );
        const forbiddenError = graphQLErrors.find(
          (err) => err.extensions?.code === 'FORBIDDEN'
        );

        if (forbiddenError) {
          navigate(ROUTES.PROTECTED.HOME, { replace: true });
          return;
        }

        if (unauthenticatedError) {
          authManager.clear();
          navigate(ROUTES.NOT_PROTECTED.LOGIN, { replace: true });
        }
      }),
    [navigate, authManager]
  );

  const authLink = useMemo(
    () =>
      setContext((_, { headers }) => {
        const { token } = authManager.get();
        return {
          headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : '',
          },
        };
      }),
    []
  );

  const client = useMemo(
    () =>
      new ApolloClient({
        link: from([errorLink, authLink, httpLink]),
        cache: new InMemoryCache(),
      }),
    [errorLink, authLink, httpLink]
  );

  return (
    <SessionProvider>
      <ApolloProvider client={client}>
        <ToastProvider>{children}</ToastProvider>
      </ApolloProvider>
    </SessionProvider>
  );
}
