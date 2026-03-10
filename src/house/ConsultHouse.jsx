import React, {useState} from "react";
import {useParams} from "react-router-dom";
import {GET_HOUSE_BY_ID} from "../graphQl/query";
import {useMutation, useQuery} from "@apollo/client/react";
import {useAuth} from "../AuthContext";
import {COMPLETE_TASK_FOR_USER, UNCOMPLETED_TASK_FOR_USER} from "../graphQl/mutation";

const ConsultHouse = () => {
    const {id: houseId} = useParams()
    const {loading, error, data} = useQuery(GET_HOUSE_BY_ID, {variables: {id: parseInt(houseId)}})
    const [completeTask] = useMutation(COMPLETE_TASK_FOR_USER)
    const [unCompletedTask] = useMutation(UNCOMPLETED_TASK_FOR_USER)
    const [mutationError, setMutationError] = useState(null)

    const {user} = useAuth()

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;
    if (!data) return <div>No data found.</div>;

    const house = data?.getHouseById;


    const tasksForCurrentUser = house.tasks.filter(task =>
        task.taskLives.some(taskLife =>
            taskLife.assignedUsers.some(assignedUser => assignedUser.id === user?.id)
        )
    )
    console.log(tasksForCurrentUser)

    const handleCheckTask = (taskId) => {
        setMutationError(null)
        const task = tasksForCurrentUser.find(task => (task.id === taskId.taskId))
        console.log(task)
        if(task.taskLives[0].isCompleted){
            unCompletedTask({
                variables: {taskId: taskId.taskId},
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
                variables: {taskId: taskId.taskId},
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

    return (
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
            </div>
        </div>
    )
}

export default ConsultHouse