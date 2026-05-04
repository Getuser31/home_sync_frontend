import React from "react";
import {render, screen} from "../utils/test-utils";
import Menu from "../Menu";

describe("Menu", () => {
    it("renders HouseSync brand", () => {
        render(<Menu/>);
        expect(screen.getByText(/HouseSync/i)).toBeInTheDocument();
    });

    it("renders Login button when user is not authenticated", () => {
        render(<Menu/>, {
            authValue: {
                user: null,
                loading: false,
                login: jest.fn(),
                logout: jest.fn(),
            },
        });
        expect(screen.getByText(/Login/i)).toBeInTheDocument();
    });

    it("renders Profile and Logout when user is authenticated", () => {
        render(<Menu/>, {
            authValue: {
                user: {
                    id: 1,
                    name: "Test User",
                    email: "test@test.com",
                    roleHouseUsers: [],
                },
                loading: false,
                login: jest.fn(),
                logout: jest.fn(),
            },
        });
        expect(screen.getByText(/Profile/i)).toBeInTheDocument();
        expect(screen.getByText(/Logout/i)).toBeInTheDocument();
    });

    it("renders Houses dropdown when user is authenticated and has houses", () => {
        render(<Menu/>, {
            authValue: {
                user: {
                    id: 1,
                    name: "Test User",
                    email: "test@test.com",
                    roleHouseUsers: [
                        {
                            house: {id: 1, name: "Test House", inviteCode: "ABC123"},
                            role: {id: 1, name: "admin"},
                        },
                    ],
                },
                loading: false,
                login: jest.fn(),
                logout: jest.fn(),
            },
        });
        // "Houses" appears in both desktop and mobile menu, so use getAllByText
        expect(screen.getAllByText(/Houses/i).length).toBeGreaterThanOrEqual(1);
    });
});
