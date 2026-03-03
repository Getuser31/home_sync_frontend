import React from 'react';
import {useNavigate} from "react-router-dom";
import {useQuery } from "@apollo/client/react"
import { gql } from "@apollo/client"
import {isAuthenticated} from "./utils/auth";

const GET_HOUSE = gql`
    query GetHouseByCode($invitationCode: String!){
        getHouseByInviteCode(inviteCode: $invitationCode) {
            id
            name
            inviteCode
        }
    }
`;

const HomeComponent = () => {
    const auth = isAuthenticated();
    const navigate = useNavigate();
    if (!auth) {
        navigate("/login");
    }
    const {loading, error, data} = useQuery(GET_HOUSE, {
        variables: {
            invitationCode: "EFRP0XQK"
        }
    })
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;

    return (
        <div>
            <h1>House: {data.getHouseByInviteCode.name}</h1>
            <p>House ID: {data.getHouseByInviteCode.id}</p>
            <p>Invitation Code: {data.getHouseByInviteCode.inviteCode}</p>
        </div>
    );
}

export default HomeComponent;
