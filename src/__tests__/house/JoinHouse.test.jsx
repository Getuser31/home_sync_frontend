import React from "react";
import {render, screen} from "../../utils/test-utils";
import JoinHouse from "../../house/JoinHouse";

describe("JoinHouse", () => {
    it("renders the join house form heading", () => {
        render(<JoinHouse/>);
        expect(screen.getByText(/Join a House/i)).toBeInTheDocument();
    });

    it("renders invitation code input field", () => {
        render(<JoinHouse/>);
        expect(screen.getByPlaceholderText(/Enter invitation code/i)).toBeInTheDocument();
    });

    it("renders the Join House button", () => {
        render(<JoinHouse/>);
        expect(screen.getByRole("button", {name: /Join House/i})).toBeInTheDocument();
    });

    it("renders back link", () => {
        render(<JoinHouse/>);
        expect(screen.getByText(/Back to Houses/i)).toBeInTheDocument();
    });
});
