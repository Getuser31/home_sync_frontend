import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { RouterProvider } from 'react-router-dom';
import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { ApolloProvider } from '@apollo/client/react';
import { AuthProvider } from './AuthContext';
import Router from './router';
import reportWebVitals from './reportWebVitals';
import {setContext} from "@apollo/client/link/context";

const authLink = setContext((_, { headers }) => {
    const token = localStorage.getItem('userTokenHomeSync');
    return {
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : "",
        }
    }
});

const client = new ApolloClient({
    link: authLink.concat(createHttpLink({ uri: "http://127.0.0.1:8000/graphql" })),
    cache: new InMemoryCache({
        possibleTypes: {
            CreateUserResult: ['User', 'UserError'],
            LoginResult: ['AuthPayload', 'UserError'],
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