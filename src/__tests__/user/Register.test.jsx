import React from "react";
import {render, screen} from "../../utils/test-utils";
import Register from "../../user/Register";

describe("Register", () => {
    it("renders the registration form heading", () => {
        render(<Register/>);
        expect(screen.getByRole("heading", {name: /Create Account/i})).toBeInTheDocument();
    });

    it("renders username input field", () => {
        render(<Register/>);
        expect(screen.getByPlaceholderText(/Enter your username/i)).toBeInTheDocument();
    });

    it("renders email input field", () => {
        render(<Register/>);
        expect(screen.getByPlaceholderText(/Enter your Email/i)).toBeInTheDocument();
    });

    it("renders password input field", () => {
        render(<Register/>);
        expect(screen.getAllByPlaceholderText(/Enter your password/i)).toHaveLength(2);
    });

    it("renders confirm password input field", () => {
        render(<Register/>);
        expect(screen.getByPlaceholderText(/Re-enter your password/i)).toBeInTheDocument();
    });

    it("renders the Create Account button", () => {
        render(<Register/>);
        expect(screen.getByRole("button", {name: /Create Account/i})).toBeInTheDocument();
    });
});
