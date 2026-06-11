import React from "react";
import {render, screen} from "../../utils/test-utils";
import Login from "../../user/Login";

describe("Login", () => {
    it("renders the login form heading", () => {
        render(<Login/>);
        expect(screen.getByText(/Welcome Back/i)).toBeInTheDocument();
    });

    it("renders email input field", () => {
        render(<Login/>);
        expect(screen.getByPlaceholderText(/Enter your email/i)).toBeInTheDocument();
    });

    it("renders password input field", () => {
        render(<Login/>);
        expect(screen.getByPlaceholderText(/Enter your password/i)).toBeInTheDocument();
    });

    it("renders the Sign In button", () => {
        render(<Login/>);
        expect(screen.getByRole("button", {name: /Sign In/i})).toBeInTheDocument();
    });

    it("renders the Create An Account link", () => {
        render(<Login/>);
        expect(screen.getByText(/Create An Account/i)).toBeInTheDocument();
    });

    it("renders the remember me checkbox", () => {
        render(<Login/>);
        expect(screen.getByLabelText(/Remember me/i)).toBeInTheDocument();
    });
});
