import React from 'react';
import {useNavigate} from "react-router-dom";
import {useQuery} from "@apollo/client/react"
import {isAuthenticated} from "./utils/auth";
import {GEY_HOUSE_FOR_CURRENT_USER} from "./graphQl/query";


const HomeComponent = () => {
    const auth = isAuthenticated();
    const navigate = useNavigate();

    React.useEffect(() => {
        if (!auth) {
            navigate("/login");
        }
    }, [auth, navigate]);

    const {loading, error, data} = useQuery(GEY_HOUSE_FOR_CURRENT_USER)
    const houses = data?.getHouseByUser;

    if (error) {
        if(error.errors.filter((error) => error.message === "TOKEN_EXPIRED")){
            navigate("/login")
        }
    }

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
                        <div key={house.id}
                             className="bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow p-6 flex flex-col justify-between">
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <div className="bg-blue-100 p-3 rounded-xl">
                                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor"
                                             viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
                                        </svg>
                                    </div>
                                    <span className="text-xs font-mono text-gray-400">Nb Users: {house.users.length}</span>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">{house.name}</h3>
                                <div className="flex items-center gap-2 mb-4">
                                    <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Invite Code:</span>
                                    <code
                                        className="bg-gray-100 px-2 py-1 rounded text-blue-600 font-bold">{house.inviteCode}</code>
                                </div>
                            </div>
                            <button
                                className="w-full mt-4 border border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold py-2 rounded-xl transition-colors text-sm">
                                Manage House
                            </button>
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
