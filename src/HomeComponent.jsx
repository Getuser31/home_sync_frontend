import React from 'react';
import {Link, useNavigate} from "react-router-dom";
import {useQuery} from "@apollo/client/react"
import {isAuthenticated} from "./utils/auth";
import {GET_HOUSE_FOR_CURRENT_USER} from "./graphQl/query";
import {useAuth} from "./AuthContext";


const HomeComponent = () => {
    const auth = isAuthenticated();
    const navigate = useNavigate();

    React.useEffect(() => {
        if (!auth) {
            navigate("/login");
        }
    }, [auth, navigate]);

    const {loading, error, data} = useQuery(GET_HOUSE_FOR_CURRENT_USER)
    const houses = data?.getHouseByUser;

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 my-4">
                <div className="flex">
                    <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd"
                                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                  clipRule="evenodd"/>
                        </svg>
                    </div>
                    <div className="ml-3">
                        <p className="text-sm text-red-700">
                            Error loading houses. Please try again later.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center border-b pb-4">
                <h2 className="text-2xl font-bold text-gray-800">Your Houses</h2>
                <div className="flex gap-3">
                    <button
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors shadow-md"
                        onClick={() => navigate("/join_house")}
                    >
                        + Join House
                    </button>
                    <button
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors shadow-md"
                        onClick={() => navigate("/create_house")}
                    >
                        + Add House
                    </button>
                </div>
            </div>

            {houses?.length ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {houses.map((house) => (
                        <div key={house.id} className="bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow flex flex-col overflow-hidden">
                            {/* Card header */}
                            <div className="bg-gradient-to-br from-blue-50 to-indigo-100 px-6 pt-6 pb-4 flex items-start justify-between">
                                <div className="bg-white p-3 rounded-xl shadow-sm">
                                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
                                    </svg>
                                </div>
                                <div className="flex items-center gap-1.5 bg-white/70 backdrop-blur-sm px-2.5 py-1 rounded-full">
                                    <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>
                                    </svg>
                                    <span className="text-xs font-semibold text-gray-500">{house.users.length}</span>
                                </div>
                            </div>

                            {/* Card body */}
                            <div className="px-6 py-4 flex-1">
                                <h3 className="text-lg font-extrabold text-gray-900 mb-3">{house.name}</h3>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Invite</span>
                                    <code className="bg-indigo-50 text-indigo-600 font-bold text-xs px-2 py-1 rounded-lg">{house.inviteCode}</code>
                                </div>
                            </div>

                            {/* Card actions */}
                            <div className="px-6 pb-6 flex flex-col gap-2">
                                <Link to={`/profile_house/${house.name}/${house.id}`} className="w-full">
                                    <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-xl transition-colors text-sm">
                                        Consult House
                                    </button>
                                </Link>
                                {house.currentUserRole.name === "admin" && (
                                    <Link to={`/manage_house/${house.name}/${house.id}`} className="w-full">
                                        <button className="w-full border border-gray-200 hover:bg-gray-50 text-gray-600 font-semibold py-2 rounded-xl transition-colors text-sm">
                                            Manage House
                                        </button>
                                    </Link>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-12 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                    <div className="mb-4 flex justify-center">
                        <svg className="w-16 h-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                        </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">No houses found</h3>
                    <p className="mt-1 text-gray-500">Get started by creating your first house.</p>
                </div>
            )}
        </div>
    );
};

export default HomeComponent;
