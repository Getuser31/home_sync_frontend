import React from "react";
import {render, screen} from "../utils/test-utils";
import AddHouse from "./AddHouse";

describe("AddHouse", () => {
    it("renders the create house form heading", () => {
        render(<AddHouse/>);
        expect(screen.getByText(/Create a New House/i)).toBeInTheDocument();
    });

    it("renders house name input field", () => {
        render(<AddHouse/>);
        expect(screen.getByPlaceholderText(/Enter house name/i)).toBeInTheDocument();
    });

    it("renders the Create House button", () => {
        render(<AddHouse/>);
        expect(screen.getByRole("button", {name: /Create House/i})).toBeInTheDocument();
    });

    it("renders back link", () => {
        render(<AddHouse/>);
        expect(screen.getByText(/Back to Houses/i)).toBeInTheDocument();
    });
});
