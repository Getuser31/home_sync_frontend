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
        mutation create_task($title: String!, $task_recurrence_id: Int!, $house_id: Int!, $description: String!, $weight: Int!, $user_id: Int!) {
                createTask(title: $title, taskRecurrenceId: $task_recurrence_id, houseId: $house_id, description: $description, weight: $weight, userId: $user_id) {
                        title
                        description
                        weight
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