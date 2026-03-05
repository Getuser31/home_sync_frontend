import React from "react";
import {useNavigate, useParams} from "react-router-dom";
import {useQuery} from "@apollo/client/react";
import {GET_HOUSE_BY_ID} from "../graphQl/query";

const ManageHouse = () => {
    const {id: houseId} = useParams()
    const {loading, error, data} = useQuery(GET_HOUSE_BY_ID, {variables: {id: parseInt(houseId)}})
    const navigate = useNavigate()

    const house = data?.getHouseById;
    console.log(house)

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;
    if (!data) return <div>No data found.</div>;



  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-10 w-full max-w-md border border-white/50">
            <div className="mb-8 text-center">
                <p className="text-indigo-600 font-bold text-sm uppercase tracking-wider mb-1">Management</p>
                <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight leading-tight">{house.name}</h1>
            </div>

            <div className="mb-8">
                <div className="flex items-center justify-between mb-4 px-1">
                    <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide">Members</h3>
                    <span className="bg-indigo-100 text-indigo-700 text-xs font-bold px-2.5 py-1 rounded-full">
                        {house.users.length} Total
                    </span>
                </div>
                <ul className="flex flex-col gap-3">
                    {house.users.map((user) => (
                        <li key={user.email} className="group flex items-center gap-3 bg-white hover:bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3 shadow-sm transition-all duration-200">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center text-white text-sm font-bold shadow-md group-hover:scale-110 transition-transform">
                                {user.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex flex-col">
                                <span className="text-sm font-bold text-gray-800">{user.name}</span>
                                <span className="text-[11px] text-gray-500 font-medium">{user.email}</span>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="mb-8">
                <div className="flex items-center justify-between mb-4 px-1">
                    <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide">Tasks</h3>
                    <button className="text-indigo-600 hover:text-indigo-800 text-xs font-bold transition-colors">
                        View All
                    </button>
                </div>
                <ul className="flex flex-col gap-3 mb-6">
                    {["Grocery Shopping", "Clean Kitchen", "Take out Trash"].map((chore, index) => (
                        <li key={index} className="flex items-center gap-3 bg-gray-50/50 border border-gray-100 rounded-xl px-4 py-3">
                            <div className="w-5 h-5 rounded-md border-2 border-gray-300 flex items-center justify-center">
                                <div className="w-2.5 h-2.5 bg-transparent rounded-sm"></div>
                            </div>
                            <span className="text-sm font-medium text-gray-600">{chore}</span>
                        </li>
                    ))}
                </ul>
                <button className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-indigo-200"
                    onClick={() => navigate(`/add_new_task/${house.id}`)}
                 >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    Add New Task
                </button>
            </div>

            <div className="bg-indigo-50/50 border border-indigo-100 rounded-2xl p-5">
                <div className="flex items-center justify-between mb-2">
                    <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Invite Code</p>
                    <button className="text-indigo-600 hover:text-indigo-800 text-[10px] font-bold uppercase tracking-wider transition-colors">
                        Copy Code
                    </button>
                </div>
                <p className="text-2xl font-mono font-black text-indigo-700 tracking-[0.2em] text-center select-all">{house.inviteCode}</p>
            </div>
        </div>
    </div>
  );
};

export default ManageHouse;