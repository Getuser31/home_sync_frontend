import React from "react";
import {useAuth} from "../AuthContext";
import {useNavigate, useLocation} from "react-router-dom";

const AdminNavigationBar = ({ house }) => {
    const {user} = useAuth()
    const navigate = useNavigate()
    const location = useLocation()

    const isAdmin = () => {
        const houseUser = house.users?.find(u => u.id === Number(user?.id))
        return houseUser?.roleHouseUsers[0]?.role?.name === "admin"
    }

    const navBtn = (path) =>
        location.pathname === path
            ? "px-3 py-1 rounded-xl bg-indigo-100 text-indigo-700 text-xs font-semibold border border-indigo-300 transition-colors whitespace-nowrap"
            : "px-3 py-1 rounded-xl border border-indigo-200 text-indigo-600 text-xs font-semibold hover:bg-indigo-50 transition-colors whitespace-nowrap"

    return (
        <>
            {isAdmin() && (
                <nav className="bg-white border-b border-gray-200 shadow-sm">
                    <div className="flex items-center gap-2 px-3 py-2 overflow-x-auto scrollbar-none">
                        <button
                            className={navBtn(`/profile_house/${house.name}/${house.id}`)}
                            onClick={() => navigate(`/profile_house/${house.name}/${house.id}`)}
                        >
                            Tasks
                        </button>
                        <button
                            className={navBtn(`/manage_users/${house.id}`)}
                            onClick={() => navigate(`/manage_users/${house.id}`)}
                        >
                            Users
                        </button>
                        <button
                            className={navBtn(`/manage_house/${house.name}/${house.id}`)}
                            onClick={() => navigate(`/manage_house/${house.name}/${house.id}`)}
                        >
                            House
                        </button>
                        <button
                            className={navBtn(`/house_statistics/${house.name}/${house.id}`)}
                            onClick={() => navigate(`/house_statistics/${house.name}/${house.id}`)}
                        >
                            Statistics
                        </button>
                        <div className="ml-auto pl-2 shrink-0">
                            <button
                                className="px-3 py-1 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 transition-colors whitespace-nowrap"
                                onClick={() => navigate(`/add_new_task/${house.id}`)}
                            >
                                + New Task
                            </button>
                        </div>
                    </div>
                </nav>
            )}
        </>
    )
}

export default AdminNavigationBar;