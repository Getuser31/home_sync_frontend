import React from "react";
import {render, screen} from "../utils/test-utils";
import AddNewTaskButton from "./AddNewTaskButton";

describe("AddNewTaskButton", () => {
    it("renders the button text", () => {
        render(<AddNewTaskButton houseId={1}/>);
        expect(screen.getByText(/Add New Task/i)).toBeInTheDocument();
    });

    it("renders as a button element", () => {
        render(<AddNewTaskButton houseId={1}/>);
        expect(screen.getByRole("button", {name: /Add New Task/i})).toBeInTheDocument();
    });

    it("applies additional className when provided", () => {
        render(<AddNewTaskButton houseId={1} className="extra-class"/>);
        const button = screen.getByRole("button", {name: /Add New Task/i});
        expect(button.className).toContain("extra-class");
    });
});
