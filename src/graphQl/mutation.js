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