import {gql} from "@apollo/client"

export const GET_HOUSE = gql`
    query GetHouseByCode($invitationCode: String!){
        getHouseByInviteCode(inviteCode: $invitationCode) {
            id
            name
            inviteCode
        }
    }
`;

export const GEY_HOUSE_FOR_CURRENT_USER = gql`
    query getHouseByUser{
        getHouseByUser {
            id
            name
            inviteCode
        }
    }
`;