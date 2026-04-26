import React from "react";
import {render} from "@testing-library/react";
import {MemoryRouter} from "react-router-dom";
import {MockedProvider} from "@apollo/client/testing";
import {AuthContext} from "../AuthContext";
import "../i18n";

const defaultAuthValue = {
    user: null,
    login: jest.fn(),
    logout: jest.fn(),
    loading: false,
};

const TestWrapper = ({children, mocks = [], authValue = defaultAuthValue, initialEntries = ["/"]}) => {
    return (
        <MockedProvider mocks={mocks} addTypename={false}>
            <AuthContext.Provider value={authValue}>
                <MemoryRouter initialEntries={initialEntries}>
                    {children}
                </MemoryRouter>
            </AuthContext.Provider>
        </MockedProvider>
    );
};

const customRender = (ui, options = {}) => {
    const {mocks, authValue, initialEntries, ...renderOptions} = options;
    return render(ui, {
        wrapper: ({children}) => (
            <TestWrapper mocks={mocks} authValue={authValue} initialEntries={initialEntries}>
                {children}
            </TestWrapper>
        ),
        ...renderOptions,
    });
};

export * from "@testing-library/react";
export {customRender as render};
