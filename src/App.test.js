import React from 'react';
import {render, screen} from '@testing-library/react';
import {MemoryRouter} from 'react-router-dom';
import {AuthContext} from './AuthContext';
import App from './App';

const authValue = {
    user: null,
    login: jest.fn(),
    logout: jest.fn(),
    loading: false,
};

test('renders app with menu', () => {
    render(
        <AuthContext.Provider value={authValue}>
            <MemoryRouter>
                <App/>
            </MemoryRouter>
        </AuthContext.Provider>
    );
    expect(screen.getByText(/HouseSync/i)).toBeInTheDocument();
});
