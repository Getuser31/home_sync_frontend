import React from "react";
import {useParams} from "react-router-dom";
import {useMutation, useQuery} from "@apollo/client/react";
import {GET_HOUSE_BY_ID, GET_TASK_BY_ID} from "../graphQl/query";
import {ASSIGN_TASK_TO_USER, REMOVE_USER_FROM_TASK} from "../graphQl/mutation";

const ConsultTask = () => {
    const {houseId, taskId} = useParams()
    const {loading, error, data} = useQuery(GET_TASK_BY_ID, {variables: {id: parseInt(taskId)}})
    const {
        loading: loadinghouse,
        error: errorHouse,
        data: houseData
    } = useQuery(GET_HOUSE_BY_ID, {variables: {id: parseInt(houseId)}})
    const [assignUserToTask] = useMutation(ASSIGN_TASK_TO_USER)
    const [removeUserFromTaskMutation] = useMutation(REMOVE_USER_FROM_TASK)

    const isLoading = loading || loadinghouse;
    const combinedError = error || errorHouse;

    if (isLoading) {
        return (
            <div
                className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-6">
                <div className="flex flex-col items-center gap-4">
                    <div
                        className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                    <p className="text-indigo-800 font-medium animate-pulse">Loading details...</p>
                </div>
            </div>
        );
    }

    if (combinedError) {
        return (
            <div
                className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-6">
                <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md border-l-4 border-red-500">
                    <h3 className="text-lg font-bold text-red-600 mb-2">Error</h3>
                    <p className="text-gray-600">{combinedError.message}</p>
                </div>
            </div>
        );
    }

    const task = data?.getTaskById;
    const house = houseData?.getHouseById;

    if (!task || !house) {
        return (
            <div
                className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-6">
                <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md text-center">
                    <p className="text-gray-500 font-medium">Data not found.</p>
                </div>
            </div>
        );
    }

    const userAlreadyAssigned = task.taskLives.flatMap(life => life.assignedUsers);
    const assignedNewUser = house.users.filter(user => !userAlreadyAssigned.some(u => u.id === user.id));

    const assignUser = (e) => {
        console.log(e.target.value)
        const userId = parseInt(e.target.value);
        if (userId) {
            assignUserToTask({
                variables: { task_id: task.id, user_id: userId },
                refetchQueries: [{ query: GET_TASK_BY_ID, variables: { id: parseInt(taskId) } }]
            }).then(
                (data) => {
                    console.log(data)
                }
            ).catch((error) => {
                console.log(error)
            })
        }
    }

    const removeUserFromTask = (userId) => {
        if (!userId) return;
        console.log(
            "removeUserFromTask",
            task.id,
            userId
        )
        removeUserFromTaskMutation({
            variables: {task_id: task.id, user_id: userId},
            refetchQueries: [{ query: GET_TASK_BY_ID, variables: { id: parseInt(taskId) } }]
        }).then(
            (data) => {
                console.log(data)
            }
        ).catch((error) => {
            console.log(error)
        })
    }


    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-start justify-center p-6">
            <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-lg border border-white/50">
                <div className="mb-8">
                    <p className="text-indigo-600 font-bold text-xs uppercase tracking-widest mb-1">Task</p>
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">{task.title}</h1>
                    {task.description && (
                        <p className="mt-2 text-sm text-gray-500">{task.description}</p>
                    )}
                </div>

                <div className="flex flex-col gap-6">
                    {task.taskLives.map((taskLife) => (
                        <div key={taskLife.id} className="border border-gray-100 rounded-2xl p-5 bg-gray-50/50">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wide">{taskLife.recurrence.name}</h2>
                                <span
                                    className="bg-indigo-100 text-indigo-700 text-xs font-bold px-2.5 py-1 rounded-full">
                                    Every {taskLife.recurrence.frequencyDays}d
                                </span>
                            </div>

                            {taskLife.completions.length > 0 ? (
                                <ul className="flex flex-col gap-2">
                                    {taskLife.completions.map((completion) => (
                                        <li key={completion.id}
                                            className="flex items-center gap-3 bg-white border border-gray-100 rounded-xl px-4 py-2.5 shadow-sm">
                                            <div className="w-2 h-2 rounded-full bg-green-400 shrink-0"/>
                                            <span className="text-xs text-gray-600 font-medium">
                                                {new Date(completion.completedAt).toLocaleString()}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-xs text-gray-400 italic">No completions yet.</p>
                            )}

                            {taskLife.assignedUsers.length > 0 ? (
                                <div className="mt-4">
                                    <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-2">Assigned
                                        To</h3>
                                    <ul className="flex flex-col gap-2">
                                        {taskLife.assignedUsers.map((user) => (
                                            <li key={user.id}
                                                className="flex items-center gap-3 bg-white border border-gray-100 rounded-xl px-4 py-2.5 shadow-sm">
                                                <div className="w-2 h-2 rounded-full bg-green-400 shrink-0"/>
                                                <span className="text-xs text-gray-600 font-medium">
                                                    {user.name}
                                                </span>
                                                <button
                                                    onClick={() => removeUserFromTask(user.id)}
                                                    className="ml-auto text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg p-1 transition-colors"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                                    </svg>
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ) : (
                                <p className="text-xs text-gray-400 italic mt-4">No users assigned yet.</p>
                            )}

                            <div className="mt-5">
                                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">
                                    Assign to member
                                </label>
                                <select
                                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-700 font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition"
                                    disabled={assignedNewUser.length === 0}
                                    onChange={assignUser}
                                >
                                    <option value="">Select a member</option>
                                    {assignedNewUser.map((user) => (
                                        <option key={user.id} value={user.id}>{user.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default ConsultTask;