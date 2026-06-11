import generatePeriodKey from "../../utils/periodKeyService";

describe("generatePeriodKey", () => {
    describe("Daily recurrence", () => {
        it("returns YYYY-MM-DD format", () => {
            const date = new Date("2026-04-25T10:00:00");
            const result = generatePeriodKey("Daily", date);
            expect(result).toBe("2026-04-25");
        });

        it("handles single-digit month and day", () => {
            const date = new Date("2026-01-05T10:00:00");
            const result = generatePeriodKey("Daily", date);
            expect(result).toBe("2026-01-05");
        });

        it("uses current date when no date provided", () => {
            const today = new Date();
            const y = today.getFullYear();
            const m = String(today.getMonth() + 1).padStart(2, "0");
            const d = String(today.getDate()).padStart(2, "0");
            const result = generatePeriodKey("Daily");
            expect(result).toBe(`${y}-${m}-${d}`);
        });
    });

    describe("Weekly recurrence", () => {
        it("returns ISO week format for a Monday in week 17 of 2026", () => {
            // Monday, April 20, 2026 → ISO week 2026-W17
            const date = new Date("2026-04-20T10:00:00");
            const result = generatePeriodKey("Weekly", date);
            expect(result).toBe("2026-W17");
        });

        it("returns ISO week format for a Sunday which belongs to the same week", () => {
            // Sunday, April 26, 2026 → ISO week 2026-W17 (Sunday belongs to same week as preceding Monday)
            const date = new Date("2026-04-26T10:00:00");
            const result = generatePeriodKey("Weekly", date);
            expect(result).toBe("2026-W17");
        });

        it("returns next week for the following Monday", () => {
            // Monday, April 27, 2026 → ISO week 2026-W18
            const date = new Date("2026-04-27T10:00:00");
            const result = generatePeriodKey("Weekly", date);
            expect(result).toBe("2026-W18");
        });

        it("returns correct week for early January", () => {
            const date = new Date("2026-01-01T10:00:00");
            const result = generatePeriodKey("Weekly", date);
            expect(result).toBe("2026-W01");
        });
    });

    describe("Monthly recurrence", () => {
        it("returns YYYY-MM format", () => {
            const date = new Date("2026-04-15T10:00:00");
            const result = generatePeriodKey("Monthly", date);
            expect(result).toBe("2026-04");
        });

        it("handles single-digit month", () => {
            const date = new Date("2026-03-01T10:00:00");
            const result = generatePeriodKey("Monthly", date);
            expect(result).toBe("2026-03");
        });

        it("handles December", () => {
            const date = new Date("2026-12-25T10:00:00");
            const result = generatePeriodKey("Monthly", date);
            expect(result).toBe("2026-12");
        });
    });

    describe("Yearly / unknown recurrence", () => {
        it("returns the year as a string", () => {
            const date = new Date("2026-06-15T10:00:00");
            const result = generatePeriodKey("Yearly", date);
            expect(result).toBe("2026");
        });

        it("returns the year for any unknown recurrence name", () => {
            const date = new Date("2025-12-31T10:00:00");
            const result = generatePeriodKey("Custom", date);
            expect(result).toBe("2025");
        });
    });
});
