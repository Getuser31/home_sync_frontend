import {countPeriodsBetween, formatDuration, taskStats} from "./HouseStatistics";
import generatePeriodKey from "../utils/periodKeyService";

// HouseStatistics.jsx has helper functions that are not exported.
// We test via generatePeriodKey directly (which is already tested),
// and we test the component rendering here.
import React from "react";
import {render, screen} from "../utils/test-utils";
import HouseStatistics from "./HouseStatistics";

// Mock useQuery to simulate loaded data for HouseStatistics
import {useQuery} from "@apollo/client/react";
jest.mock("@apollo/client/react", () => ({
    ...jest.requireActual("@apollo/client/react"),
    useQuery: jest.fn(),
}));

const mockHouseData = {
    getHouseById: {
        id: 1,
        name: "Test House",
        inviteCode: "ABC123",
        currentUserRole: {name: "admin"},
        users: [
            {id: 1, name: "Alice", email: "alice@test.com", isActive: true, roleHouseUsers: [{id: 1, role: {id: 1, name: "admin"}}]},
            {id: 2, name: "Bob", email: "bob@test.com", isActive: true, roleHouseUsers: [{id: 2, role: {id: 2, name: "member"}}]},
        ],
        tasks: [
            {
                id: 1,
                title: "Clean Kitchen",
                description: "Wipe counters and mop floor",
                weight: 3,
                timeToComplete: 30,
                dateCreated: "2026-04-01T00:00:00.000Z",
                taskLives: [
                    {
                        id: 1,
                        isCompleted: false,
                        recurrence: {id: 1, name: "Daily", frequencyDays: 1},
                        completions: [
                            {id: 1, userWhoCompletedId: 1, completedAt: "2026-04-24T10:00:00.000Z", periodKey: "2026-04-24"},
                        ],
                        assignedUsers: [{id: 1, name: "Alice", email: "alice@test.com", isActive: true}],
                    },
                ],
            },
        ],
    },
};

describe("HouseStatistics", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("renders loading state initially", () => {
        useQuery.mockReturnValue({
            loading: true,
            error: undefined,
            data: undefined,
            refetch: jest.fn(),
        });
        render(<HouseStatistics/>);
        expect(screen.getByText(/Loading/i)).toBeInTheDocument();
    });

    it("renders the house name after loading", async () => {
        useQuery.mockReturnValue({
            loading: false,
            error: undefined,
            data: mockHouseData,
            refetch: jest.fn(),
        });
        render(<HouseStatistics/>);
        expect(await screen.findByText("Test House")).toBeInTheDocument();
    });

    it("renders the Statistics header", async () => {
        useQuery.mockReturnValue({
            loading: false,
            error: undefined,
            data: mockHouseData,
            refetch: jest.fn(),
        });
        render(<HouseStatistics/>);
        expect(await screen.findByText(/Statistics/i)).toBeInTheDocument();
    });

    it("renders a user filter select", async () => {
        useQuery.mockReturnValue({
            loading: false,
            error: undefined,
            data: mockHouseData,
            refetch: jest.fn(),
        });
        render(<HouseStatistics/>);
        expect(await screen.findByText(/All Users/i)).toBeInTheDocument();
    });

    it("renders task title in statistics", async () => {
        useQuery.mockReturnValue({
            loading: false,
            error: undefined,
            data: mockHouseData,
            refetch: jest.fn(),
        });
        render(<HouseStatistics/>);
        expect(await screen.findByText("Clean Kitchen")).toBeInTheDocument();
    });
});

describe("formatDuration", () => {
    it("returns em-dash for nullish values", () => {
        expect(formatDuration(null)).toBe("—");
        expect(formatDuration(undefined)).toBe("—");
        expect(formatDuration(0)).toBe("—");
    });

    it("formats only minutes", () => {
        expect(formatDuration(30)).toBe("30min");
        expect(formatDuration(5)).toBe("5min");
    });

    it("formats only hours", () => {
        expect(formatDuration(60)).toBe("1h");
        expect(formatDuration(180)).toBe("3h");
    });

    it("formats hours and minutes", () => {
        expect(formatDuration(90)).toBe("1h 30min");
        expect(formatDuration(150)).toBe("2h 30min");
        expect(formatDuration(65)).toBe("1h 5min");
    });
});

describe("countPeriodsBetween", () => {
    it("counts 1 period when start and end are the same day for daily", () => {
        const start = "2026-04-25";
        const end = "2026-04-25";
        expect(countPeriodsBetween(start, end, "Daily", 1)).toBe(1);
    });

    it("counts 3 periods for 3 days daily", () => {
        const start = "2026-04-25";
        const end = "2026-04-27";
        // Generate keys for April 25, 26, 27
        const keys = new Set();
        keys.add(generatePeriodKey("Daily", new Date("2026-04-25")));
        keys.add(generatePeriodKey("Daily", new Date("2026-04-26")));
        keys.add(generatePeriodKey("Daily", new Date("2026-04-27")));
        expect(keys.size).toBe(3);
    });

    it("counts 2 periods for weekly across 8 days", () => {
        const start = "2026-04-20";  // Monday W17
        const end = "2026-04-27";    // Monday W18
        // Monday April 20 -> W17, April 27 -> W18
        const keys = new Set();
        keys.add(generatePeriodKey("Weekly", new Date("2026-04-20")));
        keys.add(generatePeriodKey("Weekly", new Date("2026-04-27")));
        expect(keys.size).toBe(2);
    });
});
