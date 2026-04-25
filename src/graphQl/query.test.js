import {
    GET_HOUSE_BY_CODE,
    GET_HOUSE_FOR_CURRENT_USER,
    GET_HOUSE_BY_ID,
    GET_TASK_BY_ID,
    GET_TASK_RECURRENCES,
    GET_ME,
    GET_ROLES,
} from "./query";

describe("GraphQL query definitions", () => {
    it("GET_HOUSE_BY_CODE is a valid query", () => {
        expect(GET_HOUSE_BY_CODE).toBeDefined();
        expect(GET_HOUSE_BY_CODE.loc.source.body).toContain("GetHouseByCode");
    });

    it("GET_HOUSE_FOR_CURRENT_USER is a valid query", () => {
        expect(GET_HOUSE_FOR_CURRENT_USER).toBeDefined();
        expect(GET_HOUSE_FOR_CURRENT_USER.loc.source.body).toContain("getHouseByUser");
    });

    it("GET_HOUSE_BY_ID is a valid query", () => {
        expect(GET_HOUSE_BY_ID).toBeDefined();
        expect(GET_HOUSE_BY_ID.loc.source.body).toContain("getHouseById");
    });

    it("GET_TASK_BY_ID is a valid query", () => {
        expect(GET_TASK_BY_ID).toBeDefined();
        expect(GET_TASK_BY_ID.loc.source.body).toContain("getTaskById");
    });

    it("GET_TASK_RECURRENCES is a valid query", () => {
        expect(GET_TASK_RECURRENCES).toBeDefined();
        expect(GET_TASK_RECURRENCES.loc.source.body).toContain("getTaskRecurrences");
    });

    it("GET_ME is a valid query", () => {
        expect(GET_ME).toBeDefined();
        expect(GET_ME.loc.source.body).toContain("getMe");
    });

    it("GET_ROLES is a valid query", () => {
        expect(GET_ROLES).toBeDefined();
        expect(GET_ROLES.loc.source.body).toContain("getRoles");
    });
});
