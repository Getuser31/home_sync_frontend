import React, {useState} from "react";
import {useParams} from "react-router-dom";
import {GET_HOUSE_BY_ID} from "../graphQl/query";
import {useMutation, useQuery} from "@apollo/client/react";
import {useAuth} from "../AuthContext";
import {COMPLETE_TASK_FOR_USER, UNCOMPLETED_TASK_FOR_USER} from "../graphQl/mutation";
import AdminNavigationBar from "./AdminNavigationBar";

const ConsultHouse = () => {
    const {id: houseId} = useParams()
    const {loading, error, data} = useQuery(GET_HOUSE_BY_ID, {variables: {id: parseInt(houseId)}})
    const [completeTask] = useMutation(COMPLETE_TASK_FOR_USER)
    const [unCompletedTask] = useMutation(UNCOMPLETED_TASK_FOR_USER)
    const [mutationError, setMutationError] = useState(null)
    const [showSelectedUserModal, setShowSelectedUserModal] = useState({ status: false, selectedUser: null })

    const {user} = useAuth()

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;
    if (!data) return <div>No data found.</div>;

    const house = data?.getHouseById;

    if (!house || house.__typename !== 'House') return <div>House not found.</div>;

    const tasksForCurrentUser = (house.tasks ?? []).filter(task =>
        task.taskLives.some(taskLife =>
            taskLife.assignedUsers.some(assignedUser => assignedUser.id === user?.id)
        )
    )


    const tasksForDummyUsers = (house.tasks ?? []).filter(task =>
        task.taskLives.some(taskLife =>
            taskLife.assignedUsers.some(assignedUser => assignedUser.isActive === false)
        )
    )

    function mutateTask(taskId, task, userId) {
        userId = userId || null
        if(task.taskLives[0].isCompleted){
            unCompletedTask({
                variables: {taskId: taskId.taskId, userId: userId},
                refetchQueries: [{query: GET_HOUSE_BY_ID, variables: {id: parseInt(houseId)}}]
            })
                .then(
                    (data) => {
                        console.log(data)
                    }
                )
                .catch((error) => {
                        console.error("Mutation error (uncomplete):", error)
                        setMutationError(error.message || "Failed to uncomplete task.")
                    }
                )
        } else {
            completeTask({
                variables: {taskId: taskId.taskId, userId: userId},
                refetchQueries: [{query: GET_HOUSE_BY_ID, variables: {id: parseInt(houseId)}}]
            })
                .then(
                    (data) => {
                        console.log(data)
                    }
                )
                .catch((error) => {
                        console.error("Mutation error (complete):", error)
                        setMutationError(error.message || "Failed to complete task.")
                    }
                )
        }
    }


    const handleCheckTask = (taskId) => {
        setMutationError(null)
        const task = tasksForCurrentUser.find(task => (task.id === taskId.taskId))
        mutateTask(taskId, task)
    }

    const handleCheckTaskForDummyUser = (taskId) => {
        setMutationError(null)
        const task = tasksForDummyUsers.find(task => (task.id === taskId.taskId))
        const dummyUsers = task.taskLives[0].assignedUsers.filter(user => user.isActive === false )

        if(dummyUsers.length === 1 ||  (task.taskLives[0].isCompleted)) {
            mutateTask(taskId, task, dummyUsers[0].id)
        } else {
            setShowSelectedUserModal({ status: true, selectedUser: task })
        }
    }

    return (
        <div>
            <AdminNavigationBar house={house}/>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-start justify-center p-6">
            <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-lg border border-white/50">
                <div className="mb-8">
                    <p className="text-indigo-600 font-bold text-xs uppercase tracking-widest mb-1">House</p>
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">{house.name}</h1>
                    <p className="mt-1 text-sm text-gray-400">Tasks assigned to you</p>
                </div>

                {mutationError && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 text-sm rounded-2xl flex justify-between items-center animate-in fade-in duration-300">
                        <span>{mutationError}</span>
                        <button
                            onClick={() => setMutationError(null)}
                            className="text-red-400 hover:text-red-600 font-bold px-2"
                        >
                            ✕
                        </button>
                    </div>
                )}

                {tasksForCurrentUser.length === 0 ? (
                    <p className="text-sm text-gray-400 italic">No tasks assigned to you yet.</p>
                ) : (
                    <div className="flex flex-col gap-6">
                        {Object.entries(
                            [...tasksForCurrentUser]
                                .sort((a, b) => (a.taskLives[0]?.recurrence?.frequencyDays ?? 0) - (b.taskLives[0]?.recurrence?.frequencyDays ?? 0))
                                .reduce((groups, task) => {
                                    const label = task.taskLives[0]?.recurrence?.name ?? 'Other';
                                    if (!groups[label]) groups[label] = [];
                                    groups[label].push(task);
                                    return groups;
                                }, {})
                        ).map(([recurrenceName, tasks]) => (
                            <div key={recurrenceName}>
                                <p className="text-indigo-600 font-bold text-xs uppercase tracking-widest mb-3">{recurrenceName}</p>
                                <ul className="flex flex-col gap-3">
                                    {tasks.map((task) => (
                                        <li key={task.id} className="flex items-center gap-4 bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4">
                                            <input
                                                onChange={() => handleCheckTask({taskId: task.id})}
                                                type="checkbox"
                                                className="w-5 h-5 rounded-md border-gray-300 text-indigo-600 accent-indigo-600 cursor-pointer shrink-0"
                                                checked={task.taskLives[0].isCompleted}
                                            />
                                            <div className="flex flex-col min-w-0">
                                                <span className="text-sm font-bold text-gray-800 truncate">{task.title}</span>
                                                {task.description && (
                                                    <span className="text-xs text-gray-400 truncate">{task.description}</span>
                                                )}
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                )}

                <div className="mt-10 pt-8 border-t border-gray-100">
                    <p className="mt-1 text-sm text-gray-400">Tasks for inactive users</p>
                    {house.currentUserRole?.name === "admin" && (tasksForDummyUsers.length === 0 ? (
                        <p className="text-sm text-gray-400 italic">No tasks assigned to inactive user yet.</p>
                    ) : (
                        <div className="flex flex-col gap-6">
                            {Object.entries(
                                [...tasksForDummyUsers]
                                    .sort((a, b) => (a.taskLives[0]?.recurrence?.frequencyDays ?? 0) - (b.taskLives[0]?.recurrence?.frequencyDays ?? 0))
                                    .reduce((groups, task) => {
                                        const label = task.taskLives[0]?.recurrence?.name ?? 'Other';
                                        if (!groups[label]) groups[label] = [];
                                        groups[label].push(task);
                                        return groups;
                                    }, {})
                            ).map(([recurrenceName, tasks]) => (
                                <div key={recurrenceName}>
                                    <p className="text-indigo-600 font-bold text-xs uppercase tracking-widest mb-3">{recurrenceName}</p>
                                    <ul className="flex flex-col gap-3">
                                        {tasks.map((task) => (
                                            <li key={task.id} className="flex items-center gap-4 bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4">
                                                <input
                                                    onChange={() => handleCheckTaskForDummyUser({taskId: task.id})}
                                                    type="checkbox"
                                                    className="w-5 h-5 rounded-md border-gray-300 text-indigo-600 accent-indigo-600 cursor-pointer shrink-0"
                                                    checked={task.taskLives[0].isCompleted}
                                                />
                                                <div className="flex flex-col min-w-0 flex-1">
                                                    <span className="text-sm font-bold text-gray-800 truncate">{task.title}</span>
                                                    {task.description && (
                                                        <span className="text-xs text-gray-400 truncate">{task.description}</span>
                                                    )}
                                                    {task.taskLives[0]?.assignedUsers.some(u => !u.isActive) && (
                                                        <div className="flex items-center gap-1 mt-1 flex-wrap">
                                                            {task.taskLives[0].assignedUsers.map(user => (
                                                                !user.isActive && (
                                                                    <span key={user.id} className="text-xs bg-indigo-50 text-indigo-500 font-medium px-2 py-0.5 rounded-full">
                                                                        {user.name}
                                                                    </span>
                                                                )
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
            {showSelectedUserModal.status && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm mx-4">
                        <h3 className="text-lg font-extrabold text-gray-900 mb-1">Who completed this task?</h3>
                        <p className="text-sm text-gray-400 mb-5">{showSelectedUserModal.selectedUser?.title}</p>
                        <div className="flex flex-wrap gap-2 mb-6">
                            {showSelectedUserModal.selectedUser?.taskLives[0].assignedUsers.map(user => (
                                !user.isActive && (
                                    <button
                                        key={user.id}
                                        onClick={() => {
                                            mutateTask({taskId: showSelectedUserModal.selectedUser.id}, showSelectedUserModal.selectedUser, user.id)
                                            setShowSelectedUserModal({ status: false, selectedUser: null })
                                        }}
                                        className="px-4 py-2 rounded-xl bg-indigo-50 text-indigo-600 text-sm font-bold hover:bg-indigo-100 transition-colors"
                                    >
                                        {user.name}
                                    </button>
                                )
                            ))}
                        </div>
                        <button
                            onClick={() => setShowSelectedUserModal({ status: false, selectedUser: null })}
                            className="w-full px-4 py-2 rounded-xl border border-gray-200 text-sm font-bold text-gray-500 hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
        </div>
    )
}

export default ConsultHouse