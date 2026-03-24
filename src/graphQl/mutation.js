import {gql} from "@apollo/client"

export const LOGIN_MUTATION = gql`
    mutation Login($email: String!, $password: String!) {
        login(email: $email, password: $password) {
            ... on AuthPayload {
                token
            }
            ... on UserError {
                message
            }
        }
    }
`

export const REGISTER_MUTATION = gql`
   mutation Register($username: String!, $email: String!, $password: String!) {
       createUser(username: $username, email: $email, password: $password){
           ... on User{
               id
               name
               email
           }
           ... on UserError {
               message
           }

       }
   }
`

export const CREATE_NEW_HOUSE = gql`
    mutation CreateNewHouse($name: String!) {
        createHouse(name: $name) {
            ... on House {
                id
                name
                inviteCode
                }
            ... on HouseError {
                message
            }
        }
    }
`

export const REMOVE_HOUSE = gql`
    mutation RemoveHouse($houseId: Int!) {
        removeHouse(houseId: $houseId){
            ... on House {
                id
                name
                inviteCode
            }
            ... on HouseError {
                message
            }
        }
    }
`

export const JOIN_HOUSE_BY_INVITATION_CODE = gql`
    mutation join_house_by_invitation_code($inviteCode: String!) {
        joinHouseByInvitationCode(inviteCode: $inviteCode) {
            ... on House {
                id
                name
                inviteCode
            }
            ... on HouseError {
                message
            }
        }
    }
`

export const ADD_NEW_TASK = gql`
        mutation create_task($title: String!, $task_recurrence_id: Int!, $house_id: Int!, $description: String!, $weight: Int!, $user_id: Int) {
                createTask(title: $title, taskRecurrenceId: $task_recurrence_id, houseId: $house_id, description: $description, weight: $weight, userId: $user_id) {
                        ... on Task {
                            title
                            description
                            weight
                        }
                        ... on UserError {
                            message
                        }
                }
        }
`

export const DELETE_TASK = gql`
    mutation delete_task($taskId : Int!) {
        deleteTask(taskId: $taskId) {
            ... on DeleteTaskSuccess {
                success
            }
            ... on TaskError {
                message
            }
        }
    }
`

export const ASSIGN_TASK_TO_USER = gql`
    mutation assign_task_to_user($task_id: Int!, $user_id: Int!){
        assignTaskToUser(taskId: $task_id, userId: $user_id) {
            ... on Task {
                id
                title
                description
                weight
            }
            ... on UserError {
                message
            }
            ... on TaskError {
                message
            }
        }
    }
`

export const REMOVE_USER_FROM_TASK = gql`
    mutation Remove_user_from_task($task_id: Int!, $user_id: Int!) {
        removeUserFromTask(taskId: $task_id, userId: $user_id) {
            ... on Task {
                id
                title
                description
                weight
            }
            ... on UserError {
                message
            }
            ... on TaskError {
                message
            }
        }
    }
`

export const COMPLETE_TASK_FOR_USER = gql`
    mutation complete_task($taskId: Int!, $userId: Int) {
        completeTask(taskId: $taskId, userId: $userId) {
            ... on TaskCompletion {
                id
                completedAt
                periodKey
            }
            ... on UserError {
                message
            }
        }
    }
`

export const UNCOMPLETED_TASK_FOR_USER = gql`
    mutation uncompleted_task($taskId: Int!, $userId: Int) {
        uncompletedTask(taskId: $taskId, userId: $userId) {
            ... on UncompletedTaskSuccess {
                success
            }
            ... on UserError {
                message
            }
            ... on TaskError {
                message
            }
        }
    }    
`

export const UPDATE_USER_ROLE = gql`
    mutation update_user_role($userId: Int!, $roleId: Int!, $houseId: Int!){
        updateUserRole(userId: $userId, roleId: $roleId, houseId: $houseId) {
            ... on User {
                id
                name
                email
                roleHouseUsers {
                    role {
                        id
                        name
                    }
                }
            }
            ... on UserError {
                message
            }
            ... on HouseError {
                message
            }
        }
    }
    `

export const CREATE_DUMMY_USER_FOR_HOUSE = gql`
    mutation create_dummy_user_for_house($houseId: Int!, $username: String!) {
        createDummyUserForHouse(houseId: $houseId, username: $username) {
            ... on User {
                id
                name
                email
            }
            ... on UserError {
                message
            }
            ... on HouseError {
                message
            }
        }
    }
`

export const REMOVE_USER_FROM_HOUSE = gql`
    mutation remove_user_from_house($userId : Int!, $houseId: Int!){
        removeUserFromHouse(userId: $userId, houseId: $houseId) {
            ... on House {
                id
                name
                inviteCode
            }
            ... on HouseError {
                message
            }
        }
    }   
`