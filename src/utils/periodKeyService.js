const generatePeriodKey = (recurrenceName, dataRef = new Date()) => {
    const pad = (n) => String(n).padStart(2, '0');

    if (recurrenceName === "Daily") {
        const y = dataRef.getFullYear();
        const m = pad(dataRef.getMonth() + 1);
        const d = pad(dataRef.getDate());
        return `${y}-${m}-${d}`;
    }

    if (recurrenceName === "Weekly") {
        // ISO week date: %G-W%V
        const thursday = new Date(dataRef);
        thursday.setDate(dataRef.getDate() - ((dataRef.getDay() + 6) % 7) + 3);
        const isoYear = thursday.getFullYear();
        const jan4 = new Date(isoYear, 0, 4);
        const startOfWeek1 = new Date(jan4);
        startOfWeek1.setDate(jan4.getDate() - ((jan4.getDay() + 6) % 7));
        const weekNum = Math.round((thursday - startOfWeek1) / 604800000) + 1;
        return `${isoYear}-W${pad(weekNum)}`;
    }

    if (recurrenceName === "Monthly") {
        const y = dataRef.getFullYear();
        const m = pad(dataRef.getMonth() + 1);
        return `${y}-${m}`;
    }

    return String(dataRef.getFullYear());
}

export default generatePeriodKey;