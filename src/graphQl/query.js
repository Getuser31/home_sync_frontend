import {gql} from "@apollo/client"

export const GET_HOUSE_BY_CODE = gql`
    query GetHouseByCode($invitationCode: String!){
        getHouseByInviteCode(inviteCode: $invitationCode) {
            id
            name
            inviteCode
        }
    }
`;

export const GET_HOUSE_FOR_CURRENT_USER = gql`
    query getHouseByUser {
        getHouseByUser {
            id
            name
            inviteCode
            currentUserRole {
                name
            }
            users {
                id
                name
                email
            }
        }
    }
`;

export const GET_HOUSE_BY_ID = gql`
    query getHouseById($id: Int!){
        getHouseById(id: $id){
            ... on House {
                id
                name
                inviteCode
                currentUserRole {
                    name
                }
                users {
                    id
                    name
                    email
                    isActive
                    roleHouseUsers{
                        id
                        role{
                            id
                            name
                        }
                    }
                }
                tasks {
                    id
                    title
                    description
                    weight
                    taskLives {
                        id
                        isCompleted   
                        recurrence {
                            id
                            name
                            frequencyDays
                        }
                        completions {
                            id
                            userWhoCompletedId
                            completedAt
                            periodKey
                        }
                        assignedUsers{
                            id
                            name
                            email
                            isActive
                        }
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

export const GET_TASK_BY_ID = gql`
    query getTaskById($id: Int!){
        getTaskById(taskId: $id){
            id
            title
            description
            weight
            taskLives{
                id
                recurrence{
                    id
                    name
                    frequencyDays
                }
                completions{
                    id
                    completedAt
                    periodKey
                    userWhoCompletedId
                }
                assignedUsers{
                    id
                    name
                    email
                }
            }
        }
    }
`


export const GET_TASK_RECURRENCES = gql`
    query getTaskRecurrences{
        getTaskRecurrences {
            id
            name
            frequencyDays
        }
    }
`

export const GET_ME = gql`
    query getMe{
        getMe{
            ... on User{
                id
                name
                email
                roleHouseUsers {
                    house {
                        id
                        name
                        inviteCode
                    }
                    role {
                        id
                        name
                    }
                }
            }
           ... on UserError{
               message
           }
        }
    }
`

export const GET_ROLES = gql`
    query getRoles{
        getRoles{
            id
            name
        }
    }
`