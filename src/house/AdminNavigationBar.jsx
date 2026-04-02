import React from "react";
import {useAuth} from "../AuthContext";
import {useNavigate} from "react-router-dom";

const AdminNavigationBar = ({ house }) => {
    const {user} = useAuth()
    const navigate = useNavigate()
    const isAdmin = () => {
        const houseUser = house.users?.find(u => u.id === Number(user?.id))
        return houseUser?.roleHouseUsers[0]?.role?.name === "admin"
    }

    return (
        <>
            {isAdmin() && (
                <nav className="bg-white border-b border-gray-200 px-6 py-3 flex items-center gap-3 shadow-sm">
                    <span className="text-xs font-bold uppercase tracking-widest text-indigo-400 mr-2">Admin</span>
                    <button
                        className="px-4 py-1.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition-colors"
                        onClick={() => navigate(`/add_new_task/${house.id}`)}
                    >
                        Create task
                    </button>
                    <button
                        className="px-4 py-1.5 rounded-xl border border-indigo-200 text-indigo-600 text-sm font-semibold hover:bg-indigo-50 transition-colors"
                        onClick={() => navigate(`/manage_users/${house.id}`)}
                    >
                        Manage users
                    </button>
                    <button
                        className="px-4 py-1.5 rounded-xl border border-indigo-200 text-indigo-600 text-sm font-semibold hover:bg-indigo-50 transition-colors"
                        onClick={() => navigate(`/manage_house/${house.name}/${house.id}`)}
                    >
                        Manage house
                    </button>
                </nav>
            )}
        </>
    )
}

export default AdminNavigationBar;