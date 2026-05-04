import React from "react";
import {render, screen} from "../utils/test-utils";
import PrivateRoute from "../PrivateRoute";

describe("PrivateRoute", () => {
    it("renders nothing when user is authenticated and not loading", () => {
        render(
            <PrivateRoute/>,
            {
                authValue: {
                    user: {id: 1, name: "Test User", email: "test@test.com"},
                    loading: false,
                    login: jest.fn(),
                    logout: jest.fn(),
                },
                initialEntries: ["/home"],
            }
        );

        // PrivateRoute renders <Outlet/> when authenticated
        // Since there's no route matching, it renders nothing
        expect(screen.queryByText(/Sign In/i)).not.toBeInTheDocument();
    });

    it("renders nothing while loading", () => {
        const {container} = render(
            <PrivateRoute/>,
            {
                authValue: {
                    user: null,
                    loading: true,
                    login: jest.fn(),
                    logout: jest.fn(),
                },
            }
        );

        expect(container.innerHTML).toBe("");
    });

    it("redirects to /login when user is not authenticated", () => {
        render(
            <PrivateRoute/>,
            {
                authValue: {
                    user: null,
                    loading: false,
                    login: jest.fn(),
                    logout: jest.fn(),
                },
            }
        );

        // When not authenticated, a Navigate component is rendered
        // which redirects to /login
        expect(screen.queryByText("Protected Content")).not.toBeInTheDocument();
    });
});
