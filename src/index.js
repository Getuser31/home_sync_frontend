import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './i18n';
import { RouterProvider } from 'react-router-dom';
import { ApolloClient, InMemoryCache, createHttpLink, ApolloLink, Observable } from '@apollo/client';
import { ApolloProvider } from '@apollo/client/react';
import { AuthProvider } from './AuthContext';
import Router from './router';
import reportWebVitals from './reportWebVitals';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import {setContext} from "@apollo/client/link/context";

const errorLink = new ApolloLink((operation, forward) => {
    return new Observable(observer => {
        forward(operation).subscribe({
            next: observer.next.bind(observer),
            error: (error) => {
                if (error?.statusCode === 401) {
                    localStorage.removeItem('userTokenHomeSync');
                    window.location.href = "/login";
                } else {
                    observer.error(error);
                }
            },
            complete: observer.complete.bind(observer),
        });
    });
});

const authLink = setContext((_, { headers }) => {
    const token = localStorage.getItem('userTokenHomeSync');
    return {
        headers: {
            ...headers,
            ...(token && { authorization: `Bearer ${token}` }),
        }
    }
});

const client = new ApolloClient({
    link: errorLink.concat(authLink).concat(createHttpLink({ uri: process.env.REACT_APP_GRAPHQL_URL })),
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

serviceWorkerRegistration.register();
reportWebVitals();