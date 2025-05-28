import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { ToastProvider } from './context/ToastContext.tsx';
import './index.css';

const client = new ApolloClient({
  uri: import.meta.env.VITE_API_URL,
  cache: new InMemoryCache(),
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ApolloProvider client={client}>
      <ToastProvider>
        <App />
      </ToastProvider>
    </ApolloProvider>
  </StrictMode>
);
