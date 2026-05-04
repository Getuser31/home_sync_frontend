import {
    LOGIN_MUTATION,
    REGISTER_MUTATION,
    UPDATE_PASSWORD,
    UPDATE_EMAIL,
    UPDATE_USER_CONFIGURATION,
    CREATE_NEW_HOUSE,
    REMOVE_HOUSE,
    JOIN_HOUSE_BY_INVITATION_CODE,
    ADD_NEW_TASK,
    UPDATE_TASK,
    DELETE_TASK,
    ASSIGN_TASK_TO_USER,
    REMOVE_USER_FROM_TASK,
    COMPLETE_TASK_FOR_USER,
    UNCOMPLETED_TASK_FOR_USER,
    UPDATE_USER_ROLE,
    CREATE_DUMMY_USER_FOR_HOUSE,
    REMOVE_USER_FROM_HOUSE,
} from "../../graphQl/mutation";

describe("GraphQL mutation definitions", () => {
    const mutations = [
        {name: "LOGIN_MUTATION", mutation: LOGIN_MUTATION, operation: "login"},
        {name: "REGISTER_MUTATION", mutation: REGISTER_MUTATION, operation: "createUser"},
        {name: "UPDATE_PASSWORD", mutation: UPDATE_PASSWORD, operation: "updatePassword"},
        {name: "UPDATE_EMAIL", mutation: UPDATE_EMAIL, operation: "updateEmail"},
        {name: "UPDATE_USER_CONFIGURATION", mutation: UPDATE_USER_CONFIGURATION, operation: "updateUserConfiguration"},
        {name: "CREATE_NEW_HOUSE", mutation: CREATE_NEW_HOUSE, operation: "createHouse"},
        {name: "REMOVE_HOUSE", mutation: REMOVE_HOUSE, operation: "removeHouse"},
        {name: "JOIN_HOUSE_BY_INVITATION_CODE", mutation: JOIN_HOUSE_BY_INVITATION_CODE, operation: "joinHouseByInvitationCode"},
        {name: "ADD_NEW_TASK", mutation: ADD_NEW_TASK, operation: "createTask"},
        {name: "UPDATE_TASK", mutation: UPDATE_TASK, operation: "updateTask"},
        {name: "DELETE_TASK", mutation: DELETE_TASK, operation: "deleteTask"},
        {name: "ASSIGN_TASK_TO_USER", mutation: ASSIGN_TASK_TO_USER, operation: "assignTaskToUser"},
        {name: "REMOVE_USER_FROM_TASK", mutation: REMOVE_USER_FROM_TASK, operation: "removeUserFromTask"},
        {name: "COMPLETE_TASK_FOR_USER", mutation: COMPLETE_TASK_FOR_USER, operation: "completeTask"},
        {name: "UNCOMPLETED_TASK_FOR_USER", mutation: UNCOMPLETED_TASK_FOR_USER, operation: "uncompletedTask"},
        {name: "UPDATE_USER_ROLE", mutation: UPDATE_USER_ROLE, operation: "updateUserRole"},
        {name: "CREATE_DUMMY_USER_FOR_HOUSE", mutation: CREATE_DUMMY_USER_FOR_HOUSE, operation: "createDummyUserForHouse"},
        {name: "REMOVE_USER_FROM_HOUSE", mutation: REMOVE_USER_FROM_HOUSE, operation: "removeUserFromHouse"},
    ];

    mutations.forEach(({name, mutation, operation}) => {
        it(`${name} is a valid mutation containing ${operation}`, () => {
            expect(mutation).toBeDefined();
            const body = mutation.loc.source.body;
            expect(body).toContain(`mutation`);
            expect(body).toContain(operation);
        });
    });
});
