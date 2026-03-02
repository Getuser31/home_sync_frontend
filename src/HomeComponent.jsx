import React from 'react';
import {useQuery } from "@apollo/client/react"
import { gql } from "@apollo/client"

const GET_HOUSE = gql`
    query GetHouseByCode($invitationCode: String!){
        getHouseByInvitationCode(inviteCode: $invitationCode) {
            id
            name
            inviteCode
        }
    }
`;

const HomeComponent = () => {
    const {loading, error, data} = useQuery(GET_HOUSE, {
        variables: {
            invitationCode: "EFRP0XQK"
        }
    })
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;

    return (
        <div>
            <h1>House: {data.getHouseByInvitationCode.name}</h1>
            <p>House ID: {data.getHouseByInvitationCode.id}</p>
            <p>Invitation Code: {data.getHouseByInvitationCode.inviteCode}</p>
        </div>
    );
}

export default HomeComponent;
