import React from "react";
import {useQuery} from "@apollo/client/react";
import {useParams, Link} from "react-router-dom";
import {GET_HOUSE_BY_ID} from "../graphQl/query";
import AddNewTaskButton from "./AddNewTaskButton";

const AllTasks = () => {
    const houseId = useParams().houseId;
    const {loading, error, data} = useQuery(GET_HOUSE_BY_ID, {variables: {id: parseInt(houseId)}})

    if (loading) return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-6">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                <p className="text-indigo-800 font-medium animate-pulse">Loading tasks...</p>
            </div>
        </div>
    );
    if (error) return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-6">
            <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md border-l-4 border-red-500">
                <h3 className="text-lg font-bold text-red-600 mb-2">Error</h3>
                <p className="text-gray-600">{error.message}</p>
            </div>
        </div>
    );
    if (!data) return <div>No data found.</div>;

    const house = data.getHouseById
    const tasks = house.tasks

    console.log(house)

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-start justify-center p-6">
            <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-lg border border-white/50">
                <div className="mb-8">
                    <p className="text-indigo-600 font-bold text-xs uppercase tracking-widest mb-1">House</p>
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">{house.name}</h1>
                    <p className="mt-1 text-sm text-gray-400">{tasks.length} task{tasks.length !== 1 ? 's' : ''}</p>
                </div>

                <ul className="flex flex-col gap-3">
                    {tasks.map((task) => (
                        <li key={task.id}>
                            <Link
                                to={`/consult_task/${houseId}/${task.title}/${task.id}`}
                                className="flex items-center gap-4 bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 hover:bg-indigo-50 hover:border-indigo-200 transition-colors group"
                            >
                                <div className="w-2.5 h-2.5 rounded-full bg-indigo-400 shrink-0 group-hover:bg-indigo-600 transition-colors"/>
                                <div className="flex flex-col min-w-0">
                                    <span className="text-sm font-bold text-gray-800 group-hover:text-indigo-700 transition-colors truncate">{task.title}</span>
                                    {task.description && (
                                        <span className="text-xs text-gray-400 truncate">{task.description}</span>
                                    )}
                                </div>
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-300 group-hover:text-indigo-400 ml-auto shrink-0 transition-colors" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"/>
                                </svg>
                            </Link>
                        </li>
                    ))}
                </ul>
                <AddNewTaskButton houseId={house.id} className="mt-4"/>
            </div>
        </div>
    )
}

export default AllTasks;