import {
  ApolloClient,
  ApolloProvider,
  createHttpLink,
  InMemoryCache,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { SessionProvider } from './context/SessionContext.tsx';
import { ToastProvider } from './context/ToastContext.tsx';
import { authManager } from './utils/authManager.ts';
import './index.css';

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

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SessionProvider>
      <ApolloProvider client={client}>
        <ToastProvider>
          <App />
        </ToastProvider>
      </ApolloProvider>
    </SessionProvider>
  </StrictMode>
);
