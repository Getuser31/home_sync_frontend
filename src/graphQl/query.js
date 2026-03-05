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
    query getHouseByUser{
        getHouseByUser {
            id
            name
            inviteCode
            users {
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
                users {
                    name
                    email
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