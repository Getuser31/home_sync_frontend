import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { RouterProvider } from 'react-router-dom';
import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { ApolloProvider } from '@apollo/client/react';
import { AuthProvider } from './AuthContext';
import Router from './router';
import reportWebVitals from './reportWebVitals';

const client = new ApolloClient({
    link: createHttpLink({ uri: "http://127.0.0.1:8000/graphql" }),
    cache: new InMemoryCache({
        possibleTypes: {
            CreateUserResult: ['User', 'UserError'],
        },
    })
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <AuthProvider>
        <RouterProvider router={Router} />
      </AuthProvider>
    </ApolloProvider>
  </React.StrictMode>
);

reportWebVitals();