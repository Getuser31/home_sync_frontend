import React from "react";
import {useParams} from "react-router-dom";
import {useQuery} from "@apollo/client/react";
import {GET_HOUSE_BY_ID} from "../graphQl/query";

const ManageHouse = () => {
    const {id: houseId} = useParams()
    const {loading, error, data} = useQuery(GET_HOUSE_BY_ID, {variables: {id: parseInt(houseId)}})

    const house = data?.getHouseById;
    console.log(house)

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;
    if (!data) return <div>No data found.</div>;



  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-10 w-full max-w-md border border-white/50">
            <div className="mb-8 text-center">
                <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-2">Manage: {house.name}</h1>
            </div>

            <div className="mb-8">
                <h3 className="text-sm font-semibold text-gray-700 mb-3 ml-1">Members</h3>
                <ul className="flex flex-col gap-2">
                    {house.users.map((user) => (
                        <li key={user.email} className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white text-sm font-bold">
                                {user.name.charAt(0).toUpperCase()}
                            </div>
                            <span className="text-sm font-medium text-gray-800">{user.name}</span>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5">
                <p className="text-xs font-semibold text-gray-500 mb-1">Invite Code</p>
                <p className="text-sm font-mono font-bold text-indigo-600 tracking-widest">{house.inviteCode}</p>
            </div>
        </div>
    </div>
  );
};

export default ManageHouse;